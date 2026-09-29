# 从零开始用 MkDocs + GitHub Actions 搭建个人网站

本文记录如何从零开始，使用 **MkDocs + Material 主题 + GitHub Actions** 搭建一个个人静态网站。只需要写 Markdown，推送到 GitHub，剩下的构建和部署全部自动完成。

---

## 一、什么是 GitHub Pages？

GitHub Pages 是 GitHub 提供的**免费静态网站托管服务**。你把网页文件放在 GitHub 仓库里，GitHub 就会帮你发布成一个可以访问的网站。

它的主要特点：

- **免费**：不需要买服务器，不需要备案（使用默认域名时）。
- **自带 HTTPS**：自动提供 SSL 证书，安全访问。
- **和仓库集成**：网站内容就是仓库里的文件，用 Git 管理，历史修改可追溯。
- **支持自定义域名**：可以绑定你自己买的域名，比如 `example.com`。
- **只支持静态内容**：不能跑 PHP、Python 等后端程序，也不能连数据库。适合文档、博客、个人主页。

> GitHub Pages 原生支持 Jekyll，但 Jekyll 配置复杂，容易和 MkDocs 冲突。本文改用 **GitHub Actions** 自动构建，更干净、更可控。

### ⚠️ 使用限制（小白必读）

GitHub Pages 虽然免费，但**不是无限网盘**，不能拿来传视频、大图或做下载站。官方限制如下：

| 项目 | 限制 | 说明 |
|------|------|------|
| 仓库容量 | 建议 < 1GB | 单个仓库最好不要超过 1GB，否则可能被限流 |
| 月流量 | 约 100GB | 每月访问量约 10 万次，超出可能被暂时限流 |
| 单次构建 | 不超过 10 分钟 | 构建太慢会失败，所以不要放太多大文件 |
| 内容类型 | 仅静态 | 不支持后端程序、数据库、视频流媒体 |

**结论**：GitHub Pages 适合放**文字、图片、代码**，不适合放**视频、大型压缩包、频繁下载的资源**。如果你要放视频，请用 B 站、YouTube 等平台，然后嵌入链接。

---

## 二、个人页面 vs 项目页面

GitHub Pages 分两种，建仓库前要先想好选哪种。

| 类型 | 仓库名要求 | 访问地址 | 数量限制 |
|------|------------|----------|----------|
| **用户页面** | 必须为 `<你的用户名>.github.io` | `https://<用户名>.github.io/` | 每个账号只能有一个 |
| **项目页面** | 任意名称 | `https://<用户名>.github.io/<仓库名>/` | 每个仓库都可以有一个 |

**怎么选？**

- 如果你想做一个**个人网站、知识库、博客**，希望地址简短干净，选**用户页面**。
- 如果你已经有一个用户页面，或者想给某个具体项目做文档站，选**项目页面**。

本文以**用户页面**为例。新建仓库时，仓库名必须为 `<你的用户名>.github.io`，可见性选择 **Public**。

---

## 三、准备工作

### 1. 安装必要工具

- **Git**：版本控制。下载：https://git-scm.com/downloads
- **Python 3.10+**：MkDocs 运行环境。下载：https://www.python.org/downloads/
- **VS Code**（可选）：代码编辑器。下载：https://code.visualstudio.com

安装完成后，在终端验证：

```bash
git --version
python --version
pip --version
```

### 2. 配置 Git 用户信息（首次使用）

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

---

## 四、初始化本地 MkDocs 项目

1. 克隆仓库到本地：

   ```bash
   git clone https://github.com/<用户名>/<用户名>.github.io.git
   cd <用户名>.github.io
   ```

2. 安装 MkDocs 和 Material 主题：

   ```bash
   pip install mkdocs mkdocs-material
   ```

3. 生成基础项目：

   ```bash
   mkdocs new .
   ```

   项目里会出现 `docs/` 文件夹和 `mkdocs.yml` 文件。

4. 本地预览：

   ```bash
   mkdocs serve
   ```

   浏览器打开 `http://127.0.0.1:8000/`，看到默认页面即成功。

---

## 五、配置 `mkdocs.yml`

编辑 `mkdocs.yml`，使用以下最简配置：

```yaml
site_name: 我的个人网站
site_url: https://<用户名>.github.io/

theme:
  name: material
  language: zh
  features:
    - navigation.tabs

nav:
  - 首页: index.md
```

保存后，`mkdocs serve` 会自动重载，页面变成 Material 主题。

---

## 六、添加自动部署工作流

在项目根目录创建以下两个文件。

### 1. `requirements.txt`

```txt
mkdocs>=1.6
mkdocs-material>=9.5
```

### 2. `.github/workflows/deploy-docs.yml`

```yaml
name: Deploy MkDocs to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Build site
        run: mkdocs build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
          force_orphan: true
```

---

## 七、推送并配置 GitHub Pages

1. 提交并推送：

   ```bash
   git add .
   git commit -m "初始化 MkDocs 项目"
   git push
   ```

2. 打开 GitHub 仓库的 **Actions** 标签页，等待工作流运行完成（绿色 ✅）。

3. 进入 **Settings → Pages**：
   - **Source** 选择 **Deploy from a branch**
   - **Branch** 选择 **gh-pages**，目录选 **/(root)**
   - 点击 **Save**

4. 稍等片刻，访问 `https://<用户名>.github.io/` 即可看到网站。

> **注意**：如果仓库里存在 GitHub 默认生成的 `jekyll-gh-pages.yml` 工作流，请删除它，否则会和我们的工作流冲突。

---

## 八、自定义域名（可选）

1. 在域名服务商处添加 DNS 解析：
   - 主机记录 `@`，类型 `A`，记录值 `185.199.108.153`（共四条，最后一位 108~111）
   - 主机记录 `www`，类型 `CNAME`，记录值 `<用户名>.github.io`

2. 在 **Settings → Pages → Custom domain** 填写你的域名，保存。

3. 在 `docs/` 下新建 `CNAME` 文件，内容为你的域名（例如 `example.com`）。

4. 等待 DNS 生效后，勾选 **Enforce HTTPS**。

---

## 九、日常更新

以后只需要：

```bash
# 1. 修改 docs/ 下的 Markdown 文件
# 2. 本地预览（可选）
mkdocs serve

# 3. 推送
git add .
git commit -m "更新文章"
git push
```

GitHub Actions 会自动构建并部署，你不需要做任何额外操作。

---

## 十、参考文档

- [GitHub Pages 官方文档](https://docs.github.com/zh/pages)
- [Material for MkDocs 官方文档](https://squidfunk.github.io/mkdocs-material/)
- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Markdown 教程](https://markdown.com.cn/)

---

**总结**：本地写 Markdown，推送到 GitHub，Actions 自动构建并发布到 `gh-pages` 分支，GitHub Pages 从该分支发布网站。整个流程干净、自动、无需手动构建。注意不要用它托管视频或大文件，否则可能被限流。