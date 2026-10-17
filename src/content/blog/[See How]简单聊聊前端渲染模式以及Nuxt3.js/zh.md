---
title: "[See How]简单聊聊前端渲染模式以及Nuxt3.js"
description: "原文链接:因卓诶-简单聊聊前端渲染模式以及Nuxt3.js 前言 最近的工作有涉及到ssr，所以这篇文章算是一个总结，并且对还在beta阶段的nuxt3做一个浅析。前段时间有一个蛮火的视频，关于rollup作者rich的一段演讲，在演讲里面rich梳理了ssr…"
date: 2021-11-10
lang: zh
translationKey: "2021-11-10_692_[See How]简单聊聊前端渲染模式以及Nuxt3.js"
categories:
  - "前端"
  - "唠嗑"
  - "精读"
views: 15070
draft: false
---

原文链接:[因卓诶-简单聊聊前端渲染模式以及Nuxt3.js](https://www.yinzhuoei.com/index.php/archives/692/)

## 前言

最近的工作有涉及到ssr，所以这篇文章算是一个总结，并且对还在beta阶段的nuxt3做一个浅析。前段时间有一个蛮火的视频，关于rollup作者rich的一段演讲，在演讲里面rich梳理了ssr和csr，并且讲述了痛点，和提出新的概念“transition app”，如果你有兴趣可以[看看这个视频](https://www.youtube.com/watch?v=860d8usGC0o&t=34s)

在文章开始前，我来简单介绍一下\"spa\", \"mpa\", \"ssr\", \"csr\"......这些个名词的意义。如果你是做web前端开发的，这几个词可能伴随着你的工作生涯很久很久了，相关文章互联网上多如牛毛，如果你对这些概念比较模糊甚至压根不知道，那么别关闭网页，我希望这篇文章能够拯救你。

## SPA与MPA

MPA称之为“多页应用”, 那么什么是多页应用呢？字面意思其实就是有多个页面的应用就是多页应用。从技术手段上来讲，你可以这么粗略地理解。SPA,MPA不同点太多了，而且各有利弊。

MPA应用你需要单独维护多个html页面，而且我们每加载/切换一次页面，都需要加载一整个页面。但是它对于seo特别友好，因为我们可以给每一个html页面设置不同的meta等信息，从而达到更好的收录效果；所以MPA多出现在大型的电商/新闻网站等。

不同于MPA，SPA可以使得我们通过ajax或者其他技术动态的更改某一个区域的内容而不需要重新加载页面，包括切换页面也不会重新加载整个html，它对状态的留存做的很好，而且在移动端表现特别优异（因为在以前流量是很珍贵的，可以以最小的损失切换页面，无论是用户体验还是成本相较于MPA都是极大的改善）

## SSR

在我们web较早的时候，开发者喜欢使用jsp或者其他模板渲染引擎来构造一个应用。我们一般称之为**SSR（服务端渲染）** 它的大致架构是如下这个样子

![untitled.png](https://static.yinzhuoei.com/typecho/2021/11/08/519524039097615/untitled.png)

用户发起一个请求抵达后端服务器后：

1. 后端会将用户所需要的内容通过数据层进行查询
2. 处理业务
3. 通过模板来拼接页面
4. 返回一个html字符串给客户端
5. 前端渲染然后加载js脚本完成剩余交互

你可能也发现了，在SSR服务端渲染中，前端负责的东西太过单薄，说得好听叫交互，难听点就是“点击事件工程师”。所以老一辈的后端基本人人都会前端，js的水平高的一抓一大把。随着使用SSR渲染页面的应用越来越多，弊端也出现了:

1. 后端做了太多事情了，再牛逼的人也吃不消
2. 前后端耦合，维护难度升级
3. 内容更新/跳转，都需要重新加载一次页面
4. 服务端渲染成本很高
5. ...

## CSR

**CSR（客户端渲染）**大致是以下的架构:

![csr.png](https://static.yinzhuoei.com/typecho/2021/11/08/55248977498837/csr.png)

CSR架构更贴近我们的现代前端开发，我们一般使用VUE, REACT这一类的前端视图框架时，都是默认CSR体系的。大致的流程是下面这样子的:

1. 浏览器向前端服务器请求html和js，html页面是空html，并且同时执行js
2. js渲染页面
3. 通过后端暴露的api进行交互

## SSR和CSR的区别

可以发现，使用CSR进行开发，会有几个明显的缺点

### SEO

因为从前端服务器获取的html最开始是空html，这非常不利于seo，很多搜索引擎的老版本蜘蛛会直接爬页面，不会等待js加载完，所以会直接爬出来一个空页面。尽管现在的百度，谷歌等搜索引擎的爬虫能力很强，能够部分支持CSR SPA页面，SEO效果虽然可以其他方式弥补 (比如加入meta标签等等); 但是我们使用SSR完全不用担心，因为获得的html页面是一个完整的，可以直接渲染的。

### 用户体验（白屏）

关于白屏，由于CSR从HTML构建完成到JS渲染页面完成（但还没呈现页面）这一段过程中，是处于一个白屏的时间，用户体验很不好，反之使用SSR获得HTML之后只需要直接构建DOM就可以了。

同样的，我们使用SSR还有不一样的缺点:

1. 成本问题（相比CSR多了构建HTML以及获取数据，需要更多的服务器负载均衡）
2. 部署问题（与CSR部署环境不同，不是仅仅需要一个静态文件托管服务器那么简单了）
3. 代码难度问题
4. ...

## 使用Vite快速构建一个SSR（实践SSR）

Vite SSR虽然现在是一个实验性质，不能用于生产环境。但是我们可以使用Vite做一个ssr的demo，帮助我们理解SSR的构建，理解之后我们再来引入\"Nuxt\", \"同构\"等概念。Vite里面为SSR提供了很多支持，所以我们要开发一个demo，会非常非常简单，你也可以参考这篇[官网文档](https://cn.vitejs.dev/guide/ssr.html)

我们首先需要更改index.html的内容

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

可以看到我们在app的div里写了一段注释，到时候我们渲染完之后的html将会replace这个注释。

然后需要在根目录新建一个server.mjs，作为我们的服务入口，用express作为一个例子:

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
  // 使用vite这个中间件
  app.use(vite.middlewares)
  app.use(\'*\', async (req, res) => {
    try {
      // 服务 index.html - 下面我们来处理这个问题
      const url = req.originalUrl
      // 读取根目录的模板
      let template = readFileSync(resolve(\'index.html\'), \'utf-8\')
      // 转换index.html 使其hmr有效
      template = await vite.transformIndexHtml(url, template)
      // 加载entry-server这个文件中的render方法
      const { render } = await vite.ssrLoadModule(\'./src/entry-server.js\')
      // 根据url进行渲染
      const appHtml = await render(url)
      // 替换注释为准备好的html
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

我们的main.js也需要更改

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

我们在main.js中，从vue导出createSSRApp函数，并且使用router，并且返回一个对象，这个对象之后将会被entry-server引用。

那么router也和我们传统的csr应用不太一样，我们根据env判断，传入了不同的路由类型:

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

然后我们需要在src中新建 entry-client.js（会被index.html引入） 以及 entry-server.js

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
    // url跳转一下路径
    router.push(url)
    // 路由准备好
    await router.isReady()
    const ctx = {}
    // 返回一个html
    const html = await renderToString(app, ctx)
    return html
  } catch (error) {
    // console.log(error)
  }
}
```

到此为止我们可以在本地启动一个服务器，并且可以将我们的页面以ssr的形式渲染到浏览器中了，由于我们的demo代码都是esm，所以我们使用node执行，必须要写成mjs的后缀。

```bash
node server.mjs
```

启动服务器之后，访问/index这个路由，你就能看到我们的页面了

> 如果你的node版本不支持mjs，请先升级...

ssr示例项目:

1. [本篇文章的demo](https://github.com/seho-code-life/vite-ssr-demo)
2. [官方的demo](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)

## 喝水，脱水，注水（SSR）

读到这里，你或许已经对ssr的流程有一个粗略的了解了；那么这一part的三个例子会加深你对ssr的理解，就是ssr常常说的`喝水，脱水，注水`。

我们ssr在服务端构造页面时，数据是从数据源`流下`，使得我们页面数据得到填充，这个过程就叫做`喝水`（render & beforeRender）
喝水的过程就是在服务端渲染页面做的事情，就好比下面这个图:

![1.png](https://static.yinzhuoei.com/typecho/2021/11/10/35243711893279/1.png)

饱满的水气球代表了一个健壮的网页

我们实现ssr需要直出html，所以需要把结构以及数据进行`脱水` (如图)

![fpic6008.jpeg](https://static.yinzhuoei.com/typecho/2021/11/10/355283501440982/fpic6008.jpeg)

然后到了客户端，我们需要ssr应用重新焕活，就要让原本脱水了的state,prop等等数据恢复到原来的生机，并且重新render组件，这个过程就叫做`注水`

## SSG

SSG这种渲染模式采取了CSR和SSR的共同优点，它不需要开发者介入服务器操作，开发者只需要准备cdn或者其他静态网页托管服务器，prerender出静态资源这一步将在构建时就已经做了，呈现在用户眼前的虽然不是实时变更的，但是也保留了CSR和SSR的精髓，一定程度上有了平衡。但是因为prerender的缘故，它和SSR的大致工作方式会相似一点。

### 也是有缺点的

1. 随着业务的复杂，需要生成的页面可能不单单只有1，2个，所以这对于构建的要求很高
2. 时效性问题，用户可能看到的页面是上一次生成的，所以这一部分仍需要其他模式来补充...

## 同构SSR和CSR（共享data）

同构说白了，就是将我们的前端代码，既能在客户端运行，也能在服务端运行，而且还能保持上下文的状态，我们在上面的改造例子已经实现了同一份代码在2个端的运行，但是并没有实现状态的同步，比如我们在nuxt中，使用`asyncData`这类钩子一样，能在服务端运行而且返回的data可以和客户端共享。

```js
// 在nuxt2中我们可以这样
async asyncData({ store, $axios, $oss }) {
    return {
        hello: \"world\"
    }
}
```

```html
<div>{{hello}}</div>
```

我们现在需要改造我们的demo：

```js
// index.vue
// 新增一个option
asyncData() {
   return {
     hello: \'message\'
   }
 }
```

其次在server端将asyncData返回的对象和其他页面html一起进行脱水：

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
    // 命中路由组件，且执行asyncData这个函数
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

// 我们的server.mjs也需要变更一下

```js
// server.mjs

app.use(\'*\', async (req, res) => {
    try {
      // 服务 index.html - 下面我们来处理这个问题
      const url = req.originalUrl
      let template = readFileSync(resolve(\'index.html\'), \'utf-8\')
      template = await vite.transformIndexHtml(url, template)
      const { render } = await vite.ssrLoadModule(\'./src/entry-server.js\')
      const { html: appHtml, data } = await render(url)
      // 拼接标签，把data序列化插入到文档中
      const html = template.replace(`<!--ssr-outlet-->`, `${appHtml}<script>window.__data__=${JSON.stringify(data)}</script>`)
      res.status(200).set({ \'Content-Type\': \'text/html\' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
```

可以看到我们将data序列化到了window对象中了，接下来我们需要在client端注水的时候，把新data进行替换

```js
// entry-client.js

router.isReady().then(() => {
  const component = router.currentRoute.value.matched[0].components.default
  let _data = {}
  // 判断是否是函数
  if (typeof component.data === \'function\') {
    _data = component.data.call()
  }
  // 判断是否有脱水的data
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

这个时候我们已经成功的看到index.vue中能够正确的在template中打印`hello`这个字段了

到这里，你就可以举一反三，使用vuex也可以进行同步数据，都是把data序列化到window中保存，然后在client挂载前重新commit到store里面就可以了。

## Nuxt3

是时候引入nuxt了，我们如果使用nuxt将会更容易的完成ssr需求，这一部分不会教大家怎么写nuxt，毕竟都是框架，都很简单。我会和大家梳理一下nuxt2和nuxt3的变化，如果你用过nuxt2，那么这一部分内容你可能会非常感兴趣。写这篇文章的时候，nuxt3并没有release，所以到时候release后会考虑再出一篇总结。

### 值得关注的更新内容

1. 更好的性能
2. esm的支持
3. vue3更好的集成，说明我们可以使用composition api了
4. vite开发服务器加持
5. webpack5 支持（尽管我不用）

## Nitro Engine

简单翻阅了一下文档，和大家分享一下，在nuxt3中的新服务端引擎 `Nitro Engine`, nuxt2中服务端核心使用的是connect.js，而nuxt3使用的是nuxt团队自研的h3框架，特点就是具有很强的可移植性，而且非常轻量级，并且还支持connect编写的中间件。也就是说nuxt3基于h3编写的server端，可以无缝地移植到支持js运行环境的地方，比如说woker，serverless...

我们先试试，开发一个在nuxt3中使用的api

```js
// server/api/hello.ts
export default (req, res) => {
  return \'Hello World\'
}
```

同样，支持异步，也支持nodejs风格的调用

```js
export default async (req, res) => {
  res.statusCode = 200
  res.end(\'hello world\')
}
```

nuxt3也支持在同一个server文件夹中编写middleware，而且是自动导入的。nuxt3这次的更新，属于是把文件系统玩出花了，不光plugins不需要重复声明了（nuxt2要在config重复声明），而且components，composables（nuxt3新增的文件夹，可以存放公共hook）... 都可以支持自动导入。

试想一下，如今写nuxt3应用，搭配vue3 composition api，将会使开发体验上升好几个台阶。

文末，我们可以试试打包一个nuxt应用到cloudflare 作为woker运行是什么效果？我们在build之后会发现output文件夹很简洁（不像nuxt2迁移部署都很令人头疼）

我们不仅可以在最后的demo中看到页面，也可以访问 [api/hello](https://nuxt3-demo-playground.seho.workers.dev/api/hello) 这个路由查看刚刚我们在nuxt中定义的api

[点击访问](https://nuxt3-demo-playground.seho.workers.dev/)
[部署到cloudflare-文档](https://v3.nuxtjs.org/docs/deployment/cloudflare)
[demo地址](https://github.com/seho-code-life/nuxt3-demo)

## 结语

又是水文一篇，希望以后可以出一些高质量的总结文章，希望这篇文章所讲述的前端常见的渲染模式，你能够知道，并且知道原理，这也就是本文最终的目标。框架会不会都没关系，我们要洞悉一切技术背后的真相，再去研究框架不是手到擒来么？
