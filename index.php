<?php

declare(strict_types=1);

/**
 * RayongCoop Digital Portal - React Entrypoint
 */

$spaIndex = __DIR__ . '/public/app/index.html';
if (file_exists($spaIndex)) {
    readfile($spaIndex);
    exit;
}

// Fallback to root index.html
$rootIndex = __DIR__ . '/index.html';
if (file_exists($rootIndex)) {
    readfile($rootIndex);
    exit;
}
