<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Services\Mailer;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

session_start();

// CSRFトークン生成
if (empty($_SESSION['csrf_token'])) {
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$errors = [];

// HTMLエスケープ処理
function escape($string) {
  return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// CSRFトークンチェック
function check_csrf_token($token) {
  return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// バリデーション関数
function validate_input($name, $email, $message) {
  $errors = [];
  if (!$name) $errors[] = '名前を入力してください。';
  if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = '有効なメールアドレスを入力してください。';
  if (!$message) $errors[] = 'お問合せ内容を入力してください。';
  return $errors;
}

// フォーム処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = escape(trim($_POST['name'] ?? ''));
  $email = escape(trim($_POST['email'] ?? ''));
  $message = escape(trim($_POST['message'] ?? ''));
  
  if (!check_csrf_token($_POST['csrf_token'] ?? '')) {
      $errors[] = '不正なリクエストです。';
  } else {
      $errors = validate_input($name, $email, $message);
      if (empty($errors)) {
          $mailer = new Mailer();
          if ($mailer->sendContactMail($name, $email, $message)) {
              // 出力バッファリングを開始
              ob_start();
              header('Location: thank-you.php');
              exit;
          } else {
              $errors[] = 'メール送信に失敗しました。';
          }
      }
  }
}

require_once(__DIR__ . '/header.php');
?>

<main>
  <!-- フォーム -->
  <section id="contact">
    <div class="wrapper">
      <div class="desc">
        <h2>CONTACT</h2>
      </div>
      <form method="post" action="" id="contactForm">
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
        <?php if ($errors): ?>
        <div class="error-messages">
        <?php foreach ($errors as $error): ?>
          <p><?php echo escape($error); ?></p>
        <?php endforeach; ?>
        </div>
        <?php endif; ?>
        <div class="form-block">
          <label for="name">名前</label>
          <input type="text" id="name" name="name" required value="<?php echo escape($name ?? ''); ?>">
        </div>
        <div class="form-block">
          <label for="email">メールアドレス</label>
          <input type="email" id="email" name="email" required value="<?php echo escape($email ?? ''); ?>">
        </div>
        <div class="form-block">
          <label for="message">お問合せ内容</label>
          <textarea id="message" name="message" required><?php echo escape($message ?? ''); ?></textarea>
        </div>
        <div class="form-block send-button">
          <button type="submit" class="en submit-btn" id="submitBtn">
            <span class="default">SEND</span>
            <span class="loading" style="display: none;">
              <div class="spinner"></div>
              送信中...
            </span>
          </button>
        </div>
      </form>
    </div>
  </section>
</main>

<script>
document.getElementById('contactForm').addEventListener('submit', function() {
  var submitBtn = document.getElementById('submitBtn');
  var defaultText = submitBtn.querySelector('.default');
  var loadingText = submitBtn.querySelector('.loading');

  // ボタンをローディング状態に切り替え
  defaultText.style.display = 'none';
  loadingText.style.display = 'inline-flex';
});
</script>

<?php require_once(__DIR__ . '/footer.php'); ?> 