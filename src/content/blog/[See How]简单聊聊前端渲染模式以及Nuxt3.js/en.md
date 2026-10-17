---
title: "[See How] A Quick Look at Frontend Rendering Modes and Nuxt 3.js"
description: "Original post: Yinzhuoei—A Quick Look at Frontend Rendering Modes and Nuxt 3.js. Introduction: My recent work has involved SSR, so this article summarizes what I have learned and takes an introductory look at Nuxt 3, which is still in beta. A recent talk by Rich, the creator of Rollup, explored SSR…"
date: 2021-11-10
lang: en
translationKey: "2021-11-10_692_[See How]简单聊聊前端渲染模式以及Nuxt3.js"
categories:
  - "Frontend"
  - "Life"
  - "Deep Dive"
views: 15070
draft: false
---

Original post: [Yinzhuoei—A Quick Look at Frontend Rendering Modes and Nuxt 3.js](https://www.yinzhuoei.com/index.php/archives/692/)

## Introduction

My recent work has involved SSR, so this article is a summary of what I have learned, along with an introductory look at Nuxt 3, which is still in beta. A talk by Rich, the creator of Rollup, gained quite a bit of attention recently. In it, he walks through SSR and CSR, discusses their pain points, and introduces a new concept: the “transition app.” If you are interested, [watch the video here](https://www.youtube.com/watch?v=860d8usGC0o&t=34s).

Before we begin, let me briefly explain terms such as “SPA,” “MPA,” “SSR,” and “CSR.” If you work in web frontend development, these acronyms have probably followed you around for much of your career. There are countless articles about them online. If you are still a little hazy on these concepts—or have never heard of them—do not close this page. I hope this article can help.

## SPA and MPA

MPA stands for “multipage application.” What is a multipage application? Literally, it is an application with multiple pages. That is a rough way to understand it from a technical perspective, too. SPAs and MPAs differ in many ways, and each has its advantages and disadvantages.

With an MPA, you maintain multiple HTML pages separately, and every page load or navigation requires loading an entire page. It is particularly SEO-friendly, however: you can give each HTML page its own metadata to help search engines index it. This is why MPAs are common on large e-commerce and news websites.

Unlike an MPA, an SPA can dynamically update part of a page using Ajax or other techniques without reloading the page. Even navigation does not reload the entire HTML document. SPAs are good at preserving state and perform particularly well on mobile devices. Mobile data used to be precious, so switching pages with minimal overhead was a substantial improvement over MPAs in both user experience and cost.

## SSR

In the earlier days of the web, developers often built applications using JSP or other template engines. We generally call this **SSR (server-side rendering)**. Its architecture looks roughly like this:

![untitled.png](https://static.yinzhuoei.com/typecho/2021/11/08/519524039097615/untitled.png)

After a user's request reaches the backend server:

1. The backend queries the data layer for the content the user needs.
2. It processes the business logic.
3. It assembles the page using a template.
4. It returns an HTML string to the client.
5. The browser renders the page and loads JavaScript to handle the remaining interactions.

You may have noticed that the frontend has very little to do in this SSR model. Put generously, it handles interactions; less generously, you are a “click-event engineer.” That is why almost every backend developer from that generation also knew frontend development, and plenty were excellent at JavaScript. As more applications adopted SSR, its drawbacks became apparent:

1. The backend has too much on its plate. Even the best developers can only handle so much.
2. Tight coupling between frontend and backend makes maintenance harder.
3. Updating content or navigating requires a page reload.
4. Server-side rendering is expensive.
5. ...

## CSR

The architecture of **CSR (client-side rendering)** looks roughly like this:

![csr.png](https://static.yinzhuoei.com/typecho/2021/11/08/55248977498837/csr.png)

CSR is closer to modern frontend development. When we use view frameworks such as Vue or React, CSR is usually the default. The process is roughly as follows:

1. The browser requests HTML and JavaScript from the frontend server. The HTML is initially empty, and the browser executes the JavaScript.
2. JavaScript renders the page.
3. The application interacts with APIs exposed by the backend.

## Differences Between SSR and CSR

CSR has a few obvious drawbacks.

### SEO

The HTML fetched from the frontend server is initially empty, which is bad for SEO. Older search-engine crawlers often read the page directly without waiting for JavaScript to finish, so all they find is an empty page. Although modern crawlers from Baidu, Google, and other search engines are powerful enough to support some CSR SPA pages, and other measures such as adding meta tags can help, SSR avoids this concern: it delivers a complete HTML page that can be rendered immediately.

### User Experience: The Blank Screen

With CSR, there is a blank-screen interval between constructing the initial HTML document and JavaScript finishing rendering the page, before any content appears. This makes for a poor user experience. With SSR, the browser can construct the DOM directly from the HTML it receives.

SSR, meanwhile, has its own drawbacks:

1. Cost: compared with CSR, generating HTML and fetching data add server load and increase load-balancing requirements.
2. Deployment: unlike CSR, it needs more than a static file hosting server.
3. Code complexity.
4. ...

## Building an SSR Demo Quickly with Vite

Vite SSR is still experimental and not ready for production. However, we can use it to build an SSR demo that helps us understand how SSR is put together. Once that is clear, we can introduce concepts such as “Nuxt” and “isomorphic rendering.” Vite provides plenty of SSR support, making this demo very straightforward. You can also refer to the [official documentation](https://cn.vitejs.dev/guide/ssr.html).

First, change the contents of index.html:

```html
<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <link rel=\"icon\" href=\"/favicon.ico\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>Vite App</title>
  </head>
  <body>
    <div id=\"app\"><!--ssr-outlet--></div>
    <script type=\"module\" src=\"/src/entry-client\"></script>
  </body>
</html>
```

Notice the comment inside the app div. We will replace it with the rendered HTML later.

Next, create server.mjs in the project root as the server entry point. Here is an example using Express:

```js
// server.mjs
import { readFileSync } from \'fs\'
import { resolve } from \'path\'
import express from \'express\'
import { createServer as createViteServer } from \'vite\'

const createServer = async () => {
  const app = express()
  const vite = await createViteServer({
    server: { middlewareMode: \'ssr\' }
  })
  // Use vite middleware
  app.use(vite.middlewares)
  app.use(\'*\', async (req, res) => {
    try {
      // Serve index.html - handled below
      const url = req.originalUrl
      // Read the template from the root directory
      let template = readFileSync(resolve(\'index.html\'), \'utf-8\')
      // Transform index.html to enable hmr
      template = await vite.transformIndexHtml(url, template)
      // Load the render function from entry-server
      const { render } = await vite.ssrLoadModule(\'./src/entry-server.js\')
      // Render based on url
      const appHtml = await render(url)
      // Replace the comment with the prepared html
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      res.status(200).set({ \'Content-Type\': \'text/html\' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  app.listen(3000)
}

createServer()
```

We also need to change main.js:

```js
// src/main.js

import App from \'./App.vue\'
import Router from \'./router\'
import { createSSRApp } from \'vue\'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Router)
  return { app, router: Router }
}
```

In main.js, we import createSSRApp from Vue, install the router, and return an object that entry-server will use later.

The router is slightly different from a conventional CSR application, too. We choose a different history implementation based on the environment:

```js
// src/router/router.js

import { createRouter, createWebHistory, createMemoryHistory } from \'vue-router\'

const Router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes: [
    {
      name: \'index\',
      path: \'/index\',
      component: () => import(\'../pages/index.vue\')
    }
  ]
})

export default Router
```

Next, create entry-client.js, which index.html will load, and entry-server.js inside src:

```js
// src/entry-client.js

import { createApp } from \'./main\'

const { app, router } = createApp()

router.isReady().then(() => {
  app.mount(\'#app\')
})
```

```js
// src/entry-server.js

import { createApp } from \'./main\'
import { renderToString } from \'vue/server-renderer\'

export const render = async (url) => {
  try {
    const { app, router } = createApp()
    // Navigate to url
    router.push(url)
    // Wait for the router to be ready
    await router.isReady()
    const ctx = {}
    // Return html
    const html = await renderToString(app, ctx)
    return html
  } catch (error) {
    // console.log(error)
  }
}
```

At this point, we can start a local server and render our page in the browser using SSR. Because the demo uses ESM, we need the mjs extension when running the server with Node:

```bash
node server.mjs
```

Once the server starts, visit the /index route to see the page.

> If your Node version does not support mjs, upgrade it first...

SSR example projects:

1. [The demo for this article](https://github.com/seho-code-life/vite-ssr-demo)
2. [The official demo](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)

## Drinking, Dehydrating, and Hydrating: SSR

By now, you probably have a rough understanding of the SSR process. The three analogies in this section will help make it clearer: `drinking, dehydration, and hydration`, as they are often described in SSR discussions.

When SSR builds a page on the server, data `flows down` from its source to fill the page. We can call this process `drinking` (render & beforeRender).
This is what happens when rendering a page on the server, as illustrated below:

![1.png](https://static.yinzhuoei.com/typecho/2021/11/10/35243711893279/1.png)

A full water balloon represents a fully populated web page.

SSR needs to output HTML directly, so we need to `dehydrate` the structure and data, as illustrated here:

![fpic6008.jpeg](https://static.yinzhuoei.com/typecho/2021/11/10/355283501440982/fpic6008.jpeg)

On the client, the SSR application needs to come back to life. We restore the dehydrated state, props, and other data, and render the components again. This process is called `hydration`.

## SSG

SSG combines advantages of CSR and SSR. Developers do not need to manage server-side operations; they only need a CDN or another static website hosting service. Static assets are prerendered at build time. Although the content users see is not updated in real time, SSG retains key strengths of both CSR and SSR, striking a balance between them. Because it involves prerendering, its overall workflow resembles SSR somewhat.

### It Has Drawbacks, Too

1. As the application becomes more complex, it may need to generate far more than one or two pages, placing greater demands on the build process.
2. Freshness is an issue: users may see content from the last build, so other rendering modes are still needed to fill the gap...

## Isomorphic SSR and CSR: Sharing Data

Put simply, isomorphic rendering means our frontend code can run on both the client and the server while preserving contextual state. The example above already runs the same code on both, but it does not synchronize state. In Nuxt, for example, hooks such as `asyncData` can run on the server and share the returned data with the client.

```js
// In nuxt2, we can do this
async asyncData({ store, $axios, $oss }) {
    return {
        hello: \"world\"
    }
}
```

```html
<div>{{hello}}</div>
```

Now we need to update our demo:

```js
// index.vue
// Add an option
asyncData() {
   return {
     hello: \'message\'
   }
 }
```

Next, on the server, dehydrate the object returned by asyncData along with the page HTML:

```js
// entry-
import { createApp } from \'./main\'
import { renderToString } from \'vue/server-renderer\'

export const render = async (url) => {
  try {
    const { app, router } = createApp()
    router.push(url)
    await router.isReady()
    let data = {}
    // Find the matched route component and call asyncData
    if (router.currentRoute.value.matched[0].components.default.asyncData) {
      const asyncFunc = router.currentRoute.value.matched[0].components.default.asyncData
      data = asyncFunc.call()
    }
    const html = await renderToString(app)
    return { html, data }
  } catch (error) {
    // console.log(error)
  }
}
```

// We also need to update server.mjs.

```js
// server.mjs

app.use(\'*\', async (req, res) => {
    try {
      // Serve index.html - handled below
      const url = req.originalUrl
      let template = readFileSync(resolve(\'index.html\'), \'utf-8\')
      template = await vite.transformIndexHtml(url, template)
      const { render } = await vite.ssrLoadModule(\'./src/entry-server.js\')
      const { html: appHtml, data } = await render(url)
      // Append a tag to insert serialized data into the document
      const html = template.replace(`<!--ssr-outlet-->`, `${appHtml}<script>window.__data__=${JSON.stringify(data)}</script>`)
      res.status(200).set({ \'Content-Type\': \'text/html\' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
```

As you can see, we serialize data onto the window object. Next, when hydrating on the client, we need to merge in this data:

```js
// entry-client.js

router.isReady().then(() => {
  const component = router.currentRoute.value.matched[0].components.default
  let _data = {}
  // Check whether it is a function
  if (typeof component.data === \'function\') {
    _data = component.data.call()
  }
  // Check for dehydrated data
  if (window.__data__) {
    _data = {
      ..._data,
      ...window.__data__
    }
  }
  component.data = () => _data
  app.mount(\'#app\')
})
```

Now the template in index.vue can successfully display the `hello` field.

From here, you can apply the same idea to synchronize data with Vuex: serialize the data onto window, then commit it back to the store before mounting the client application.

## Nuxt 3

It is time to introduce Nuxt. Using Nuxt makes SSR much easier. This section will not teach you how to write a Nuxt application—it is a framework, after all, and straightforward enough to learn. Instead, I will walk through the changes from Nuxt 2 to Nuxt 3. If you have used Nuxt 2, this part may be particularly interesting. Nuxt 3 has not reached its stable release at the time of writing, so I may write another summary once it does.

### Updates Worth Watching

1. Better performance.
2. ESM support.
3. Better Vue 3 integration, which means we can use the Composition API.
4. The Vite development server.
5. Webpack 5 support, although I do not use it.

## Nitro Engine

After a quick read through the documentation, I want to share a little about Nuxt 3's new server engine, `Nitro Engine`. Nuxt 2 uses connect.js at its server-side core, while Nuxt 3 uses h3, a framework developed by the Nuxt team. It is highly portable, very lightweight, and supports middleware written for Connect. In other words, Nuxt 3's h3-based server can be moved seamlessly to environments that support JavaScript, such as workers and serverless platforms.

Let us try building an API in Nuxt 3:

```js
// server/api/hello.ts
export default (req, res) => {
  return \'Hello World\'
}
```

It also supports asynchronous handlers and Node.js-style responses:

```js
export default async (req, res) => {
  res.statusCode = 200
  res.end(\'hello world\')
}
```

Nuxt 3 also lets you write middleware in the same server folder, with automatic imports. This update really gets creative with the file system: plugins no longer need to be declared again in the configuration, as they did in Nuxt 2, and components, composables—the new Nuxt 3 folder for shared hooks—and more can all be imported automatically.

Imagine building a Nuxt 3 application with the Vue 3 Composition API: the developer experience should improve by several notches.

To wrap up, let us try deploying a Nuxt application to Cloudflare as a worker. After building, you will find a very tidy output folder, unlike Nuxt 2, where moving and deploying an application could be a real headache.

In the final demo, you can view the page and visit the [api/hello](https://nuxt3-demo-playground.seho.workers.dev/api/hello) route to try the API we just defined in Nuxt.

[Visit the demo](https://nuxt3-demo-playground.seho.workers.dev/)
[Deploying to Cloudflare—documentation](https://v3.nuxtjs.org/docs/deployment/cloudflare)
[Demo repository](https://github.com/seho-code-life/nuxt3-demo)

## Closing Thoughts

Another fairly lightweight post—I hope to write some higher-quality summaries in the future. The goal here is for you to recognize common frontend rendering modes and understand how they work. It does not matter whether you know a particular framework. Once you understand the ideas behind the technology, learning a framework becomes much easier, does it not?
