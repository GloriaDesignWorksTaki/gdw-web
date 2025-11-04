/**
 * リッチアニメーション実装
 * three.jsとGSAPを使用したインタラクティブアニメーション
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // 1. Main Visual 3Dパーティクル背景
  // ============================================
  function initParticleBackground() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js is not loaded');
      return;
    }

    const mvSection = document.getElementById('mv');
    if (!mvSection) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    canvas.style.pointerEvents = 'none';
    mvSection.style.position = 'relative';
    mvSection.appendChild(canvas);

    const scene = new THREE.Scene();
    const width = mvSection.offsetWidth || window.innerWidth;
    const height = mvSection.offsetHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // パーティクルシステム
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
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

    // アニメーション
    function animate() {
      requestAnimationFrame(animate);

      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.001;

      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.5;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    // リサイズ処理
    window.addEventListener('resize', () => {
      const newWidth = mvSection.offsetWidth || window.innerWidth;
      const newHeight = mvSection.offsetHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    animate();
  }

  // ============================================
  // 2. Main Visual テキストアニメーション
  // ============================================
  function initMainVisualTextAnimation() {
    if (typeof gsap === 'undefined') {
      return;
    }

    const concept = document.querySelector('.concept h1');
    if (!concept) return;

    // 既にアニメーション済みの場合はスキップ
    if (concept.dataset.animated === 'true') return;
    concept.dataset.animated = 'true';

    // h1全体を一度にアニメーション（シンプルで速い）
    gsap.fromTo(concept,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay: 0,
        ease: 'power2.out'
      }
    );
  }

  // ============================================
  // 3. スクロールアニメーション（GSAP）
  // ============================================
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger is not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // セクションタイトルアニメーション
    // 既に表示されている要素（.is-show）はスキップ
    gsap.utils.toArray('.target').forEach((target, index) => {
      // 既に表示されている場合は初期状態を設定しない
      if (target.classList.contains('is-show')) {
        gsap.set(target, { opacity: 1, y: 0 });
        return;
      }

      // ビューポート内にある場合は即座に表示
      const rect = target.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (isInViewport) {
        // 既に表示エリアにある場合は即座に表示
        gsap.set(target, { opacity: 1, y: 0 });
        return;
      }
      // 初期状態を設定
      gsap.set(target, { opacity: 0, y: 50 });
      gsap.to(target, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: target,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
          // 一度実行されたら保持
          once: false
        }
      });
    });

    // ポートフォリオカードアニメーション
    // 高品質なアニメーションを実装
    const portfolioSelect = document.querySelector('.portfolio-select');
    const shadow = document.querySelector('#shadow');
    if (portfolioSelect && typeof gsap !== 'undefined') {
      const cards = gsap.utils.toArray('.portfolio-select li');
      const ul = portfolioSelect.querySelector('ul');
      const closeBtn = portfolioSelect.querySelector('.portfolio-close-btn');
      // 初期状態を設定（最適化）
      gsap.set(portfolioSelect, {
        opacity: 0,
        scale: 0.96,
        y: '-50%',
        visibility: 'hidden'
      });
      gsap.set(shadow, { opacity: 0 });
      if (closeBtn) {
        // 初期状態を設定（pointer-eventsはCSSでautoに設定済み）
        gsap.set(closeBtn, {
          opacity: 0,
          scale: 0,
          rotation: -180,
          transformOrigin: 'center center'
        });
        // 非表示時はクリックできないようにする
        closeBtn.style.pointerEvents = 'none';
      }
      cards.forEach((card) => {
        // 既存のスタイルをクリア
        gsap.set(card, { clearProps: 'all' });
        // 初期状態を設定
        gsap.set(card, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          transformOrigin: 'center center',
          force3D: true
        });
      });
      // 開くアニメーション（最適化版 - 超スムーズ）
      window.animatePortfolioOpen = function() {
        // 既存のアニメーションを完全にクリア
        gsap.killTweensOf([portfolioSelect, shadow]);
        cards.forEach(card => gsap.killTweensOf(card));
        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' }
        });
        // visibilityを表示
        gsap.set(portfolioSelect, { visibility: 'visible' });
        // シャドウを先に表示
        tl.to(shadow, {
          opacity: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        }, 0)
        // コンテナを滑らかに表示
        .to(portfolioSelect, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        }, 0.05)
        // カードを順番に滑らかに表示（最適化）
        .to(cards, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: {
            each: 0.08,
            from: 'start',
            ease: 'power1.out'
          },
          ease: 'power2.out',
          force3D: true,
          immediateRender: false
        }, 0.15)
        // 閉じるボタンを表示
        if (closeBtn) {
          // アニメーション開始時にpointer-eventsを有効化
          closeBtn.style.pointerEvents = 'auto';
          tl.to(closeBtn, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'back.out(1.4)'
          }, 0.3);
        }
      };
      // 閉じるアニメーション（最適化版 - 超スムーズ）
      window.animatePortfolioClose = function(callback) {
        // 既存のアニメーションを完全にクリア
        gsap.killTweensOf([portfolioSelect, shadow]);
        cards.forEach(card => gsap.killTweensOf(card));
        const tl = gsap.timeline({
          defaults: { ease: 'power2.in' },
          onComplete: () => {
            gsap.set(portfolioSelect, { visibility: 'hidden' });
            if (callback) callback();
          }
        });
        // 閉じるボタンを先に非表示
        if (closeBtn) {
          closeBtn.style.pointerEvents = 'none';
          tl.to(closeBtn, {
            opacity: 0,
            scale: 0,
            rotation: 180,
            duration: 0.2,
            ease: 'power2.in'
          }, 0);
        }
        // カードを滑らかに非表示（逆順）
        tl.to(cards, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          duration: 0.35,
          stagger: {
            each: 0.06,
            from: 'end',
            ease: 'power1.in'
          },
          ease: 'power2.in',
          force3D: true,
          immediateRender: false
        }, 0.05)
        // コンテナとシャドウを同時に非表示
        .to([portfolioSelect, shadow], {
          opacity: 0,
          scale: 0.96,
          duration: 0.25,
          ease: 'power2.in'
        }, 0.15);
      };
    }

    // ポートフォリオモックの3D効果
    const portfolioMock = document.querySelector('.portfolio-mock');
    if (portfolioMock && window.innerWidth >= 1024) {
      portfolioMock.addEventListener('mousemove', (e) => {
        const rect = portfolioMock.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        gsap.to(portfolioMock, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power2.out'
        });
      });

      portfolioMock.addEventListener('mouseleave', () => {
        gsap.to(portfolioMock, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    }

    // パララックス効果
    gsap.utils.toArray('section').forEach((section, index) => {
      if (index % 2 === 0) {
        gsap.to(section, {
          y: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });
  }

  // ============================================
  // 4. フォームインタラクティブアニメーション
  // ============================================
  function initFormAnimations() {
    if (typeof gsap === 'undefined') {
      return;
    }

    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    inputs.forEach(input => {
      // フォーカス時のアニメーション
      input.addEventListener('focus', () => {
        gsap.to(input, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      input.addEventListener('blur', () => {
        gsap.to(input, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      // 入力時の波紋効果
      input.addEventListener('input', () => {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(27, 134, 212, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'scale(0)';
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(ripple);

        gsap.to(ripple, {
          x: Math.random() * input.offsetWidth,
          y: Math.random() * input.offsetHeight,
          scale: 10,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        });
      });
    });

    // 送信ボタンアニメーション
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('mouseenter', () => {
        gsap.to(submitBtn, {
          scale: 1.05,
          boxShadow: '0 10px 30px rgba(27, 134, 212, 0.4)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      submitBtn.addEventListener('mouseleave', () => {
        gsap.to(submitBtn, {
          scale: 1,
          boxShadow: '0 0 0 rgba(27, 134, 212, 0)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  }

  // ============================================
  // 5. SVGアニメーション強化
  // ============================================
  function enhanceSVGAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    const svg = document.querySelector('#yuyaTaki');
    if (!svg) return;

    // 既にアニメーション済みの場合はスキップ
    if (svg.classList.contains('is-show')) {
      const paths = svg.querySelectorAll('path');
      paths.forEach(path => {
        gsap.set(path, { opacity: 1 });
      });
      return;
    }

    const paths = svg.querySelectorAll('path');
    paths.forEach((path, index) => {
      const pathLength = path.getTotalLength();
      // 初期状態を設定（既存のdrawアニメーションと競合しないように）
      if (!path.style.strokeDasharray) {
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
      }
      // 透明度は既存のアニメーションに任せる

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

  // ============================================
  // 6. ローディングアニメーション
  // ============================================
  function initLoadingAnimation() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">Gloria Design Works</div>
      </div>
    `;
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        onComplete: () => loader.remove()
      });
    });
  }

  // ============================================
  // 7. ヘッダーアニメーション
  // ============================================
  function initHeaderAnimation() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;

          if (currentScroll > lastScroll && currentScroll > 100) {
            gsap.to(header, {
              y: -100,
              duration: 0.3,
              ease: 'power2.in'
            });
          } else {
            gsap.to(header, {
              y: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ============================================
  // 8. フッターアイコンアニメーション
  // ============================================
  function initFooterAnimations() {
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach((link, index) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, {
          scale: 1.3,
          rotation: 360,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      });

      link.addEventListener('mouseleave', () => {
        gsap.to(link, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }

  // ============================================
  // 初期化
  // ============================================
  initParticleBackground();
  initMainVisualTextAnimation();
  initScrollAnimations();
  initFormAnimations();
  enhanceSVGAnimation();
  initLoadingAnimation();
  initHeaderAnimation();
  initFooterAnimations();
});

