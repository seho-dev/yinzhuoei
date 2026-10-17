---
title: "Understanding Vite's Key Features from Scratch, Part 1"
description: "Modern browsers already fully support the mechanism for exporting and importing objects. Evan You is not only a brilliant engineer but also a remarkably creative thinker: Vite is a bundle-free development server that uses modern browser capabilities to improve the development experience. When the browser encounters module imports, it issues HTTP requests that Vite intercepts…"
date: 2020-11-25
lang: en
translationKey: "2020-11-25_469_从0开始理解Vite的主要新特性（一）"
categories:
  - "Frontend"
  - "Deep Dive"
views: 9105
draft: false
---

The mechanism for exporting and importing objects is already fully implemented in modern browsers.

![](https://pic3.zhimg.com/v2-8a59c73997054d430999acc77e0b92b6_b.jpg)

![](http://static.yinzhuoei.com/typecho/2020/11/25/355261092154136.png)

> I have to say, Evan You is not only a brilliant engineer but also a remarkably creative thinker. He made Vite a bundle-free development server, using modern browser capabilities to deliver a better development experience.

When the browser parses code that retains its module keywords, it issues HTTP requests. Vite uses Koa to intercept those requests:

> .vue => intercept request => compile => return to client

This gives bundle-free Vite some clear advantages over its older, bundler-based counterpart, Vue CLI:

1. Vite takes advantage of the client's capabilities instead of bundling everything first. Serving native ES imports directly improves cold-start speed.

2. Vite compiles only the components needed by the current page, rather than bundling every component in the app. Compared with Vue CLI, the larger the project, the greater the speed difference.

3. HMR update speed does not depend on the number of modules. Vite keeps hot updates consistently fast.

Early in a project's life, startup speed may be the most noticeable benefit. As the application grows, you begin to appreciate the rest of what makes Vite powerful.

---

TypeScript Support

Vite includes TypeScript support out of the box:

```
<script lang=\"ts\">
import { ref } from \"vue\";

export default {
  name: \'App\',
  setup(){
    let hello = ref<string>(\"1\");
    console.log(hello.value);
  }
}
</script>
```

One detail worth mentioning: this built-in support does not use TypeScript's official tsc CLI, but esbuild, which I had heard about before. That is hardly surprising—Vite is clearly committed to speed all the way down.

The esbuild README makes an exciting claim:

> In practice, our current web build tools are 10–100 times slower than they could be.

![](https://pic4.zhimg.com/v2-ce4eadb18af31a1fc9e2c2ac021dd9c3_b.jpg)

![](http://static.yinzhuoei.com/typecho/2020/11/25/355262388385111.png)

Why is esbuild so fast?

- It is written in Go and compiled directly to native code.
- Go's concurrency makes parsing and mapping very fast.
- It avoids unnecessary configuration.
- Data transformations are straightforward and fast.

Although esbuild is an extremely fast bundler, it does not provide hot module replacement or a complete, ready-to-use development toolchain. At this point, I also think building an esbuild-based plugin system like webpack's would be very difficult. Vite therefore puts esbuild's strengths to work compiling TypeScript. Even in large projects, compiling TS files with Vite feels almost instantaneous.

---

Hot Module Replacement

First, we need to understand how hot module replacement differs from a traditional page refresh. Take webpack-dev-server as an example. Once the development server starts, the page establishes a WebSocket connection to it. When we change the code, the server sends the page a message, and the page refreshes. This live-reload mechanism is already helpful, but reloading is less pleasant when a page contains state:

> If the page has an open dialog or an editor, live reload will reload the entire page after a code change. Ideally, we would reload only the changed files without reloading the page itself. That is what webpack's hot replacement mechanism—usually called hot module replacement, or HMR—is designed to do.

webpack.config.js

```
module.exports = {
  mode: \"development\", // Development environment
  devtool: \"cheap-module-eval-source-map\",
  devServer: {
    contentBase: \"./bundle\",
    open: true,
    hot: true, // Enable hot module replacement
    hotOnly: true  // Do not reload the page if an update fails
  },
  module: {
    rules: [{
      test: /\\.css$/,
      use: [\"style-loader\", \"css-loader\"]
    }]
  }
}
```

The CSS loaders already implement hot-update handling using the HMR API:

```
// main.jsif (module.hot) {
  module.hot.accept(function() {
    // Watch for changes and apply updates
  });
  module.hot.dispose(function() {
    // Clean up  });
}
```

Now that we understand the basics of HMR, let's look at how Vite implements it.

Vite and webpack use the same underlying approach: the client and server establish a socket connection, and the server notifies the client when something changes:

```
// server/serverPlugin.ts
 watcher.on(\'change\', (file) => {
    if (!(file.endsWith(\'.vue\') || isCSSRequest(file))) {
      handleJSReload(file);
    }
  })
```

Inside handleJSReload, the **walkImportChain** function is called recursively. It checks which JS or Vue files import the changed file. If the recursive traversal finds no suitable importer, Vite performs a full reload:

```
send({
     type: \'full-reload\',
     path: publicPath
  })
```

If it finds a file importing that JavaScript module, it performs a hot update:

```
send({
    type: \'multi\',
    updates: boundaries.map((boundary) => {
      return {
        type: boundary.endsWith(\'vue\') ? \'vue-reload\' : \'js-update\',
        path: boundary,
        changeSrcPath: publicPath,
        timestamp
      }
    })
  })
```

On the client, Vite's central **handleMessage** function recognizes these message types:

- connected: WebSocket connection established
- vue-reload: a Vue file's script has changed
- vue-rerender: a Vue file's template has changed
- style-update: a CSS stylesheet has changed
- style-remove: a CSS stylesheet has been removed
- js-update: a JavaScript file has changed
- full-reload: refresh the page

The client handles each message type differently. It requests new files using the **timestamp**, while Vue files are updated through **HMRRuntime**.

---

Bare Module Imports

Vite also supports everyday features found in other bundlers. Browsers do not allow us to import bare module specifiers directly, for example:

```
import { add } from \"lodash\"
```

Vite has a particular advantage when handling bare imports of Vue. It not only rewrites ordinary module paths so that they resolve correctly, but also handles the Vue dependency specially:

> If Vue is not installed locally in the project, importing it will use the version that Vite depends on. This means a globally installed copy can be easier to access from a Vite project.

Vite rewrites module loading paths:

```
// src/node/server/serverPluginModuleRewrite.ts
 ctx.body = rewriteImports(
    root,
    content!,
    importer,
    resolver,
    ctx.query.t
  )
```

After rewriteImports processes the module's body, the result looks like this:

```
import vue from \"vue\" => import vue from \"@/modules/vue.js\"
```

The **rewriteImports** method uses **es-module-lexer**, also used in **esbuild**, for lexical analysis. I was not very familiar with esbuild, so I looked into this package and found a tiny lexer that can analyze JavaScript very quickly. Here is a simplified example from its official documentation:

```
// Pseudocode
// Same as in the vite source code
import {
  init as initLexer,
  parse as parseImports,
  ImportSpecifier
} from \'es-module-lexer\'

// Initialization required
await initLexer;
const [import, export] = parseImports(`
  import {a} from \"a\"
  export const add = 1;
`
console.log(import[0].s);
// The parse result contains these fields
// \"s\" is shorthand for \"start\"
// \"e\" is shorthand for \"end\"
// \"ss\" is shorthand for \"statement start\"
// \"se\" is shorthand for \"statement end\"
```

This lexical analysis is what lets Vite replace module import paths. Although the package is powerful, most developers do not need to work with lexical analysis day to day. For now, it is enough to know that Vite uses es-module-lexer to analyze imports before rewriting their paths.

---

Summary

Comparing Vite with webpack, I see webpack as a dedicated bundler. It has a rich ecosystem, and plugins let it do all sorts of things. But as Evan has pointed out, there are relatively few higher-level tools built on top of webpack, and using it involves substantial learning and configuration costs. Vite offers a smoother development experience, with powerful built-in HMR, TypeScript support, WebAssembly support, and more. Which tool you choose ultimately depends on your application's needs.

---

Vite is still evolving, but the principles behind its main features are unlikely to change. It has many other excellent features, and even the three covered here deserve a closer look. I will keep this Vite series going. Thanks for your support!
