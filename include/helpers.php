<?php
/**
 * Helpers
 * @author Gloria Design Works
 * @version 1.00.000
 * @see https://gloria-design-works.com/
 * @package App\Helpers
 */

// ベースURLの設定
function base_url(): string {
  $fromEnv = $_ENV['APP_BASE_URL'] ?? getenv('APP_BASE_URL');
  if (is_string($fromEnv) && $fromEnv !== '') {
    return rtrim($fromEnv, '/');
  }

  $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
  $https = false;

  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    $https = true;
  }

  if (!$https && is_request_from_trusted_proxy()) {
    $proto = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));
    if ($proto === 'https') {
      $https = true;
    }
  }

  $scheme = $https ? 'https' : 'http';
  return $scheme . '://' . $host;
}

// TRUSTED_PROXY_IPSにREMOTE_ADDRが含まれるかのチェック
function is_request_from_trusted_proxy(): bool {
  $remote = $_SERVER['REMOTE_ADDR'] ?? '';
  if ($remote === '' || $remote === '0.0.0.0') {
    return false;
  }
  $list = $_ENV['TRUSTED_PROXY_IPS'] ?? getenv('TRUSTED_PROXY_IPS');
  if (!is_string($list) || trim($list) === '') {
    return false;
  }
  foreach (array_map('trim', explode(',', $list)) as $trusted) {
    if ($trusted !== '' && $trusted === $remote) {
      return true;
    }
  }
  return false;
}

// HTMLエスケープ
function escape($string) {
  return htmlspecialchars((string) $string, ENT_QUOTES, 'UTF-8');
}

// CSRFトークンチェック
function check_csrf_token($token) {
  return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// 日本語文字が含まれているか
function contains_japanese($text) {
  return preg_match('/[\x{3040}-\x{309F}\x{30A0}-\x{30FF}\x{4E00}-\x{9FAF}\x{3000}-\x{303F}]/u', $text);
}

// お問い合わせフォームのバリデーション
function validate_input($name, $email, $message) {
  $errors = [];
  if (!$name) {
    $errors[] = '名前を入力してください。';
  }
  if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = '有効なメールアドレスを入力してください。';
  }
  if (!$message) {
    $errors[] = 'お問い合わせ内容を入力してください。';
  }
  $combinedText = $name . ' ' . $message;
  if (!contains_japanese($combinedText)) {
    $errors[] = 'エラーが発生しました。しばらく時間をおいてから再度お試しください。';
  }
  return $errors;
}
