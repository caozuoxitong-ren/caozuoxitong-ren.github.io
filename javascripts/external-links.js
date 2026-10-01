function processLinks() {
  var host = window.location.hostname;

  // 1. 外链：新标签打开
  document.querySelectorAll("a[href^='http']").forEach(function (a) {
    try {
      var url = new URL(a.href);
      if (url.hostname !== host) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    } catch (e) {
      // 忽略无法解析的链接
    }
  });

  // 2. 导航栏里带 ↗ 标记的站内链接：新标签打开，并去掉箭头
  document
    .querySelectorAll(".md-nav__link, .md-tabs__link")
    .forEach(function (a) {
      var text = a.textContent.trim();
      if (text.endsWith("↗")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        // 去掉末尾的箭头和空格
        a.textContent = text.replace(/\s*↗\s*$/, "").trim();
      }
    });
}

// 兼容 Material 的即时导航
if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    processLinks();
  });
} else {
  document.addEventListener("DOMContentLoaded", processLinks);
  window.addEventListener("load", processLinks);
}