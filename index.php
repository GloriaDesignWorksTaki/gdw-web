<?php
require_once __DIR__ . '/config/bootstrap.php';

$errors = [];
$name = $email = $message = '';
require_once __DIR__ . '/include/contact_form.php';

$portfolioItems = require __DIR__ . '/config/portfolio.php';

require_once __DIR__ . '/header.php';
require_once __DIR__ . '/include/dialog.php';
?>
<!-- <div class="noise"></div> -->
<main>
  <!-- #mv -->
  <div id="mv">
    <div class="concept-box">
      <div class="concept">
        <h1>Design <span>×</span> Code = <br><strong>Gloria Design Works</strong></h1>
      </div>
    </div>
    <div class="expanding-box"></div>
  </div>
  <!-- #about -->
  <section id="about">
    <div class="wrapper">
      <div class="desc">
        <h2>ABOUT</h2>
        <div class="profile-box">
          <h3>
            <small>Designer・Developer</small>
            <span>YUYA TAKI</span>
          </h3>
        </div>
        <div class="about-flex">
          <div class="text-box">
            <div class="text-box">
              <div class="text is-show">
                <p>Gloria Design Works is a creative project based in Kashiwa City, Chiba Prefecture.</p>
                <p>We specialize in a wide range of design fields, from web design to DTP, logo design, and application UI/UX.</p>
                <p>As active engineers and marketers, we provide not only beautiful design, beautiful code, and branding-conscious marketing strategies, but also designs that are full of attention as professionals in web and branding.</p>
              </div>
              <div class="text is-show">
                <p>Gloria Design Worksは千葉県柏市を中心に活動するクリエイティブプロジェクトです。</p>
                <p>WebデザインをメインにDTP、ロゴデザイン、アプリケーションのUI/UXまで幅広いデザイン領域を得意としています。</p>
                <p>現役エンジニアであり、現役マーケターでもある美しいデザイン、美しいコード、ブランディングを意識したマーケティング戦略までデザインのみならずWeb・ブランディングのプロとしてこだわりに満ち溢れたデザインを提供します。</p>
              </div>
            </div>
          </div>
          <div class="about-img">
            <?php require __DIR__ . '/include/yuya_taki_svg.php'; ?>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- #portfolio -->
  <section id="portfolio">
    <div class="wrapper">
      <div class="desc">
        <div class="title">
          <h2>PORTFOLIO</h2>
          <p>モックをクリックすると選択画面が開きます</p>
        </div>
        <div class="portfolio-mock">
          <div class="mock-base">
            <img class="mock-pc" src="<?php echo $url; ?>/assets/images/portfolio/pc-mock.webp" alt="PC">
            <img class="mock-sp" src="<?php echo $url; ?>/assets/images/portfolio/sp-mock.webp" alt="MOBILE">
          </div>
          <div class="portfolio-mock-img">
            <?php foreach ($portfolioItems as $item): ?>
            <div id="<?php echo escape($item['id']); ?>" class="portfolio-works">
              <img class="works-pc" src="<?php echo $url; ?>/assets/images/works/<?php echo escape($item['image_pc']); ?>" alt="<?php echo escape($item['alt']); ?>">
              <img class="works-sp" src="<?php echo $url; ?>/assets/images/works/<?php echo escape($item['image_sp']); ?>" alt="<?php echo escape($item['alt']); ?>">
            </div>
            <?php endforeach; ?>
          </div>
          <div class="portflio-mock-desc">
            <?php foreach ($portfolioItems as $item): ?>
            <div id="<?php echo escape($item['id']); ?>" class="portfolio-desc">
              <h3><?php echo escape($item['title']); ?></h3>
              <div class="desc-detail">
                <p><?php echo escape($item['description']); ?></p>
                <ul class="tech">
                  <?php foreach ($item['tech'] as $tech): ?>
                  <li><i class="fa-brands fa-<?php echo escape($tech); ?>"></i></li>
                  <?php endforeach; ?>
                </ul>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="portfolio-select">
    <button class="portfolio-close-btn" aria-label="閉じる">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <ul>
      <?php foreach ($portfolioItems as $item): ?>
      <li>
        <a href="#<?php echo escape($item['id']); ?>">
          <img src="<?php echo $url; ?>/assets/images/works/<?php echo escape($item['image_sp']); ?>" alt="<?php echo escape($item['alt']); ?>">
          <div class="site-title"><?php echo escape($item['title']); ?></div>
        </a>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
  <div id="shadow"></div>
  <!-- #skills -->
  <section id="skills" class="rightScroll">
    <div class="wrapper">
      <div class="desc">
        <h2>SKILLS</h2>
        <div class="text">
          <p>Web Design・UI/UX Design・Development・Branding・Marketing</p>
        </div>
        <div class="text">
          <p>Webデザインを中心に、ユーザーエクスペリエンス（UX）を重視したUI/UXデザイン、堅牢で効率的な開発、ブランドイメージの構築を支援するブランディング、そしてマーケティング戦略を駆使して、オンラインの効果的なプレゼンスを作り上げるお手伝いをしています。</p>
          <p>これらのスキルを融合させ、クライアント様のビジネスの成長と成功をサポートしています。</p>
        </div>
      </div>
      <div class="desc">
        <h3>Using Skills</h3>
        <div class="text">
          <p>HTML / CSS / PHP / JavaScript / TypeScript / Python</p>
          <p>React / Node.js / AWS / Git / WordPress</p>
          <p>Figma / Adobe Photoshop / Adobe Illustrator / Adobe InDesign / Affinity</p>
          <p>Google Analytics / Google Tag Manager / Google Search Console / Google Ads / Facebook Ads / Press Release</p>
        </div>
      </div>
    </div>
  </section>
  <!-- #contact -->
  <section id="contact">
    <div class="wrapper">
      <div class="desc">
        <h2>CONTACT</h2>
      </div>
      <form method="post" action="" id="contactForm">
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
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
              SENDING...
            </span>
          </button>
        </div>
      </form>
    </div>
  </section>
</main>
<?php require_once(__DIR__ . '/footer.php'); ?>