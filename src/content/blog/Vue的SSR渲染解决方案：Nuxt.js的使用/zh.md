---
title: "Vue的SSR渲染解决方案：Nuxt.js的使用"
description: "Vue 很轻量，适合做 SPA 单页应用。但新闻、论坛、商城这类需要搜索引擎流量的站点，需要 SSR 渲染来弥补 Vue 的短板。Nuxt 就是不错的选择——基于 Vue 的服务端渲染框架，上手快，工作里也常用。 快速开始 安装命令： 进入目录 install…"
date: 2018-11-15
lang: zh
translationKey: "2018-11-15_69_Vue的SSR渲染解决方案：Nuxt.js的使用"
categories:
  - "前端"
views: 5634
draft: false
---

![QQ截图20181115232109.png](https://www.yinzhuoei.com/usr/uploads/2018/11/453159128.png)

Vue 很轻量，适合做 SPA 单页应用。但新闻、论坛、商城这类需要搜索引擎流量的站点，需要 SSR 渲染来弥补 Vue 的短板。Nuxt 就是不错的选择——基于 Vue 的服务端渲染框架，上手快，工作里也常用。

**快速开始**

安装命令：

```bash
vue init nuxt/starter
```

进入目录 install 之后，组件和页面都在 pages 目录下，改 pages/index.vue 来输出 hello world，然后启动服务：

```bash
npm run dev
```

**目录结构**

```
├── .nuxt           // 自动生成
├── assets          // 未编译的静态资源
├── components      // Vue 组件
├── layouts         // 布局组件
├── middleware      // 中间件
├── pages           // 页面，主要工作区
├── plugins         // JS 插件
├── static          // 静态资源
├── store           // Vuex
├── nuxt.config.js  // 个性化配置
└── package.json
```

**常用配置**

修改端口和 IP：

```json
"config": {
    "nuxt": {
        "host": "127.0.0.1",
        "port": "1818"
    }
}
```

**路由**

Nuxt 自动装配路由，以目录为基准。在 pages/news/index.vue 可以通过 /news 访问。

跳转用 `<nuxt-link>`：

```html
<nuxt-link :to="{name: 'index', params: {id: 1234}}">跳转</nuxt-link>
```

目标组件通过 `$route.params.id` 取值。

**动态路由**

以下划线结尾的组件是动态路由。pages/news/_id.vue：

```javascript
validate ({ params }) {
    return /^\d+$/.test(params.id)
}
```

用正则校验参数，不是数字会显示 404。

**动画效果**

全局动画，assets/css/main.css：

```css
.page-enter-active,
.page-leave-active {
    transition: opacity 2s;
}
.page-enter,
.page-leave-active {
    opacity: 0;
}
```

在 nuxt.config.js 引入：

```javascript
css: ['assets/css/main.css']
```

局部动画，在组件里定义 `transition: '名字'` 即可。

**默认模板和布局**

默认模板：根目录 app.html，不需要重启：

```html
<!DOCTYPE html>
<html>
<head>{{ HEAD }}</head>
<body>
    <p>因卓诶</p>
    {{ APP }}
</body>
</html>
```

默认布局：layouts/default.vue，需要重启：

```html
<template>
    <div>
        <p>因卓诶2</p>
        <nuxt/>
    </div>
</template>
```

区别：模板定制头部信息，布局管页面结构，看情况选用。

**错误页面和 SEO**

layouts/error.vue 用来重写错误页面。

设置 head 信息有利于 SEO：

```javascript
head() {
    return {
        title: this.title,
        meta: [
            { hid: 'description', name: 'news', content: 'This is news page' }
        ]
    }
}
```

**asyncData 方法**

异步获取数据：

```javascript
asyncData() {
    return axios.get('https://api.myjson.com/bins/8gdmr')
        .then((res) => {
            return { info: res.data }
        })
}
```

用 async/await 更简洁：

```javascript
async asyncData() {
    let { data } = await axios.get('https://api.myjson.com/bins/8gdmr')
    return { info: data }
}
```

**打包**

```bash
npm run generate
```

---

有错误欢迎指出，微信：meng99huan，转载说明出处因卓诶。
