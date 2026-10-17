---
title: "[Pitfall Avoidance Guide] Developing Mobile Apps with uni-app's nvue and Weex"
description: "A comprehensive guide on developing hybrid mobile apps with uni-app, nvue, and Weex. Covers the v3 compiler engine, fast startup mode, compilation differences, styling constraints, and cross-communication between Vue and nvue."
date: 2020-01-27
lang: en
translationKey: "2020-01-27_171_【重跳坑指南】使用uniapp中的nvue结合weex开发APP"
categories:
  - "Life"
views: 8273
draft: false
---

Reference Documentation:
- [Notes on using Weex/nvue in uni-app](https://uniapp.dcloud.io/use-weex)
- [Official Weex Documentation](https://weex.apache.org/zh/guide/introduction.html)
- [v3 Engine Update Notes](https://ask.dcloud.net.cn/article/36599)
- [Nvue Fast Startup Mode Documentation](https://ask.dcloud.net.cn/article/36749)

As a developer with a year of uni-app experience who transitioned back to standard web frontend development for a while, I had stepped away from DCloud's toolchain. However, since uni-app still played a central role in this year's roadmap, I sat down to review the update logs from the past six months. What immediately caught my eye were the new **v3 engine** and the **fast startup mode**. Here is an account of my journey diving back in and navigating the pitfalls.

## Getting Started

This article assumes familiarity with uni-app basics and essential Vue concepts.

In previous projects, I hadn't used `nvue` (uni-app's native-rendered pages). For upcoming requirements, `nvue` was slated for complex components and computation-heavy pages in our app by adopting a hybrid `vue + nvue` approach. Before kicking off feature development, I wanted to see firsthand how capable the v3 engine and fast startup mode really were.

## Fast Startup Mode

Fast startup mode requires the v3 engine. It decouples the view layer rendering from waiting on the service layer to finish loading, allowing them to render in parallel. When fast mode is enabled, the startup acceleration is perceptibly faster. However, in an nvue landing page, avoid using **`vuex` and `getApp()`**, because the service layer might not have finished initializing yet.

## v3 Engine

Looking back at compilation modes in uni-app, it evolved from the original template compilation mode to the custom component mode. I reaped significant benefits from the custom component mode: previously, a form component with multiple date pickers and inputs suffered from severe lag, which was resolved immediately after upgrading to custom component mode; similarly, a cinema seat reservation page that rendered tons of DOM nodes and stuttered on selection achieved great performance under that mode. Because of that, I decided to dedicate more effort to exploring the latest update: the v3 engine.

Key advantages summarized:

1. Faster build & compilation speeds during development
2. Faster app runtime execution
3. Support for view-layer debugging
4. Expanded Vue syntax support

Among these, runtime smoothness mattered most to me. The official docs lacked extensive benchmarks, so the best way was to test it directly in project code.

New Vue syntax features were introduced, particularly filters and props improvements:

![WeChat Screenshot 20200127151840.png](https://www.yinzhuoei.com/usr/uploads/2020/01/2011416613.png)

![WeChat Screenshot 20200127151917.png](https://www.yinzhuoei.com/usr/uploads/2020/01/2634001594.png)

## Using nvue and Weex

HBuilder includes a configuration option: "Pure nvue project". Enabling it speeds up app startup and reduces bundle size. However, writing an entire app exclusively in `nvue` can be a developer nightmare: many web features are simply unsupported. I strongly recommend adopting a hybrid **`vue + nvue`** structure instead.

Jumping into `nvue` reveals quite a few stumbling blocks. Below, I've outlined common pitfalls alongside documentation notes. For deeper compatibility tables, refer to the first reference link above.

The official docs remark:
> If you are already a Weex developer capable of working around Weex quirks, then nvue is an optimal choice that significantly improves development efficiency and reduces costs.

At first, I didn't think much of it. Later on, when standard CSS selectors and shorthand properties failed compilation—turning what should have been a simple page into half a day of troubleshooting—it became evident: for developers accustomed to standard web CSS, Weex can be quite unforgiving.

---

**Compilation Mode Differences in nvue**

1. `uni-app`
2. `weex`

In our project, we chose the `uni-app` compilation mode for several reasons:

1. It allows writing components that can compile to WeChat Mini Programs and H5. In `weex` mode, components can only target the App.
2. It supports uni-app lifecycles, whereas `weex` mode only supports Weex lifecycles.
3. API invocations are consistent across both: `weexAPI`, `uni-app API`, and `plusApi` can all be invoked.
4. **Most importantly, cross-platform support:** `weex` targets only mobile apps, while `uni-app` targets all platforms.

> Note: If no compilation mode is explicitly declared, it defaults to `weex` compilation mode for backwards compatibility.

Configuration method:

```json
// manifest.json
{
    "app-plus": {
        "nvueCompiler": "uni-app" // "uni-app" or "weex"
    }
}
```

**What happens if a `.vue` and `.nvue` file share the same name?**  
If an `.nvue` file and a `.vue` file have identical names, the App build will prioritize the `.nvue` page, ignoring the `.vue` file (and vice-versa on other platforms). If an `.nvue` file exists alone on non-App platforms, its compilation depends on the compiler mode: under `uni-app` mode it compiles normally, whereas under `weex` mode it will not compile, because **the `weex` compilation mode does not support non-App platforms**.

**Important Considerations When Developing nvue (Where the Frustration Begins)**

- **Templates**: Standard syntax matches Vue. In `uni-app` nvue mode, you can use uni-app components (though some components do not have nvue implementations). In `weex` mode, use Weex component syntax.
- **JavaScript**: Follows standard Vue patterns and supports `weexAPI`, `uni-app API`, and `plusApi`. `weexAPI` requires module-level imports before use. Most `uni-app APIs` are supported with a few exceptions. `plusApi` is freely usable in custom component mode, though official docs are silent on its exact status under the v3 engine.
- **Styling**: This is where most issues occur. **nvue only supports Flexbox layout**, and many standard CSS rules are completely unsupported—especially shorthand properties. For example, with borders, we usually write:

```css
border: 1px solid red;
```

In Weex / nvue, you must write:

```css
border-width: 1px;
border-style: solid;
border-color: red;
```

**Communication Between nvue and vue**

In hybrid `vue + nvue` applications, cross-page communication is critical. I initially assumed standard route parameters would suffice, but it required extra handling:

1. **nvue -> vue** (data is a key-value object whose values must be strings):
   - In nvue: `uni.postMessage(data);`
   - In vue: listen via the `onUniNViewMessage` lifecycle method.

2. **vue -> nvue**:
   - In vue, use the 5+ API: `plus.webview.postMessageToUniNView(data, nvueId);`  
     *Parameters:* `data` is a key-value map with string values; `nvueId` is the webview ID of the nvue page, retrievable via `$getAppWebview()`.
   - In nvue, import the `globalEvent` module and listen to the `plusMessage` event to receive data sent from vue.

Check the detailed example here: [Passing values from vue to nvue](https://uniapp.dcloud.io/use-weex?id=vue-%e5%90%91-nvue-%e9%80%9a%e8%ae%af).

**Shared Variables and State Between vue and nvue**

- **Vuex**: Direct store imports are not supported; use helper functions like `mapMutations` or `this.$store`. Only supported under the `uni-app` compilation mode, not under `weex` mode.
- **Storage**: `uni.setStorage` / `uni.getStorage` can be used for communication between vue and nvue, though relying on disk persistence for transient messaging is not ideal.
- **globalData**: A mechanism inherited from mini-programs. It works as follows:

```javascript
// App.vue
export default {
    globalData: {
        text: 'text'
    },
    onLaunch: function() {
        console.log('App Launch')
    },
    onShow: function() {
        console.log('App Show')
    },
    onHide: function() {
        console.log('App Hide')
    }
}
```

In a vue page, you can retrieve values with `getApp().globalData.text`. If you need reactive binding in the page, reassign the variable inside the `onShow` hook. A few caveats regarding `onShow` (excerpted from the docs):

> To bind `globalData` to the view, reassign variables in the page's `onShow` lifecycle hook. Starting from HBuilderX 2.0.3, nvue pages under `uni-app` mode also support `onShow`. Under `weex` mode, `onShow` is unsupported, but developers familiar with 5+ can listen to the webview's `addEventListener('show', ...)` event to achieve the same effect.

---

That wraps up the core breakdown. For regular daily development, keeping these gotchas in mind will save you countless hours. If you encounter edge cases, feel free to reach out so we can troubleshoot together, or check the reference links at the top of the article.

Happy New Year everyone, and remember to wear a mask when heading outdoors!
