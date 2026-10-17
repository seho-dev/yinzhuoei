---
title: "Learning Vue's Source Together: The Build Process"
description: "A walkthrough of Vue's source build: following the npm scripts into build/build.js, understanding how build configurations are filtered and generated, and tracing the resolve helper that locates entry files."
date: 2020-04-27
lang: en
translationKey: "2020-04-27_202_【大家一起学习vue源码】源码构建"
categories:
  - "Frontend"
  - "Deep Dive"
views: 5970
draft: false
---

For an npm package or library, package.json describes the project. The scripts field in this JSON object defines the scripts npm can run. Vue.js configures the following entries:

```
\"build\": \"node build/build.js\",
\"build:ssr\": \"npm run build -- web-runtime-cjs,web-server-renderer\", （**注意这一块是用逗号分割的**）
\"build:weex\": \"npm run build -- weex\"
```

Vue has many npm scripts, of course, but these are the ones used for building. build:ssr and build:weex run the same build script, just with different arguments.

## Finding the Build Entry Point: How Does Vue Build Its Source?

Open the corresponding build/build.js file:

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

This code is quite straightforward. The author also left a comment in the source explaining what it does:

```
通过命令行arg构建过滤器
```

The imported config file exposes the getAllBuilds method. In config.js, we can see:

```
exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
```

This line is the key to exporting the configurations. The builds object contains predefined build definitions:

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

> entry: the entry file
> dest: the output destination file
> format: the build format; umd uses UMD, cjs follows CommonJS, and es follows the ES module specification
> env: development or production mode
> banner: the header at the top of each JavaScript file, containing details such as the author and open-source license
> There are other Rollup settings, such as aliases, whose design is rather similar to webpack's. I will not cover them here—I have forgotten much of that myself. The documentation is easy to find if you want to look up what each option means.

## How the resolve Function Is Defined

The resolve function is short and easy to follow:

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

First, base is the string “web.”
It is not an actual path; instead, web refers to an entry in the aliases configuration:

```
module.exports = {
  web: resolve(\'src/platforms/web\'),
}
```

Here, web points to src/platforms/web.
The resolve function returns the result of path.resolve, with the resolved web path as the first argument and entry-runtime.js as the second.
This is how the build entry file is located. Rollup then bundles that entry into an output file in the dist directory.

## Further Reading

[Runtime Only vs. Runtime + Compiler — Recommended Reading](https://ustbhuangyi.github.io/vue-analysis/v2/prepare/build.html#runtime-only-vs-runtime-compiler)
