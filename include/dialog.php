<?php
/**
 * Dialog
 * @package App\Dialog
 * @author Gloria Design Works
 * @version 1.00.000
 * @see https://gloria-design-works.com/
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

<script src="<?php echo $url; ?>/assets/js/dialog.js"></script>
