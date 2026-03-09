<?php
// $url は config/bootstrap.php で設定済み（全ページで require すること）
if (!isset($url)) {
  $url = (empty($_SERVER['HTTPS']) ? 'http://' : 'https://') . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}
$styleVersion = file_exists(__DIR__ . '/assets/css/style.css') ? filemtime(__DIR__ . '/assets/css/style.css') : time();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>デザイン×コード=Gloria Design Works|千葉県柏のWebデザインプロジェクト</title>
  <meta name="description" content="千葉県柏市を拠点に活動するWebデザインプロジェクトです。Webのみならずロゴやプロダクトデザインまで幅広く手がけます。マーケティング、ブランディングを意識したデザインをお届けします。">
  <!-- no cache -->
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Cache-Control" content="no-cache">
  <!-- ファビコン・アップルタッチアイコン -->
  <link rel="icon" href="<?php echo $url; ?>/assets/images/favicon.ico" id="favicon">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <!-- CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
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
<body class="dark">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TQCN4897" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  <header>
    <div class="logo">
      <a href="<?php echo $url; ?>">
        <img src="<?php echo $url; ?>/assets/images/logo.svg" alt="Gloria Design Works LOGO">
      </a>
    </div>
  </header>
  <div class="mouse-stalker">
    <span class="mouse-stalker-text"></span>
  </div>