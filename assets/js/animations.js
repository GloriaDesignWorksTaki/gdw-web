/**
 * Animations JS
 * @version 1.00.000
 * @author Gloria Design Works
 * @website https://gloria-design-works.com/
 * @file assets/js/animations.js
 */



/**
 * MVのテキストアニメーション
 */
class MainVisualText {
  static init() {
    if (typeof gsap === 'undefined') return;
    const concept = document.querySelector('.concept h1');
    if (!concept || concept.dataset.animated === 'true') return;
    concept.dataset.animated = 'true';
    gsap.set(concept, { opacity: 1, y: 0 });
  }
}

/**
 * ローディングアニメーション用クラス
 * @type {class}
 */
class LoadingAnimation {
  // ローディングアニメーションの最小時間
  static MIN_MS = 3000;

  // ロゴの描写
  static drawLogo(logoContainer, logoSrc) {
    if (!logoContainer) return Promise.resolve();
    return fetch(logoSrc)
      .then((res) => res.text())
      .then((svgText) => {
        const svg = new DOMParser().parseFromString(svgText, 'image/svg+xml').querySelector('svg');
        if (!svg) throw new Error('SVG not found');
        svg.classList.add('loader-logo-svg');
        logoContainer.innerHTML = '';
        logoContainer.appendChild(svg);

        const elements = svg.querySelectorAll('path, line, polyline, polygon, rect, circle, ellipse');
        if (elements.length === 0) {
          return new Promise((resolve) => {
            gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.5, onComplete: resolve });
          });
        }
        elements.forEach((el) => {
          if (typeof el.getTotalLength !== 'function') return;
          const len = el.getTotalLength();
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
          el.style.stroke = 'var(--color-secondary)';
          el.style.strokeWidth = '1.5';
          el.style.fill = 'transparent';
        });
        return new Promise((resolve) => {
          const tl = gsap.timeline({ onComplete: resolve });
          elements.forEach((el, i) => {
            tl.to(el, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out' }, i * 0.04);
          });
          tl.to(elements, { fill: 'var(--color-secondary)', duration: 0.25, stagger: 0.01 }, '-=0.15');
        });
      })
      .catch(() => {
        logoContainer.innerHTML = `<img src="${logoSrc}" alt="Gloria Design Works logo">`;
      });
  }

  static init() {
    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.innerHTML = `
        <div class="loader-content">
          <div class="loader-logo" id="loaderLogo" aria-label="Gloria Design Works logo"></div>
        </div>`;
      document.body.appendChild(loader);
      document.body.classList.add('is-loading');
    }

    const logoContainer = loader.querySelector('#loaderLogo');
    const logoSrc = document.querySelector('header .logo img')?.src ?? './assets/images/logo.svg';

    const hideLoader = () => {
      const cleanup = () => {
        document.body.classList.remove('is-loading');
        loader.remove();
      };
      if (typeof gsap === 'undefined') {
        cleanup();
        return;
      }
      gsap.to(loader, { opacity: 0, duration: 0.45, delay: 0.15, onComplete: cleanup });
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

// アニメーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  MainVisualText.init();
  LoadingAnimation.init();
});
