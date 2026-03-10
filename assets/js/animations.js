/**
 * リッチアニメーション（Three.js / GSAP）
 * @file assets/js/animations.js
 */

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Main Visual の 3D パーティクル背景を初期化する
   * #mv 内に canvas を追加し、Three.js でパーティクルを描画する
   * @returns {void}
   */
  function initParticleBackground() {
    if (typeof THREE === 'undefined') return;

    const mvSection = document.getElementById('mv');
    if (!mvSection) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '1',
      opacity: '0.3',
      pointerEvents: 'none'
    });
    mvSection.style.position = 'relative';
    mvSection.appendChild(canvas);

    const scene = new THREE.Scene();
    const width = mvSection.offsetWidth || window.innerWidth;
    const height = mvSection.offsetHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000;
      positions[i + 1] = (Math.random() - 0.5) * 2000;
      positions[i + 2] = (Math.random() - 0.5) * 2000;
      const color = new THREE.Color();
      color.setHSL(0.6, 0.8, 0.5 + Math.random() * 0.3);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    const particles = new THREE.BufferGeometry();
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);
    camera.position.z = 1000;

    /**
     * パーティクルのループアニメーション（回転・波打ち）
     * @returns {void}
     */
    function animate() {
      requestAnimationFrame(animate);
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.001;
      const posAttr = particleSystem.geometry.attributes.position;
      const posArray = posAttr.array;
      for (let i = 1; i < posArray.length; i += 3) {
        posArray[i] += Math.sin(Date.now() * 0.001 + i) * 0.5;
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      const w = mvSection.offsetWidth || window.innerWidth;
      const h = mvSection.offsetHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    animate();
  }

  /**
   * Main Visual のコンセプト見出しを即時表示する
   * GSAP の opacity / y を設定し、フェードをスキップする
   * @returns {void}
   */
  function initMainVisualText() {
    if (typeof gsap === 'undefined') return;
    const concept = document.querySelector('.concept h1');
    if (!concept || concept.dataset.animated === 'true') return;
    concept.dataset.animated = 'true';
    gsap.set(concept, { opacity: 1, y: 0 });
  }

  /**
   * スクロール用のターゲット表示とポートフォリオモーダルの開閉アニメーションを初期化する
   * window.animatePortfolioOpen / animatePortfolioClose を定義する
   * @returns {void}
   */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.target').forEach((el) => {
      gsap.set(el, { opacity: 1, y: 0 });
    });

    const portfolioSelect = document.querySelector('.portfolio-select');
    const shadow = document.querySelector('#shadow');
    if (!portfolioSelect || !shadow) return;

    const cards = gsap.utils.toArray('.portfolio-select li');
    const closeBtn = portfolioSelect.querySelector('.portfolio-close-btn');

    gsap.set(portfolioSelect, { opacity: 0, scale: 0.96, y: '-50%', visibility: 'hidden' });
    gsap.set(shadow, { opacity: 0 });
    if (closeBtn) {
      gsap.set(closeBtn, { opacity: 0, scale: 0, rotation: -180, transformOrigin: 'center center' });
      closeBtn.style.pointerEvents = 'none';
    }
    cards.forEach((card) => {
      gsap.set(card, { clearProps: 'all' });
      gsap.set(card, { opacity: 0, scale: 0.9, y: 40, transformOrigin: 'center center', force3D: true });
    });

    /** ポートフォリオモーダルを開くアニメーション */
    window.animatePortfolioOpen = () => {
      gsap.killTweensOf([portfolioSelect, shadow]);
      cards.forEach((c) => gsap.killTweensOf(c));
      gsap.set(portfolioSelect, { visibility: 'visible' });
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to(shadow, { opacity: 0.5, duration: 0.3 }, 0)
        .to(portfolioSelect, { opacity: 1, scale: 1, duration: 0.4 }, 0.05)
        .to(cards, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: { each: 0.08, from: 'start', ease: 'power1.out' },
          ease: 'power2.out',
          force3D: true,
          immediateRender: false
        }, 0.15);
      if (closeBtn) {
        closeBtn.style.pointerEvents = 'auto';
        tl.to(closeBtn, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: 'back.out(1.4)' }, 0.3);
      }
    };

    /**
     * ポートフォリオモーダルを閉じるアニメーション完了後に callback を実行する
     * @param {function(): void} [callback] - 閉じた後に呼ぶ関数
     * @returns {void}
     */
    window.animatePortfolioClose = (callback) => {
      gsap.killTweensOf([portfolioSelect, shadow]);
      cards.forEach((c) => gsap.killTweensOf(c));
      const tl = gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete: () => {
          gsap.set(portfolioSelect, { visibility: 'hidden' });
          callback?.();
        }
      });
      if (closeBtn) {
        closeBtn.style.pointerEvents = 'none';
        tl.to(closeBtn, { opacity: 0, scale: 0, rotation: 180, duration: 0.2 }, 0);
      }
      tl.to(cards, {
        opacity: 0,
        scale: 0.9,
        y: 40,
        duration: 0.35,
        stagger: { each: 0.06, from: 'end', ease: 'power1.in' },
        ease: 'power2.in',
        force3D: true,
        immediateRender: false
      }, 0.05)
        .to([portfolioSelect, shadow], { opacity: 0, scale: 0.96, duration: 0.25, ease: 'power2.in' }, 0.15);
    };
  }

  /**
   * ABOUT セクションの #yuyaTaki SVG をスクロールで線描画する
   * path の strokeDashoffset を ScrollTrigger で 0 にする
   * @returns {void}
   */
  function initSVGAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const svg = document.querySelector('#yuyaTaki');
    if (!svg) return;

    if (svg.classList.contains('is-show')) {
      svg.querySelectorAll('path').forEach((path) => gsap.set(path, { opacity: 1 }));
      return;
    }

    const paths = svg.querySelectorAll('path');
    paths.forEach((path, index) => {
      const len = path.getTotalLength();
      if (!path.style.strokeDasharray) {
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      }
      ScrollTrigger.create({
        trigger: svg,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(path, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1,
            delay: index * 0.05,
            ease: 'power2.inOut'
          });
        }
      });
    });
  }

  /**
   * ローディング画面を初期化する
   * ロゴ SVG の線描画を行い、load 完了と最低表示時間（3秒）後にフェードアウトする
   * @returns {void}
   */
  function initLoadingAnimation() {
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

    const logoContainer = loader.querySelector('#loaderLogo') ?? (() => {
      const wrap = document.createElement('div');
      wrap.className = 'loader-content';
      const logo = document.createElement('div');
      logo.className = 'loader-logo';
      logo.id = 'loaderLogo';
      logo.setAttribute('aria-label', 'Gloria Design Works logo');
      wrap.appendChild(logo);
      loader.appendChild(wrap);
      return logo;
    })();

    const logoSrc = document.querySelector('header .logo img')?.src ?? './assets/images/logo.svg';

    /**
     * ロゴ SVG を fetch して線描画アニメーションを実行する
     * @returns {Promise<void>}
     */
    const drawLogo = () => {
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
    };

    /** ローダーをフェードアウトして DOM から削除する */
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

    const MIN_LOADER_MS = 3000;
    const start = Date.now();

    Promise.all([
      drawLogo(),
      document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }))
    ]).then(() => {
      const wait = Math.max(0, MIN_LOADER_MS - (Date.now() - start));
      wait > 0 ? setTimeout(hideLoader, wait) : hideLoader();
    });
  }

  /** 初期化: パーティクル / MV テキスト / スクロール・モーダル / SVG / ローディング */
  initParticleBackground();
  initMainVisualText();
  initScrollAnimations();
  initSVGAnimation();
  initLoadingAnimation();
});
