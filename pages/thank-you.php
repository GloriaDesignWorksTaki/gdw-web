<?php
/**
 * Thank You Page
 * @package App\ThankYou
 * @author Gloria Design Works
 * @version 1.00.000
 * @see https://gloria-design-works.com/
 */

$root = dirname(__DIR__);

require_once $root . '/config/bootstrap.php';
$url = base_url();

$form_data = isset($_SESSION['form_data']) ? $_SESSION['form_data'] : null;
unset($_SESSION['form_data']);

$page_meta_robots = 'noindex';
$body_class_extra = 'page-thanks';
$show_page_loader = false;

require_once $root . '/components/header.php';
?>
<div class="noise"></div>
<main>
  <!-- #contact-thanks -->
   <section id="contact-thanks">
    <div class="wrapper">
      <div class="desc">
        <h2>CONTACT THANKS!</h2>
        <div class="text">
          <p>お問い合わせありがとうございます。</p>
          <p>メールの内容を確認後、ご返信いたします。</p>
        </div>
      </div>
      <div class="button">
        <a href="<?php echo $url; ?>">TOPに戻る</a>
      </div>
    </div>
  </section>
</main>
<?php require_once $root . '/components/footer.php'; ?>
