document.addEventListener('DOMContentLoaded', () => {
  // スクロールアニメーション（使わないかも〜）
  const targets = document.querySelectorAll('.target');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-show');
      }
    });
  }, { threshold: 0.75 });

  targets.forEach(target => observer.observe(target));

  // Main Visual Animation gsap
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(".expanding-box", {
    width: "100vw", 
    height: "100vh",
    backgroundColor: "#1b86d4",
    duration: 1,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: "body",
      start: "top top", 
      end: "35% bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const startColor = {r: 255, g: 255, b: 255}; // 白
        const endColor = {r: 47, g: 44, b: 42}; // #2f2c2a
        
        const currentR = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
        const currentG = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
        const currentB = Math.round(startColor.b + (endColor.b - startColor.b) * progress);
        
        gsap.set(".expanding-box", {
          backgroundColor: `rgb(${currentR}, ${currentG}, ${currentB})`
        });
      }
    }
  });

  // PORTFOLIO DATA
  const portfolioMock = document.querySelector(".portfolio-mock");
  const portfolioList = document.querySelector(".portfolio-select");
  const portfolioLinks = document.querySelectorAll(".portfolio-select a");
  const works = document.querySelectorAll(".portfolio-works");
  const descriptions = document.querySelectorAll(".portfolio-desc");
  const shadow = document.querySelector("#shadow");
  const body = document.querySelector("body");
  // ポートフォリオリストの開閉
  portfolioMock.addEventListener("click", () => {
    portfolioList.classList.toggle("active");
    shadow.classList.toggle("active");
    body.classList.toggle("fixed");
  });

  // すべての作品と説明を非表示、最初の作品と説明を表示
  works.forEach(work => (work.style.display = "none"));
  descriptions.forEach(desc => (desc.style.display = "none"));
  document.querySelector("#works01").style.display = "block";
  document.querySelector(".portfolio-desc#works01").style.display = "block";

  // ポートフォリオリンクのクリックイベント
  portfolioLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault(); // ページ遷移を防ぐ

      const targetId = link.getAttribute("href").replace("#", "");
      const targetWork = document.querySelector(`#${targetId}`);
      const targetDesc = document.querySelector(`.portfolio-desc#${targetId}`);

      if (targetWork && targetDesc) {
        // すべての作品と説明を非表示
        works.forEach(work => (work.style.display = "none"));
        descriptions.forEach(desc => (desc.style.display = "none"));

        // 選択された作品と説明を表示
        targetWork.style.display = "block";
        targetDesc.style.display = "block";
      }

      // 選択状態のスタイル変更
      portfolioLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      // モックを閉じる
      portfolioList.classList.remove("active");
      shadow.classList.remove("active");
      body.classList.remove("fixed");
    });
  });

  shadow.addEventListener("click", () => {
    portfolioList.classList.remove("active");
    shadow.classList.remove("active");
    body.classList.remove("fixed");
  });

  // mouse-stalker
  const stalker = document.querySelector('.mouse-stalker');
  let mouseX = 0, mouseY = 0;
  let stalkerX = 0, stalkerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const updateStalker = () => {
    stalkerX += (mouseX - stalkerX) * 0.2;
    stalkerY += (mouseY - stalkerY) * 0.2;
    stalker.style.transform = `translate(${stalkerX}px, ${stalkerY}px)`;
    requestAnimationFrame(updateStalker);
  };
  updateStalker();

  document.querySelectorAll('a, input, label, button, .portfolio-mock').forEach((elem) => {
    elem.addEventListener('mouseover', () => stalker.classList.add('is_active'));
    elem.addEventListener('mouseout', () => stalker.classList.remove('is_active'));
  });

  // コンタクトフォームの送信ボタン
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
  });
});