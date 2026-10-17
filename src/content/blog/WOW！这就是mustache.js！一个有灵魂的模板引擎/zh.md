---
title: "WOW！这就是mustache.js！一个有灵魂的模板引擎"
description: "今天做题遇到了一个问题，vue的模板语法是基于什么的，带着强烈的好奇心我找到了它，mustache，胡子语法； 然后打开了官网，这个语法已经支持了20多种编程语言，js的支持是node的作者开源的； 微信截图20190909220549.png git地址：…"
date: 2019-09-09
lang: zh
translationKey: "2019-09-09_110_WOW！这就是mustache.js！一个有灵魂的模板引擎"
categories:
  - "唠嗑"
views: 7319
draft: false
---

今天做题遇到了一个问题，vue的模板语法是基于什么的，带着强烈的好奇心我找到了它，mustache，胡子语法；
然后打开了官网，这个语法已经支持了20多种编程语言，js的支持是node的作者开源的；

微信截图_20190909220549.png

git地址： https://github.com/janl/mustache.js

模板引擎技术是非常有用的，所以它不是一个冷门的知识，反而是需要我们去了解的；

所以我们通过github的安装指令，一步一步的来实现基本的api

我搜查了很多资料，网上并没有一个使用npm包的方式来做demo，都是使用render来执行渲染，鉴于我们日常工作中使用npm比较多，我做一版npm的demo

首先npm init初始化一个空项目；

然后安装mustache

npm i mustache -s -d

在package.json中填写如下内容：

"scripts": {
 "build": "mustache dataView.json myTemplate.mustache>public/output.html",
 },

如同这个指示看到的一样，我们需要创建一个json文件，这个文件就是变量配置文件，还需要创建一个模板文件，这个模板文件相当于执行render函数的文件，这种方式更加一目了然；

我们创建它们，我使用了vscode，并且装了相关的mustache的插件，所以语法会有提示；

微信截图_20190909221112.png

我们首先在json文件中写入一个对象，里面写一个值，然后在模板文件中使用{{}}来执行渲染；

然后执行

npm run build

就会发现在public下面生成了一个html文件，如果报错，说明你的文件目录跟我的不一样

我们在json文件中，写入了这么多值，有普通的值，有布尔值，有数组等等

{
 "name": "shenhao",
 "age": "19",
 "html": "

123

",
 "isTrue": true,
 "thisIsObject": {
 "name": "shenhao",
 "age": "19"
 },
 "isArray": [{
 "name" : "shenhao"
 },{
 "name" : "shenhao"
 },{
 "name" : "shenhao"
 }]
 }

我们在模板中写出了这些代码，我在模板中写了一个简单的html

<!DOCTYPE html>
 
 
 
 
 
 Document
 
 
 {{name}} 有一个 {{&html}}

---

 {{thisIsObject.name}} {{thisIsObject.age}}
 

---

 -webkit- {{#isTrue}} 如果是真就显示了 {{/isTrue}}
 

---

 循环一下下面的内容, 如果是数组，可以用.来表示循环的每一个元素
 {{#isArray}} {{name}} {{/isArray}}
 

---

 {{!^}}与{{!#}}相反，如果变量是null、undefined、 false、和空数组讲输出结果
