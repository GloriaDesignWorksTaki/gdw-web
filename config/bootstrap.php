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

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

session_start();

// CSRFトークン生成
if (empty($_SESSION['csrf_token'])) {
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 共通ヘルパーを読み込み
require_once __DIR__ . '/../include/helpers.php';

// 共通で使うベースURL
$url = base_url();
