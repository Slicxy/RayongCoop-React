<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;

class LedSchemaService
{
    protected LedService $ledService;

    public function __construct(?LedService $ledService = null)
    {
        $this->ledService = $ledService ?? new LedService();
    }

    /**
     * Get discovered schema metadata with formatted fields and masked examples
     */
    public function getSchema(bool $forceRefresh = false): array
    {
        if (!$forceRefresh) {
            $cached = $this->getCachedSchema();
            if ($cached !== null) {
                return $cached;
            }
        }

        return $this->refreshSchema();
    }

    /**
     * Refresh schema live from the LED CKAN API
     */
    public function refreshSchema(): array
    {
        $schemaData = $this->ledService->getDataStoreSchema();

        if (!$schemaData['success']) {
            return [
                'success' => false,
                'message' => $schemaData['message'] ?? 'ไม่สามารถดึงข้อมูล Schema ได้',
                'resource_id' => $schemaData['resource_id'] ?? '',
                'fields' => [],
                'refreshed_at' => date('Y-m-d H:i:s'),
                'total_fields' => 0,
            ];
        }

        $rawFields = $schemaData['fields'] ?? [];
        $sampleRecord = $schemaData['sample_record'] ?? [];
        $formattedFields = [];

        foreach ($rawFields as $field) {
            $id = (string) ($field['id'] ?? '');
            $type = (string) ($field['type'] ?? 'unknown');
            $info = $field['info'] ?? [];

            $label = !empty($info['label']) ? (string) $info['label'] : (!empty($info['notes']) ? (string) $info['notes'] : $id);
            $rawSample = $sampleRecord[$id] ?? null;

            $formattedFields[] = [
                'name' => $id,
                'type' => $type,
                'label' => $label,
                'notes' => (string) ($info['notes'] ?? ''),
                'example_value' => $this->maskExampleValue($id, $rawSample),
            ];
        }

        $result = [
            'success' => true,
            'resource_id' => $schemaData['resource_id'] ?? '',
            'total_records' => $schemaData['total_records'] ?? 0,
            'total_fields' => count($formattedFields),
            'duration_ms' => $schemaData['duration_ms'] ?? 0,
            'fields' => $formattedFields,
            'refreshed_at' => date('Y-m-d H:i:s'),
        ];

        $this->saveCachedSchema($result);

        return $result;
    }

    /**
     * Mask example values for privacy and security
     */
    protected function maskExampleValue(string $fieldName, mixed $value): string
    {
        if ($value === null || $value === '') {
            return '-';
        }

        $str = (string) $value;
        $nameUpper = strtoupper($fieldName);

        // Citizen ID / ID card mask
        if (str_contains($nameUpper, 'CITIZEN') || str_contains($nameUpper, 'IDCARD') || preg_match('/^\d{13}$/', $str)) {
            return mb_substr($str, 0, 1) . '-XXXX-XXXXX-' . mb_substr($str, -2);
        }

        // Phone number mask
        if (str_contains($nameUpper, 'PHONE') || str_contains($nameUpper, 'TEL')) {
            return mb_substr($str, 0, 3) . '-XXX-' . mb_substr($str, -4);
        }

        // Capital amount formatting
        if (is_numeric($str) && (str_contains($nameUpper, 'AMOUNT') || str_contains($nameUpper, 'CAPITAL'))) {
            return number_format((float) $str, 2) . ' บาท';
        }

        return $str;
    }

    /**
     * Retrieve cached schema from site_settings
     */
    protected function getCachedSchema(): ?array
    {
        try {
            $row = Database::first("SELECT value, updated_at FROM site_settings WHERE `key` = 'led_schema_cache' LIMIT 1");
            if ($row && !empty($row['value'])) {
                $decoded = json_decode((string) $row['value'], true);
                if (is_array($decoded)) {
                    $decoded['cached'] = true;
                    $decoded['refreshed_at'] = $row['updated_at'];
                    return $decoded;
                }
            }
        } catch (\Throwable $e) {
            // Ignore DB errors
        }

        return null;
    }

    /**
     * Save schema into site_settings cache
     */
    protected function saveCachedSchema(array $schema): void
    {
        try {
            $json = json_encode($schema, JSON_UNESCAPED_UNICODE);
            Database::execute(
                "INSERT INTO site_settings (`key`, `value`, `group`, `is_public`, created_at, updated_at)
                 VALUES ('led_schema_cache', ?, 'led', 0, NOW(), NOW())
                 ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = NOW()",
                [$json]
            );
        } catch (\Throwable $e) {
            // Ignore cache write errors
        }
    }
}
