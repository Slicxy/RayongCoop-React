<?php

declare(strict_types=1);

namespace App\Middlewares;

use App\Core\Auth;
use App\Core\Request;
use App\Core\Response;
use App\Core\Session;

class RoleMiddleware
{
    private array $allowedRoles;

    public function __construct(string|array $roles = [])
    {
        $this->allowedRoles = (array) $roles;
    }

    public function handle(Request $request, Response $response): bool
    {
        if (!Auth::check()) {
            $response->redirect(url('admin/login'));
            return false;
        }

        if (!empty($this->allowedRoles) && !Auth::hasRole($this->allowedRoles)) {
            if ($request->isAjax()) {
                $response->json([
                    'success' => false,
                    'code' => 'FORBIDDEN',
                    'message' => 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Permission Denied)'
                ], 403);
                return false;
            }

            Session::flash('error', 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Permission Denied)');
            $role = Auth::user()['role_slug'] ?? '';
            $fallbackUrl = match ($role) {
                'member' => url('member/dashboard'),
                'staff' => url('staff/dashboard'),
                default => url('login'),
            };
            $response->redirect($fallbackUrl);
            return false;
        }

        return true;
    }
}
