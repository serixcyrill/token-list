<?php
// Daily index data updater
// Usage: php /path/to/update_index_data.php

const EODHD_API_KEY = 'MEIN_EODHD_KEY';
const FINNHUB_API_KEY = 'MEIN_FINNHUB_KEY';

$symbols = [
    'URTH.US', // MSCI World
    'EEM.US',  // MSCI Emerging Markets
    'MCHI.US', // MSCI China
    'EWZ.US',  // MSCI Brazil
    'EZA.US',  // MSCI South Africa
    'EWA.US',  // MSCI Australia
    'EWJ.US',  // MSCI Japan
    'EWC.US',  // MSCI Canada
    'EWU.US',  // MSCI UK
    'IEUR.US', // MSCI Europe
];

$targetDir = __DIR__ . '/data';
$targetFile = $targetDir . '/index-data.json';

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0775, true);
}

function fetchWithCurl(string $url): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => [
            'User-Agent: Index-Updater/1.0'
        ],
    ]);
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [$status, $body];
}

function fetchEodhd(string $symbol): ?array
{
    $url = sprintf(
        'https://eodhd.com/api/eod/%s?api_token=%s&from=1990-01-01&order=a&fmt=json',
        rawurlencode($symbol),
        EODHD_API_KEY
    );
    [$status, $body] = fetchWithCurl($url);
    if ($status !== 200 || $body === false) {
        return null;
    }

    $data = json_decode($body, true);
    if (!is_array($data)) {
        return null;
    }

    return array_map(function ($row) {
        return [
            'date' => $row['date'] ?? null,
            'close' => isset($row['close']) ? (float)$row['close'] : null,
            'adjusted_close' => isset($row['adjusted_close']) ? (float)$row['adjusted_close'] : null,
        ];
    }, $data);
}

function fetchFinnhub(string $symbol): ?array
{
    $url = sprintf(
        'https://finnhub.io/api/v1/stock/candle?symbol=%s&resolution=D&token=%s',
        rawurlencode($symbol),
        FINNHUB_API_KEY
    );
    [$status, $body] = fetchWithCurl($url);
    if ($status !== 200 || $body === false) {
        return null;
    }

    $data = json_decode($body, true);
    if (!is_array($data) || empty($data['c']) || empty($data['t'])) {
        return null;
    }

    $closes = $data['c'];
    $times = $data['t'];
    $out = [];
    foreach ($closes as $i => $price) {
        if (!isset($times[$i])) {
            continue;
        }
        $out[] = [
            'date' => gmdate('Y-m-d', (int)$times[$i]),
            'close' => (float)$price,
            'adjusted_close' => (float)$price,
        ];
    }

    return $out;
}

$result = [];

foreach ($symbols as $symbol) {
    echo "Fetching {$symbol}..." . PHP_EOL;
    $series = fetchEodhd($symbol);
    if ($series === null || empty($series)) {
        echo " -> EODHD failed, trying Finnhub" . PHP_EOL;
        $series = fetchFinnhub($symbol);
    }

    if ($series === null || empty($series)) {
        echo " -> No data for {$symbol}" . PHP_EOL;
        continue;
    }

    $result[$symbol] = $series;
    echo " -> Stored " . count($series) . " rows" . PHP_EOL;
}

file_put_contents($targetFile, json_encode($result, JSON_PRETTY_PRINT));
echo "Done. Saved to {$targetFile}" . PHP_EOL;
