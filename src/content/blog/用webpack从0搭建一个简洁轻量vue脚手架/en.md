---
title: "Building a Minimalist and Lightweight Vue Scaffolding from Scratch with Webpack"
description: "A step-by-step tutorial on building a clean, lightweight Vue CLI scaffolding from scratch using Webpack 4, covering multi-environment configuration, loaders, plugins, Vue single-file components, routing, and modular API architecture."
date: 2020-01-05
lang: en
translationKey: "2020-01-05_165_用webpack从0搭建一个简洁轻量vue脚手架"
categories:
  - "Life"
views: 8845
draft: false
---

> **Prerequisites**: This article assumes basic familiarity with Webpack and npm.

A few days ago during my daily routine, it struck me: while modern frontend engineering makes coding effortless, we rarely dive under the hood to see how our tools actually work. For example, Vue CLI is the quintessential scaffolding tool for Vue projects, and version 3 is built upon Webpack 4. As it happened, I had been searching for a good hands-on project to practice Webpack, so I decided to build a lightweight Vue CLI setup from scratch using Webpack 4.

![Cover Image](https://www.yinzhuoei.com/usr/uploads/2020/01/2381946703.jpg)

Without further ado, let's build it from scratch!

## 1. Prepare an Empty Project

Initialize a new project:

```bash
npm init
```

Follow the prompts to enter your project name, description, etc. Next, install Webpack and its CLI:

```bash
npm i webpack webpack-cli -D
```

Once installed, create a `build` directory. Here we will maintain three configuration files: one for development, one for production, and one for shared common settings. To set up our configuration smoothly, we will need several plugins and loaders. Let's tackle them step by step.

## 2. Consolidating Multiple Webpack Configurations

### 1. Create `webpack.common.js`

Import core Node.js modules:

```javascript
const path = require("path");
```

Export a configuration object via `module.exports`:

```javascript
entry: "./src/main.js",
output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[hash]_[name].js",
},
```

All bundled files will be output to the `dist` directory with a hash prefixed to the filename for cache busting.

In Vue development, we typically omit file extensions like `.js` and `.vue` when importing modules. Vue CLI handles this automatically via Webpack's resolution algorithm.

We configure this using the `resolve` field:

```javascript
resolve: {
    // File extensions to resolve automatically when importing modules
    extensions: ['.js', '.vue'],
    alias: {
        '@': path.resolve('src'),
        // Use the full build (runtime + compiler) so templates can be compiled in development
        'vue$': 'vue/dist/vue.esm.js'
    }
},
```

> In `extensions`, we only specify `.js` and `.vue`. Avoid adding too many extensions (like `.css`, `.html`, `.xml`), as checking every extension slows down Webpack's resolution speed.
>
> The `'vue$': 'vue/dist/vue.esm.js'` alias is crucial: by default, npm imports Vue's runtime-only build, which throws an error when compiling templates directly in code. This alias fixes that issue.

### 2. Install Required Dependencies

Here is a typical `package.json` dependency manifest including Axios and Vue Router:

```json
"dependencies": {
    "@babel/core": "^7.7.7",
    "axios": "^0.19.0",
    "copy-webpack-plugin": "^5.1.1",
    "stylus": "^0.54.7",
    "stylus-loader": "^3.0.2",
    "vue": "^2.6.11",
    "vue-router": "^3.1.3",
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10",
    "webpack-merge": "^4.2.2"
},
"devDependencies": {
    "autoprefixer": "^7.1.2",
    "babel-loader": "^8.0.6",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^3.4.0",
    "file-loader": "^5.0.2",
    "html-webpack-plugin": "^3.2.0",
    "postcss-loader": "^3.0.0",
    "precss": "^4.0.0",
    "style-loader": "^1.1.2",
    "url-loader": "^3.0.0",
    "vue-loader": "^15.8.3",
    "vue-template-compiler": "^2.6.11",
    "webpack-dev-server": "^3.10.1"
}
```

### 3. Configure Loaders in `module.rules`

```javascript
module: {
    rules: [{
        test: /\.vue$/, // Process Vue SFC files
        loader: 'vue-loader'
    }, {
        test: /\.js$/,
        loader: "babel-loader", // Transpile modern ES6+ syntax
        exclude: /node_modules/
    }, {
        test: /\.css$/, // Process standard CSS
        use: ["style-loader", "css-loader", "postcss-loader"]
    }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // Process images
        loader: 'file-loader',
        options: {
            name: "[name].[ext]"
        }
    }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // Process media files
        loader: 'url-loader',
        options: {
            limit: 10000
        }
    }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // Process web fonts
        loader: 'url-loader',
        options: {
            // Inline small files as base64 data URIs
            limit: 10000,
            name: '[name].[ext]'
        }
    }, {
        test: /\.styl/, // Process Stylus syntax
        use: [
            'style-loader',
            'css-loader',
            "postcss-loader",
            'stylus-loader'
        ]
    }]
},
```

> Loaders listed in `use` arrays execute from right to left (bottom to top).

For PostCSS, create a `postcss.config.js` file in the project root:

```javascript
module.exports = {
    plugins: [
      require('precss'),
      require('autoprefixer')
    ]
};
```

These plugins provide advanced CSS capabilities and automatically inject vendor prefixes for browser compatibility.

### 4. Configure HTML Template & Plugins

Create an `index.html` file in the project root:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>A Vue.js Project</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

This HTML file serves as the mounting shell for the compiled Vue application. The container `<div id="app"></div>` is where Vue mounts.

Now configure the shared plugins in `webpack.common.js`:

```javascript
plugins: [
    new HtmlWebpackPlugin({
        template: './index.html'
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../public'), // Static files to copy without processing
        to: '', // Destination directory inside dist
        ignore: ['.*'] // Ignore dotfiles
    }])
]
```

- `HtmlWebpackPlugin`: Generates the HTML page and automatically injects all output bundles.
- `VueLoaderPlugin`: Required by `vue-loader` to clone and apply existing loader rules to `.vue` blocks.
- `CopyWebpackPlugin`: Copies static assets from `public` directly to `dist`.

---

### Development Configuration: `webpack.dev.js`

Create `build/webpack.dev.js`:

```javascript
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    // Development server configuration
    devServer: {
        contentBase: "./dist",
        open: true,
        hot: true,
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});
```

Here we set `mode: "development"`, configure fast source maps (`cheap-module-eval-source-map`), enable `webpack-dev-server` with Hot Module Replacement (HMR), and merge everything with `webpack.common.js` using `webpack-merge`.

---

### Production Configuration: `webpack.prod.js`

Create `build/webpack.prod.js`:

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: "production",
    entry: "./src/main.js",
    optimization: {
        // Code splitting
        splitChunks: {
            chunks: 'all'
        },
        // Tree shaking
        usedExports: true
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
});
```

In production, we enable tree shaking and code splitting (`splitChunks`), and use `CleanWebpackPlugin` to purge stale files in `dist` before each build.

---

### Configure npm Scripts

Add the following scripts to `package.json`:

```json
"scripts": {
    "serve": "webpack-dev-server --progress --config build/webpack.dev.js",
    "build": "webpack --progress --config build/webpack.prod.js"
}
```

- `npm run serve`: Starts the development dev-server.
- `npm run build`: Generates the production bundle.

> **Note**: Because our entry point is configured as `./src/main.js`, create a `src` directory with `main.js` inside, and add a quick `console.log` to verify your setup before proceeding.

## 3. Configuring main.js and Writing a Vue Hello World

Create `src/App.vue` as the root component container:

```vue
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
</style>
```

Next, organize `src` by creating `pages` and `router` directories:
- `pages`: Holds Vue view components.
- `router`: Holds routing configuration.

Create `src/pages/list/index.vue`:

```vue
<template>
  <div class="box">
    Hello World
  </div>
</template>

<script>
export default {
};
</script>

<style lang="stylus" scoped>
.box
  color red
</style>
```

Define the router in `src/router/index.js`:

```javascript
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import list from "@/pages/list/index.vue";

export default new VueRouter({
    routes: [{
        path: "/",
        component: list
    }]
});
```

Finally, configure `src/main.js`:

```javascript
import Vue from 'vue';
import router from "./router";
import App from './App.vue';

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
});
```

Run `npm run serve`. If you see "Hello World" rendered in red in your browser, your scaffolding is working!

## 4. Recommended Project Architecture

Every developer has their own architectural habits. Here is a structure I find clean and scalable:

Inside `src`, create three directories: `api`, `assets`, and `config`:
- `api`: Service layer encapsulating backend API endpoints.
- `assets`: Static assets including icons, global styles, and utility scripts.
- `config`: Environment and application configuration constants.

First, create a generalized HTTP client in `src/assets/js/request.js`:

```javascript
import axios from "axios";

/**
 * Universal Axios request wrapper
 * @param {string} url - Request URL
 * @param {object} data - Request payload
 * @param {string} method - HTTP method
 * @param {string} locktype - Encryption type
 */
export default function request(url, data, method, locktype) {
    return new Promise((resolve, reject) => {
        axios.request({
            url,
            method,
            data,
        }).then(res => {
            if (res.data.code === 200 && res.status === 200) {
                resolve(res.data.data);
            }
        }).catch(error => {
            console.error(error);
            reject(error);
        });
    });
}
```

Then define specific API functions in `src/api/index.js`:

```javascript
import request from "@/assets/js/request";

export function getList(url, data, method) {
    return new Promise((resolve) => {
        request(url, data, method).then(res => {
            resolve(res);
        });
    });
}
```

Typically, scripts under `api/` are modularized by domain—such as `auth.js`, `home.js`, `shop.js`, etc. In your Vue components, simply import the required API function, invoke it with parameters, and update component state.

> **Benefits of this Architecture**:
> Vue components focus strictly on view presentation and user interactions rather than data manipulation or raw HTTP logic. This separation keeps components clean, facilitates endpoint reuse, and significantly improves maintainability.

---

## Directory Structure & Conclusion

Here is the resulting directory structure of our scaffold:

![Directory Structure](https://www.yinzhuoei.com/usr/uploads/2020/01/2395771588.png)

The complete scaffolding code is available on GitHub:
- [GitHub Repository for this Vue Scaffolding](https://github.com/1018715564/vue-cli)
