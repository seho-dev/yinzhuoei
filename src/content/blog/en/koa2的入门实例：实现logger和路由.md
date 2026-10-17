---
title: "Getting Started with Koa2: Implementing a Logger and Routing"
description: "Created by the original Express team, Koa2 is ultra-lightweight with only 600–700 lines of code. It's a great choice for lightweight applications like mini-programs and blogs. Learn the basics of Koa2, the onion middleware model, custom loggers, and routing."
date: 2019-01-18
lang: en
translationKey: "2019-01-18_81_koa2的入门实例：实现logger和路由"
categories:
  - "Life"
views: 6153
draft: false
---

![download.jpg](https://www.yinzhuoei.com/usr/uploads/2019/01/2239338298.jpg)

Koa2 was created by the original Express team. With only 600–700 lines of core code, it is ultra-lightweight. For lightweight applications like WeChat mini-programs and personal blogs, Koa2 is an excellent choice.

**Quick Start**

Installation:

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

**Middleware Concepts**

Similar to the onion model: requests enter from the outer layer to the inner layer, and then travel back from the inner layer to the outer layer. Calling `next()` moves execution to the next middleware, and `ctx` is the context object.

You can use `await` to wait for middleware execution to finish:

```javascript
app.use(async (ctx, next) => {
    ctx.body = '3'
    await delay()
    await next()
    ctx.body = ctx.body + '4'
})
```

**Logger Middleware**

```javascript
module.exports = async (ctx, next) => {
    const start = new Date().getTime()
    await next()
    const end = new Date().getTime()
    console.log(ctx.request.url, end - start, ctx.body.length)
}
```

Simply import and register it in `server.js` with `app.use()`.

**Routing Implementation**

Approach 1: Manual condition checks

```javascript
app.use(async (ctx, next) => {
    ctx.body = '1'
    if (ctx.request.url == '/qitiandasheng') {
        ctx.body = 'Monkey King'
    } else if (ctx.request.url == '/') {
        ctx.body = 'Home'
    } else {
        ctx.body = '<h1>404</h1>'
    }
    await next()
})
```

Approach 2: Using `koa-router`

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

Koa Router repository: https://github.com/alexmingoia/koa-router
