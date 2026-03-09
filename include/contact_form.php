<?php
/**
 * お問い合わせフォームの受信・バリデーション・送信
 */
use App\Services\Mailer;
use App\Services\SecurityService;

$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
  && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  return;
}

$name_raw = trim($_POST['name'] ?? '');
$email_raw = trim($_POST['email'] ?? '');
$message_raw = trim($_POST['message'] ?? '');

if (!check_csrf_token($_POST['csrf_token'] ?? '')) {
  $errors[] = '不正なリクエストです。';
} else {
  $security = new SecurityService();

  if (!$security->checkTimeLimit()) {
    $errors[] = '送信の間隔が短すぎます。しばらく時間をおいてから再度お試しください。';
  }
  if (empty($errors)) {
    $errors = validate_input($name_raw, $email_raw, $message_raw);
  }
  if (empty($errors) && !$security->validateEmail($email_raw)) {
    $errors[] = '有効なメールアドレスを入力してください。';
  }
  if (empty($errors) && !$security->checkRateLimit()) {
    $errors[] = '送信回数の上限を超えました。しばらく時間をおいてから再度お試しください。';
  }
  if (empty($errors)) {
    $mailer = new Mailer();
    if ($mailer->sendContactMail($name_raw, $email_raw, $message_raw)) {
      if ($isAjax) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'redirect' => 'thank-you.php']);
        exit;
      }
      header('Location: thank-you.php');
      exit;
    }
    $errors[] = 'メール送信に失敗しました。';
  }
}

$name = escape($name_raw);
$email = escape($email_raw);
$message = escape($message_raw);

if ($isAjax) {
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'errors' => $errors]);
  exit;
}
