<footer>
  <div class="footer-logo">
    <a href="<?php echo $url; ?>">
      <img src="<?php echo $url; ?>/assets/images/logo-white.svg" alt="Gloria Design Works LOGO">
    </a>
  </div>
  <div class="footer-links">
    <ul>
      <li>
        <a href="https://github.com/GloriaDesignWorksTaki" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-github"></i>
        </a>
      </li>
      <li>
        <a href="https://x.com/GloriaDesignWKS" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-x-twitter"></i>
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/takiboy_95/" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-instagram"></i>
        </a>
      </li>
    </ul>
  </div>
  <div class="copy">
    <p>&copy; Gloria Design Works</p>
  </div>
</footer>
<!-- JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script> 
<script src="./assets/js/common.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // デフォルトの送信を防ぐ
      
      const submitBtn = document.getElementById('submitBtn');
      const defaultText = submitBtn.querySelector('.default');
      const loadingText = submitBtn.querySelector('.loading');
      const submitButton = submitBtn;

      // ボタンをローディング状態に切り替え
      defaultText.style.display = 'none';
      loadingText.style.display = 'inline-flex';
      submitButton.disabled = true;

      // FormDataを作成
      const formData = new FormData(contactForm);

      // Fetch APIでAjax送信
      fetch(window.location.href, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.json())
      .then(data => {
        // ローディング状態を解除
        defaultText.style.display = '';
        loadingText.style.display = 'none';
        submitButton.disabled = false;

        if (data.success) {
          // 成功した場合はリダイレクト
          window.location.href = data.redirect;
        } else {
          // エラーがある場合はダイアログを表示
          if (data.errors && Array.isArray(data.errors)) {
            const errorMessage = data.errors.join('<br>');
            if (window.showDialog) {
              window.showDialog(errorMessage, 'error', 'エラー');
            }
          }
        }
      })
      .catch(error => {
        // エラー処理
        console.error('Error:', error);
        defaultText.style.display = '';
        loadingText.style.display = 'none';
        submitButton.disabled = false;
        
        if (window.showDialog) {
          window.showDialog('通信エラーが発生しました。しばらく時間をおいてから再度お試しください。', 'error', 'エラー');
        }
      });
    });
  }
});
</script>
</body>
</html>