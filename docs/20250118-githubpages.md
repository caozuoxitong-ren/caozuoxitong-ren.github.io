# 从零开始用GitHub Pages搭建个人网站

本文记录如何从零开始，使用GitHub Pages搭建个人网站。

## 一、什么是GitHub Pages？
GitHub Pages 是由 GitHub 提供的静态网站托管服务，直接与代码仓库集成，适用于个人、项目或组织的网页展示。其主要特点如下：

1. 免费托管
    - 免费域名：默认提供 https://&lt;username&gt;.github.io 或 https://&lt;<orgname&gt;.github.io/<repo> 的访问地址。
    - 自动 HTTPS：免费提供 SSL 证书，且证书自动续签更新，保障传输安全。
    - 支持绑定自定义域名：支持将网站关联到自己的域名（如 example.com）。
    - 无流量费用：适合中小型项目，但需注意 GitHub 的[使用限制](https://docs.github.com/zh/pages/getting-started-with-github-pages/about-github-pages#github-pages-%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6)。
2. 与 GitHub 仓库深度集成
    - 自动部署：将代码推送到关联的 GitHub 仓库后，自动构建并部署网站。
    - 版本控制：通过 Git 管理网站内容，历史修改可追溯，支持协作开发。
    - 分支/目录绑定：可通过仓库的特定分支（如 main、gh-pages）或 docs 目录直接发布内容。
3. 支持静态网站生成器
    - 内置 Jekyll：GitHub Pages 原生支持 Jekyll，推送 Markdown 文件后自动生成静态页面。
    - 灵活扩展：可集成其他静态生成工具，通过 GitHub Actions 自定义构建流程。
4. 使用限制
    - 仅限静态内容：不支持服务端脚本（如 PHP、Python）或数据库。
    - 构建限制：单次构建时长不超过 10 分钟，仓库容量建议小于 1GB。
    - 流量限制：每月 100GB 带宽、10 万次访问（超出可能导致限流）。

## 二、安装python环境
1. 下载并安装 Python。访问 [Python 官方下载页面](https://www.python.org/downloads/)，选择对应的操作系统的版本（推荐下载 Python 3.10+ 的稳定版本）。
2. 安装或更新 pip。
    - 在命令行终端输入 `pip --version` ，如果输出pip的版本号，则说明已经安装。
    - 若未安装 pip ，则可以下载 [get-pip.py](https://bootstrap.pypa.io/get-pip.py)，在命令行终端输入 `python get-pip.py`，安装最新版本的 pip。安装完成后，再次输入 `pip --version`，验证是否成功安装。

## 三、创建GitHub仓库
1. 注册GitHub账号。访问[github.com](https://github.com)注册账号。
2. 下载并安装 git。访问[git 官方下载页面](https://git-scm.com/downloads)，下载对应的操作系统版本。安装完成后在终端验证：

    ```git --version```<br>
    ```# 如果安装成功，会显示版本信息，类似 git version 2.32.0```

3. 配置 Git 用户账号信息（首次使用需要）：

    ```git config --global user.name "你的GitHub用户名"```<br>
    ```git config --global user.email "你的GitHub邮箱" ```

4. 创建GitHub仓库。
    1. GitHub支持两种类型的GitHub Pages：
        - 用户页面（User Pages）。每个用户帐户可以有一个用户页面。页面的网址通常为：`<你的GitHub用户名>.github.io`
        - 项目页面（Project Pages）：每个项目仓库可以有一个项目页面。每个账户可以有多个项目。页面的网址通常为：`<你的GitHub用户名>.github.io/<仓库名>`
    2. 此处我们使用用户页面新建一个个人知识库：
        - 新建一个仓库：仓库名**必须**为：`<你的GitHub用户名>.github.io`，选择Public可见性。
        - 例如：github用户名为myname，建立的仓库名应为：`myname.github.io` (两个点也是仓库名的一部分)
5. 配置github pages页面
    1. 在项目setting中，找到pages选项卡，
    2. 设置Build and deployment的Source为GitHub Actions
    3. 选择：GitHub Pages Jekyll，点击configure，默认即可，点击编辑框右上角的commit changes...保存。
    4. 测试访问：稍等片刻，等待部署，可以在项目的Actions选项卡中查看部署进度。部署完成后，可以访问：`https://<你的GitHub用户名>.github.io/`
    5. （可选）自定义域名。如果不需要，可以跳过此步。
        1. 购买域名。
        2. 设置DNS解析。如果有自己的域名，可以添加解析记录：
            - 主机记录：www ,记录类型：CNAME，记录值：<你的GitHub用户名>.github.io
            - 主机记录：@ ,记录类型：CNAME，记录值：<你的GitHub用户名>.github.io
        3. 在github的项目<你的GitHub用户名>.github.io中，设置自定义域名：在 Settings-->pages-->Custom domain，填写自定义域名，保存即可，默认勾选Enforce HTTPS。
        4. 设置完成后，当前网站将变得不可访问，需要对项目文件进行必要设置，参考下面文档。

## 四、使用mkdocs构建网站

MkDocs是一个快速、简单、华丽的静态网站生成器，适用于构建项目文档。

1. 同步github仓库：`git clone https://github.com/<用户名>/<用户名>.github.io.git`，此时本地电脑上应该有一个项目目录：`<用户名>.github.io`
2. 使用mkdocs生成网站：进入项目目录`<用户名>.github.io`，然后输入：`mkdocs new .`(注意，最后有个点，表示在当前目录下)。
3. 生成网站静态文件：运行命令 `mkdocs build`，可以在site目录下查看。
4. 本地测试：运行命令 `mkdocs serve`，即可在本地测试预览网站 http://127.0.0.1:8000/
5. 创建跳转页面。如果使用了自定义域名，github pages会默认从根目录下寻找index.html文件，可以直接在根目录下创建一个跳转页面 index.html，链接到site/index.html，内容如下：

```
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=site/index.html">
    <title>Redirecting...</title>
</head>
<body>
    <p>If you are not redirected automatically, <a href="another-page.html">click here</a>.</p>
</body>
</html>
```

## 五、将网站推送到github仓库
1. 每次推送前，都要重新生成一下网站，保证是最新的：`mkdocs build`
2. 拉取最新代码。在提交代码之前，首先要拉取远程仓库的最新代码，以避免代码冲突。可以使用以下命令：`git pull`
3. 暂存更改。将更改的文件暂存起来，可以使用以下命令：git add . (注意，这里add后面有个点"."，表示当前目录下的所有改动)
4. 提交更改。将暂存的更改提交到本地的版本库，可以使用以下命令：`git commit -m "提交说明例如初始化网站"`
5. 推送到远程仓库。将本地的分支版本上传到远程仓库，可以使用以下命令：`git push`
6. 等待github pages自动部署，稍等一会即可访问：`https://<你的GitHub用户名>.github.io/` 或者：`https://你的域名`

## 六、配置网站
MkDocs有一堆很好看的主题，这里我们将使用Material for MkDocs作为主题。

1. 安装 Material for MkDocs，使用命令：`pip install mkdocs-material`
2. 修改配置文件 `mkdocs.yml`，内容如下：

```
site_name: 人的操作系统
site_dir: site 
docs_dir: docs

# 主题设置
theme:
  name: material
  features:
    - navigation.tabs
    # - navigation.tabs.sticky 固定顶部导航栏
  language: zh

# 导航
nav:
  - 简介: index.md
  - 文章:
    - 第一篇文章: index.md
    - 第二篇文章: index2.md # 自己创建一个文件，写一写内容，后缀md表示使用markdown语法
  - 关于:
    - 关于本网站: about.md
```

重新构建mkdocs build和同步到github仓库中。

## 七、参考文档
- [material for mkdocs 中文文档](http://mkdoc-material.llango.com/)
- [Markdown 教程](https://markdown.com.cn/)