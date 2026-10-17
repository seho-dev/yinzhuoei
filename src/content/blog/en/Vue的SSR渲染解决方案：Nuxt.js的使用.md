---
title: "Server-Side Rendering for Vue: Getting Started with Nuxt.js"
description: "Vue is lightweight and well suited to single-page applications. But sites that rely on search traffic, such as news sites, forums, and online stores, need SSR to address its limitations. Nuxt is a good option: a Vue-based server-side rendering framework that's easy to get started with and useful at work."
date: 2018-11-15
lang: en
translationKey: "2018-11-15_69_Vue的SSR渲染解决方案：Nuxt.js的使用"
categories:
  - "Frontend"
views: 5634
draft: false
---

![QQ screenshot, 2018-11-15 23:21:09](https://www.yinzhuoei.com/usr/uploads/2018/11/453159128.png)

Vue is lightweight and well suited to single-page applications (SPAs). But sites that rely on search engine traffic, such as news sites, forums, and online stores, need server-side rendering (SSR) to address Vue's limitations. Nuxt is a good option: a Vue-based server-side rendering framework that's easy to pick up and often used at work.

**Quick start**

Installation command:

```bash
vue init nuxt/starter
```

Enter the project directory and install the dependencies. The pages directory is where you'll work on page components. Edit pages/index.vue to display hello world, then start the server:

```bash
npm run dev
```

**Directory structure**

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

**Common configuration**

Change the port and IP address:

```json
"config": {
    "nuxt": {
        "host": "127.0.0.1",
        "port": "1818"
    }
}
```

**Routing**

Nuxt automatically generates routes based on your directory structure. For example, pages/news/index.vue is accessible at /news.

Use `<nuxt-link>` to navigate:

```html
<nuxt-link :to="{name: 'index', params: {id: 1234}}">跳转</nuxt-link>
```

The destination component can retrieve the value through `$route.params.id`.

**Dynamic routes**

An underscore in a page component's filename marks a dynamic route segment. For pages/news/_id.vue:

```javascript
validate ({ params }) {
    return /^\d+$/.test(params.id)
}
```

This regular expression validates the parameter. A nonnumeric value results in a 404 page.

**Transitions**

For global transitions, add the following to assets/css/main.css:

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

Include it in nuxt.config.js:

```javascript
css: ['assets/css/main.css']
```

For a component-specific transition, define `transition: 'name'` in the component.

**Default template and layout**

The default template is app.html in the root directory. Changes do not require a restart:

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

The default layout is layouts/default.vue. Changes require a restart:

```html
<template>
    <div>
        <p>因卓诶2</p>
        <nuxt/>
    </div>
</template>
```

The distinction is that the template customizes the document shell and head information, while the layout controls the page structure. Choose whichever fits your needs.

**Error pages and SEO**

Use layouts/error.vue to customize the error page.

Setting head information helps with SEO:

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

**The asyncData method**

Fetch data asynchronously:

```javascript
asyncData() {
    return axios.get('https://api.myjson.com/bins/8gdmr')
        .then((res) => {
            return { info: res.data }
        })
}
```

Using async/await is more concise:

```javascript
async asyncData() {
    let { data } = await axios.get('https://api.myjson.com/bins/8gdmr')
    return { info: data }
}
```

**Building**

```bash
npm run generate
```

---

Please let me know if you spot any mistakes. My WeChat ID is meng99huan. If you republish this article, please credit Yinzhuoei as the source.
