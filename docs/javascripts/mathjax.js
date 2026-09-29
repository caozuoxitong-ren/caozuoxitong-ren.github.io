// MathJax 配置：推荐用 \(...\) 和 \[...\]，不容易和 Markdown 冲突
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    // 跳过这些标签内的内容，避免把代码块里的公式也拿去渲染
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    // 只处理带有 arithmatex 类的元素
    processHtmlClass: "arithmatex"
  },
  startup: {
    pageReady: () => {
      // MathJax 主库加载完成后，先执行一次默认渲染
      return MathJax.startup.defaultPageReady();
    }
  }
};

// 兼容 Material 主题的即时加载（instant loading）
if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    // 定义带重试的渲染函数
    function tryTypeset(retries) {
      if (window.MathJax && MathJax.typesetPromise) {
        // 清除输出缓存，确保样式表重新生成
        MathJax.startup.output.clearCache();
        // 清除之前已排版的内容记录
        MathJax.typesetClear();
        // 重置 TeX 编号系统
        MathJax.texReset();
        // 执行实际的排版操作
        MathJax.typesetPromise().catch(function (err) {
          console.error("MathJax error:", err);
        });
      } else if (retries > 0) {
        // 每隔 200ms 重试一次，最多等 4 秒
        setTimeout(function () {
          tryTypeset(retries - 1);
        }, 200);
      } else {
        console.warn("MathJax 未在预期时间内加载完成");
      }
    }

    tryTypeset(20);
  });
} else {
  // 未启用即时加载时的回退
  document.addEventListener("DOMContentLoaded", function () {
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise().catch(function (err) {
        console.error("MathJax error:", err);
      });
    }
  });
}