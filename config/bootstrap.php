<?php
/**
 * Bootstrap
 * @package App\Bootstrap
 * @author Gloria Design Works
 * @version 1.00.000
 * @see https://gloria-design-works.com/
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$root = dirname(__DIR__);

// envファイルの読み込み
$dotenvFromEnv = getenv('DOTENV_FILE');
if ($dotenvFromEnv !== false && $dotenvFromEnv !== '') {
  $dotenvName = basename($dotenvFromEnv);
} elseif (PHP_SAPI === 'cli') {
  $dotenvName = '.env_local';
} else {
  $host = $_SERVER['HTTP_HOST'] ?? '';
  $hostOnly = preg_replace('/:\d+$/', '', $host);
  $isLocalHost =
    preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/i', $host)
    || preg_match('/^\[::1\](:\d+)?$/', $host)
    || preg_match('/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)/', $hostOnly);
  $dotenvName = $isLocalHost ? '.env_local' : '.env_prod';
}

if (is_readable($root . '/' . $dotenvName)) {
  Dotenv::createImmutable($root, $dotenvName)->load();
} elseif (is_readable($root . '/.env')) {
  Dotenv::createImmutable($root, '.env')->load();
}

session_start();

// CSRFトークン生成
if (empty($_SESSION['csrf_token'])) {
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 共通ヘルパーを読み込み
require_once __DIR__ . '/../include/helpers.php';

// 共通で使うベースURL
$url = base_url();
