---
title: "Webpack 4.0: A Basic Configuration Guide"
description: "A guide to basic Webpack 4 configuration. Installation: initialize the project first. Webpack runs on Node and can be installed globally, which gives you a single shared version, or locally in a project, which lets different projects use different versions. A local installation is recommended. Basic usage: create an index.js entry file and use ES module imports…"
date: 2019-03-27
lang: en
translationKey: "2019-03-27_92_Webpack4.0：最base的配置指南"
categories:
  - "Frontend"
views: 5621
draft: false
---

A guide to basic Webpack 4 configuration.

**Installation**

First, initialize your project:

```bash
npm init -y
```

Webpack runs on Node and can be installed in two ways:

- Globally: you can only run the one shared version.
- Locally in a project: different projects can use different versions.

A local installation is recommended:

```bash
npm install webpack webpack-cli -D
```

**Basic Usage**

Create an entry file, index.js, and use ES module imports.

Compile it:

```bash
npx webpack index.js
```

`npx` is a command provided with Node. Since webpack is installed locally, you can't run the webpack command directly. A successful build generates dist/main.js: the bundled JavaScript file that the browser can execute.

**Custom Configuration**

Webpack provides a default configuration. To customize the output filename and directory, create webpack.config.js:

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

**Update package.json**

```json
"scripts": {
    "bundle": "webpack"
}
```

Then run:

```bash
npm run bundle
```

![QQ screenshot 20190327172906.png](https://www.yinzhuoei.com/usr/uploads/2019/03/3442048727.png)
