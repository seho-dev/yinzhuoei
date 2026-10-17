---
title: "Vue案例：利用jsonp跨域做百度下拉菜单"
description: "跟着教程做了一个 Vue 小项目，用到了 Vue 的三个交互方法：get、post 和 jsonp。对于 js 基础不太好的人来说，学习起来还是有点吃力的。 语法说明 引入 vue-resource.js 后，可以这样用： post 提交时需要加 emulat…"
date: 2018-07-28
lang: zh
translationKey: "2018-07-28_29_Vue案例：利用jsonp跨域做百度下拉菜单"
categories:
  - "前端"
  - "唠嗑"
views: 5744
draft: false
---

跟着教程做了一个 Vue 小项目，用到了 Vue 的三个交互方法：get、post 和 jsonp。对于 js 基础不太好的人来说，学习起来还是有点吃力的。

**语法说明**

引入 vue-resource.js 后，可以这样用：

```javascript
this.$http.get/post/jsonp(url, data, options).then(successFn, errorFn)
```

post 提交时需要加 `emulateJSON: true`：

```javascript
this.$http.post(url, data, {emulateJSON: true}).then(...)
```

jsonp 跨域时，callback 默认名字是 callback，但百度的接口用的是 cb，所以要声明一下：

```javascript
this.$http.jsonp(url, data, {jsonp: 'cb'}).then(...)
```

**完整案例：百度下拉菜单**

功能：输入内容显示百度下拉建议，按回车跳转到搜索结果页。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>百度下拉菜单</title>
    <script src="bootstrap.js"></script>
    <script src="bootstrap.min.css"></script>
    <script src="vue.js"></script>
    <script src="vue-resource.js"></script>
</head>
<style>
    .grey {
        background: #ccc;
    }
</style>
<body>
    <div id="box">
        <input type="text" class="input-group" v-model="text" @keyup="get($event)" @keydown.down="down()" @keydown.up.prevent="up()" @keydown.enter="enter()">
        <ul>
            <li class="list-group" v-for="(li,$index) in mydata" :class="{grey:$index==now}">{{li}}</li>
        </ul>
        <p v-show="mydata.length==0">暂无数据。。。</p>
    </div>
<script>
    new Vue({
        el: '#box',
        data: function () {
            return {
                text: '',
                mydata: [],
                now: '-1'
            }
        },
        methods: {
            get: function (ev) {
                if (ev.keyCode == 38 || ev.keyCode == 40) return;
                this.$http.jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su', {
                    wd: this.text
                }, {
                    jsonp: 'cb'
                }).then(function (code) {
                    this.mydata = code.data.s;
                }, function (code) {
                    alert(code.data);
                })
            },
            down: function () {
                this.now++;
                if (this.now == this.mydata.length) {
                    this.now = -1
                };
                this.text = this.mydata[this.now]
            },
            up: function () {
                this.now--;
                if (this.now == -2) {
                    this.now = this.mydata.length - 1;
                };
                this.text = this.mydata[this.now]
            },
            enter: function () {
                window.open('https://www.baidu.com/s?wd=' + this.text);
                this.text = ''
            }
        }
    })
</script>
</body>
</html>
```

![u=1436948145,4270509323&fm=200&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2291182219.jpg)
