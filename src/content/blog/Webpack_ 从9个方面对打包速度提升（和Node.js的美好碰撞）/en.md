---
title: "Webpack: Nine Ways to Speed Up Builds (A Happy Encounter with Node.js)"
description: "Technical approaches to speeding up Webpack builds. 1. Keep your tools up to date. Upgrade Node, npm, or yarn. Webpack runs on Node, so upgrading Node can improve performance. Updating dependencies can also help build speed. 2. Reduce loader usage. Loaders parse additional files…"
date: 2019-12-07
lang: en
translationKey: "2019-12-07_148_Webpack_ 从9个方面对打包速度提升（和Node.js的美好碰撞）"
categories:
  - "Frontend"
views: 5836
draft: false
---

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2019/12/735949451.jpg)

Here are some technical approaches to speeding up Webpack builds.

**1. Keep Your Tools Up to Date**

Upgrade Node, npm, or yarn. Webpack runs on Node, so upgrading Node can improve performance. Updating dependencies can also help build speed.

**2. Reduce Loader Usage**

Loaders cause more files to be parsed. Exclude node_modules in your configuration: dependencies may already be bundled, and bundling them again wastes time.

**3. Choose Plugins Carefully**

Prefer plugins recommended by the community or the official documentation for their stability and ease of use. Avoid unofficial plugins maintained by individuals.

**4. Optimize resolve Configuration**

```javascript
resolve: {
    extensions: ["vue", "js", "jsx"]
}
```

Configure only the extensions you need, such as js, jsx, and vue. Too many increase the amount of searching required.

Alias configuration:

```javascript
alias: {
    shenhao: path.resolve(__dirname, "../src/common")
}
```

Only configure the aliases you use most often. The more you add, the slower resolution becomes.

**5. Speed Up Builds with DllPlugin**

Bundle libraries that rarely change separately. Analyze them once, then read the already-analyzed files in subsequent builds.

Create webpack.dll.js:

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

Use DllPlugin to generate a manifest:

```javascript
plugins: [new webpack.DllPlugin({
    name: "[name]",
    path: path.resolve(__dirname, "dll/[name].manifest.json")
})]
```

Reference it in webpack.config.js:

```javascript
new webpack.DllReferencePlugin({
    manifest: path.resolve(__dirname, "dll/vendors.manifest.json")
})
```

This avoids looking up modules in node_modules on every build.

**A Smarter Approach**

Iterate over the dll directory and configure everything automatically:

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

**6. Keep Bundle Sizes Under Control**

Use tree shaking and code splitting.

**7. Build with Multiple Threads**

- Single-page applications: thread-loader
- Multi-page applications: parallel-webpack, happypack

**8. Use Source Maps Appropriately**

Choose a source map format that suits your project. Excessive detail adds build overhead.

**9. Analyze Your Builds with stats**

Use third-party websites to analyze your bundles, identify large or slow files, and optimize those specifically.

**10. Compile in Memory During Development**

webpack-dev-server stores output in memory, which is faster than reading and writing to disk.

**11. Remove Unnecessary Plugins in Development**

Plugins such as minifiers aren't needed during development. Removing them speeds things up.

![Image.png](https://www.yinzhuoei.com/usr/uploads/2019/12/686070618.png)

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2019/12/2685794861.png)
