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
  if (works.length > 0 && descriptions.length > 0) {
    const firstWorkId = works[0].id;
    const firstDesc = document.querySelector(`.portfolio-desc#${firstWorkId}`);
    if (works[0]) works[0].style.display = "block";
    if (firstDesc) firstDesc.style.display = "block";
  }

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
  const stalkerText = document.querySelector('.mouse-stalker-text');
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

  // 各要素に応じたアクション文言を取得する関数
  function getActionText(element) {
    // ポートフォリオモック
    if (element.classList.contains('portfolio-mock')) {
      return 'VIEW PORTFOLIO';
    }
    // ボタン
    if (element.tagName === 'BUTTON' || element.type === 'submit') {
      const buttonText = element.textContent.trim();
      if (buttonText.includes('SEND') || buttonText.includes('送信')) {
        return 'SEND';
      }
      return 'CLICK';
    }
    // リンク
    if (element.tagName === 'A') {
      const href = element.getAttribute('href');
      if (href && href.startsWith('#')) {
        return 'VIEW';
      }
      if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
        return 'OPEN';
      }
      return 'CLICK';
    }
    // フォーム入力
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      return 'INPUT';
    }
    // ラベル
    if (element.tagName === 'LABEL') {
      return 'SELECT';
    }
    // その他
    return 'CLICK';
  }

  // テキストの幅を測定してマウスストーカーのサイズを調整する関数
  function updateStalkerSize(text) {
    if (!stalkerText || !text) return;
    // テキストを設定
    stalkerText.textContent = text;
    // 一時的な要素を作成してテキストの幅を測定
    // 実際のスタイルを適用（CSS変数ではなく計算済みの値を使用）
    const measureElement = document.createElement('span');
    measureElement.style.fontSize = '0.625rem'; // 10px
    measureElement.style.fontFamily = '"Merriweather", serif';
    measureElement.style.fontWeight = '700';
    measureElement.style.letterSpacing = '1px';
    measureElement.style.whiteSpace = 'nowrap';
    measureElement.style.visibility = 'hidden';
    measureElement.style.position = 'absolute';
    measureElement.style.top = '-9999px';
    measureElement.style.padding = '0';
    measureElement.style.margin = '0';
    measureElement.textContent = text;
    document.body.appendChild(measureElement);
    // テキストの幅と高さを取得
    const textWidth = measureElement.offsetWidth;
    const textHeight = measureElement.offsetHeight;
    // 一時要素を削除
    document.body.removeChild(measureElement);
    // パディングを考慮したサイズを計算（左右に各10px、上下に各8px）
    const padding = 20; // 左右のパディング
    const verticalPadding = 16; // 上下のパディング
    const minSize = 40; // 最小サイズ
    const width = Math.max(minSize, textWidth + padding);
    const height = Math.max(minSize, textHeight + verticalPadding);
    // マウスストーカーのサイズを設定
    stalker.style.width = `${width}px`;
    stalker.style.height = `${height}px`;
    stalker.style.top = `-${height / 2}px`;
    stalker.style.left = `-${width / 2}px`;
  }

  // インタラクティブ要素にイベントリスナーを追加
  document.querySelectorAll('a, input, label, button, .portfolio-mock, textarea').forEach((elem) => {
    elem.addEventListener('mouseover', () => {
      stalker.classList.add('is_active');
      const actionText = getActionText(elem);
      if (stalkerText) {
        updateStalkerSize(actionText);
      }
    });
    elem.addEventListener('mouseout', () => {
      stalker.classList.remove('is_active');
      if (stalkerText) {
        stalkerText.textContent = '';
        // サイズをリセット
        stalker.style.width = '';
        stalker.style.height = '';
        stalker.style.top = '';
        stalker.style.left = '';
      }
    });
  });
});