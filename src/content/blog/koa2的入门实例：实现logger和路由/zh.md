---
title: "koa2的入门实例：实现logger和路由"
description: "Koa2 是 express 原班人马打造的，只有 600-700 行代码，超轻量级。做小程序、博客等轻量级程序，Koa2 是个不错的选择。 快速开始 安装： 中间件概念 类似洋葱圈模型：请求从外层进入内层，再从内层穿回外层。执行 next() 进入下一个中间…"
date: 2019-01-18
lang: zh
translationKey: "2019-01-18_81_koa2的入门实例：实现logger和路由"
categories:
  - "唠嗑"
views: 6153
draft: false
---

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2019/01/2239338298.jpg)

Koa2 是 express 原班人马打造的，只有 600-700 行代码，超轻量级。做小程序、博客等轻量级程序，Koa2 是个不错的选择。

**快速开始**

安装：

```bash
npm install koa
```

```javascript
const koa = require('koa')
const app = new koa()

app.use(async (ctx, next) => {
    ctx.body = '1'
    await next()
    ctx.body = ctx.body + '2'
})

app.use(async (ctx, next) => {
    ctx.body = '1'
    await next()
    ctx.body = ctx.body + '2'
})

app.listen('3000')
```

**中间件概念**

类似洋葱圈模型：请求从外层进入内层，再从内层穿回外层。执行 `next()` 进入下一个中间件，`ctx` 是上下文对象。

可以用 await 等待中间件执行完毕：

```javascript
app.use(async (ctx, next) => {
    ctx.body = '3'
    await delay()
    await next()
    ctx.body = ctx.body + '4'
})
```

**Logger 中间件**

```javascript
module.exports = async (ctx, next) => {
    const start = new Date().getTime()
    await next()
    const end = new Date().getTime()
    console.log(ctx.request.url, end - start, ctx.body.length)
}
```

在 server.js 中 `app.use` 引入即可。

**路由实现**

方式一：手动判断

```javascript
app.use(async (ctx, next) => {
    ctx.body = '1'
    if (ctx.request.url == '/qitiandasheng') {
        ctx.body = '齐天大圣'
    } else if (ctx.request.url == '/') {
        ctx.body = '首页'
    } else {
        ctx.body = '<h1>404</h1>'
    }
    await next()
})
```

方式二：使用 koa-router

```bash
npm install koa-router
```

```javascript
const Router = require('koa-router')
const router = new Router()

router.get('/sun', (ctx, next) => {
    ctx.body = '1'
    next()
})

app
    .use(router.routes())
    .use(router.allowedMethods())
```

Koa Router 地址：https://github.com/alexmingoia/koa-router
