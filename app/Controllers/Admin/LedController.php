<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Core\Controller;

class LedController extends Controller
{
    private function serveSpa(): void
    {
        $spaIndex = dirname(__DIR__, 2) . '/public/app/index.html';
        if (file_exists($spaIndex)) {
            readfile($spaIndex);
            exit;
        }

        $rootIndex = dirname(__DIR__, 2) . '/index.html';
        if (file_exists($rootIndex)) {
            readfile($rootIndex);
            exit;
        }

        $this->redirect(url('/'));
    }

    public function index(): void
    {
        $this->serveSpa();
    }

    public function dashboard(): void
    {
        $this->serveSpa();
    }

    public function search(): void
    {
        $this->serveSpa();
    }

    public function review(): void
    {
        $this->serveSpa();
    }

    public function batch(): void
    {
        $this->serveSpa();
    }

    public function schema(): void
    {
        $this->serveSpa();
    }
}
