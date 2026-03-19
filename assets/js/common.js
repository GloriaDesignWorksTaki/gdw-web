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
      'fa-github': 'Open Github',
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

  /** 非ホバー時：小さな追従ドット */
  applyIdleVisual() {
    if (!this.stalker) return;
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
      zIndex: '99999',
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

/** TODO:消す
 * ポートフォリオのモーダル表示・切り替えを制御するクラス
 *
 * `.portfolio-mock` のクリックでモーダルを開閉し、
 * リスト内のリンククリックで対象作品と説明を切り替える。
 *
 * @example
 * new PortfolioModal().init();
 */
class PortfolioModal {
  /**
   * PortfolioModal インスタンスを生成する
   */
  constructor() {
    /**
     * モーダル開閉トリガー要素
     * @type {HTMLElement | null}
     */
    this.mock = document.querySelector('.portfolio-mock');

    /**
     * ポートフォリオ選択リスト要素
     * @type {HTMLElement | null}
     */
    this.list = document.querySelector('.portfolio-select');

    /**
     * オーバーレイ要素
     * @type {HTMLElement | null}
     */
    this.shadow = document.querySelector('#shadow');

    /**
     * 作品切り替えリンク一覧
     * @type {NodeListOf<HTMLAnchorElement>}
     */
    this.links = document.querySelectorAll('.portfolio-select a');

    /**
     * 作品要素一覧
     * @type {NodeListOf<HTMLElement>}
     */
    this.works = document.querySelectorAll('.portfolio-works');

    /**
     * 説明要素一覧
     * @type {NodeListOf<HTMLElement>}
     */
    this.descriptions = document.querySelectorAll('.portfolio-desc');
  }

  /**
   * モーダルを閉じる
   *
   * `window.animatePortfolioClose` が定義されている場合は
   * その完了後にクローズ処理を実行する。
   *
   * @param {() => void} [callback] クローズ完了後に実行するコールバック
   * @returns {void}
   */
  close(callback) {
    const done = () => {
      if (!this.list || !this.shadow) return;

      this.list.classList.remove('active');
      this.shadow.classList.remove('active');
      document.body.classList.remove('fixed');
      callback?.();
    };

    if (typeof window.animatePortfolioClose === 'function') {
      window.animatePortfolioClose(done);
    } else {
      done();
    }
  }

  /**
   * PortfolioModal を初期化する
   *
   * @returns {void}
   */
  init() {
    if (!this.mock || !this.list || !this.shadow) return;

    this.mock.addEventListener('click', () => {
      const isOpening = !this.list.classList.contains('active');

      if (isOpening) {
        this.list.classList.add('active');
        this.shadow.classList.add('active');
        document.body.classList.add('fixed');

        if (typeof window.animatePortfolioOpen === 'function') {
          window.animatePortfolioOpen();
        }
      } else {
        this.close();
      }
    });

    this.works.forEach((w) => {
      w.style.display = 'none';
    });

    this.descriptions.forEach((d) => {
      d.style.display = 'none';
    });

    if (this.works.length > 0 && this.descriptions.length > 0) {
      const firstId = this.works[0].id;
      this.works[0].style.display = 'block';

      const firstDesc = document.querySelector(`.portfolio-desc#${firstId}`);
      if (firstDesc) firstDesc.style.display = 'block';
    }

    this.links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        const targetId = link.getAttribute('href')?.replace('#', '') ?? '';
        const targetWork = document.querySelector(`#${targetId}`);
        const targetDesc = document.querySelector(`.portfolio-desc#${targetId}`);

        if (targetWork && targetDesc) {
          this.works.forEach((w) => {
            w.style.display = 'none';
          });

          this.descriptions.forEach((d) => {
            d.style.display = 'none';
          });

          targetWork.style.display = 'block';
          targetDesc.style.display = 'block';
        }

        this.links.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        this.close();
      });
    });

    this.shadow.addEventListener('click', () => this.close());

    document.querySelector('.portfolio-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
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

    const modal        = document.querySelector('.works-flip-modal');
    const modalContent = modal.querySelector('.works-flip-modal-content');
    const modalOverlay = modal.querySelector('.works-flip-modal-overlay');
    const slots        = gsap.utils.toArray('#works .works-lists .works-slot');
    const images       = gsap.utils.toArray('#works .works-lists .works-image');
    let boxIndex = undefined;

    images.forEach((image, i) => {
      image.addEventListener('click', () => {
        if (boxIndex !== undefined) {

          // 閉じる
          const state = Flip.getState(image);
          slots[boxIndex].appendChild(image);
          boxIndex = undefined;

          // slot ごと前面に出す
          gsap.set(slots[i], { zIndex: 1002, position: 'relative' });

          gsap.to([modal, modalOverlay], {
            autoAlpha: 0,
            ease: 'power1.inOut',
            duration: 0.35,
          });
          Flip.from(state, {
            duration: 0.7,
            ease: 'power1.inOut',
            absolute: true,
            onComplete: () => {
              gsap.set(slots[i], { zIndex: 'auto' });
              gsap.set(image, { zIndex: 'auto' });
            },
          });
        } else {
          // --- 開く ---
          const state = Flip.getState(image);
          modalContent.appendChild(image);
          boxIndex = i;
          gsap.set(modal, { autoAlpha: 1 });
          Flip.from(state, {
            duration: 0.7,
            ease: 'power1.inOut',
          });
          gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35 });
        }
      });
    });
  }
}

// 共通JSを初期化
const init = () => {
  new MouseStalker().init();
  ExpandingBoxScroll.init();
  new PortfolioModal().init();
  new WorksFlipModal().init();
};

// ドキュメントが読み込まれたら共通JSを初期化
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();