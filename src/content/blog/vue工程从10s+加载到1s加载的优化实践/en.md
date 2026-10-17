---
title: "Optimization Practice: Accelerating a Vue Project from 10s+ to 1s Load Time"
description: "A case study on diagnosing and optimizing a production Vue project using Vue CLI 3 and Ant Design, slashing the initial bundle size and load time from over 10 seconds down to 1 second through code splitting, compression, OSS, and more."
date: 2020-06-06
lang: en
translationKey: "2020-06-06_241_vue工程从10s+加载到1s加载的优化实践"
categories:
  - "Frontend"
views: 7081
draft: false
---

The background of this article comes from a company project built on Vue + Vue CLI 3 + Ant Design. Due to quirks in an earlier backend API, Ant Design's `upload` component couldn't satisfy our business requirements, so we brought in iView's upload component instead. Consequently, Ant Design was imported in its entirety while iView had its upload module imported on demand. When we ran the production build, we discovered that `chunk-vendors.js` was enormous—close to 8 MB! This caused the first screen loading time to drag on for over 10 seconds. To solve this issue, we analyzed and optimized the application across several key areas.

## Bundle Analysis

For module analysis, we used the `webpack-bundle-analyzer` plugin. Simply configure it in your Webpack `plugins` array. Because this plugin is very straightforward to set up, here is a helpful reference:
[Introduction to webpack-bundle-analyzer](https://www.jianshu.com/p/e85d6a4f68c0)

Mixing two heavy UI component libraries like Ant Design and iView is generally discouraged in production. When you run this analysis plugin, inspect your JavaScript bundles to see which ones are the largest. If your `chunk-vendors.js` is bloated, follow the configuration steps below to optimize it step by step.

## Webpack 4 splitChunks and runtimeChunk (Caching JS by Reference Count)

When I first learned about this topic, I relied on fragmented notes and bumped into quite a few gotchas.
First, let's understand the default configuration of `splitChunks`. Frankly speaking, you won't need all of these options, and many configurations can feel confusing at first glance:

```javascript
optimization: {
    splitChunks: { // If this is an empty object, code splitting follows default configurations
        chunks: "all", // Split 'all', 'async', or 'initial' module imports
        minSize: 30000, // Minimum module size in bytes to trigger splitting; divide by 1000 for KB
        // Similarly there is maxSize; if a chunk exceeds this, it will be split further
        minChunks: 1, // Minimum number of chunks that must share a module before splitting
        maxAsyncRequests: 5, // Maximum number of parallel requests when loading on demand (default 5, avoid changing lightly)
        maxInitialRequests: 3, // Maximum number of parallel requests at an entry point (avoid changing lightly)
        automaticNameDelimiter: '~', // Delimiter string for generated chunk names
        name: true, // Enables customizable chunk filenames
        cacheGroups: { // Cache groups: configure alongside `chunks` to group matched code together into files
            // Cache group: as the name implies, temporarily caches split code and bundles matched code into a single file
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10, // Priority: lower number means higher priority. Determines destination when matching multiple rules
                filename: "vendor.js" // Output filename for this split chunk group
            },
            default: { // Fallback configuration if the cache groups above are not matched
                minChunks: 2, // Minimum number of chunks sharing the module
                priority: -20,
                reuseExistingChunk: true // If the current chunk already contains modules extracted from the main bundle, reuse it rather than generating a new one
            }
        }
    }
}
```

We can extract heavy libraries identified during bundle analysis (such as Vue, Lodash, Moment, etc.) into dedicated chunks.
In `cacheGroups`, you can configure:

```javascript
vue: {
    test: /vue/,
    chunks: "initial",
    name: "vue",
    enforce: true,
}
```

Similarly, Lodash and Moment can be extracted separately:

![Bundle Analysis Result](https://www.yinzhuoei.com/usr/uploads/2020/06/1707593622.png)

Once files are properly split, our `chunk-vendors.js` shrinks drastically. We can also enable `runtimeChunk` to optimize smaller runtime files. By bundling Webpack's runtime boilerplate separately, multiple JavaScript files can share the same runtime bundle. See the [runtimeChunk documentation](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk).

## Image Compression

Image compression is a quick yet highly effective optimization technique, and here we use TinyPNG. In this section, we focus strictly on compression rather than CDN delivery.
TinyPNG offers an official website with a [free online compression service](https://tinypng.com/), allowing up to 50 images per session (max 5 MB each), which is usually plenty during daily development. If you want to integrate TinyPNG into your automated build workflow, you can [obtain an API key](https://tinypng.com/developers) and install the [TinyPNG npm package](https://www.npmjs.com/search?q=tinypng).

Here is a comparison of compression ratio and visual quality:

![TinyPNG Compression Example 1](https://www.yinzhuoei.com/usr/uploads/2020/06/4009353833.png)

![TinyPNG Compression Example 2](https://www.yinzhuoei.com/usr/uploads/2020/06/1581031140.png)

> As a side note, TinyPNG also provides a Photoshop plugin for around $60. Additionally, some community members have shared custom unlimited API wrappers and compression scripts.

## Gzip Compression

As a front-end engineer, understanding and knowing how to configure Gzip compression is essential. In production builds, Webpack already minifies and uglifies JS and CSS resources. Gzip compression reduces these assets by another 50% or more on top of that. With proper Webpack configuration, you can generate pre-compressed `.gz` assets as shown below:

![Gzip Assets Output](http://static.yinzhuoei.com/typecho/2020/06/07/43816917449480.png)

Not every browser handles Gzip identically, so servers inspect the request header:

> `Accept-Encoding: gzip, deflate`  
> This indicates Chrome's compression support. When the server detects this header in the request, it serves the corresponding Gzip file; otherwise, it falls back to the uncompressed JavaScript asset.

```bash
npm i compression-webpack-plugin -D
```

`vue.config.js` configuration:

```javascript
plugins: [
  new CompressionWebpackPlugin({
    algorithm: 'gzip',
    test: /\.js$|\.html$|\.json$|\.css/,
    threshold: 10240,
    minRatio: 0.8
  })
]
```

On the backend, Nginx requires only a few lines to enable Gzip serving.

> Note: Vue CLI 2 included a simple `productionGzip: true` flag in its config without needing manual plugin installation, whereas Vue CLI 3 requires configuring `compression-webpack-plugin` directly in `vue.config.js`.

## Vue Route Lazy Loading

When implementing route lazy loading, I was initially confused: if routes are lazy-loaded, why does the browser appear to request all JavaScript files upon initial page load?

![Route Lazy Loading Network Request](http://static.yinzhuoei.com/typecho/2020/06/07/45542483992753.png)

Doesn't that defeat the purpose of lazy loading? Upon closer inspection, I realized that during the initial load, those lazy-loaded chunks aren't actually evaluated or executed immediately:

![Lazy Loaded Script Inspection](http://static.yinzhuoei.com/typecho/2020/06/08/457452223843459.png)

Digging deeper into the runtime mechanics and discussing with fellow developers revealed the key logic:

1. First, dynamic imports append script tags on demand:

![Append Script Mechanism](http://static.yinzhuoei.com/typecho/2020/06/08/46335859755242.png)

2. Each split JS chunk pushes its module into the global `webpackJsonp` array:

```javascript
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[12]]); // 12 represents the module ID
```

Logging `webpackJsonp` in the console confirms this structure:

![webpackJsonp Console Output](http://static.yinzhuoei.com/typecho/2020/06/08/462552358863895.png)

The array stores both the module ID and the module definitions to be loaded. Inside each lazy-loaded chunk, the internal `require` function caches previously loaded modules. On subsequent accesses, it directly retrieves the cached result from this array:

```javascript
__webpack_require__.e and webpackJsonp
```

For a comprehensive source code breakdown of asynchronous module loading, see [this in-depth article](https://imweb.io/topic/5a4cce35a192c3b460fce39b).

> Note: Older Webpack articles refer to `CommonsChunkPlugin`, which was replaced by `splitChunks` in Webpack 4.

## IgnorePlugin: Excluding Unnecessary Packages

Webpack's `IgnorePlugin` helps exclude unnecessary submodules—such as unused locales—from being bundled:

```javascript
const webpack = require('webpack');

plugins: [
  // Ignore locale files inside third-party packages
  new webpack.IgnorePlugin(/\.\/locale/, /moment/)
]
```

**Scenario:** If you only need Chinese or English in `moment.js`, this configuration strips out all other language packs, saving significant bundle size.

## OSS (Object Storage Service)

Alibaba Cloud's OSS provides highly reliable, scalable cloud storage. While I first encountered it through cloud promotional bundles years ago, utilizing OSS as an asset storage service during this project yielded immediate dividends. Currently, my blog also uses OSS for static asset hosting—at very low cost (e.g., 40 GB per year for around 9 RMB).

Because OSS has been proven through years of massive traffic spikes (like Alibaba's Double 11 shopping festival), its multi-redundant, highly available architecture ensures durable storage. Compared to self-hosted server storage, where hardware failures or disk issues require costly manual recovery, OSS provides built-in durability, encryption, and enterprise-grade security.

In this optimization journey, moving heavy static assets to OSS played a massive role in dropping load times from 10s+ to ~1s.

## HTTP/2

Although HTTP/2 was not enabled in that particular deployment, reviewing HTTP/2 fundamentals is crucial for modern web performance. In the HTTP/1.1 era, classic optimization advice included CSS sprites, inlining styles, and concatenating all scripts into a single file to minimize HTTP requests.

In HTTP/1.1, head-of-line blocking meant multiple TCP requests had to proceed linearly; a resource had to finish downloading before the next could start over that connection. Hence, "bundling everything together" was standard practice. In HTTP/2, however, these workarounds are no longer recommended.

![HTTP/1 vs HTTP/2 Comparison](http://static.yinzhuoei.com/typecho/2020/06/13/59238963901370.jpg)

Key HTTP/2 features that change performance optimization:

1. **Multiplexing**: Allows multiple HTTP requests and responses to share a single TCP connection concurrently, eliminating TCP handshake overhead.
2. **Header Compression (HPACK)**: Drastically reduces header overhead across multiple requests.
3. **Stream Prioritization**: The browser can specify resource priority, ensuring critical files (like primary CSS and fonts) arrive first.
4. **Server Push**: The server can proactively push supplementary assets to the client before they are requested.

How does HTTP/2 reshape traditional optimization rules?

### 1. No Need to Concatenate Everything into Monolithic Files
Bundling all CSS into one file, all JavaScript into one massive chunk, or combining icons into CSS sprites is outdated. If someone insists on CSS sprites today, their frontend toolchain is noticeably behind the curve.

![Granular Assets](http://static.yinzhuoei.com/typecho/2020/06/13/59678197871446.jpg)

Under HTTP/2, combining files may slightly improve compression ratios, but it ruins browser caching. If a single line changes inside a 2 MB bundled script, the user must re-download the entire file. HTTP/2 encourages **granular delivery**, maximizing cache reuse: only the modified module gets invalidated. Furthermore, monolithic bundles force users to download code for pages they may never visit, hurting initial load times.

![Asset Caching Strategy](http://static.yinzhuoei.com/typecho/2020/06/13/59789100759013.jpg)

A good strategy is separating frequently updated business code from rarely modified vendor libraries (`node_modules`), serving the vendor chunks via CDN.

### 2. Style Inlining Is No Longer Advised
In HTTP/1, inlining styles like `<body style="color: red">` saved a network round-trip for critical CSS.

![Inline Styles vs Separate Files](http://static.yinzhuoei.com/typecho/2020/06/13/598831658928204.jpg)

However, when multiple HTML pages inline the same CSS, styles cannot be cached independently. Inlining also bypasses HTTP/2 stream prioritization because inline styles inherit the priority of the HTML document itself. With HTTP/2 Server Push, the server can push external CSS files alongside HTML without breaking prioritization, while keeping them independently cacheable.

### 3. Domain Sharding Is Obsolete
Browsers limit concurrent TCP connections per domain (typically 6 in HTTP/1.1), which led developers to shard assets across multiple domains (e.g., `cdn1.example.com`, `cdn2.example.com`). Under HTTP/2, multiple domains trigger unnecessary DNS lookups and multiple TCP handshakes, negating multiplexing benefits and breaking stream prioritization.

Of course, baseline optimizations like CDNs and HTTP cache headers remain universally effective across both HTTP/1.1 and HTTP/2.

## Conclusion

In technical interviews today, bundling tools (Webpack, Vite), browser performance metrics, CDNs, and optimization strategies have become standard evaluation criteria. Relying on dated tricks like CSS sprites or monolithic file concatenation no longer cuts it.

Starting from a real-world Vue application, this article outlined practical performance optimization strategies—from identifying bottlenecks to implementing code splitting, compression, and modern network delivery. These techniques are just the starting point; performance tuning is an ongoing journey.

## References

- [Getting Started with Webpack splitChunks](https://juejin.im/post/5af1677c6fb9a07ab508dabb)
- [Webpack Output File Source Code Analysis](https://imweb.io/topic/5a4cce35a192c3b460fce39b)
- [Alibaba Cloud OSS Advantages and Architecture](https://help.aliyun.com/document_detail/31818.html)
- [HTTP/2 Performance Optimization Guide](https://juejin.im/entry/56ce7d1a1532bc005372a7fa)
