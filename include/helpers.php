<?php
/**
 * 共通ヘルパー関数
 * bootstrap.php から読み込まれる
 */

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
    $errors[] = 'お問合せ内容を入力してください。';
  }
  $combinedText = $name . ' ' . $message;
  if (!contains_japanese($combinedText)) {
    $errors[] = 'エラーが発生しました。しばらく時間をおいてから再度お試しください。';
  }
  return $errors;
}
