function openExternalLinksInNewTab() {
  var host = window.location.hostname;
  // 同时覆盖顶部导航、侧边栏、正文里的链接
  document.querySelectorAll("a[href^='http']").forEach(function (a) {
    try {
      var url = new URL(a.href);
      // 只处理站外链接，站内链接保持当前标签打开
      if (url.hostname !== host) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    } catch (e) {
      // 忽略无法解析的链接
    }
  });
}

// 兼容 Material 的即时导航
if (typeof document$ !== "undefined") {
  document$.subscribe(function () {
    openExternalLinksInNewTab();
  });
} else {
  document.addEventListener("DOMContentLoaded", openExternalLinksInNewTab);
  window.addEventListener("load", openExternalLinksInNewTab);
}