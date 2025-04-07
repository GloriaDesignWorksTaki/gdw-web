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
document.getElementById('contactForm').addEventListener('submit', function() {
  var submitBtn = document.getElementById('submitBtn');
  var defaultText = submitBtn.querySelector('.default');
  var loadingText = submitBtn.querySelector('.loading');

  // ボタンをローディング状態に切り替え
  defaultText.style.display = 'none';
  loadingText.style.display = 'inline-flex';
});
</script>
</body>
</html>