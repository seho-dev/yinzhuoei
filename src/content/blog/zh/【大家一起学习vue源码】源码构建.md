---
title: "【大家一起学习vue源码】源码构建"
description: "基于NPM的包或者库，项目中的package.json是对项目的描述，这个json对象中的script标签就是npm运行脚本，vue.js在这里配置了如下的内容 vue当然有很多script命令，但是仅仅只有这几种是build的，build:ssr和build…"
date: 2020-04-27
lang: zh
translationKey: "2020-04-27_202_【大家一起学习vue源码】源码构建"
categories:
  - "前端"
  - "精读"
views: 5970
draft: false
---

基于NPM的包或者库，项目中的package.json是对项目的描述，这个json对象中的script标签就是npm运行脚本，vue.js在这里配置了如下的内容

```
\"build\": \"node build/build.js\",
\"build:ssr\": \"npm run build -- web-runtime-cjs,web-server-renderer\", （**注意这一块是用逗号分割的**）
\"build:weex\": \"npm run build -- weex\"
```

vue当然有很多script命令，但是仅仅只有这几种是build的，build:ssr和build:weex其实和build一样，只不过提供了不同的运行参数

## 查找build的入口文件，vue是如何做build源码的？

打开对应的build/build.js

```
let builds = require(\'./config\').getAllBuilds()
// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(\',\') （**分割出来的数组是[\"web-runtime-cjs\"，\"web-server-renderer\"]** ）
 // 通过getAllBuild函数返回的config对象对其打包模式进行了rollup的配置，包括output等设置
 // 而下面这一段代码的b则是返回的config对象，filters这个参数数组使用some来判断builds中output中的file(被resolve函数定义了，这个resolve函数下面会具体讨论)
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf(\'weex\') === -1
  })
}
```

这一段代码其实非常简单，作者也在源码中写了注释解释了这段代码的作用

```
通过命令行arg构建过滤器
```

其中引入的config 文件调用了getAllBuilds这个方法，在config.js可以看出

```
exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
```

这一句代码是导出config的关键代码，builds是预定义的一些对象

```
// runtime-only build (Browser)
  \'web-runtime-dev\': {
    entry: resolve(\'web/entry-runtime.js\'),
    dest: resolve(\'dist/vue.runtime.js\'),
    format: \'umd\',
    env: \'development\',
    banner
  },
```

> entry: 入口文件
> dest: 输出目标文件
> format: 构建的格式  umd为umd格式 cjs遵循commonJS规范 es遵循esmodule规范
> env：开发模式/生产模式
> banner指的是每个js的页头，比如作者，信息，开源协议等信息
> 还有其他的一些关于rollup（很像webpack的一些设计）别名诸如此类的配置，这边就不阐述了，因为我也忘记的差不多了，文档都很好查，想知道具体的意思也很容易

## resolve函数的定义

这里的resolve函数比较简短，很容易理清

```
//假定一个config中使用resolve这个函数，它传递的字符串是这样的
\'web-runtime-cjs\': {
    entry: resolve(\'web/entry-runtime.js\')
  }

const resolve = p => {
  const base = p.split(\'/\')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, \'../\', p)
  }
}
```

首先base则是 “web”这个字符串，
这个base并不是真实的路径，而这个web则指向了aliases的配置

```
module.exports = {
  web: resolve(\'src/platforms/web\'),
}
```

这里的web指向的路径就是src/platforms/web
那么resolve函数返return的就是path.resolve，其中第一个参数就是web，第二个参数则是entry-runtime
所以由此得知，通过这样的一个过程找到了build的入口文件然后经过rollup的打包就会在dist目录下生成web/entry-runtime.js

## 拓展阅读

[Runtime Only VS Runtime + Compiler 推荐阅读](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/build.html#runtime-only-vs-runtime-compiler)
