<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use App\Core\Database;

try {
    $pdo = Database::connect();
    $adminUsername = trim((string) env('INITIAL_ADMIN_USERNAME', 'admin'));
    $adminEmail = trim((string) env('INITIAL_ADMIN_EMAIL', 'admin@rayongcoop.com'));
    $adminPasswordPlaintext = (string) env('INITIAL_ADMIN_PASSWORD', '');
    if (strlen($adminPasswordPlaintext) < 8) {
        throw new RuntimeException('INITIAL_ADMIN_PASSWORD must be at least 8 characters.');
    }
    $pwConfig = config('security.password');
    $passwordHash = password_hash($adminPasswordPlaintext, $pwConfig['algo'] ?? PASSWORD_ARGON2ID, $pwConfig['options'] ?? []);

    $user = Database::first('SELECT id FROM users WHERE username = ? OR email = ?', [$adminUsername, $adminEmail]);

    if ($user) {
        $stmt = $pdo->prepare('UPDATE users SET username = ?, email = ?, password = ?, status = \'active\', two_factor_enabled = 0 WHERE id = ?');
        $stmt->execute([$adminUsername, $adminEmail, $passwordHash, $user['id']]);
        $adminId = $user['id'];
        echo "Successfully updated existing user '{$adminUsername}' (ID: {$adminId})\n";
    } else {
        $uuid = '00000000-0000-0000-0000-000000000001';
        $stmt = $pdo->prepare("INSERT INTO users (uuid, name, username, email, password, status, two_factor_enabled, created_at) VALUES (?, ?, ?, ?, ?, 'active', 0, NOW())");
        $stmt->execute([$uuid, 'ผู้ดูแลระบบสูงสุด (Super Admin)', $adminUsername, $adminEmail, $passwordHash]);
        $adminId = (int)$pdo->lastInsertId();
        echo "Successfully created new user '{$adminUsername}' (ID: {$adminId})\n";
    }

    $superAdminRoleId = (int)Database::value("SELECT id FROM roles WHERE slug = 'super_admin'") ?: 1;
    $pdo->prepare("INSERT IGNORE INTO user_roles (user_id, role_id, created_at) VALUES (?, ?, NOW())")->execute([$adminId, $superAdminRoleId]);

    echo "Assigned Super Admin role to user ID {$adminId}\n";
    echo "Done! The initial administrator password was read from INITIAL_ADMIN_PASSWORD.\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
