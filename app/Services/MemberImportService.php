<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Core\Logger;

class MemberImportService
{
    /**
     * Generate sample CSV template with UTF-8 BOM for Microsoft Excel compatibility
     */
    public static function generateTemplateCsv(): string
    {
        $headers = [
            'เลขที่สมาชิก*',
            'คำนำหน้า*',
            'ชื่อ*',
            'นามสกุล*',
            'เลขประจำตัวประชาชน',
            'สังกัด/หน่วยงาน*',
            'ตำแหน่ง',
            'เบอร์โทรศัพท์*',
            'อีเมล',
            'ที่อยู่',
            'วันที่เริ่มเป็นสมาชิก (YYYY-MM-DD)',
            'ส่งค่าหุ้นรายเดือน (บาท)',
            'จำนวนหุ้นสะสม (หุ้น)',
            'ยอดเงินฝากเริ่มต้น (บาท)'
        ];

        $samples = [
            [
                'MEM-2024-0010',
                'นาย',
                'ธนากร',
                'สุขเจริญ',
                '1219900123456',
                'โรงพยาบาลระยอง',
                'นายแพทย์ชำนาญการ',
                '081-111-2233',
                'thanakorn.s@rayongcoop.com',
                '45/1 ถ.สุขุมวิท ต.ท่าประดู่ อ.เมือง จ.ระยอง 21000',
                '2022-01-15',
                '2000',
                '1500',
                '50000'
            ],
            [
                'MEM-2024-0011',
                'นางสาว',
                'วิมลรัตน์',
                'ทองแท้',
                '1219900987654',
                'รพ.สต.บ้านแลง',
                'พยาบาลวิชาชีพ',
                '089-222-3344',
                'wimonrat.t@rayongcoop.com',
                '78/9 หมู่ 3 ต.บ้านแลง อ.เมือง จ.ระยอง 21000',
                '2023-04-01',
                '1500',
                '800',
                '25000'
            ],
            [
                'MEM-2024-0012',
                'นาย',
                'เกียรติศักดิ์',
                'มั่งมี',
                '1219900554433',
                'สสจ.ระยอง',
                'นักวิชาการสาธารณสุขชำนาญการ',
                '086-333-4455',
                'kiattisak.m@rayongcoop.com',
                '12/3 ถ.ตากสินมหาราช ต.ท่าประดู่ อ.เมือง จ.ระยอง 21000',
                '2021-08-10',
                '3000',
                '2400',
                '100000'
            ]
        ];

        $output = "\xEF\xBB\xBF"; // UTF-8 BOM for Excel
        $output .= implode(',', array_map(fn($h) => '"' . str_replace('"', '""', $h) . '"', $headers)) . "\r\n";

        foreach ($samples as $row) {
            $output .= implode(',', array_map(fn($v) => '"' . str_replace('"', '""', (string)$v) . '"', $row)) . "\r\n";
        }

        return $output;
    }

    /**
     * Parse and validate uploaded CSV file
     */
    public static function parseAndValidate(string $filePath): array
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            return ['success' => false, 'message' => 'ไม่พบไฟล์หรือไฟล์ไม่สามารถอ่านได้'];
        }

        $content = file_get_contents($filePath);
        if ($content === false || trim($content) === '') {
            return ['success' => false, 'message' => 'ไฟล์ว่างเปล่า ไม่มีข้อมูล'];
        }

        // Remove UTF-8 BOM if present
        if (str_starts_with($content, "\xEF\xBB\xBF")) {
            $content = substr($content, 3);
        }

        // Auto detect line ending
        $lines = preg_split('/\r\n|\r|\n/', trim($content));
        if (empty($lines) || count($lines) < 2) {
            return ['success' => false, 'message' => 'ไฟล์ต้องมีแถวหัวตารางและข้อมูลอย่างน้อย 1 แถว'];
        }

        // Detect delimiter: comma, semicolon, tab
        $firstLine = $lines[0];
        $delimiters = [',', ';', "\t"];
        $delimiter = ',';
        $maxCount = 0;
        foreach ($delimiters as $d) {
            $cnt = substr_count($firstLine, $d);
            if ($cnt > $maxCount) {
                $maxCount = $cnt;
                $delimiter = $d;
            }
        }

        // Get existing member numbers & id cards from DB for duplicate checking
        $existingMembers = Database::query("SELECT member_no, id_card, email FROM members");
        $existingMemberNos = array_flip(array_column($existingMembers, 'member_no'));

        $headerRow = str_getcsv(array_shift($lines), $delimiter);
        $rows = [];
        $validCount = 0;
        $duplicateCount = 0;
        $errorCount = 0;
        $seenMemberNosInFile = [];

        foreach ($lines as $idx => $line) {
            if (trim($line) === '') continue;
            
            $cols = str_getcsv($line, $delimiter);
            $rowNum = $idx + 2; // 1-indexed including header

            $memberNo = trim((string)($cols[0] ?? ''));
            $prefix = trim((string)($cols[1] ?? ''));
            $firstName = trim((string)($cols[2] ?? ''));
            $lastName = trim((string)($cols[3] ?? ''));
            $idCard = trim((string)($cols[4] ?? ''));
            $department = trim((string)($cols[5] ?? ''));
            $position = trim((string)($cols[6] ?? ''));
            $phone = trim((string)($cols[7] ?? ''));
            $email = trim((string)($cols[8] ?? ''));
            $address = trim((string)($cols[9] ?? ''));
            $joinDate = trim((string)($cols[10] ?? ''));
            $rawMonthlyShare = str_replace([',', ' ', '฿'], '', (string)($cols[11] ?? '1000'));
            $monthlyShare = is_numeric($rawMonthlyShare) ? (float)$rawMonthlyShare : 1000.0;

            $rawTotalShares = str_replace([',', ' ', 'หุ้น'], '', (string)($cols[12] ?? '100'));
            $totalShares = is_numeric($rawTotalShares) ? (int)$rawTotalShares : 100;

            $rawInitialDeposit = str_replace([',', ' ', '฿'], '', (string)($cols[13] ?? '0'));
            $initialDeposit = is_numeric($rawInitialDeposit) ? (float)$rawInitialDeposit : 0.0;

            $status = 'valid';
            $errors = [];

            // Required field validations
            if (empty($memberNo)) {
                $status = 'error';
                $errors[] = 'ไม่มีเลขที่สมาชิก';
            }
            if (empty($firstName) || empty($lastName)) {
                $status = 'error';
                $errors[] = 'ไม่มีชื่อหรือนามสกุล';
            }
            if (empty($department)) {
                $status = 'error';
                $errors[] = 'ไม่มีสังกัด/หน่วยงาน';
            }

            // Duplicate in file check
            if (!empty($memberNo)) {
                if (isset($seenMemberNosInFile[$memberNo])) {
                    $status = 'error';
                    $errors[] = "เลขที่สมาชิกซ้ำกับแถว {$seenMemberNosInFile[$memberNo]} ในไฟล์";
                } else {
                    $seenMemberNosInFile[$memberNo] = $rowNum;
                }
            }

            // Duplicate in DB check
            if ($status === 'valid' && isset($existingMemberNos[$memberNo])) {
                $status = 'duplicate';
                $errors[] = 'มีเลขที่สมาชิกนี้ในระบบแล้ว (จะทำการอัปเดตข้อมูล)';
            }

            // Date validation
            if (!empty($joinDate) && !strtotime($joinDate)) {
                $joinDate = date('Y-m-d');
            } elseif (empty($joinDate)) {
                $joinDate = date('Y-m-d');
            }

            if ($status === 'valid') {
                $validCount++;
            } elseif ($status === 'duplicate') {
                $duplicateCount++;
            } else {
                $errorCount++;
            }

            $rows[] = [
                'row_number' => $rowNum,
                'status' => $status,
                'errors' => $errors,
                'member_no' => $memberNo,
                'prefix' => $prefix ?: 'นาย',
                'first_name' => $firstName,
                'last_name' => $lastName,
                'id_card' => $idCard,
                'department' => $department,
                'position' => $position,
                'phone' => $phone,
                'email' => $email,
                'address' => $address,
                'join_date' => $joinDate,
                'monthly_share' => $monthlyShare > 0 ? $monthlyShare : 1000,
                'total_shares' => $totalShares > 0 ? $totalShares : 100,
                'initial_deposit' => $initialDeposit
            ];
        }

        return [
            'success' => true,
            'total_rows' => count($rows),
            'valid_count' => $validCount,
            'duplicate_count' => $duplicateCount,
            'error_count' => $errorCount,
            'rows' => $rows
        ];
    }

    /**
     * Generate UUID v4
     */
    private static function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Execute batch database import
     */
    public static function executeImport(array $rows, bool $updateDuplicates = true, bool $createLoginAccounts = true): array
    {
        $importedCount = 0;
        $updatedCount = 0;
        $skippedCount = 0;
        $accountsCreated = 0;

        $pdo = Database::connect();
        $pdo->beginTransaction();

        try {
            foreach ($rows as $r) {
                if ($r['status'] === 'error') {
                    $skippedCount++;
                    continue;
                }

                $memberNo = $r['member_no'];
                $existing = Database::first("SELECT id, user_id FROM members WHERE member_no = ? LIMIT 1", [$memberNo]);

                $memberId = null;

                if ($existing) {
                    if (!$updateDuplicates) {
                        $skippedCount++;
                        continue;
                    }

                    // Update existing member
                    Database::execute(
                        "UPDATE members SET 
                            prefix = ?, first_name = ?, last_name = ?, id_card = ?, 
                            department = ?, position = ?, phone = ?, email = ?, 
                            address = ?, updated_at = NOW() 
                         WHERE id = ?",
                        [
                            $r['prefix'], $r['first_name'], $r['last_name'], $r['id_card'] ?? '',
                            $r['department'], $r['position'] ?? '', $r['phone'] ?? '', $r['email'] ?? '',
                            $r['address'] ?? '', $existing['id']
                        ]
                    );
                    $memberId = (int)$existing['id'];
                    $updatedCount++;
                } else {
                    // Create User Account if enabled
                    $userId = null;
                    if ($createLoginAccounts) {
                        $username = strtolower(str_replace(['-', ' '], '', $memberNo));
                        $email = !empty($r['email']) ? $r['email'] : "{$username}@rayongcoop.com";
                        
                        // Check if username exists
                        $existingUser = Database::first("SELECT id FROM users WHERE username = ? OR email = ?", [$username, $email]);
                        if ($existingUser) {
                            $userId = (int)$existingUser['id'];
                        } else {
                            $userUuid = self::generateUuid();
                            $pwConfig = config('security.password');
                            $passwordHash = password_hash('coop1234', $pwConfig['algo'] ?? PASSWORD_ARGON2ID, $pwConfig['options'] ?? []);
                            $userId = Database::insert(
                                "INSERT INTO users (uuid, name, username, email, password, status, two_factor_enabled, created_at, updated_at) 
                                 VALUES (?, ?, ?, ?, ?, 'active', 0, NOW(), NOW())",
                                [$userUuid, "{$r['prefix']}{$r['first_name']} {$r['last_name']}", $username, $email, $passwordHash]
                            );

                            // Assign 'member' role (role_id = 12 or slug = member)
                            $role = Database::first("SELECT id FROM roles WHERE slug = 'member' LIMIT 1");
                            if ($role) {
                                Database::execute("INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)", [$userId, $role['id']]);
                            }
                            $accountsCreated++;
                        }
                    }

                    // Insert new member
                    $memberUuid = self::generateUuid();
                    $joinDate = !empty($r['join_date']) ? $r['join_date'] : date('Y-m-d');
                    $memberId = Database::insert(
                        "INSERT INTO members (uuid, user_id, member_no, prefix, first_name, last_name, id_card, department, position, phone, email, address, join_date, status, created_at, updated_at) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())",
                        [
                            $memberUuid, $userId, $memberNo, $r['prefix'], $r['first_name'], $r['last_name'],
                            $r['id_card'] ?? '', $r['department'], $r['position'] ?? '', $r['phone'] ?? '',
                            $r['email'] ?? '', $r['address'] ?? '', $joinDate
                        ]
                    );
                    $importedCount++;
                }

                // Insert / Update Member Shares
                $shareTotalAmount = $r['total_shares'] * 10;
                $joinDate = !empty($r['join_date']) ? $r['join_date'] : date('Y-m-d');
                Database::execute(
                    "INSERT INTO member_shares (member_id, monthly_share, total_shares, share_value, total_amount, start_date, last_payment_date, updated_at) 
                     VALUES (?, ?, ?, 10.00, ?, ?, NOW(), NOW()) 
                     ON DUPLICATE KEY UPDATE 
                        monthly_share = VALUES(monthly_share), 
                        total_shares = VALUES(total_shares), 
                        total_amount = VALUES(total_amount), 
                        updated_at = NOW()",
                    [$memberId, $r['monthly_share'], $r['total_shares'], $shareTotalAmount, $joinDate]
                );

                // Insert Deposit Account if initial deposit > 0 and no account exists
                if ($r['initial_deposit'] > 0) {
                    $hasDeposit = Database::first("SELECT id FROM deposit_accounts WHERE member_id = ? LIMIT 1", [$memberId]);
                    if (!$hasDeposit) {
                        $accNo = '01-0' . str_pad((string)$memberId, 5, '0', STR_PAD_LEFT);
                        Database::insert(
                            "INSERT INTO deposit_accounts (member_id, account_no, account_type, account_name, interest_rate, balance, accrued_interest, open_date, status, created_at, updated_at) 
                             VALUES (?, ?, 'special_savings', ?, 2.75, ?, 0, ?, 'active', NOW(), NOW())",
                            [$memberId, $accNo, "บัญชีเงินฝาก {$r['prefix']}{$r['first_name']} {$r['last_name']}", $r['initial_deposit'], $joinDate]
                        );
                    }
                }
            }

            $pdo->commit();

            AuditService::log('member_import', 'bulk_excel_import', 'system', null, [
                'imported' => $importedCount,
                'updated' => $updatedCount,
                'skipped' => $skippedCount,
                'accounts_created' => $accountsCreated
            ]);

            return [
                'success' => true,
                'imported_count' => $importedCount,
                'updated_count' => $updatedCount,
                'skipped_count' => $skippedCount,
                'accounts_created' => $accountsCreated,
                'message' => "นำเข้าข้อมูลสมาชิกสำเร็จ: เพิ่มใหม่ {$importedCount} ราย, อัปเดต {$updatedCount} ราย, ข้าม {$skippedCount} ราย, สร้างบัญชี Login {$accountsCreated} บัญชี"
            ];
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            Logger::error("Bulk member import error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' . $e->getMessage()
            ];
        }
    }
}
