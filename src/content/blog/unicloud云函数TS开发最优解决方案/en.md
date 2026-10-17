---
title: "An Optimal TypeScript Development Setup for uniCloud Cloud Functions"
description: "I've recently been exploring uniCloud cloud function development and wanted to add type inference to my JS code. This post documents how I develop cloud functions in TypeScript. 1. Choosing Between TypeScript and Flow.js. Flow.js has syntax very similar to TypeScript. I see it as a way to add type inference to existing projects, since you only need to install a few packages…"
date: 2020-12-12
lang: en
translationKey: "2020-12-12_470_unicloud云函数TS开发最优解决方案"
categories:
  - "Frontend"
  - "Life"
views: 7773
draft: false
---

![WeChat screenshot_20201212173122.png](http://static.yinzhuoei.com/typecho/2020/12/12/655123721150242.png)

I've recently been exploring uniCloud cloud function development and wanted to add type inference to my JS code. This post documents how I develop cloud functions in TypeScript.

1. Choosing Between TypeScript and Flow.js

Flow.js has syntax very similar to TypeScript. I see it as a way to add type inference to existing projects, since installing a few packages and adding a Flow annotation to a file is enough to enable type inference for that file. But the project I'm working on isn't a legacy project, so I might as well use TypeScript from the start.

For our cloud functions, we chose explain, a very lightweight, extensible framework available in the plugin marketplace. It already supports single-route handling, RESTful APIs, and basic filtering interceptors. It doesn't currently offer a TypeScript setup, so I took the liberty of putting together a workaround for its author. This setup has the following advantages:

1. TypeScript compilation is tens to hundreds of times faster than with the official TSC compiler.
2. It supports rebuilding when files change.
3. It works without adding any dependencies to the cloud function project itself.

uni's official size limit for cloud functions is 10 MB, so we can't install all the dependencies inside the project. We need to install them globally:

```jsx
npm i -g typescript esbuild-node-tsc nodemon
```

1. esbuild-node-tsc is an esbuild-based TypeScript compiler. The well-known esbuild offers excellent compilation performance, making TypeScript compilation much faster in large projects.
2. nodemon helps us recompile TypeScript whenever files change.

These two tools offer plenty of possibilities, especially nodemon. For this setup, we only need to configure a few files to get the project running.

![WeChat image_20201212171411.png](http://static.yinzhuoei.com/typecho/2020/12/12/651933137474804.png)

This is the directory structure of our cloud function, using the explain.js framework mentioned above. In etsc.config.js, we can configure the output JS version, output directory, and whether to minify:

```jsx
module.exports = {
  outDir: "./dist",
  esbuild: {
    minify: true,
    target: "es2015",
  },
  assets: {
    baseDir: "services",
    filePatterns: ["**/*.json"],
  },
};
```

After we write TypeScript files in the services directory, esbuild-node-tsc puts the generated JS files in dist. We just need to change explain.js's default configuration:

```jsx
config.init({
  baseDir: __dirname,
  serviceDir: "/dist/"
});
```

This makes explain look for files in dist rather than services.

Run the compilation command from this root directory:

```jsx
etsc
```

If we run the function now, we'll find that we've met our goals:

1. We develop in TypeScript.
2. The cloud function runs and uploads successfully.

But we also want changes in services to trigger compilation into dist. That's where nodemon comes in, using nodemon.json:

```jsx
{
    "watch": ["services"],
    "ext": "ts,js,json",
    "exec": "etsc",
    "legacyWatch": true
  }
```

This watches the services directory for files with the ts, js, and json extensions, then runs etsc.

Next, add the command to run nodemon to package.json:

```jsx
"scripts": {
    "dev": "nodemon"
  },
```

Now we can start the nodemon watcher and enjoy developing cloud functions in TypeScript~~

![WeChat screenshot_20201212172316.png](http://static.yinzhuoei.com/typecho/2020/12/12/652052467024791.png)

![WeChat screenshot_20210331210548.png](https://static.yinzhuoei.com/typecho/2021/03/31/961232385599512/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210331210548.png)
