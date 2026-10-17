---
title: "用webpack从0搭建一个简洁轻量vue脚手架"
description: "前情提要：本文需要有一定的webpack，npm基础哟 前几天，日常搬砖的我突然想到，前端工程化将编码的工作变得简单，但是我们并没有深究其根本去研究它们是如何运作的，比如vue-cli是vue项目开发用的非常多的脚手架工具，最新版本3是基于webpack4来开…"
date: 2020-01-05
lang: zh
translationKey: "2020-01-05_165_用webpack从0搭建一个简洁轻量vue脚手架"
categories:
  - "唠嗑"
views: 8845
draft: false
---

前情提要：本文需要有一定的webpack，npm基础哟
前几天，日常搬砖的我突然想到，前端工程化将编码的工作变得简单，但是我们并没有深究其根本去研究它们是如何运作的，比如vue-cli是vue项目开发用的非常多的脚手架工具，最新版本3是基于webpack4来开发的，巧了，最近一直再寻找webpack训练题材的我想到了一个很好的办法，我们可以自己通过webpack4来搭建一个vue-cli项目

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2020/01/2381946703.jpg)

话不多说，我们从0开始；

## 1. 准备一个空项目

```
npm init
```

然后根据提示设置项目名称等等，然后我们安装webpack

```
npm i webpack webpack-cli -s-d
```

安装成功后，我们需要建立一个目录【build】，在这里面我们存储3个文件，一个是webpack开发配置，一个是线上配置，一个是抽象出来的公共配置，为了我们能够将配置文件一次到位，我们需要安装很多很多的插件，我们一步一步来

## 2. 整合webpack的多个配置文件

```
1. 新建webpack.common.js
```

引入一些node的核心模块

```
const path = require(\"path\");
```

通过module.exports导出一个对象：

```
entry: \"./src/main.js\",
output: {
    path: path.resolve(__dirname, \"../dist\"),
    filename: \"[hash]_[name].js\",
},
```

我们把所有的文件导出到dist目录下，文件名前面加入一个hash值

一般在写vue的时候，我们引入模块不会写.js，.vue这样的后缀，因为vue-cli设置了自动搜索文件的功能，它能帮助我们去寻找对应的文件拓展名

所以我们写入一个resolve配置

```
resolve: {
    // 拓展名，在引入文件的时候，不用写以下的后缀，让webpack自己去寻找
    extensions: [\'.js\', \'.vue\'],
    alias: {
        \'@\': path.resolve(\'src\'),
        // 这是因为正在使用的是vue的运行时版本，而此版本中的编译器时不可用的，我们需要把它切换成运行时 + 编译需要在配置文件中添加如下代码
        \'vue$\': \'vue/dist/vue.esm.js\'
    }
},
```

> 可以看到extensions我们配置了js和vue，这个地方我们不宜配置过多的拓展名，比如css，html,xml等等，这样会拖慢webpack打包的速度

在alias中我们配置了一个\"vue$\"，这个配置非常重要，将解决后面的vue文件解析失败的问题，需要加这一句配置

```
2. 安装一大波依赖

  vue-loader
  babel-loader
  @babel/core
  style-loader
  css-loader
  postcss-loader
  file-loader
  ...
```

具体的非常多，我列出一个package.json，我的预装脚手架包含了axios和vue-router

```
\"dependencies\": {
    \"@babel/core\": \"^7.7.7\",  // babel核心
    \"axios\": \"^0.19.0\", // 请求ajax库
    \"copy-webpack-plugin\": \"^5.1.1\", // 插件： 拷贝文件
    \"stylus\": \"^0.54.7\", // 博主预装的：stylus
    \"stylus-loader\": \"^3.0.2\", // 预装的stylus-loader
    \"vue\": \"^2.6.11\", // vue核心是必须的
    \"vue-router\": \"^3.1.3\", // 预装了一个vue-router
    \"webpack\": \"^4.41.5\", // webpack 核心
    \"webpack-cli\": \"^3.3.10\", // webpack脚手架
    \"webpack-merge\": \"^4.2.2\" // webpack的合并几个配置文件的包
  },
  \"devDependencies\": {
    \"autoprefixer\": \"^7.1.2\", // postcss中的核心，自动加入css前缀
    \"babel-loader\": \"^8.0.6\", // babel的loader
    \"clean-webpack-plugin\": \"^3.0.0\", // 清空文件夹下的所有内容
    \"css-loader\": \"^3.4.0\", // cssloader： 分析各种依赖关系的css
    \"file-loader\": \"^5.0.2\", // 文件loader
    \"html-webpack-plugin\": \"^3.2.0\", // 自动生成html
    \"postcss-loader\": \"^3.0.0\", // postcss的loader
    \"precss\": \"^4.0.0\", // postcss的核心功能
    \"style-loader\": \"^1.1.2\", // 把css代码加入到head中
    \"url-loader\": \"^3.0.0\", // 基于file-loader的封装有更多的拓展，本文中所有配置建议使用url-loader
    \"vue-loader\": \"^15.8.3\", // 解析vue文件的loader
    \"vue-template-compiler\": \"^2.6.11\", // vue模板解释器
    \"webpack-dev-server\": \"^3.10.1\" // webpack-dev-server服务器，开发时候的必备服务器
  }

3. 配置module

module: {
    rules: [{
        test: /\\.vue$/, // 处理vue文件
        loader: \'vue-loader\'
    }, {
        test: /\\.js$/,
        loader: \"babel-loader\", // 处理es6+的语法
        exclude: /node_modules/
    }, {
        test: /\\.css$/, // 处理css
        use: [\"style-loader\", \"css-loader\", \"postcss-loader\"]
    }, {
        test: /\\.(png|jpe?g|gif|svg)(\\?.*)?$/, // 处理图片，这边尽量使用url-loader
        loader: \'file-loader\',
        options: {
            name: \"[name].[ext]\"
        }
    }, {
        test: /\\.(mp4|webm|ogg|mp3|wav|flac|aac)(\\?.*)?$/, // 处理音频
        loader: \'url-loader\',
        options: {
            limit: 10000
        }
    }, {
        test: /\\.(woff2?|eot|ttf|otf)(\\?.*)?$/, // 处理字体
        loader: \'url-loader\',
        options: {
            // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
            limit: 10000,
            name:\'[name].[ext]\'
        }
    }, {
        test: /\\.styl/, // 处理stylus的语法
        use: [
            \'style-loader\',
            \'css-loader\',
            \"postcss-loader\",
            \'stylus-loader\'
        ]
    }]
},
```

> use下的数组配置了很多的loader，它们是从右到左去执行的

里面有几个值得注意的地方，就是postcss，我们需要额外的建立一个配置文件在根目录

```
postcss.config
```

内容：

```
module.exports = {
    plugins: [
      require(\'precss\'),
      require(\'autoprefixer\')
    ]
 }
```

配置了2个核心之后，我们就可以使用css写出更多自由的东西，自动帮助我们添加了兼容前缀

```
4. 配置html模板
```

我们在根目录创建一个html文件，名字叫做index.html，内容如下

```
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">
    <title>A Vue.js Project</title>
</head>
<body>
    <div id=\"app\">
    </div>
</body>
</html>
```

这个html文件就是我们的vue程序打包出来的html，我们可以在这里配置网站标题，最主要的是要写一个id为app的div，因为稍后我们的vue程序将挂载到这个app实例上去

接下来我们配置一下common的插件

```
plugins: [new HtmlWebpackPlugin({
    template: \'./index.html\'
}), new VueLoaderPlugin(), new CopyWebpackPlugin([{
    from: path.resolve(__dirname, \'../public\'), // 不打包直接输出的文件
    to: \'\', // 打包后静态文件放置位置
    ignore: [\'.*\'] // 忽略规则。（这种写法表示将该文件夹下的所有文件都复制）
}])]
```

> HtmlWebpackPlugin首先这个插件就是生成html，选址了一个我们刚刚建立好的模板即可，自动会把dist下的js加入到html中哦~~
> VueLoaderPlugin则是vue解析的插件
> CopyWebpackPlugin 把public下的所有文件放到dist下

我们完成了common的配置，在开发环境下的和线上环境的配置是不一样的，比如soucemap，还有treeshaking，webpack-dev-server等等

所以我们在build目录下建立

```
webpack.dev.js

const webpack = require(\"webpack\"); // 引入webpack引用
const merge = require(\"webpack-merge\");
const common = require(\"./webpack.common\");

module.exports = merge(common,{
mode: \"development\",
devtool: \"cheap-module-eval-source-map\",
// dev模式下独有的webpack-dev-server配置
devServer: {
    contentBase: \"./dist\",
    open: true,
    // HMR
    hot: true,
    hotOnly: true
},
plugins: [new webpack.HotModuleReplacementPlugin()]
})
```

> 我们在开发环境做的配置并不多，首先我们的mode是development，webpack有一个自动的代码压缩，配置了webpack推荐的开发环境调试的devtool:
> \"cheap-module-eval-source-map\",
> 还有在开发启动的服务器（webpack-dev-server），并且开启了HMR（热模块更新）

并且我们引入了刚刚完成的common.js的配置，利用webpack-merge这个插件，将dev的配置和common的配置进行一个合并

同理，我们建立prod

```
webpack.prod.js

const {
    CleanWebpackPlugin
} = require(\'clean-webpack-plugin\');
const merge = require(\"webpack-merge\");
const common = require(\"./webpack.common\");
module.exports = merge(common, {
mode: \"production\",
entry: \"./src/main.js\",
// prod独有的配置  treeshaking和splitChunks
optimization: {
    // 代码分割
    splitChunks: {
        chunks: \'all\'
    },
    // 配置treeshaking
    usedExports: true
},
plugins: [new CleanWebpackPlugin()]
})
```

> 在线上的配置，我们采用了基本的treeshaking和代码分割，并且CleanWebpackPlugin，在打包的时候清除掉了dist下的所有文件再进行打包，这样就能让dist下目录下保持最新的代码

配置package.json中的脚本

```
\"scripts\": {
\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\",
\"serve\": \"webpack-dev-server --progress --config build/webpack.dev.js\",
\"build\": \"webpack --progress --config build/webpack.prod.js\"
  },

npm run serve --启动开发配置
npm run build --启动线上配置
```

***注意注意，我们webpack配置文件中的入口写的是entry: \"./src/main.js\",所以需要新建src目录，并且新建一个main.js，然后尝试写一个console或者其他的js语法，试一下程序是否正常***

## 开始配置main.js写一个vue的helloworld

如果我们的脚本能正常运行，说明我们的配置的没有问题

我们需要在src下新建一个App.vue，让App.vue成为所有组件的父容器

App.vue

```
<template>
  <div id=\"app\">
    <router-view />
  </div>
</template>

<script>
export default {
  name: \"App\"
};
</script>

<style>
</style>
```

然后我们在src下只建立pages文件夹和router文件夹
pages: 存放vue页面的文件夹
router：存放路由的文件夹

在我们的demo中我们在pages下建立list文件夹，然后在list文件夹下建立index.vue，内容如下

```
<template>
  <div class=\"box\">
    hello world
  </div>
</template>

<script>
export default {
};
</script>

<style lang=\"stylus\" scoped>
    .box
       color red;
</style>
```

在router文件夹下定义index.js文件

```
import Vue from \"vue\";
import VueRouter from \"vue-router\";

Vue.use(VueRouter);

// 引入路由
import list from \"@/pages/list/index.vue\";

export default new VueRouter({
    routes: [{
        path: \"/\",
        component: list
    }]
})
```

在main.js中引入router和App.vue

```
import Vue from \'vue\';
import router from \"../src/router\"
import App from \'./App.vue\';

new Vue({
    el: \'#app\',
    template: \'<App/>\',
    components: { App },
    router
})
```

如果你能在浏览器中看到helloworld呈红色就说明你成功了~~

## 架构其他的目录

每个人有每个人写代码的习惯，我的习惯是之前和蜗牛老师学的，一直觉得这种风格非常的好

在src目录下新建文件夹: api, assets, config

> api: 接口的service层
> assets：存放一些icon，css，和js
> config： config配置项

我们在这篇文章简单分享一下我的习惯，大家做一个参考

首先我会在asstes下的js文件夹下建立request.js，作为请求文件

request.js

```
import axios from \"axios\";
/**
 * 封装的通用请求类
 * @param {*} url
 * @param {*} data 请求参数
 * @param {*} method 请求类型
 * @param {*} locktype 加密类型
 */

export default function request(url, data, method, locktype) {
    return new Promise((resolve, reject) => {
        axios.request({
            url,
            method,
            data,
        }).then(res => {
            if (res.data.code === 200 && res.status === 200) {
                resolve(res.data.data);
            }
        }).catch(error => {
            console.log(error);
            reject();
        })
    })
}
```

然后在api文件夹下的index.js中引入request

```
import request from \"@/assets/js/request\";

export function getList(url, data, method) {
    return new Promise((resolve) => {
        request(url, data, method).then(res => {
            resolve(res)
        })
    })
}
```

一般情况下，api下的js命名一般都是模块，比如登录模块，首页，商城等等

然后我们会在具体的vue文件中引入api/index， 将里面的方法导出来，传递参数进行请求

> 这样架构的好处有很多，vue只有视图逻辑&获取数据，基本不会做其他的过多数据处理，这样非常好维护，并且可以使更多的接口复用，同样的更好维护

ok，我们本次的分享到此结束，目前为止，我们的脚手架是全部跑通了的，仅仅只有引入图片，非常奇怪，不能直接引入public目录下的文件，需要import一下，但是在vue-cli3直接引入public下的是不需要编译的，所以哪位朋友解决了，就私信艾特我

*微信： meng99huan   请求内容： 因卓诶 webpack脚手架引用静态资源问题*

目录结构在这里：

![微信截图_20200105170656.png](https://www.yinzhuoei.com/usr/uploads/2020/01/2395771588.png)

[本篇文章的脚手架github地址，点我获取](https://github.com/1018715564/vue-cli)
