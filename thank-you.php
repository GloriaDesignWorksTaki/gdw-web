<?php
require_once __DIR__ . '/config/bootstrap.php';

$form_data = isset($_SESSION['form_data']) ? $_SESSION['form_data'] : null;
unset($_SESSION['form_data']);
require_once __DIR__ . '/header.php';
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
<?php require_once __DIR__ . '/footer.php'; ?>