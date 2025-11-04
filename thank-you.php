<?php
session_start();

// 必要ならセッションのデータを使用する例
$form_data = isset($_SESSION['form_data']) ? $_SESSION['form_data'] : null;

// セッションをクリア（不要であればこの行を削除）
unset($_SESSION['form_data']);
require_once(__DIR__ . '/header.php');
?>
<script>
// サンクスページにクラスを追加
document.body.classList.add('page-thanks');
</script>
<main>
  <!-- #contact-thanks -->
   <section id="contact-thanks">
    <div class="wrapper">
      <div class="desc">
        <h2>CONTACT THANKS!</h2>
        <div class="text">
          <p>お問合せありがとうございます。</p>
          <p>メールの内容を確認後、ご返信いたします。</p>
        </div>
      </div>
      <div class="button">
        <a href="<?php echo $url; ?>">TOPに戻る</a>
      </div>
    </div>
   </section>
</main>
<?php require_once(__DIR__ . '/footer.php'); ?>