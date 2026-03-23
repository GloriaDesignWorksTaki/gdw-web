<?php
/**
 * Header Parts
 * @author Gloria Design Works
 * @version 1.00.000
 * @see https://gloria-design-works.com/
 */

if (!isset($url)) {
  require_once __DIR__ . '/../config/bootstrap.php';
}
$styleVersion = file_exists(__DIR__ . '/../assets/css/style.css') ? filemtime(__DIR__ . '/../assets/css/style.css') : time();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php if (!empty($page_meta_robots ?? '')): ?>
  <meta name="robots" content="<?php echo escape($page_meta_robots); ?>">
  <?php endif; ?>
  <title>デザイン×コード=Gloria Design Works|千葉県柏のWebデザインプロジェクト</title>
  <meta name="description" content="千葉県柏市を拠点に活動するWebデザインプロジェクトです。Webのみならずロゴやプロダクトデザインまで幅広く手がけます。マーケティング、ブランディングを意識したデザインをお届けします。">
  <!-- no cache -->
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Cache-Control" content="no-cache">
  <!-- Favicon & Apple Touch Icon -->
  <link rel="icon" href="<?php echo $url; ?>/assets/images/favicon.ico" id="favicon">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $url; ?>/apple-touch-icon.png">
  <!-- CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css">
  <link rel="stylesheet" href="<?php echo $url; ?>/assets/css/reset.css">
  <link rel="stylesheet" href="<?php echo $url; ?>/assets/css/style.css?v=<?php echo $styleVersion; ?>">
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TQCN4897');</script>
  <!-- End Google Tag Manager -->
</head>
<?php
$body_class_extra = isset($body_class_extra) ? trim((string) $body_class_extra) : '';
$show_page_loader = isset($show_page_loader) ? (bool) $show_page_loader : true;
$body_loading_class = $show_page_loader ? ' is-loading' : '';
?>
<body class="dark<?php echo $body_loading_class; ?><?php echo $body_class_extra !== '' ? ' ' . escape($body_class_extra) : ''; ?>">
  <?php if ($show_page_loader): ?>
  <div id="page-loader">
    <div class="loader-content">
      <div class="loader-logo" id="loaderLogo" aria-label="Gloria Design Works logo"></div>
    </div>
  </div>
  <?php endif; ?>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQCN4897" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <noscript><style>.scroll-trigger{opacity:1!important}</style></noscript>
  <header>
    <div class="logo">
      <a href="<?php echo $url; ?>">
        <img src="<?php echo $url; ?>/assets/images/common/logo.svg" alt="Gloria Design Works LOGO">
      </a>
    </div>
  </header>
  <div class="mouse-stalker">
    <span class="mouse-stalker-text"></span>
  </div>
