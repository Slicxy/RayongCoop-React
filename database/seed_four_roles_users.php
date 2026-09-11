<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\App;
use App\Core\Database;

try {
    $app = new App();
    $pdo = Database::connect();

    echo "--- Seeding 4 Roles and 4 Specific Users ---\n";

    // 1. Roles definitions
    $rolesMap = [
        'super_admin' => 'Super Admin (ผู้ดูแลระบบสูงสุด)',
        'staff' => 'Loan & Finance Staff (เจ้าหน้าที่สินเชื่อ/การเงิน)',
        'auditor' => 'Auditor (ผู้ตรวจสอบกิจการ/ฝ่ายจัดการ)',
        'member' => 'Member (สมาชิกสหกรณ์)',
    ];

    $roleIds = [];
    foreach ($rolesMap as $slug => $name) {
        $existing = Database::first("SELECT id FROM roles WHERE slug = ?", [$slug]);
        if (!$existing) {
            $roleId = Database::insert(
                "INSERT INTO roles (name, slug, description, created_at, updated_at) VALUES (?, ?, 'Role for Rayong Coop', NOW(), NOW())",
                [$name, $slug]
            );
            $roleIds[$slug] = (int)$roleId;
        } else {
            $roleIds[$slug] = (int)$existing['id'];
        }
    }
    echo "✓ Role IDs: " . json_encode($roleIds, JSON_UNESCAPED_UNICODE) . "\n";

    // 2. Define the 4 distinct users
    $users = [
        [
            'uuid' => '550e8400-e29b-41d4-a716-446655440001',
            'name' => 'นายธีระพงษ์ ผู้ดูแลระบบสูงสุด',
            'username' => 'admin',
            'email' => 'admin@rayongcoop.com',
            'password' => password_hash('Admin@RayongCoop2026!', PASSWORD_DEFAULT),
            'role_slug' => 'super_admin'
        ],
        [
            'uuid' => '550e8400-e29b-41d4-a716-446655440002',
            'name' => 'นางสาวกานดา ใจดี (เจ้าหน้าที่สินเชื่อและการเงิน)',
            'username' => 'staff1',
            'email' => 'staff1@rayongcoop.com',
            'password' => password_hash('staff123', PASSWORD_DEFAULT),
            'role_slug' => 'staff'
        ],
        [
            'uuid' => '550e8400-e29b-41d4-a716-446655440003',
            'name' => 'นายวรวุฒิ สมบูรณ์ทรัพย์ (ผู้ตรวจสอบกิจการ)',
            'username' => 'rayongcoop1',
            'email' => 'rayongcoop1@rayongcoop.com',
            'password' => password_hash('coop1', PASSWORD_DEFAULT),
            'role_slug' => 'auditor'
        ],
        [
            'uuid' => '550e8400-e29b-41d4-a716-446655440004',
            'name' => 'นายสมชาย มีสุข (สมาชิกสหกรณ์)',
            'username' => '04892',
            'email' => 'somchai.m@rayongcoop.com',
            'password' => password_hash('123456', PASSWORD_DEFAULT),
            'role_slug' => 'member'
        ],
    ];

    foreach ($users as $u) {
        $roleId = $roleIds[$u['role_slug']] ?? null;
        if (!$roleId) continue;

        $existing = Database::first("SELECT id FROM users WHERE username = ? OR email = ?", [$u['username'], $u['email']]);
        if (!$existing) {
            $userId = Database::insert(
                "INSERT INTO users (uuid, name, username, email, password, status, two_factor_enabled, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, 'active', 0, NOW(), NOW())",
                [$u['uuid'], $u['name'], $u['username'], $u['email'], $u['password']]
            );
            if ($userId) {
                Database::execute("INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)", [(int)$userId, $roleId]);
            }
            echo "✓ Created user: {$u['username']} -> Role: {$u['role_slug']} (ID: {$userId})\n";
        } else {
            Database::execute(
                "UPDATE users SET name = ?, password = ?, status = 'active', two_factor_enabled = 0 WHERE id = ?",
                [$u['name'], $u['password'], $existing['id']]
            );
            Database::execute("DELETE FROM user_roles WHERE user_id = ?", [$existing['id']]);
            Database::execute("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)", [$existing['id'], $roleId]);
            echo "✓ Updated user: {$u['username']} -> Role: {$u['role_slug']} (ID: {$existing['id']})\n";
        }
    }

    echo "--- 4 Roles and Users successfully created/updated in MySQL! ---\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
