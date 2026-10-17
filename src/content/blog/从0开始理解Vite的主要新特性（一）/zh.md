---
title: "从0开始理解Vite的主要新特性（一）"
description: "对象的导出和导入，而这个机制在高级浏览器已经完全实现了。 不得不说，尤大不仅是技术上的大神，而且富有创造和想象力。让vite变成了一个0捆绑的开发服务器，利用浏览器高级特性让开发体验变得更好 当浏览器解析保留了模块关键字的代码，从而会导致HTTP请求，vite…"
date: 2020-11-25
lang: zh
translationKey: "2020-11-25_469_从0开始理解Vite的主要新特性（一）"
categories:
  - "前端"
  - "精读"
views: 9105
draft: false
---

对象的导出和导入，而这个机制在高级浏览器已经完全实现了。

![](https://pic3.zhimg.com/v2-8a59c73997054d430999acc77e0b92b6_b.jpg)

![](http://static.yinzhuoei.com/typecho/2020/11/25/355261092154136.png)

> 不得不说，尤大不仅是技术上的大神，而且富有创造和想象力。让vite变成了一个0捆绑的开发服务器，利用浏览器高级特性让开发体验变得更好

当浏览器解析保留了模块关键字的代码，从而会导致HTTP请求，vite通过koa拦截了这些请求：

> .vue => 拦截请求 => 编译 => 返回给客户端

那么没有打包的vite和老东家的基于打包的vue-cli就有了一些明显的优势了：

1. vite利用了客户端能力不用打包其他服务，原生的ES Import直接输出提高了冷启动速度。

2. vite按需编译当前页面需要的组件，而不需要打包整个APP的组件，这样的提升对比cli无疑是项目越大速度差距越大。

3. HMR更新速度不会和模块数量牵扯，vite会让HMR一如既往的保持快速。

使用vite开发应用可能在前期除了启动速度，其他功能是要等到应用慢慢变大才能真实的感受vite的强大。

---

TS支持

vite内置TS的支持，开箱即用：

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

值得一提的是，内置的TS不是TS官方出的tsc cli，而是之前就听说过的ESBuild，现在vite的TS支持是ESBuild也不奇怪，毕竟是要一快到底么。

——ESBuild的ReadMe说了一句振奋人心的话

> 实际上，我们目前的网站构建工具比实际速度慢10-100倍

![](https://pic4.zhimg.com/v2-ce4eadb18af31a1fc9e2c2ac021dd9c3_b.jpg)

![](http://static.yinzhuoei.com/typecho/2020/11/25/355262388385111.png)

为什么ESbuild这么快？

- 因为Esbuild是用GO语言直接编译成原生代码
- 由于GO语言特点，它的解析和映射并发非常快
- 避免了不必要的配置
- 数据转换很简单很快速

虽然ESbuild是一个非常快速的打包器，但是不支持热模块更新和没有开箱即用的工具，而且要像webpack一样想做一款基于ESbuild的插件，我认为目前是非常难的。所以Vite将它的长处用在了处理ts编译上，大型项目中编译TS文件，Vite几乎是一瞬间的事情。

---

热模块更新

我们要知道热模块更新和我们传统的刷新页面的区别，以webpack的dev-server服务器举例，通过启动开发服务器，页面与服务器建立了websocket，我们修改了代码之后给页面发送消息，页面才会执行刷新命令，本质上这种live-reload机制已经对开发非常友好了，但是在带有状态的页面上，reload不会有更好的开发体验：

> 当页面存在弹窗或者编辑框等，代码修改之后，liveReload会重载页面，如果刷新代码的同时不会重载页面而是重新加载修改过的文件就完美，所以这个机制就是webpack提出的热替换技术，也就是我们说的热更新

webpack.config.js

```
module.exports = {
  mode: \"development\", // 开发环境
  devtool: \"cheap-module-eval-source-map\",
  devServer: {
    contentBase: \"./bundle\",
    open: true,
    hot: true, // 开启热模块更新
    hotOnly: true  // 更新失败不会刷新页面配置
  }，
  module: {
    rules: [{
      test: /\\.css$/,
      use: [\"style-loader\", \"css-loader\"]
    }]
  }
}
```

css的loader中的实现已经做了热更新的处理，通过HMR这个插件中的API

```
// main.jsif (module.hot) {
  module.hot.accept(function() {
    // 监听变化，则修改
  });
  module.hot.dispose(function() {
    // 移除  });
}
```

我们了解了HMR基本操作之后就可以看看Vite是如何做HMR的：

vite和webpack的HMR实现机制是一样的，都是通过客户端和服务端建立socket连接，服务端有变化则通知客户端做出改变：

```
// server/serverPlugin.ts
 watcher.on(\'change\', (file) => {
    if (!(file.endsWith(\'.vue\') || isCSSRequest(file))) {
      handleJSReload(file);
    }
  })
```

在handleJSReload函数中递归调用了**walkImportChain**这个函数，这个函数的作用就是查看当前变化的文件是谁引入了它（JS/Vue），那么在递归中没有找到谁引入它，就Full-reload

```
send({
     type: \'full-reload\',
     path: publicPath
  })
```

如果找到了引用这个JS的文件了就热更新：

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

在客户端中，vite则在核心处理函数**handleMessage**中定义了消息的类型：

- connected: websocket连接
- vue-reload: vue文件的script更新
- vue-rerender:  vue文件的template更新
- style-update：css样式表变更
- style-remove: css样式表移除
- js-update: js文件更新
- full-reload：刷新页面

客户端接受了不同的消息类型去做不同处理，根据**timestamp**时间戳去请求新文件，而vue文件则通过**HMRRuntime**更新。

---

裸模块导入

vite同样也支持其他家打包器的日常功能，浏览器不允许我们直接引入裸模块，例如：

```
import { add } from \"lodash\"
```

vite在裸模块处理上有着对vue得天独厚的优势，vite不仅仅的可以改写普通模块的路径然后正确的解析，还对vue这个依赖有特殊的处理：

> 如果项目本地没有安装vue依赖，那么引入vue模块会按照vite依赖的vue版本去执行，这就说明了如果你全局安装了vue，那么在vite项目中能更方便的找到它

vite重写了模块加载路径：

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

引入的模块上下文在经过rewriteImports方法处理body以后，就会造成这样的效果：

```
import vue from \"vue\" => import vue from \"@/modules/vue.js\"
```

在**rewriteImports**这个方法中使用到了**Esbuild**中的**es-module-lexer**进行词法分析，对esbuild本来就不熟悉的我去看了这个插件发现这个词法分析器又小，又可以快速对JS进行分析，这里就简单看一下官网的demo吧。

```
// 伪代码
// 和vite源码中一样
import {
  init as initLexer,
  parse as parseImports,
  ImportSpecifier
} from \'es-module-lexer\'

// 需要初始化
await initLexer;
const [import, export] = parseImports(`
  import {a} from \"a\"
  export const add = 1;
`
console.log(import[0].s);
// 解析结果的返回有这样几种
// \"s\" is shorthand for \"start\"
// \"e\" is shorthand for \"end\"
// \"ss\" is shorthand for \"statement start\"
// \"se\" is shorthand for \"statement end\"
```

经过这样的词法处理，我们的模块引入路径就被这样替换了，尽管这个插件这么强，对于词法分析这种东西我们开发者平时也用不到，所以大家只需要知道vite的模块路径替换是借助es-module-lexer进行词法分析的就可以啦~

---

总结

vite和webpack对比，我认为webpack是一个纯正的打包工具，它的生态非常丰富，可以基于插件做各种事情，但是像尤大说的一样，很少有基于webpack上层封装的工具出现，也就是具有很大学习和配置成本，而vite提供了更丝滑的开发体验，以及内置的强大的HMR，TS支持，WebAssembly支持等等，所以使用哪款产品要看业务需要。

---

由于vite目前还在不断的更新中，但是主要特性的原理应该是不会变的，因为vite有非常多优秀的其他特性，还有我们这篇文章提到的3个特性还有很多值得细细研究的地方，所以这个vite系列会继续做，谢谢大家支持哦
