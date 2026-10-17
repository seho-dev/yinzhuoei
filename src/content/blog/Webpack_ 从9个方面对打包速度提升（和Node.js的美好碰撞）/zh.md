---
title: "Webpack: 从9个方面对打包速度提升（和Node.js的美好碰撞）"
description: "从技术手段上提高 Webpack 打包速度。 1. 跟上技术迭代 升级 Node、npm 或 yarn。Webpack 基于 Node，Node 升级对性能有提升。依赖包升级也对打包速度有帮助。 2. 减少 loader 使用 Loader 会对更多文件解析。…"
date: 2019-12-07
lang: zh
translationKey: "2019-12-07_148_Webpack_ 从9个方面对打包速度提升（和Node.js的美好碰撞）"
categories:
  - "前端"
views: 5836
draft: false
---

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2019/12/735949451.jpg)

从技术手段上提高 Webpack 打包速度。

**1. 跟上技术迭代**

升级 Node、npm 或 yarn。Webpack 基于 Node，Node 升级对性能有提升。依赖包升级也对打包速度有帮助。

**2. 减少 loader 使用**

Loader 会对更多文件解析。在配置中排除 node_modules，因为依赖项可能已经打包过，再打包浪费时间。

**3. 慎用 plugins**

尽量用社区/官方推荐的插件，稳定性和易用性好。避免用第三方私人插件。

**4. resolve 配置优化**

```javascript
resolve: {
    extensions: ["vue", "js", "jsx"]
}
```

只配置必要的后缀，如 js、jsx、vue。不要配太多会增加遍历压力。

别名配置：

```javascript
alias: {
    shenhao: path.resolve(__dirname, "../src/common")
}
```

只配置最常用的，配置越多越慢。

**5. DllPlugin 提升打包速度**

把不常变的库单独打包，只分析一次，之后直接读分析过的文件。

创建 webpack.dll.js：

```javascript
const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        vendors: ["react", "react-dom", "lodash"]
    },
    output: {
        path: path.resolve(__dirname, 'dll'),
        filename: '[name].dll.js',
        library: "[name]"
    }
}
```

用 DllPlugin 生成映射文件：

```javascript
plugins: [new webpack.DllPlugin({
    name: "[name]",
    path: path.resolve(__dirname, "dll/[name].manifest.json")
})]
```

在 webpack.config.js 中引用：

```javascript
new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "dll/vendors.manifest.json")
})
```

这样不用每次都去 node_modules 找模块。

**智能做法**

遍历 dll 目录，自动配置：

```javascript
const fs = require("fs");
const files = fs.readdirSync(path.resolve(__dirname, '../dll'));
files.forEach(file => {
    if (/.*\.dll.js/.test(file)) {
        plugins.push(new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../dll', file)
        }))
    }
    if (/.*\.manifest.json/.test(file)) {
        plugins.push(new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, "dll", file)
        }))
    }
})
```

**6. 控制包文件大小**

用 treeshaking 和 code splitting。

**7. 多线程打包**

- 单页应用：thread-loader
- 多页应用：parallel-webpack、happypack

**8. 合理使用 source map**

根据项目选合适的 source map，过细会增加打包压力。

**9. 结合 stats 分析**

用第三方网站分析打包文件，找出哪个文件大、哪个慢，针对性优化。

**10. 开发环境内存编译**

webpack-dev-server 用内存存储，比硬盘读写快。

**11. 开发环境剔除无用插件**

开发环境不需要压缩等插件，剔除可提升速度。

![Image.png](https://www.yinzhuoei.com/usr/uploads/2019/12/686070618.png)

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2019/12/2685794861.png)
