/**
 * Common JS
 * @file assets/js/common.js
 * @version 1.00.000
 * @author Gloria Design Works
 * @see https://gloria-design-works.com/
 */

/**
 * モーション有効/無効フラグ
 * @type {boolean}
 */
const ENABLE_MOTION =
  typeof window.ENABLE_MOTION === 'boolean' ? window.ENABLE_MOTION : true;

/**
 * マウスストーカー用クラス
 * @type {class}
 */
class MouseStalker {
  // マウスストーカーを表示させるブレークポイント
  static MIN_WIDTH = 1024;

  // ホバー対象のセレクタ
  static SELECTOR = 'a, input, label, button, .portfolio-mock, textarea, .works-slot';

  // マウスオーバー時の表示テキスト
  static TEXT_MAP = {
    iconText: {
      'fa-github': 'Open GitHub',
      'fa-x-twitter': 'Open X',
      'fa-instagram': 'Open Instagram'
    },
    inputText: {
      name: 'Enter Your Name',
      email: 'Enter Your Email',
      message: 'Enter Your Message'
    }
  };

  // マウスストーカーのコンストラクタ
  constructor() {
    this.stalker = document.querySelector('.mouse-stalker'); // ストーカー要素
    this.stalkerText = document.querySelector('.mouse-stalker-text'); // ストーカー内テキスト要素
    this.mouseX = 0; // マウスX座標
    this.mouseY = 0; // マウスY座標
    this.stalkerX = 0; // 補間済みX座標
    this.stalkerY = 0; // 補間済みY座標
    /** @type {string} 非ホバー時のドット塗り（mix-blend 用） */
    this._idleFill = '#ffffff';
    /** works モーダル表示中はバツカーソル */
    this._worksModalCursor = false;
  }

  // 対象要素に応じたアクション文言を返す
  getActionText(el) {
    const stalkerTitle = el.dataset?.stalkerTitle?.trim();
    if (stalkerTitle) return stalkerTitle;
    // ポートフォリオモックの場合はポートフォリオを表示
    if (el.classList.contains('portfolio-mock')) return 'VIEW PORTFOLIO';
    // ボタンの場合はクリック
    const tag = el.tagName;
    if (tag === 'BUTTON') {
      return /SEND|送信/.test(el.textContent.trim()) ? 'SEND' : 'CLICK';
    }
    // リンクの場合はクリック
    if (tag === 'A') {
      const href = el.getAttribute('href') ?? '';
      const icon = el.querySelector('i');
      for (const [cls, text] of Object.entries(MouseStalker.TEXT_MAP.iconText)) {
        if (icon?.classList.contains(cls)) return text;
      }
      if (href.startsWith('#')) return el.querySelector('.site-title')?.textContent.trim() || 'VIEW';
      if (/^(https?:|mailto:)/.test(href)) return 'OPEN';
      return 'CLICK';
    }
    // 入力フォームの場合は送信
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      if (el.type === 'submit') return 'SEND';
      const key = el.getAttribute('id') || el.getAttribute('name') || '';
      return MouseStalker.TEXT_MAP.inputText[key] || 'INPUT';
    }
    // ラベルの場合は選択
    return tag === 'LABEL' ? 'SELECT' : 'CLICK';
  }

  // 正円の最小直径
  static MIN_DIAM = 152;
  static TEXT_MAX_W = 240;

  // 表示テキストに応じてストーカー正円の直径を更新する
  updateSize(text) {
    if (!this.stalker || !this.stalkerText || !text) return;

    this.stalkerText.textContent = text;

    const measure = document.createElement('div');
    Object.assign(measure.style, {
      position: 'absolute',
      left: '-9999px',
      top: '0',
      visibility: 'hidden',
      pointerEvents: 'none',
      maxWidth: `${MouseStalker.TEXT_MAX_W}px`,
      whiteSpace: 'normal',
      textAlign: 'center',
      lineHeight: '1.35',
      fontSize: '0.8125rem',
      fontFamily: '"Noto Serif JP", "Noto Serif", serif',
      fontWeight: '700',
      letterSpacing: '0.06em',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box'
    });

    measure.textContent = text;
    document.body.appendChild(measure);

    const pad = 44;
    const innerW = measure.offsetWidth;
    const innerH = measure.offsetHeight;
    document.body.removeChild(measure);

    const d = Math.max(
      MouseStalker.MIN_DIAM,
      Math.ceil(Math.max(innerW, innerH) + pad)
    );

    this.stalker.style.width = `${d}px`;
    this.stalker.style.height = `${d}px`;
    this.stalker.style.top = `-${d / 2}px`;
    this.stalker.style.left = `-${d / 2}px`;
  }

  // ストーカーの表示スタイルを初期状態に戻す
  resetStyle() {
    if (!this.stalker || !this.stalkerText) return;

    this.stalkerText.textContent = '';
    Object.assign(this.stalker.style, {
      width: '',
      height: '',
      top: '',
      left: '',
      background: '',
      border: '',
      mixBlendMode: ''
    });
  }

  applyIdleVisual() {
    if (!this.stalker) return;
    this.stalker.classList.remove('is-works-modal-close');
    const s = 12;
    Object.assign(this.stalker.style, {
      width: `${s}px`,
      height: `${s}px`,
      top: `-${s / 2}px`,
      left: `-${s / 2}px`,
      background: this._idleFill,
      border: 'none',
      borderRadius: '50%',
      mixBlendMode: 'difference'
    });
  }

  /** Modal Colse Mouse Stalker */
  applyWorksModalCloseCursor() {
    if (!this.stalker) return;
    this.stalker.classList.remove('is_active');
    this.resetStyle();
    this.stalker.classList.add('is-works-modal-close');
    if (this.stalkerText) this.stalkerText.textContent = '';
    Object.assign(this.stalker.style, {
      background: 'transparent',
      border: 'none',
      borderRadius: '0',
      mixBlendMode: 'difference',
      boxSizing: 'border-box'
    });
  }

  clearWorksModalCursor() {
    if (!this.stalker) return;
    this.stalker.classList.remove('is-works-modal-close');
    this.resetStyle();
    this.applyIdleVisual();
  }

  // MouseStalkerを初期化
  init() {
    if (!this.stalker || !this.stalkerText) return;
    if (!window.matchMedia(`(min-width: ${MouseStalker.MIN_WIDTH}px)`).matches) return;
    if (this.stalker.dataset.initialized === 'true') return;

    this.stalker.dataset.initialized = 'true';

    this._idleFill =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-secondary')
        .trim() || '#ffffff';

    Object.assign(this.stalker.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      position: 'fixed',
      top: '-6px',
      left: '-6px',
      /* z-index は CSS 側（通常 99999 / works モーダル時はモーダルより上） */
      transition: 'transform 0.1s, width 0.22s, height 0.22s, top 0.22s, left 0.22s, background 0.2s, border 0.2s, mix-blend-mode 0.2s',
      transitionTimingFunction: 'ease-out'
    });
    this.applyIdleVisual();

    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    const tick = () => {
      if (this.stalker?.dataset.initialized === 'true') {
        this.stalkerX += (this.mouseX - this.stalkerX) * 0.2;
        this.stalkerY += (this.mouseY - this.stalkerY) * 0.2;
        this.stalker.style.transform = `translate(${this.stalkerX}px, ${this.stalkerY}px)`;

        if (document.body.classList.contains('works-modal-open')) {
          if (!this._worksModalCursor) {
            this.applyWorksModalCloseCursor();
            this._worksModalCursor = true;
          }
        } else if (this._worksModalCursor) {
          this.clearWorksModalCursor();
          this._worksModalCursor = false;
        }

        requestAnimationFrame(tick);
      }
    };

    tick();

    const mql = window.matchMedia(`(min-width: ${MouseStalker.MIN_WIDTH}px)`);

    mql.addEventListener('change', () => {
      if (mql.matches) {
        this.stalker.style.display = 'flex';
      } else {
        this.stalker.style.display = 'none';
        this.stalker.classList.remove('is_active');
        this.resetStyle();
        this.applyIdleVisual();
      }
    });

    document.querySelectorAll(MouseStalker.SELECTOR).forEach((elem) => {
      elem.addEventListener('mouseover', () => {
        this.stalker.classList.add('is_active');
        const txt = this.getActionText(elem);
        this.updateSize(txt);
        // 非ホバー時と同様 mix-blend-mode: difference（背景と似た色でも反転して見える）
        Object.assign(this.stalker.style, {
          background: 'transparent',
          border: `2px solid ${this._idleFill}`,
          mixBlendMode: 'difference',
          boxSizing: 'border-box'
        });
      });

      elem.addEventListener('mouseout', () => {
        this.stalker.classList.remove('is_active');
        this.resetStyle();
        this.applyIdleVisual();
      });
    });
  }
}

/**
 * スクロールに応じてボックスを拡大・背景色を変化させるクラス（GSAP使用）
 * @type {class}
 */
class ExpandingBoxScroll {
  // 背景色補間用の開始色・終了色
  static COLOR = {
    start: { r: 255, g: 255, b: 255 },
    end: { r: 47, g: 44, b: 42 }
  };

  // スクロールアニメーションを初期化
  static init() {
    if (!ENABLE_MOTION || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

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
          const s = ExpandingBoxScroll.COLOR.start;
          const e = ExpandingBoxScroll.COLOR.end;
          const r = Math.round(s.r + (e.r - s.r) * p);
          const g = Math.round(s.g + (e.g - s.g) * p);
          const b = Math.round(s.b + (e.b - s.b) * p);

          gsap.set('.expanding-box', {
            backgroundColor: `rgb(${r}, ${g}, ${b})`
          });
        }
      }
    });
  }
}

/**
 * FLIP gallery modal
 * @type {class}
 */
class WorksFlipModal {
  init() {
    if (typeof gsap === 'undefined' || typeof Flip === 'undefined') return;

    gsap.registerPlugin(Flip);

    const modal = document.querySelector('.works-flip-modal');
    if (!modal) return;

    const modalOverlay = modal.querySelector('.works-flip-modal-overlay');
    const mount = modal.querySelector('.works-flip-modal-image-mount');
    const meta = modal.querySelector('.works-flip-modal-meta');
    const metaShade = modal.querySelector('.works-flip-modal-meta-shade');
    const metaInner = modal.querySelector('.works-flip-modal-meta-inner');
    const metaTitle = modal.querySelector('.works-flip-modal-meta-title');
    const metaYear = modal.querySelector('.works-flip-modal-meta-year');
    const metaTech = modal.querySelector('.works-flip-modal-meta-tech');

    if (!modalOverlay || !mount || !meta || !metaShade || !metaInner || !metaTitle || !metaYear || !metaTech) {
      return;
    }

    const slots = gsap.utils.toArray('#works .works-lists .works-slot');
    const images = gsap.utils.toArray('#works .works-lists .works-image');
    let boxIndex = undefined;
    let isClosing = false;

    const resetMetaDom = () => {
      metaTitle.textContent = '';
      metaYear.textContent = '';
      metaTech.innerHTML = '';
    };

    const fillMetaFromSlot = (slot) => {
      if (!slot) return;
      metaTitle.textContent = slot.dataset.workTitle?.trim() || '';
      metaYear.textContent = slot.dataset.workYear?.trim() || '';
      metaTech.innerHTML = '';
      const raw = slot.dataset.workTech?.trim() || '';
      raw.split(',').forEach((name) => {
        const icon = name.trim();
        if (!icon) return;
        const li = document.createElement('li');
        const ic = document.createElement('i');
        ic.className = `fa-brands fa-${icon}`;
        ic.setAttribute('aria-hidden', 'true');
        li.appendChild(ic);
        metaTech.appendChild(li);
      });
    };

    const showMetaAfterFlip = () => {
      gsap.killTweensOf([meta, metaShade, metaInner]);
      gsap.set(meta, { visibility: 'visible', autoAlpha: 1 });
      gsap.set(metaShade, { opacity: 0, filter: 'blur(0px)' });
      gsap.set(metaInner, { opacity: 0, filter: 'blur(14px)' });
      meta.setAttribute('aria-hidden', 'false');

      gsap
        .timeline()
        .to(metaShade, { opacity: 1, duration: 0.5, ease: 'power2.out' })
        .to(
          metaInner,
          { opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
          '-=0.35'
        );
    };

    const hideMetaThen = (onDone) => {
      gsap.killTweensOf([meta, metaShade, metaInner]);
      gsap.set(metaShade, { filter: 'blur(0px)' });
      gsap
        .timeline()
        .to(metaInner, {
          opacity: 0,
          filter: 'blur(14px)',
          duration: 0.35,
          ease: 'power2.in',
        })
        .to(
          metaShade,
          {
            opacity: 0,
            filter: 'blur(22px)',
            duration: 0.55,
            ease: 'power2.inOut',
          },
          '-=0.2'
        )
        .set(meta, { autoAlpha: 0, visibility: 'hidden' })
        .set(metaShade, { clearProps: 'filter' })
        .add(() => {
          meta.setAttribute('aria-hidden', 'true');
          onDone();
        });
    };

    gsap.set(meta, { autoAlpha: 0, visibility: 'hidden' });
    gsap.set(metaShade, { opacity: 0, filter: 'blur(0px)' });
    gsap.set(metaInner, { opacity: 0, filter: 'blur(14px)' });
    gsap.set(modalOverlay, { opacity: 0, filter: 'blur(0px)' });

    const unlockScrollAndStalker = () => {
      document.body.classList.remove('fixed', 'works-modal-open');
    };

    const runClose = () => {
      if (boxIndex === undefined || isClosing) return;
      isClosing = true;
      const closedIndex = boxIndex;
      const image = images[closedIndex];
      const slot = slots[closedIndex];

      hideMetaThen(() => {
        const state = Flip.getState(image);
        slot.appendChild(image);
        boxIndex = undefined;

        gsap.set(slot, { zIndex: 1002, position: 'relative' });

        gsap.killTweensOf([modal, modalOverlay]);
        gsap.set(modalOverlay, { filter: 'blur(0px)' });
        gsap
          .timeline()
          .to(modalOverlay, {
            opacity: 0,
            filter: 'blur(22px)',
            duration: 0.55,
            ease: 'power2.inOut',
          })
          .to(
            modal,
            {
              autoAlpha: 0,
              duration: 0.45,
              ease: 'power2.inOut',
            },
            0.08
          );
        Flip.from(state, {
          duration: 0.7,
          ease: 'power1.inOut',
          absolute: true,
          onComplete: () => {
            gsap.set(slot, { zIndex: 'auto' });
            gsap.set(image, { zIndex: 'auto' });
            gsap.set(modalOverlay, { clearProps: 'filter', opacity: 0 });
            slot.style.minHeight = '';
            modal.setAttribute('aria-hidden', 'true');
            resetMetaDom();
            unlockScrollAndStalker();
            isClosing = false;
          },
        });
      });
    };

    modal.addEventListener(
      'click',
      (e) => {
        if (boxIndex === undefined) return;
        e.preventDefault();
        e.stopPropagation();
        runClose();
      },
      true
    );

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (boxIndex === undefined) return;
      e.preventDefault();
      runClose();
    });

    images.forEach((image, i) => {
      image.addEventListener('click', (e) => {
        if (boxIndex !== undefined) return;
        e.stopPropagation();

        fillMetaFromSlot(slots[i]);
        gsap.killTweensOf([modal, modalOverlay, meta, metaShade, metaInner]);
        gsap.set(meta, { autoAlpha: 0, visibility: 'hidden' });
        gsap.set(metaShade, { opacity: 0, filter: 'blur(0px)' });
        gsap.set(metaInner, { opacity: 0, filter: 'blur(14px)' });
        gsap.set(modalOverlay, { opacity: 0, filter: 'blur(0px)' });
        meta.setAttribute('aria-hidden', 'true');

        document.body.classList.add('fixed', 'works-modal-open');

        // スロットの高さを保つ
        const slot = slots[i];
        const reserveH = Math.round(slot.getBoundingClientRect().height);
        if (reserveH > 0) {
          slot.style.minHeight = `${reserveH}px`;
        }

        const state = Flip.getState(image);
        mount.appendChild(image);
        boxIndex = i;
        gsap.set(modal, { autoAlpha: 1 });
        modal.setAttribute('aria-hidden', 'false');

        Flip.from(state, {
          duration: 0.7,
          ease: 'power1.inOut',
          onComplete: showMetaAfterFlip,
        });
        gsap.to(modalOverlay, { opacity: 0.65, duration: 0.35, ease: 'power2.out' });
      });
    });
  }
}

// 共通JSを初期化
const init = () => {
  new MouseStalker().init();
  ExpandingBoxScroll.init();
  new WorksFlipModal().init();
};

// ドキュメントが読み込まれたら共通JSを初期化
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();