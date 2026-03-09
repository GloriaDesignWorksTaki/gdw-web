<?php
/**
 * アプリケーションの共通ブートストラップ
 * 全ページで require してから header 等を読み込む
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

// 共通で使うベースURL（header / footer / リンク用）
$url = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');

// 共通ヘルパーを読み込み
require_once __DIR__ . '/../include/helpers.php';
