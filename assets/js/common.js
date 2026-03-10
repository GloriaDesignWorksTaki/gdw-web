/**
 * 共通UI: マウスストーカー・ポートフォリオモーダル・GSAPスクロール
 * @file assets/js/common.js
 */

/** @type {boolean} アニメーション有効フラグ。window.ENABLE_MOTION で上書き可能。 */
const ENABLE_MOTION = typeof window.ENABLE_MOTION === 'boolean' ? window.ENABLE_MOTION : true;

/** マウスストーカーを表示する最小幅 */
const STALKER_MIN_WIDTH = 1024;

/**
 * マウスストーカーを初期化する。
 * @returns {void}
 */
function initMouseStalker() {
  const stalker = document.querySelector('.mouse-stalker');
  const stalkerText = document.querySelector('.mouse-stalker-text');
  if (!stalker || !stalkerText) return;
  if (!window.matchMedia(`(min-width: ${STALKER_MIN_WIDTH}px)`).matches) return;
  if (stalker.dataset.initialized === 'true') return;
  stalker.dataset.initialized = 'true';

  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#ffffff';
  Object.assign(stalker.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'fixed',
    top: '-5px',
    left: '-5px',
    width: '10px',
    height: '10px',
    background: secondaryColor,
    borderRadius: '50%',
    zIndex: '99999',
    mixBlendMode: 'difference',
    transition: 'transform 0.1s, width 0.2s, height 0.2s, top 0.2s, left 0.2s',
    transitionTimingFunction: 'ease-out'
  });

  let mouseX = 0, mouseY = 0;
  let stalkerX = 0, stalkerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const updateStalker = () => {
    if (stalker?.dataset.initialized === 'true') {
      stalkerX += (mouseX - stalkerX) * 0.2;
      stalkerY += (mouseY - stalkerY) * 0.2;
      stalker.style.transform = `translate(${stalkerX}px, ${stalkerY}px)`;
      requestAnimationFrame(updateStalker);
    }
  };
  updateStalker();

  const mql = window.matchMedia(`(min-width: ${STALKER_MIN_WIDTH}px)`);
  mql.addEventListener('change', () => {
    if (mql.matches) {
      stalker.style.display = 'flex';
    } else {
      stalker.style.display = 'none';
      stalker.classList.remove('is_active');
      stalkerText.textContent = '';
      Object.assign(stalker.style, { width: '', height: '', top: '', left: '' });
    }
  });

  /**
   * 要素種別に応じたストーカー表示文言を返す
   * @param {Element} el - ホバーした要素（a, button, input など）
   * @returns {string}
   */
  function getActionText(el) {
    if (el.classList.contains('portfolio-mock')) return 'VIEW PORTFOLIO';
    if (el.tagName === 'BUTTON' || el.type === 'submit') {
      const t = el.textContent.trim();
      return (t.includes('SEND') || t.includes('送信')) ? 'SEND' : 'CLICK';
    }
    if (el.tagName === 'A') {
      const href = el.getAttribute('href') ?? '';
      const icon = el.querySelector('i');
      if (icon) {
        if (icon.classList.contains('fa-github')) return 'Access to Github';
        if (icon.classList.contains('fa-x-twitter')) return 'Access to Twitter';
        if (icon.classList.contains('fa-instagram')) return 'Access to Instagram';
      }
      if (href.startsWith('#')) {
        const title = el.closest('.portfolio-select') && el.querySelector('.site-title');
        return title?.textContent.trim() || 'VIEW';
      }
      if (href.startsWith('http') || href.startsWith('mailto:')) return 'OPEN';
      return 'CLICK';
    }
    if (el.tagName === 'INPUT') {
      const id = el.getAttribute('id') ?? '';
      const name = el.getAttribute('name') ?? '';
      if (id === 'name' || name === 'name') return 'Enter Your Name';
      if (id === 'email' || name === 'email') return 'Enter Your Email';
      return 'INPUT';
    }
    if (el.tagName === 'TEXTAREA') {
      const id = el.getAttribute('id') ?? '';
      const name = el.getAttribute('name') ?? '';
      return (id === 'message' || name === 'message') ? 'Enter Your Message' : 'INPUT';
    }
    if (el.tagName === 'LABEL') return 'SELECT';
    return 'CLICK';
  }

  /**
   * ストーカーのサイズをテキスト幅に合わせて更新する
   * @param {string} text - 表示するラベル文字列
   * @returns {void}
   */
  function updateStalkerSize(text) {
    if (!stalkerText || !text) return;
    stalkerText.textContent = text;
    const measure = document.createElement('span');
    Object.assign(measure.style, {
      fontSize: '0.625rem',
      fontFamily: '"Noto Serif JP", "Noto Serif", serif',
      fontWeight: '700',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
      visibility: 'hidden',
      position: 'absolute',
      top: '-9999px',
      padding: '0',
      margin: '0'
    });
    measure.textContent = text;
    document.body.appendChild(measure);
    const w = Math.max(40, measure.offsetWidth + 20);
    const h = Math.max(40, measure.offsetHeight + 16);
    document.body.removeChild(measure);
    stalker.style.width = `${w}px`;
    stalker.style.height = `${h}px`;
    stalker.style.top = `-${h / 2}px`;
    stalker.style.left = `-${w / 2}px`;
  }

  const selector = 'a, input, label, button, .portfolio-mock, textarea';
  document.querySelectorAll(selector).forEach((elem) => {
    elem.addEventListener('mouseover', () => {
      stalker.classList.add('is_active');
      updateStalkerSize(getActionText(elem));
    });
    elem.addEventListener('mouseout', () => {
      stalker.classList.remove('is_active');
      stalkerText.textContent = '';
      Object.assign(stalker.style, { width: '', height: '', top: '', left: '' });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMouseStalker);
} else {
  initMouseStalker();
}

document.addEventListener('DOMContentLoaded', () => {
  /** expanding-box のスクロール連動背景色（ENABLE_MOTION 時のみ） */
  if (ENABLE_MOTION && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.expanding-box', {
      width: '100vw',
      height: '100vh',
      backgroundColor: '#1b86d4',
      duration: 1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '35% bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const s = { r: 255, g: 255, b: 255 };
          const e = { r: 47, g: 44, b: 42 };
          const r = Math.round(s.r + (e.r - s.r) * p);
          const g = Math.round(s.g + (e.g - s.g) * p);
          const b = Math.round(s.b + (e.b - s.b) * p);
          gsap.set('.expanding-box', { backgroundColor: `rgb(${r}, ${g}, ${b})` });
        }
      }
    });
  }

  const portfolioMock = document.querySelector('.portfolio-mock');
  const portfolioList = document.querySelector('.portfolio-select');
  const shadow = document.querySelector('#shadow');

  if (!portfolioMock || !portfolioList || !shadow) return;

  const portfolioLinks = document.querySelectorAll('.portfolio-select a');
  const works = document.querySelectorAll('.portfolio-works');
  const descriptions = document.querySelectorAll('.portfolio-desc');

  /**
   * ポートフォリオモーダルを閉じ、クラスを外して callback を実行する
   * @param {function(): void} [callback] - 閉じた後に呼ぶ関数
   * @returns {void}
   */
  const closePortfolio = (callback) => {
    if (typeof window.animatePortfolioClose === 'function') {
      window.animatePortfolioClose(() => {
        portfolioList.classList.remove('active');
        shadow.classList.remove('active');
        document.body.classList.remove('fixed');
        callback?.();
      });
    } else {
      portfolioList.classList.remove('active');
      shadow.classList.remove('active');
      document.body.classList.remove('fixed');
      callback?.();
    }
  };

  portfolioMock.addEventListener('click', () => {
    const isOpening = !portfolioList.classList.contains('active');
    if (isOpening) {
      portfolioList.classList.add('active');
      shadow.classList.add('active');
      document.body.classList.add('fixed');
      if (typeof window.animatePortfolioOpen === 'function') window.animatePortfolioOpen();
    } else {
      closePortfolio();
    }
  });

  works.forEach((w) => { w.style.display = 'none'; });
  descriptions.forEach((d) => { d.style.display = 'none'; });
  if (works.length > 0 && descriptions.length > 0) {
    const firstId = works[0].id;
    works[0].style.display = 'block';
    const firstDesc = document.querySelector(`.portfolio-desc#${firstId}`);
    if (firstDesc) firstDesc.style.display = 'block';
  }

  portfolioLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.replace('#', '') ?? '';
      const targetWork = document.querySelector(`#${targetId}`);
      const targetDesc = document.querySelector(`.portfolio-desc#${targetId}`);

      if (targetWork && targetDesc) {
        works.forEach((w) => { w.style.display = 'none'; });
        descriptions.forEach((d) => { d.style.display = 'none'; });
        targetWork.style.display = 'block';
        targetDesc.style.display = 'block';
      }

      portfolioLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      closePortfolio();
    });
  });

  shadow.addEventListener('click', () => closePortfolio());

  const closeBtn = document.querySelector('.portfolio-close-btn');
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closePortfolio();
  });
});
