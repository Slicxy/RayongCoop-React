<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Auth;
use App\Core\Database;
use App\Core\Logger;

class LedBatchService
{
    protected LedService $ledService;
    protected LedMatcherService $matcherService;

    public function __construct(?LedService $ledService = null, ?LedMatcherService $matcherService = null)
    {
        $this->ledService = $ledService ?? new LedService();
        $this->matcherService = $matcherService ?? new LedMatcherService();
    }

    /**
     * Check a single member against LED Open Data API
     *
     * @param int $memberId Member primary key ID
     * @param int|null $runId Optional existing run ID, or null to create a single MANUAL run
     * @param int|null $userId User ID initiating the check
     * @return array Result of the check
     */
    public function checkMember(int $memberId, ?int $runId = null, ?int $userId = null): array
    {
        $member = Database::first("SELECT id, member_no, prefix, first_name, last_name, department FROM members WHERE id = ? LIMIT 1", [$memberId]);
        if (!$member) {
            return [
                'success' => false,
                'message' => 'ไม่พบข้อมูลสมาชิกในระบบ',
            ];
        }

        $userId = $userId ?? Auth::id();

        // If no existing run, create a MANUAL run
        $isStandaloneRun = false;
        if ($runId === null) {
            $isStandaloneRun = true;
            Database::execute(
                "INSERT INTO led_check_runs (run_type, started_at, total_members, status, initiated_by, created_at, updated_at)
                 VALUES ('MANUAL', NOW(), 1, 'RUNNING', ?, NOW(), NOW())",
                [$userId]
            );
            $runId = (int) Database::value("SELECT LAST_INSERT_ID()");
        }

        $fullName = trim("{$member['first_name']} {$member['last_name']}");
        $queryValue = $this->matcherService->normalizeName($fullName);
        if ($queryValue === '') {
            $queryValue = $fullName;
        }

        // Search LED API via server
        $apiResult = $this->ledService->searchByKeyword($queryValue, 20);
        $records = $apiResult['records'] ?? [];
        $apiSuccess = (bool) ($apiResult['success'] ?? false);
        $apiTotal = (int) ($apiResult['total'] ?? count($records));

        // Evaluate matches
        $evaluation = $this->matcherService->evaluateMatch($member, $records, $apiSuccess);
        $status = $evaluation['status'];
        $matchScore = $evaluation['match_score'];
        $responseHash = hash('sha256', json_encode($records, JSON_UNESCAPED_UNICODE));

        // Insert led_check_results
        Database::execute(
            "INSERT INTO led_check_results (
                run_id, member_id, query_value, query_type, checked_at,
                api_total, match_score, status, api_response_hash, created_at, updated_at
            ) VALUES (?, ?, ?, 'FULL_NAME', NOW(), ?, ?, ?, ?, NOW(), NOW())",
            [
                $runId,
                $memberId,
                $queryValue,
                $apiTotal,
                $matchScore,
                $status,
                $responseHash,
            ]
        );
        $resultId = (int) Database::value("SELECT LAST_INSERT_ID()");

        // Insert led_match_records for candidates
        foreach ($evaluation['candidates'] as $candidate) {
            Database::execute(
                "INSERT INTO led_match_records (
                    check_result_id, external_record_id, external_data_json,
                    normalized_name, match_score, match_reason, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, NOW())",
                [
                    $resultId,
                    $candidate['external_record_id'] ?? null,
                    json_encode($candidate['external_data'] ?? [], JSON_UNESCAPED_UNICODE),
                    $candidate['normalized_name'] ?? null,
                    $candidate['match_score'] ?? null,
                    $candidate['match_reason'] ?? null,
                ]
            );
        }

        // If standalone run, update run status and counts
        if ($isStandaloneRun) {
            $notFound = $status === 'NOT_FOUND' ? 1 : 0;
            $possibleMatch = $status === 'POSSIBLE_MATCH' ? 1 : 0;
            $reviewRequired = in_array($status, ['REVIEW_REQUIRED', 'MULTIPLE_MATCH'], true) ? 1 : 0;
            $apiError = $status === 'API_ERROR' ? 1 : 0;
            $runStatus = $apiError > 0 ? 'PARTIAL' : 'COMPLETED';

            Database::execute(
                "UPDATE led_check_runs SET
                    checked_members = 1,
                    not_found_count = ?,
                    possible_match_count = ?,
                    review_required_count = ?,
                    api_error_count = ?,
                    status = ?,
                    completed_at = NOW(),
                    updated_at = NOW()
                 WHERE id = ?",
                [$notFound, $possibleMatch, $reviewRequired, $apiError, $runStatus, $runId]
            );
        }

        return [
            'success' => true,
            'result_id' => $resultId,
            'run_id' => $runId,
            'member' => [
                'id' => $member['id'],
                'member_no' => $member['member_no'],
                'name' => "{$member['prefix']} {$member['first_name']} {$member['last_name']}",
                'department' => $member['department'],
            ],
            'evaluation' => $evaluation,
            'api_total' => $apiTotal,
            'checked_at' => date('Y-m-d H:i:s'),
        ];
    }

    /**
     * Create a new batch run and optionally start processing
     *
     * @param array $filters Filters: department, member_no_start, member_no_end, limit
     * @param string $runType 'BATCH' or 'SCHEDULED'
     * @param int|null $userId User ID initiating the run
     * @return array Created run info
     */
    public function createBatchRun(array $filters = [], string $runType = 'BATCH', ?int $userId = null): array
    {
        $userId = $userId ?? Auth::id();

        // Count eligible members
        $where = ["status = 'active'"];
        $params = [];

        if (!empty($filters['department'])) {
            $where[] = "department = ?";
            $params[] = trim((string) $filters['department']);
        }

        if (!empty($filters['member_no_start'])) {
            $where[] = "member_no >= ?";
            $params[] = trim((string) $filters['member_no_start']);
        }

        if (!empty($filters['member_no_end'])) {
            $where[] = "member_no <= ?";
            $params[] = trim((string) $filters['member_no_end']);
        }

        $whereClause = implode(' AND ', $where);
        $totalMembers = (int) Database::value("SELECT COUNT(*) FROM members WHERE {$whereClause}", $params);

        if ($totalMembers === 0) {
            return [
                'success' => false,
                'message' => 'ไม่พบสมาชิกที่ตรงตามเงื่อนไขการตรวจสอบ',
                'total_members' => 0,
            ];
        }

        Database::execute(
            "INSERT INTO led_check_runs (
                run_type, total_members, status, initiated_by, created_at, updated_at
            ) VALUES (?, ?, 'PENDING', ?, NOW(), NOW())",
            [$runType, $totalMembers, $userId]
        );
        $runId = (int) Database::value("SELECT LAST_INSERT_ID()");

        return [
            'success' => true,
            'run_id' => $runId,
            'run_type' => $runType,
            'total_members' => $totalMembers,
            'status' => 'PENDING',
        ];
    }

    /**
     * Execute batch processing for a specific run ID
     *
     * @param int $runId Run ID to process
     * @param array $filters Same filters used when creating the run
     * @param int|null $maxMembers Optional ceiling of members to process in this invocation
     * @return array Execution summary
     */
    public function executeRun(int $runId, array $filters = [], ?int $maxMembers = null): array
    {
        $run = Database::first("SELECT * FROM led_check_runs WHERE id = ? LIMIT 1", [$runId]);
        if (!$run) {
            return ['success' => false, 'message' => 'ไม่พบประวัติการรันที่ระบุ'];
        }

        if ($run['status'] === 'RUNNING') {
            return ['success' => false, 'message' => 'รอบการตรวจสอบนี้กำลังทำงานอยู่'];
        }

        // Mark run as RUNNING
        Database::execute(
            "UPDATE led_check_runs SET status = 'RUNNING', started_at = COALESCE(started_at, NOW()), updated_at = NOW() WHERE id = ?",
            [$runId]
        );

        // Fetch members to check that have not yet been checked in this run
        $where = ["m.status = 'active'"];
        $params = [$runId];

        if (!empty($filters['department'])) {
            $where[] = "m.department = ?";
            $params[] = trim((string) $filters['department']);
        }
        if (!empty($filters['member_no_start'])) {
            $where[] = "m.member_no >= ?";
            $params[] = trim((string) $filters['member_no_start']);
        }
        if (!empty($filters['member_no_end'])) {
            $where[] = "m.member_no <= ?";
            $params[] = trim((string) $filters['member_no_end']);
        }

        $whereClause = implode(' AND ', $where);
        $limitClause = '';
        if ($maxMembers !== null && $maxMembers > 0) {
            $limitClause = ' LIMIT ' . (int) $maxMembers;
        }

        $sql = "SELECT m.id, m.member_no, m.prefix, m.first_name, m.last_name, m.department
                FROM members m
                LEFT JOIN led_check_results r ON r.run_id = ? AND r.member_id = m.id
                WHERE {$whereClause} AND r.id IS NULL
                ORDER BY m.id ASC{$limitClause}";

        $members = Database::query($sql, $params);

        $delayMs = $this->ledService->getRequestDelayMilliseconds();
        $checkedInThisPass = 0;
        $errorsInThisPass = 0;

        foreach ($members as $m) {
            try {
                $checkRes = $this->checkMember((int) $m['id'], $runId, $run['initiated_by'] ? (int) $run['initiated_by'] : null);
                $status = $checkRes['evaluation']['status'] ?? 'API_ERROR';

                if ($status === 'API_ERROR') {
                    $errorsInThisPass++;
                }
            } catch (\Throwable $e) {
                $errorsInThisPass++;
                Logger::error("Batch member check error on Member ID {$m['id']}: " . $e->getMessage());
            }

            $checkedInThisPass++;

            // Rate limit delay between requests
            usleep($delayMs * 1000);
        }

        // Recompute statistics for the run
        $stats = Database::first(
            "SELECT
                COUNT(*) as checked,
                SUM(CASE WHEN status = 'NOT_FOUND' THEN 1 ELSE 0 END) as not_found,
                SUM(CASE WHEN status = 'POSSIBLE_MATCH' THEN 1 ELSE 0 END) as possible_match,
                SUM(CASE WHEN status IN ('REVIEW_REQUIRED', 'MULTIPLE_MATCH') THEN 1 ELSE 0 END) as review_required,
                SUM(CASE WHEN status = 'VERIFIED_MATCH' THEN 1 ELSE 0 END) as verified_match,
                SUM(CASE WHEN status = 'FALSE_MATCH' THEN 1 ELSE 0 END) as false_match,
                SUM(CASE WHEN status = 'API_ERROR' THEN 1 ELSE 0 END) as api_error
             FROM led_check_results
             WHERE run_id = ?",
            [$runId]
        );

        $totalChecked = (int) ($stats['checked'] ?? 0);
        $totalMembers = (int) $run['total_members'];
        $apiErrors = (int) ($stats['api_error'] ?? 0);

        $newStatus = 'RUNNING';
        if ($totalChecked >= $totalMembers) {
            $newStatus = $apiErrors > 0 ? 'PARTIAL' : 'COMPLETED';
        }

        Database::execute(
            "UPDATE led_check_runs SET
                checked_members = ?,
                not_found_count = ?,
                possible_match_count = ?,
                review_required_count = ?,
                verified_match_count = ?,
                false_match_count = ?,
                api_error_count = ?,
                status = ?,
                completed_at = IF(? IN ('COMPLETED', 'PARTIAL', 'FAILED'), NOW(), completed_at),
                updated_at = NOW()
             WHERE id = ?",
            [
                $totalChecked,
                (int) ($stats['not_found'] ?? 0),
                (int) ($stats['possible_match'] ?? 0),
                (int) ($stats['review_required'] ?? 0),
                (int) ($stats['verified_match'] ?? 0),
                (int) ($stats['false_match'] ?? 0),
                $apiErrors,
                $newStatus,
                $newStatus,
                $runId,
            ]
        );

        return [
            'success' => true,
            'run_id' => $runId,
            'status' => $newStatus,
            'checked_members' => $totalChecked,
            'total_members' => $totalMembers,
            'processed_in_pass' => $checkedInThisPass,
            'errors_in_pass' => $errorsInThisPass,
        ];
    }
}
