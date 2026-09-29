<?php

declare(strict_types=1);

namespace App\Services;

class LedMatcherService
{
    /**
     * Common Thai prefixes to strip for accurate comparison
     */
    protected const THAI_PREFIXES = [
        'ว่าที่ร้อยตรีหญิง', 'ว่าที่ร้อยตรี', 'ว่าที่ ร.ต.หญิง', 'ว่าที่ ร.ต.',
        'นางสาว', 'น.ส.', 'นาย', 'นาง', 'ดร.', 'อาจารย์', 'อ.',
        'ศาสตราจารย์', 'ศ.', 'รองศาสตราจารย์', 'รศ.', 'ผู้ช่วยศาสตราจารย์', 'ผศ.',
        'พลตำรวจเอก', 'พล.ต.อ.', 'พลตำรวจโท', 'พล.ต.ท.', 'พลตำรวจตรี', 'พล.ต.ต.',
        'พันตำรวจเอก', 'พ.ต.อ.', 'พันตำรวจโท', 'พ.ต.ท.', 'พันตำรวจตรี', 'พ.ต.ต.',
        'ร้อยตำรวจเอก', 'ร.ต.อ.', 'ร้อยตำรวจโท', 'ร.ต.ท.', 'ร้อยตำรวจตรี', 'ร.ต.ต.',
        'พลเอก', 'พล.อ.', 'พลโท', 'พล.ท.', 'พลตรี', 'พล.ต.',
        'พันเอก', 'พ.อ.', 'พันโท', 'พ.ท.', 'พันตรี', 'พ.ต.',
        'ร้อยเอก', 'ร.อ.', 'ร้อยโท', 'ร.ท.', 'ร้อยตรี', 'ร.ต.',
        'สิบเอก', 'ส.อ.', 'สิบโท', 'ส.ท.', 'สิบตรี', 'ส.ต.',
        'จ่าสิบเอก', 'จ.ส.อ.',
    ];

    /**
     * English prefixes
     */
    protected const ENGLISH_PREFIXES = [
        'mr.', 'mr', 'mrs.', 'mrs', 'ms.', 'ms', 'miss', 'dr.', 'dr', 'prof.', 'prof',
    ];

    /**
     * Normalize a name by stripping prefixes, extra whitespaces, and normalizing characters
     */
    public function normalizeName(string $name): string
    {
        // 1. Convert multiple whitespace to single space and trim
        $normalized = preg_replace('/\s+/u', ' ', trim($name));
        if ($normalized === null || $normalized === '') {
            return '';
        }

        // 2. Remove Thai prefixes
        foreach (self::THAI_PREFIXES as $prefix) {
            if (mb_strpos($normalized, $prefix) === 0) {
                $normalized = mb_substr($normalized, mb_strlen($prefix));
                $normalized = preg_replace('/\s+/u', ' ', trim($normalized));
                break;
            }
        }

        // 3. Remove English prefixes (case insensitive)
        $lower = mb_strtolower($normalized);
        foreach (self::ENGLISH_PREFIXES as $prefix) {
            if (str_starts_with($lower, $prefix)) {
                $normalized = trim(substr($normalized, strlen($prefix)));
                $normalized = preg_replace('/\s+/u', ' ', trim($normalized));
                break;
            }
        }

        return (string) $normalized;
    }

    /**
     * Split full name into first and last name components
     */
    public function splitName(string $fullName): array
    {
        $normalized = $this->normalizeName($fullName);
        $parts = explode(' ', $normalized);

        $firstName = array_shift($parts) ?? '';
        $lastName = implode(' ', $parts);

        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'full_name' => $normalized,
        ];
    }

    /**
     * Evaluate matching candidates against member data
     *
     * @param array $member Member data: ['first_name' => ..., 'last_name' => ..., 'member_no' => ...]
     * @param array $ledRecords Array of records returned from LED API
     * @param bool $apiSuccess Whether the external API call succeeded
     * @return array Standardized evaluation result
     */
    public function evaluateMatch(array $member, array $ledRecords, bool $apiSuccess = true): array
    {
        if (!$apiSuccess) {
            return [
                'status' => 'API_ERROR',
                'match_score' => null,
                'match_reason' => 'ระบบเชื่อมต่อ API กรมบังคับคดีขัดข้อง ไม่สามารถประมวลผลได้',
                'candidates' => [],
                'requires_human_review' => false,
            ];
        }

        if (empty($ledRecords)) {
            return [
                'status' => 'NOT_FOUND',
                'match_score' => 0.00,
                'match_reason' => 'ไม่พบข้อมูลรายการที่ตรงกับชื่อ-นามสกุลในฐานข้อมูลกรมบังคับคดี',
                'candidates' => [],
                'requires_human_review' => false,
            ];
        }

        $memberFirstName = $this->normalizeName($member['first_name'] ?? '');
        $memberLastName = $this->normalizeName($member['last_name'] ?? '');
        $memberFullName = trim("{$memberFirstName} {$memberLastName}");

        $evaluatedCandidates = [];

        foreach ($ledRecords as $index => $record) {
            $recordId = (string) ($record['_id'] ?? ($index + 1));
            $candidateResult = $this->scoreRecord($memberFullName, $memberFirstName, $memberLastName, $record);

            $evaluatedCandidates[] = [
                'external_record_id' => $recordId,
                'external_data' => $record,
                'normalized_name' => $candidateResult['normalized_name'],
                'match_score' => $candidateResult['score'],
                'match_reason' => $candidateResult['reason'],
            ];
        }

        // Sort candidates by match_score descending
        usort($evaluatedCandidates, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });

        $topCandidate = $evaluatedCandidates[0] ?? null;
        $topScore = $topCandidate ? (float) $topCandidate['match_score'] : 0.0;

        // Check if multiple candidates have close scores
        $highScoreCandidates = array_filter($evaluatedCandidates, fn($c) => $c['match_score'] >= 75.0);

        if (count($highScoreCandidates) > 1) {
            $status = 'MULTIPLE_MATCH';
            $reason = sprintf(
                'พบ %d รายการที่มีชื่อหรือนามสกุลตรงกัน ต้องตรวจสอบรายละเอียดคดีเพิ่มเติม',
                count($highScoreCandidates)
            );
            $requiresReview = true;
        } elseif ($topScore >= 85.0) {
            $status = 'POSSIBLE_MATCH';
            $reason = 'ตรวจพบชื่อและนามสกุลตรงกับฐานข้อมูลกรมบังคับคดีเบื้องต้น (รอเจ้าหน้าที่ตรวจสอบ)';
            $requiresReview = true;
        } elseif ($topScore >= 50.0) {
            $status = 'REVIEW_REQUIRED';
            $reason = 'ตรวจพบข้อมูลที่มีความคล้ายคลึงบางส่วน ต้องตรวจสอบโดยเจ้าหน้าที่';
            $requiresReview = true;
        } else {
            $status = 'NOT_FOUND';
            $reason = 'ไม่พบข้อมูลที่ตรงกันอย่างมีนัยสำคัญในฐานข้อมูลกรมบังคับคดี';
            $requiresReview = false;
        }

        return [
            'status' => $status,
            'match_score' => $topScore,
            'match_reason' => $reason,
            'candidates' => $evaluatedCandidates,
            'requires_human_review' => $requiresReview,
        ];
    }

    /**
     * Score an individual LED record against the member's normalized name
     */
    protected function scoreRecord(string $memberFullName, string $memberFirstName, string $memberLastName, array $record): array
    {
        // Extract all text fields from the record to search
        $recordStrings = [];
        $recordNameCandidates = [];

        foreach ($record as $key => $val) {
            if (is_scalar($val) && (string) $val !== '') {
                $strVal = (string) $val;
                $recordStrings[] = $strVal;

                $keyUpper = strtoupper((string) $key);
                if (str_contains($keyUpper, 'NAME') || str_contains($keyUpper, 'DEFENDANT') || str_contains($keyUpper, 'PARTY')) {
                    $recordNameCandidates[] = $strVal;
                }
            }
        }

        $allText = implode(' ', $recordStrings);
        $normAllText = $this->normalizeName($allText);

        $bestScore = 0.0;
        $bestReason = 'ผลการค้นหาจากคำค้นของ API';
        $bestNormalizedName = $recordNameCandidates[0] ?? ($record['COURT_NAME'] ?? 'N/A');

        // Check each candidate name field if available
        foreach ($recordNameCandidates as $rawName) {
            $normRecordName = $this->normalizeName($rawName);

            // 1. Exact match on full name
            if ($memberFullName !== '' && mb_strtolower($normRecordName) === mb_strtolower($memberFullName)) {
                return [
                    'score' => 95.00,
                    'reason' => 'ชื่อและนามสกุลตรงกันทุกตัวอักษร (Exact Name Match)',
                    'normalized_name' => $normRecordName,
                ];
            }

            // 2. Both first and last name present in name field
            if ($memberFirstName !== '' && $memberLastName !== '') {
                if (mb_strpos($normRecordName, $memberFirstName) !== false && mb_strpos($normRecordName, $memberLastName) !== false) {
                    if ($bestScore < 90.0) {
                        $bestScore = 90.00;
                        $bestReason = 'พบทั้งชื่อและนามสกุลในรายการข้อมูลเดียวกัน';
                        $bestNormalizedName = $normRecordName;
                    }
                }
            }

            // 3. First name exact match
            if ($memberFirstName !== '' && mb_strpos($normRecordName, $memberFirstName) !== false) {
                if ($bestScore < 60.0) {
                    $bestScore = 60.00;
                    $bestReason = "ชื่อตรงกัน ({$memberFirstName}) แต่นามสกุลอาจต่างกัน";
                    $bestNormalizedName = $normRecordName;
                }
            }

            // 4. Last name exact match
            if ($memberLastName !== '' && mb_strpos($normRecordName, $memberLastName) !== false) {
                if ($bestScore < 50.0) {
                    $bestScore = 50.00;
                    $bestReason = "นามสกุลตรงกัน ({$memberLastName}) แต่ชื่อต่างกัน";
                    $bestNormalizedName = $normRecordName;
                }
            }
        }

        // If no candidate name field found, inspect full record text
        if ($bestScore === 0.0) {
            $hasFirst = $memberFirstName !== '' && mb_strpos($normAllText, $memberFirstName) !== false;
            $hasLast = $memberLastName !== '' && mb_strpos($normAllText, $memberLastName) !== false;

            if ($hasFirst && $hasLast) {
                $bestScore = 85.00;
                $bestReason = 'พบทั้งชื่อและนามสกุลในข้อมูลคดี';
            } elseif ($hasFirst) {
                $bestScore = 55.00;
                $bestReason = "พบชื่อ {$memberFirstName} ในบันทึกข้อมูลคดี";
            } elseif ($hasLast) {
                $bestScore = 45.00;
                $bestReason = "พบนามสกุล {$memberLastName} ในบันทึกข้อมูลคดี";
            } else {
                // Generic hit via API keyword search
                $bestScore = 30.00;
                $bestReason = 'พบคำค้นที่ตรงกับบางส่วนของข้อมูลในระบบกรมบังคับคดี';
            }
        }

        return [
            'score' => $bestScore,
            'reason' => $bestReason,
            'normalized_name' => $bestNormalizedName,
        ];
    }
}
