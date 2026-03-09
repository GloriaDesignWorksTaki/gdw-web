<?php
/**
 * ダイアログ
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
<div id="dialogOverlay" class="dialog-overlay<?php echo $showDialog ? ' is-open' : ''; ?>">
  <div class="dialog-container dialog-<?php echo function_exists('escape') ? escape($dialogType) : htmlspecialchars($dialogType, ENT_QUOTES, 'UTF-8'); ?>">
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

<script>
(function() {
  const overlay = document.getElementById('dialogOverlay');
  const closeBtn = document.getElementById('dialogClose');
  const okBtn = document.getElementById('dialogButton');
  
  function closeDialog() {
    if (overlay) {
      overlay.classList.remove('is-open');
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
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
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
      overlay.classList.add('is-open');
    }
  };
  
  // ダイアログを閉じる関数（外部から呼び出し可能）
  window.closeDialog = closeDialog;
})();
</script>
