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
      if (el.classList.contains('wf-modal-url')) {
        return 'OPEN LINK';
      }
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
      borderRadius: '',
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

  hitTargetExcludingStalker() {
    const stack = document.elementsFromPoint(this.mouseX, this.mouseY);
    for (const n of stack) {
      if (!(n instanceof Element)) continue;
      if (n.classList.contains('mouse-stalker')) continue;
      return n;
    }
    return null;
  }

  syncWorksModalStalkerVisual() {
    if (!this.stalker || !document.body.classList.contains('works-modal-open')) return;
    const modal = document.querySelector('.wf-modal');
    const overlay = modal?.querySelector('.wf-modal-ov');
    if (!modal || !overlay) return;

    const stack = document.elementsFromPoint(this.mouseX, this.mouseY);
    let onOverlay = false;
    let onContent = false;
    for (const n of stack) {
      if (!(n instanceof Element)) continue;
      if (n.classList.contains('mouse-stalker')) continue;
      if (!modal.contains(n)) continue;
      if (n.closest('.wf-modal-content')) {
        onContent = true;
        break;
      }
      if (n === overlay || n.closest('.wf-modal-ov')) {
        onOverlay = true;
        break;
      }
    }

    if (onOverlay && !onContent) {
      if (!this.stalker.classList.contains('is-works-modal-close')) {
        this.applyWorksModalCloseCursor();
      }
      return;
    }
    if (this.stalker.classList.contains('is-works-modal-close')) {
      this.clearWorksModalCursor();
    }
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
      transition:
        'transform 0.1s, width 0.28s, height 0.28s, top 0.28s, left 0.28s, background 0.28s, border 0.28s, mix-blend-mode 0.2s',
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
          if (this.stalker.classList.contains('is_active')) {
            const top = this.hitTargetExcludingStalker();
            const stillValid =
              top && top.closest('.wf-modal') && top.closest(MouseStalker.SELECTOR);
            if (!stillValid) {
              this.stalker.classList.remove('is_active');
              this.resetStyle();
            }
          }
          if (!this.stalker.classList.contains('is_active')) {
            this.syncWorksModalStalkerVisual();
          }
        } else if (this.stalker.classList.contains('is-works-modal-close')) {
          this.clearWorksModalCursor();
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
        if (
          document.body.classList.contains('works-modal-open') &&
          !elem.closest('.wf-modal')
        ) {
          return;
        }
        const inModal =
          document.body.classList.contains('works-modal-open') &&
          elem.closest('.wf-modal');
        const isModalUrl =
          inModal &&
          elem.matches('a.wf-modal-url') &&
          (() => {
            const h = elem.getAttribute('href');
            return Boolean(h && h.trim() !== '' && h !== '#');
          })();
        if (isModalUrl) {
          this.stalker.classList.remove('is-works-modal-close');
        }

        this.stalker.classList.add('is_active');
        const txt = this.getActionText(elem);
        this.updateSize(txt);
        Object.assign(this.stalker.style, {
          background: 'transparent',
          border: `2px solid ${this._idleFill}`,
          borderRadius: '50%',
          mixBlendMode: 'difference',
          boxSizing: 'border-box'
        });
      });

      elem.addEventListener('mouseout', () => {
        this.stalker.classList.remove('is_active');
        this.resetStyle();
        if (document.body.classList.contains('works-modal-open')) {
          this.syncWorksModalStalkerVisual();
        } else {
          this.applyIdleVisual();
        }
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
  // decode base64
  static decodeConceptBase64(b64) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  }

  init() {
    if (typeof gsap === 'undefined' || typeof Flip === 'undefined') return;

    gsap.registerPlugin(Flip);

    const modal = document.querySelector('.wf-modal');
    if (!modal) return;

    const modalOverlay = modal.querySelector('.wf-modal-ov');
    const mount = modal.querySelector('.wf-modal-mount');
    const meta = modal.querySelector('.wf-modal-meta');
    const metaShade = modal.querySelector('.wf-modal-shade');
    const metaInner = modal.querySelector('.wf-modal-inner');
    const metaTitle = modal.querySelector('.wf-modal-title');
    const metaYear = modal.querySelector('.wf-modal-year');
    const metaCharge = modal.querySelector('.wf-modal-charge');
    const metaConcept = modal.querySelector('.wf-modal-concept');
    const metaTech = modal.querySelector('.wf-modal-tech');
    const metaTarget = modal.querySelector('.wf-modal-target');
    const metaPeriod = modal.querySelector('.wf-modal-period');
    const metaUrl = modal.querySelector('.wf-modal-url');

    if (!modalOverlay || !mount || !meta || !metaShade || !metaInner || !metaTitle || !metaYear || !metaCharge || !metaTech) {
      return;
    }

    const slots = gsap.utils.toArray('#works .works-lists .works-slot');
    const images = gsap.utils.toArray('#works .works-lists .works-image');
    let boxIndex = undefined;
    let isClosing = false;

    const resetMetaDom = () => {
      metaTitle.textContent = '';
      metaYear.textContent = '';
      metaCharge.textContent = '';
      if (metaConcept) metaConcept.innerHTML = '';
      metaTech.innerHTML = '';
      if (metaTarget) metaTarget.textContent = '';
      if (metaPeriod) {
        metaPeriod.innerHTML = '';
        const periodBox = metaPeriod.closest('.wf-modal-box');
        if (periodBox) periodBox.hidden = false;
      }
      if (metaUrl) {
        metaUrl.removeAttribute('href');
        metaUrl.textContent = '';
        metaUrl.hidden = false;
        const urlBox = metaUrl.closest('.wf-modal-box');
        if (urlBox) urlBox.hidden = false;
      }
    };

    const fillMetaFromSlot = (slot) => {
      if (!slot) return;
      metaTitle.textContent = slot.dataset.workTitle?.trim() || '';
      metaYear.textContent = slot.dataset.workYear?.trim() || '';
      metaCharge.textContent = slot.dataset.workCharge?.trim() || '';
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
      if (metaConcept) {
        const conceptB64 = slot.dataset.workConcept?.trim() || '';
        if (conceptB64) {
          try {
            metaConcept.innerHTML = WorksFlipModal.decodeConceptBase64(conceptB64);
          } catch {
            metaConcept.innerHTML = '';
          }
        } else {
          metaConcept.innerHTML = '';
        }
      }
      if (metaTarget) {
        metaTarget.textContent = slot.dataset.workTarget?.trim() || '';
      }
      if (metaPeriod) {
        const periodB64 = slot.dataset.workPeriod?.trim() || '';
        const periodBox = metaPeriod.closest('.wf-modal-box');
        if (periodB64) {
          try {
            metaPeriod.innerHTML = WorksFlipModal.decodeConceptBase64(periodB64);
          } catch {
            metaPeriod.innerHTML = '';
          }
          if (periodBox) periodBox.hidden = false;
        } else {
          metaPeriod.innerHTML = '';
          if (periodBox) periodBox.hidden = true;
        }
      }
      if (metaUrl) {
        const urlStr = slot.dataset.workUrl?.trim() || '';
        const urlBox = metaUrl.closest('.wf-modal-box');
        if (urlStr) {
          metaUrl.href = urlStr;
          metaUrl.textContent = urlStr;
          metaUrl.hidden = false;
          if (urlBox) urlBox.hidden = false;
        } else {
          metaUrl.removeAttribute('href');
          metaUrl.textContent = '';
          metaUrl.hidden = true;
          if (urlBox) urlBox.hidden = true;
        }
      }
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

    // オーバーレイ
    modalOverlay.addEventListener('click', (e) => {
      if (boxIndex === undefined) return;
      if (e.target !== modalOverlay) return;
      e.preventDefault();
      e.stopPropagation();
      runClose();
    });

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