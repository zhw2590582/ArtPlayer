const i18n = {
  English: "中文",
};

function changeI18n() {
  const zh = window.location.pathname.startsWith("/zh-cn/");
  const links = Array.from(document.querySelectorAll(".navbar__link"));
  links.forEach((item) => {
    const text = item.textContent.trim();
    if (zh) {
      if (i18n[text]) {
        item.textContent = i18n[text];
        item.dataset.en = text;
      }
    } else {
      if (item.dataset.en && item.dataset.en !== text) {
        item.textContent = item.dataset.en;
      }
    }
  });
}

window.addEventListener("load", () => {
  setTimeout(changeI18n, 300);
  document.addEventListener("click", (event) => {
    const { className } = event.target;
    if (!className || typeof className !== "string") return;
    if (
      className.includes("navbar__link") ||
      className.includes("dropdown__link") ||
      className.includes("navbar__title")
    ) {
      setTimeout(changeI18n, 300);
    }
  });
});
