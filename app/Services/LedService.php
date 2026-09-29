<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Core\Logger;

class LedService
{
    protected string $apiUrl;
    protected string $resourceId;
    protected int $timeout;
    protected int $batchSize;
    protected int $retryLimit;
    protected int $requestDelayMs;
    protected string $timezone;

    public function __construct()
    {
        $this->loadConfiguration();
    }

    /**
     * Load LED configuration from database (site_settings) with fallback to env()
     */
    protected function loadConfiguration(): void
    {
        $settings = $this->getDbSettings();

        $this->apiUrl = (string) (env('LED_API_URL') ?: 'https://opendata.led.go.th/api/3/action/datastore_search');
        $this->resourceId = (string) (env('LED_RESOURCE_ID') ?: 'e916cc37-78b6-4dbf-bc0f-4bee020cb830');

        $this->timeout = isset($settings['led_timeout']) ? (int) $settings['led_timeout'] : (int) env('LED_TIMEOUT', 15);
        $this->batchSize = isset($settings['led_batch_size']) ? (int) $settings['led_batch_size'] : (int) env('LED_BATCH_SIZE', 50);
        $this->retryLimit = isset($settings['led_retry_count']) ? (int) $settings['led_retry_count'] : (int) env('LED_RETRY_LIMIT', 3);
        $this->requestDelayMs = isset($settings['led_request_delay']) ? (int) $settings['led_request_delay'] : (int) env('LED_REQUEST_DELAY_MS', 500);
        $this->timezone = isset($settings['timezone']) ? (string) $settings['timezone'] : (string) env('LED_TIMEZONE', 'Asia/Bangkok');
    }

    /**
     * Retrieve LED settings from site_settings table
     */
    public function getDbSettings(): array
    {
        try {
            $rows = Database::query("SELECT `key`, `value` FROM site_settings WHERE `group` = 'led' OR `key` = 'timezone'");
            $result = [];
            foreach ($rows as $row) {
                $result[$row['key']] = $row['value'];
            }
            return $result;
        } catch (\Throwable $e) {
            return [];
        }
    }

    public function getConfiguredBatchSize(): int
    {
        return max(1, min(100, $this->batchSize));
    }

    public function getRequestDelayMilliseconds(): int
    {
        return max(100, min(5000, $this->requestDelayMs));
    }

    public function getTimezone(): string
    {
        return $this->timezone;
    }

    /**
     * Perform CKAN datastore_search schema discovery
     */
    public function getDataStoreSchema(): array
    {
        $result = $this->executeRequest(['limit' => 1]);
        if (!$result['success']) {
            return [
                'success' => false,
                'message' => $result['error'] ?? 'ไม่สามารถดึงข้อมูล Schema จากกรมบังคับคดีได้',
                'fields' => [],
                'resource_id' => $this->resourceId,
                'refreshed_at' => date('Y-m-d H:i:s'),
            ];
        }

        return [
            'success' => true,
            'resource_id' => $this->resourceId,
            'fields' => $result['fields'] ?? [],
            'sample_record' => $result['records'][0] ?? null,
            'total_records' => $result['total'] ?? 0,
            'refreshed_at' => date('Y-m-d H:i:s'),
            'duration_ms' => $result['duration_ms'] ?? 0,
        ];
    }

    /**
     * General LED search method
     */
    public function searchLed(array $params): array
    {
        return $this->executeRequest($params);
    }

    /**
     * Search LED datastore by keyword
     */
    public function searchByKeyword(string $keyword, int $limit = 20): array
    {
        $keyword = trim($keyword);
        if ($keyword === '') {
            return [
                'success' => true,
                'total' => 0,
                'records' => [],
                'fields' => [],
                'duration_ms' => 0,
            ];
        }

        return $this->executeRequest([
            'q' => $keyword,
            'limit' => max(1, min(100, $limit)),
        ]);
    }

    /**
     * Search with field filters
     */
    public function searchWithFilters(array $filters, int $limit = 20): array
    {
        return $this->executeRequest([
            'filters' => json_encode($filters, JSON_UNESCAPED_UNICODE),
            'limit' => max(1, min(100, $limit)),
        ]);
    }

    /**
     * Retrieve paginated records
     */
    public function getRecords(array $params): array
    {
        $limit = isset($params['limit']) ? max(1, min(100, (int) $params['limit'])) : 20;
        $offset = isset($params['offset']) ? max(0, (int) $params['offset']) : 0;

        $queryParams = [
            'limit' => $limit,
            'offset' => $offset,
        ];

        if (!empty($params['q'])) {
            $queryParams['q'] = trim((string) $params['q']);
        }

        if (!empty($params['filters']) && is_array($params['filters'])) {
            $queryParams['filters'] = json_encode($params['filters'], JSON_UNESCAPED_UNICODE);
        }

        return $this->executeRequest($queryParams);
    }

    /**
     * Health check for LED CKAN API
     */
    public function healthCheck(): array
    {
        $start = microtime(true);
        $result = $this->executeRequest(['limit' => 1]);
        $duration = round((microtime(true) - $start) * 1000, 2);

        return [
            'status' => $result['success'] ? 'UP' : 'DOWN',
            'api_url' => $this->apiUrl,
            'resource_id' => $this->resourceId,
            'response_time_ms' => $duration,
            'error' => $result['error'] ?? null,
            'checked_at' => date('Y-m-d H:i:s'),
        ];
    }

    /**
     * Core cURL executor with retry, backoff, timeout, duration measurement, and safe logging
     */
    protected function executeRequest(array $queryParams): array
    {
        $queryParams['resource_id'] = $this->resourceId;
        $url = $this->apiUrl . '?' . http_build_query($queryParams);

        $attempt = 0;
        $maxAttempts = max(1, $this->retryLimit);
        $lastError = null;
        $durationMs = 0;

        while ($attempt < $maxAttempts) {
            $attempt++;
            $start = microtime(true);

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($ch, CURLOPT_TIMEOUT, max(5, $this->timeout));
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
            curl_setopt($ch, CURLOPT_USERAGENT, 'RayongCoop-DigitalPortal/1.0');
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
            ]);

            $rawResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            $durationMs = round((microtime(true) - $start) * 1000, 2);
            curl_close($ch);

            // Success (HTTP 200)
            if ($httpCode === 200 && $rawResponse !== false) {
                $decoded = json_decode((string) $rawResponse, true);
                if (is_array($decoded) && ($decoded['success'] ?? false) === true) {
                    $resultData = $decoded['result'] ?? [];
                    return [
                        'success' => true,
                        'total' => (int) ($resultData['total'] ?? count($resultData['records'] ?? [])),
                        'records' => $resultData['records'] ?? [],
                        'fields' => $resultData['fields'] ?? [],
                        'duration_ms' => $durationMs,
                        'attempts' => $attempt,
                    ];
                }

                $lastError = 'LED API ตอบกลับรูปแบบข้อมูลไม่ถูกต้อง';
            } elseif ($curlError) {
                $lastError = "Connection error: {$curlError}";
            } else {
                $lastError = "HTTP error status: {$httpCode}";
            }

            // Retry on transient server errors or network timeouts
            if ($attempt < $maxAttempts) {
                $backoffUs = (int) (pow(2, $attempt - 1) * 200000); // 200ms, 400ms, 800ms
                usleep($backoffUs);
            }
        }

        // Log error safely in system log
        $this->logSystemError("LED API request failed after {$attempt} attempt(s): {$lastError}", [
            'duration_ms' => $durationMs,
            'resource_id' => $this->resourceId,
            'query_keys' => array_keys($queryParams),
        ]);

        return [
            'success' => false,
            'total' => 0,
            'records' => [],
            'fields' => [],
            'duration_ms' => $durationMs,
            'error' => 'ไม่สามารถเชื่อมต่อระบบข้อมูลกรมบังคับคดีได้ในขณะนี้ กรุณาลองใหม่ในภายหลัง',
            'attempts' => $attempt,
        ];
    }

    /**
     * Safely log errors into system_logs table and file logger
     */
    protected function logSystemError(string $message, array $context = []): void
    {
        Logger::error($message, $context);

        try {
            Database::execute(
                "INSERT INTO system_logs (level, message, context, created_at) VALUES ('error', ?, ?, NOW())",
                [$message, json_encode($context, JSON_UNESCAPED_UNICODE)]
            );
        } catch (\Throwable $e) {
            // Ignore DB log failures
        }
    }
}
