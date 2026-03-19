/**
 * Animations JS | Gloria Design Works
 * @file assets/js/animations.js
 */

/**
 * ローディングアニメーション用クラス
 * @type {class}
 */
class LoadingAnimation {
  // アニメーションの最小時間
  static MIN_MS = 3000;

  static _scrollLock = {
    locked: false,
    prevBodyOverflow: '',
    prevDocOverflow: '',
    prevBodyWidth: '',
    preventFn: null,
    enforceTimer: null,
  };

  // スクロール位置が戻る/復元されるケースがあるため、強制的に先頭へ寄せる
  static forceScrollTop() {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // ignore
    }
    // 一部ブラウザで補助的に効く
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  static lockScroll() {
    if (LoadingAnimation._scrollLock.locked) return;
    LoadingAnimation._scrollLock.locked = true;

    const state = LoadingAnimation._scrollLock;
    state.prevBodyOverflow = document.body.style.overflow;
    state.prevDocOverflow = document.documentElement.style.overflow;
    state.prevBodyWidth = document.body.style.width;

    state.preventFn = (e) => {
      e.preventDefault();
    };

    // overflow hidden だけだと環境によってはまだ動くことがあるので、念のためイベントも止める
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.width = '100%';

    window.addEventListener('wheel', state.preventFn, { passive: false, capture: true });
    window.addEventListener('touchmove', state.preventFn, { passive: false, capture: true });

    // ローディング中にブラウザが復元しようとするスクロール位置を潰す
    LoadingAnimation.forceScrollTop();
    state.enforceTimer = window.setInterval(() => {
      LoadingAnimation.forceScrollTop();
    }, 50);
  }

  static unlockScroll() {
    const state = LoadingAnimation._scrollLock;
    if (!state.locked) return;

    state.locked = false;

    if (state.enforceTimer) {
      window.clearInterval(state.enforceTimer);
      state.enforceTimer = null;
    }

    // 開放した直後に復元されることがあるため、解除前後で先頭を確定
    LoadingAnimation.forceScrollTop();

    document.body.style.overflow = state.prevBodyOverflow;
    document.documentElement.style.overflow = state.prevDocOverflow;
    document.body.style.width = state.prevBodyWidth;

    if (state.preventFn) {
      window.removeEventListener('wheel', state.preventFn, { capture: true });
      window.removeEventListener('touchmove', state.preventFn, { capture: true });
    }
  }

  // ロゴの描写
  static drawLogo(logoContainer, logoSrc) {
    if (!logoContainer) return Promise.resolve();
    return fetch(logoSrc)
      .then((r) => r.text())
      .then((svgText) => {
        const svg = new DOMParser().parseFromString(svgText, 'image/svg+xml').querySelector('svg');
        if (!svg) throw new Error('SVG not found');
        svg.classList.add('loader-logo-svg');
        logoContainer.innerHTML = '';
        logoContainer.appendChild(svg);
        // ロゴのグラデーション
        const [, , w, h] = (svg.getAttribute('viewBox') || '0 0 532 61').split(/\s+/).map(Number);
        const root = document.documentElement;
        const accent = getComputedStyle(root).getPropertyValue('--color-accent').trim() || '#1b86d4';
        const accent2 = getComputedStyle(root).getPropertyValue('--color-accent2').trim() || '#d4521b';
        const defsStr = `<defs><linearGradient id="loader-logo-gradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="${h}"><stop offset="0%" stop-color="${accent}"/><stop offset="100%" stop-color="${accent2}"/></linearGradient></defs>`;
        const defs = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${defsStr}</svg>`, 'image/svg+xml').querySelector('defs');
        svg.insertBefore(defs, svg.firstChild);

        // ロゴの要素
        const elements = svg.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse');
        if (!elements.length) return new Promise((resolve) => gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.5, onComplete: resolve }));

        const grad = 'url(#loader-logo-gradient)';
        elements.forEach((el) => {
          if (typeof el.getTotalLength !== 'function') return;
          const len = el.getTotalLength();
          el.style.strokeDasharray = el.style.strokeDashoffset = `${len}`;
          el.style.stroke = grad;
          el.style.strokeWidth = '1.5';
          el.style.fill = 'transparent';
        });
        return new Promise((resolve) => {
          const tl = gsap.timeline({ onComplete: resolve });
          elements.forEach((el, i) => tl.to(el, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out' }, i * 0.04));
          tl.to(elements, { fill: grad, duration: 0.25, stagger: 0.01 }, '-=0.15');
        });
      })
      .catch(() => { logoContainer.innerHTML = `<img src="${logoSrc}" alt="Gloria Design Works logo">`; });
  }

  static init() {
    // リロード時はページの先頭へ
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch (e) {
      // ignore
    }
    window.scrollTo(0, 0);
    LoadingAnimation.lockScroll();

    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.innerHTML = '<div class="loader-content"><div class="loader-logo" id="loaderLogo" aria-label="Gloria Design Works logo"></div></div>';
      document.body.appendChild(loader);
      document.body.classList.add('is-loading');
    }
    const logoContainer = loader.querySelector('#loaderLogo');
    const logoSrc = document.querySelector('header .logo img')?.src ?? './assets/images/logo.svg';

    const hideLoader = () => {
      const cleanup = () => {

        LoadingAnimation.unlockScroll();
        document.body.classList.remove('is-loading');
        loader.remove();
        if (typeof MainVisualText !== 'undefined' && typeof MainVisualText.init === 'function') {
          MainVisualText.init();
        }
      };
      if (typeof gsap === 'undefined') cleanup();
      else gsap.to(loader, { opacity: 0, duration: 0.45, delay: 0.15, onComplete: cleanup });
    };
    const start = Date.now();
    Promise.all([
      LoadingAnimation.drawLogo(logoContainer, logoSrc),
      document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))
    ]).then(() => {
      const wait = Math.max(0, LoadingAnimation.MIN_MS - (Date.now() - start));
      wait > 0 ? setTimeout(hideLoader, wait) : hideLoader();
    });
  }
}

/**
 * スクロールアニメーション用クラス
 * @type {class}
 */
class ScrollAnimations {
  static SELECTOR = '.scroll-trigger';
  static STAGGER_SELECTOR = '.scroll-stagger';
  static DEFAULT = {
    duration: 1.2,
    ease: 'power2.out',
    trigger: 'top 85%',
    toggleActions: 'play none none none',
  };

  /** バリエーション定義 */
  static VARIANTS = {
    'scroll-fade-up': {
      from: { y: 36, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    'scroll-fade-down': {
      from: { y: -36, opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    'scroll-fade-left': {
      from: { x: 36, opacity: 0 },
      to: { x: 0, opacity: 1 },
    },
    'scroll-fade-right': {
      from: { x: -36, opacity: 0 },
      to: { x: 0, opacity: 1 },
    },
    'scroll-scale': {
      from: { scale: 0.92, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    'scroll-scale-up': {
      from: { scale: 0.6, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    'scroll-scale-down': {
      from: { scale: 1.2, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    'scroll-blur': {
      from: { filter: 'blur(12px)', opacity: 0 },
      to: { filter: 'blur(0px)', opacity: 1 },
    },
    'scroll-rotate-y': {
      from: { rotationY: -18, opacity: 0 },
      to: { rotationY: 0, opacity: 1 },
    },
    'scroll-rotate-x': {
      from: { rotationX: 18, opacity: 0 },
      to: { rotationX: 0, opacity: 1 },
    },
    'scroll-slide-up': {
      from: { y: '1.2em', opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    'scroll-slide-down': {
      from: { y: '-1.2em', opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    'scroll-slide-left': {
      from: { x: '1.5em', opacity: 0 },
      to: { x: 0, opacity: 1 },
    },
    'scroll-slide-right': {
      from: { x: '-1.5em', opacity: 0 },
      to: { x: 0, opacity: 1 },
    },
    'scroll-reveal-up': {
      from: { y: '100%', opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    'scroll-reveal-down': {
      from: { y: '-100%', opacity: 0 },
      to: { y: 0, opacity: 1 },
    },
    'scroll-flip-x': {
      from: { rotationY: -75, opacity: 0 },
      to: { rotationY: 0, opacity: 1 },
    },
    'scroll-flip-y': {
      from: { rotationX: 55, opacity: 0 },
      to: { rotationX: 0, opacity: 1 },
    },
    'scroll-zoom-in': {
      from: { scale: 0.5, opacity: 0 },
      to: { scale: 1, opacity: 1 },
    },
    'scroll-opacity': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    'scroll-line': {
      from: { scaleX: 0, opacity: 0.8, transformOrigin: 'left center' },
      to: { scaleX: 1, opacity: 1, transformOrigin: 'left center' },
    },
  };

  /** 要素に付いているバリエーションクラスを1つ取得 */
  static getVariantClass(el) {
    for (const key of Object.keys(ScrollAnimations.VARIANTS)) {
      if (el.classList.contains(key)) return key;
    }
    return null;
  }

  static getOptions(el) {
    return {
      duration: parseFloat(el.dataset.scrollDuration) || ScrollAnimations.DEFAULT.duration,
      ease: el.dataset.scrollEase || ScrollAnimations.DEFAULT.ease,
      trigger: el.dataset.scrollTrigger || ScrollAnimations.DEFAULT.trigger,
      delay: parseFloat(el.dataset.scrollDelay) || 0,
    };
  }

  static animateElement(el, variantKey, options) {
    const def = ScrollAnimations.VARIANTS[variantKey];
    if (!def) return;
    gsap.fromTo(el, def.from, {
      ...def.to,
      duration: options.duration,
      delay: options.delay,
      ease: options.ease,
      scrollTrigger: {
        trigger: el,
        start: options.trigger,
        toggleActions: ScrollAnimations.DEFAULT.toggleActions,
      },
      overwrite: true,
    });
  }

  static init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // 単体要素
    document.querySelectorAll(ScrollAnimations.SELECTOR).forEach((el) => {
      if (el.closest(ScrollAnimations.STAGGER_SELECTOR)) return;
      const variant = ScrollAnimations.getVariantClass(el);
      const key = variant || 'scroll-fade-up';
      if (!ScrollAnimations.VARIANTS[key]) return;
      const opts = ScrollAnimations.getOptions(el);
      ScrollAnimations.animateElement(el, key, opts);
    });

    // 子要素のスタッガー
    document.querySelectorAll(ScrollAnimations.STAGGER_SELECTOR).forEach((container) => {
      const children = container.querySelectorAll(ScrollAnimations.SELECTOR);
      if (!children.length) return;
      const firstVariant = ScrollAnimations.getVariantClass(children[0]) || 'scroll-fade-up';
      const def = ScrollAnimations.VARIANTS[firstVariant];
      if (!def) return;
      const trigger = container.dataset.scrollTrigger || ScrollAnimations.DEFAULT.trigger;
      const duration = parseFloat(container.dataset.scrollDuration) || ScrollAnimations.DEFAULT.duration;
      const stagger = parseFloat(container.dataset.scrollStagger) || 0.12;
      gsap.fromTo(children, def.from, {
        ...def.to,
        duration,
        stagger,
        ease: ScrollAnimations.DEFAULT.ease,
        scrollTrigger: {
          trigger: container,
          start: trigger,
          toggleActions: ScrollAnimations.DEFAULT.toggleActions,
        },
        overwrite: true,
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  LoadingAnimation.init();
  ScrollAnimations.init();
});