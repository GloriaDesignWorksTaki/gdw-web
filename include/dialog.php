<?php
/**
 * ダイアログコンポーネント
 * エラーメッセージやその他のメッセージを表示するためのモーダルダイアログ
 * 注意: escape()関数はこのファイルをインクルードする前に定義されている必要があります
 */

// エラーメッセージがある場合は自動的にダイアログを表示
$showDialog = false;
$dialogType = 'error'; // 'error', 'success', 'info'
$dialogMessage = '';
$dialogTitle = '';

if (isset($errors) && is_array($errors) && !empty($errors)) {
  $showDialog = true;
  $dialogType = 'error';
  $dialogTitle = 'エラー';
  // escape関数が定義されている場合は使用、されていない場合はhtmlspecialcharsを直接使用
  if (function_exists('escape')) {
    $dialogMessage = implode('<br>', array_map('escape', $errors));
  } else {
    $dialogMessage = implode('<br>', array_map(function($str) { 
      return htmlspecialchars($str, ENT_QUOTES, 'UTF-8'); 
    }, $errors));
  }
}
?>

<!-- ダイアログオーバーレイ -->
<div id="dialogOverlay" class="dialog-overlay" style="display: <?php echo $showDialog ? 'flex' : 'none'; ?>;">
  <div class="dialog-container">
    <div class="dialog-header">
      <h3 class="dialog-title" id="dialogTitle"><?php echo function_exists('escape') ? escape($dialogTitle) : htmlspecialchars($dialogTitle, ENT_QUOTES, 'UTF-8'); ?></h3>
      <button class="dialog-close" id="dialogClose" aria-label="閉じる">&times;</button>
    </div>
    <div class="dialog-body">
      <div class="dialog-message" id="dialogMessage">
        <?php if ($showDialog): ?>
          <?php echo $dialogMessage; ?>
        <?php endif; ?>
      </div>
    </div>
    <div class="dialog-footer">
      <button class="dialog-button" id="dialogButton">OK</button>
    </div>
  </div>
</div>

<style>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.dialog-container {
  background-color: var(--color-primary, #2f2c2a);
  color: var(--color-secondary, #ffffff);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  width: 500px;
  max-height: 90vh;
  overflow: hidden;
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-primary-light, #817e7c);
}

.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-secondary, #ffffff);
}

.dialog-close {
  background: none;
  border: none;
  color: var(--color-secondary, #ffffff);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.dialog-close:hover {
  opacity: 0.7;
}

.dialog-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.dialog-message {
  line-height: 1.6;
  color: var(--color-secondary, #ffffff);
}

.dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-primary-light, #817e7c);
  display: flex;
  justify-content: flex-end;
}

.dialog-button {
  background-color: var(--color-accent, #1b86d4);
  color: var(--color-secondary, #ffffff);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  font-family: var(--font-family-title, "Merriweather", serif);
  letter-spacing: 1px;
}

.dialog-button:hover {
  background-color: #1470b8;
}

.dialog-button:active {
  transform: scale(0.98);
}

/* ダイアログタイプ別のスタイル */
.dialog-container.dialog-error .dialog-title {
  color: #ff6b6b;
}

.dialog-container.dialog-success .dialog-title {
  color: #51cf66;
}

.dialog-container.dialog-info .dialog-title {
  color: var(--color-accent, #1b86d4);
}

/* アニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* レスポンシブ */
@media (max-width: 768px) {
  .dialog-container {
    width: 95%;
    max-width: 95%;
  }
  .dialog-header,
  .dialog-body,
  .dialog-footer {
    padding: 1rem;
  }
}
</style>

<script>
(function() {
  const overlay = document.getElementById('dialogOverlay');
  const closeBtn = document.getElementById('dialogClose');
  const okBtn = document.getElementById('dialogButton');
  
  function closeDialog() {
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeDialog);
  }
  
  if (okBtn) {
    okBtn.addEventListener('click', closeDialog);
  }
  
  // オーバーレイクリックで閉じる
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeDialog();
      }
    });
  }
  
  // ESCキーで閉じる
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.style.display === 'flex') {
      closeDialog();
    }
  });
  
  // ダイアログを表示する関数（外部から呼び出し可能）
  window.showDialog = function(message, type = 'error', title = '') {
    const messageEl = document.getElementById('dialogMessage');
    const titleEl = document.getElementById('dialogTitle');
    const container = overlay.querySelector('.dialog-container');
    
    if (messageEl) {
      messageEl.innerHTML = message;
    }
    
    if (titleEl) {
      titleEl.textContent = title || (type === 'error' ? 'エラー' : type === 'success' ? '成功' : 'お知らせ');
    }
    
    if (container) {
      container.className = 'dialog-container dialog-' + type;
    }
    
    if (overlay) {
      overlay.style.display = 'flex';
    }
  };
  
  // ダイアログを閉じる関数（外部から呼び出し可能）
  window.closeDialog = closeDialog;
})();
</script>
