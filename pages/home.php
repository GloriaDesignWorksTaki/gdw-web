<?php
/**
 * Home Page
 * @package App\Home
 * @author Gloria Design Works
 * @version 1.00.000
 * @see https://gloria-design-works.com/
 */

$root = dirname(__DIR__);

require_once $root . '/config/bootstrap.php';

$errors = [];
$name = $email = $message = '';
require_once $root . '/include/contact_form.php';

$worksItems = require $root . '/config/works.php';
$skills = require $root . '/config/skills.php';

require_once $root . '/components/header.php';
require_once $root . '/components/dialog.php';
?>
<div class="noise"></div>
<main>
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
      <h2 class="outline-title scroll-trigger scroll-blur">About</h2>
      <div class="desc">
        <div class="text scroll-trigger scroll-blur">
          <p>My work focuses on minimal and simple design, with a strong emphasis on the use of white space.</p>
          <p>In today’s information-saturated world, I aim to reduce visual noise and make essential information clear and accessible.</p>
          <p>By organizing elements and intentionally using space, I create visual flow that helps users understand information intuitively.</p>
        </div>
        <div class="text scroll-trigger scroll-blur">
          <p>ミニマルでシンプル、余白を大切にしたデザインを軸に制作しています。</p>
          <p>情報が溢れる現代において、視覚的なノイズを減らし、本当に必要な情報が見やすく伝わることを大切にしています。</p>
          <p>要素を整理し、余白や空間を活かすことで視線の流れを設計し、直感的に理解できるデザインを心がけています。</p>
        </div>
      </div>
      <div class="profile-box scroll-trigger scroll-blur">
        <p class="profile-role">Designer / Developer</p>
        <p class="profile-name">Yuya Taki</p>
      </div>
    </div>
  </section>
  <section id="works">
    <div class="wrapper">
      <h2 class="outline-title scroll-trigger scroll-blur">Works</h2>
      <div class="works-lists">
        <?php foreach ($worksItems as $workItem): ?>
          <div
            class="works-slot scroll-trigger scroll-blur"
            data-work-id="<?php echo escape($workItem['id'] ?? ''); ?>"
            data-stalker-title="<?php echo escape($workItem['title'] ?? ''); ?>"
            data-work-title="<?php echo escape($workItem['title'] ?? ''); ?>"
            data-work-year="<?php echo escape($workItem['year'] ?? ''); ?>"
            data-work-charge="<?php echo escape($workItem['charge'] ?? ''); ?>"
            data-work-tech="<?php echo escape(implode(',', $workItem['tech'] ?? [])); ?>"
          >
            <div class="works-image image">
              <img src="<?php echo $url; ?>/assets/images/works/<?php echo escape($workItem['image'] ?? ''); ?>" alt="<?php echo escape($workItem['title'] ?? ''); ?>">
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section id="skills">
    <div class="wrapper">
      <h2 class="outline-title scroll-trigger scroll-blur">Skills</h2>
      <div class="desc-lists">
        <?php foreach ($skills as $skill): ?>
          <dl class="scroll-trigger scroll-blur">
            <dt><?php echo escape($skill['title'] ?? ''); ?></dt>
            <dd>
              <?php foreach (($skill['items'] ?? []) as $item): ?>
                <span><?php echo escape($item); ?></span>
              <?php endforeach; ?>
            </dd>
          </dl>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section id="contact">
    <div class="wrapper">
      <h2 class="outline-title scroll-trigger scroll-blur">Contact</h2>
      <form method="post" action="" id="contactForm">
        <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
        <div class="form-block scroll-trigger scroll-blur">
          <label for="name">名前</label>
          <input type="text" id="name" name="name" required value="<?php echo escape($name ?? ''); ?>">
        </div>
        <div class="form-block scroll-trigger scroll-blur">
          <label for="email">メールアドレス</label>
          <input type="email" id="email" name="email" required value="<?php echo escape($email ?? ''); ?>">
        </div>
        <div class="form-block scroll-trigger scroll-blur">
          <label for="message">お問い合わせ内容</label>
          <textarea id="message" name="message" required><?php echo escape($message ?? ''); ?></textarea>
        </div>
        <div class="form-block send-button scroll-trigger scroll-blur">
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

<div class="works-flip-modal" aria-hidden="true">
  <div class="works-flip-modal-overlay"></div>
  <div class="works-flip-modal-body">
    <div class="works-flip-modal-content" aria-label="Works gallery">
      <div class="works-flip-modal-image-mount"></div>
      <div class="works-flip-modal-meta" aria-hidden="true">
        <div class="works-flip-modal-meta-shade" aria-hidden="true"></div>
        <div class="works-flip-modal-meta-inner">
          <p class="works-flip-modal-meta-year en"></p>
          <h2 class="works-flip-modal-meta-title en"></h2>
          <p class="works-flip-modal-meta-charge en"></p>
          <ul class="works-flip-modal-meta-tech"></ul>
        </div>
      </div>
    </div>
  </div>
</div>

<?php require_once $root . '/components/footer.php'; ?>