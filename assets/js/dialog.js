/**
 * Dialog JS
 * @file assets/js/dialog.js
 * @version 1.00.000
 * @author Gloria Design Works
 * @see https://gloria-design-works.com/
 * @package App\Dialog
 */

class DialogOverlay {
  constructor() {
    this.overlay = document.getElementById('dialogOverlay');
    this.closeBtn = document.getElementById('dialogClose');
    this.okBtn = document.getElementById('dialogButton');
    this.messageEl = document.getElementById('dialogMessage');
    this.titleEl = document.getElementById('dialogTitle');
    this.container = this.overlay
      ? this.overlay.querySelector('.dialog-container')
      : null;

    this._onOverlayClick = this._onOverlayClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);

    this._bind();
  }

  close() {
    if (this.overlay) {
      this.overlay.classList.remove('is-open');
    }
  }

  show(message, type = 'error', title = '') {
    if (!this.overlay) {
      return;
    }

    if (this.messageEl) {
      this.messageEl.innerHTML = message;
    }

    if (this.titleEl) {
      this.titleEl.textContent =
        title ||
        (type === 'error' ? 'エラー' : type === 'success' ? '成功' : 'お知らせ');
    }

    if (this.container) {
      this.container.className = 'dialog-container dialog-' + type;
    }

    this.overlay.classList.add('is-open');
  }

  _bind() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.okBtn) {
      this.okBtn.addEventListener('click', () => this.close());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', this._onOverlayClick);
    }
    document.addEventListener('keydown', this._onKeydown);
  }

  _onOverlayClick(e) {
    if (e.target === this.overlay) {
      this.close();
    }
  }

  _onKeydown(e) {
    if (
      e.key === 'Escape' &&
      this.overlay &&
      this.overlay.classList.contains('is-open')
    ) {
      this.close();
    }
  }
}

const dialog = new DialogOverlay();

window.showDialog = function(message, type, title) {
  dialog.show(message, type, title);
};

window.closeDialog = function() {
  dialog.close();
};
