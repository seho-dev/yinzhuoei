---
title: "Webpack4.0：最base的配置指南"
description: "Webpack 4 的基础配置指南。 安装 先初始化项目： Webpack 基于 Node，有两种安装方式： - 全局安装：只能运行同一个版本 - 项目局部安装：可以运行多个不同版本 推荐项目局部安装： 基本使用 创建入口文件 index.js，用 ES 模块…"
date: 2019-03-27
lang: zh
translationKey: "2019-03-27_92_Webpack4.0：最base的配置指南"
categories:
  - "前端"
views: 5621
draft: false
---

Webpack 4 的基础配置指南。

**安装**

先初始化项目：

```bash
npm init -y
```

Webpack 基于 Node，有两种安装方式：

- 全局安装：只能运行同一个版本
- 项目局部安装：可以运行多个不同版本

推荐项目局部安装：

```bash
npm install webpack webpack-cli -D
```

**基本使用**

创建入口文件 index.js，用 ES 模块方式引入。

编译：

```bash
npx webpack index.js
```

`npx` 是 Node 提供的命令，因为局部安装无法直接用 webpack 命令。编译成功后生成 dist/main.js，这就是打包后能被浏览器阅读的 JS 文件。

**自定义配置**

Webpack 提供默认配置。要自定义文件名和目录，创建 webpack.config.js：

```javascript
const path = require('path')

module.exports = {
    entry: "./index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'bundle')
    }
}
```

**修改 package.json**

```json
"scripts": {
    "bundle": "webpack"
}
```

然后运行：

```bash
npm run bundle
```

![QQ截图20190327172906.png](https://www.yinzhuoei.com/usr/uploads/2019/03/3442048727.png)
