---
title: "Vue Case Study: Building a Baidu Search Dropdown via JSONP Cross-Origin"
description: "Followed a tutorial to build a small Vue project utilizing three interaction methods: get, post, and jsonp. Covers callback params and keyboard navigation for search suggestions."
date: 2018-07-28
lang: en
translationKey: "2018-07-28_29_Vue案例：利用jsonp跨域做百度下拉菜单"
categories:
  - "Frontend"
  - "Life"
views: 5744
draft: false
---

Followed a tutorial to build a small Vue project utilizing Vue's three interaction methods: `get`, `post`, and `jsonp`. For folks just starting out with JavaScript fundamentals, it can be a bit challenging at first.

**Syntax Overview**

After importing `vue-resource.js`, usage looks like this:

```javascript
this.$http.get/post/jsonp(url, data, options).then(successFn, errorFn)
```

POST submissions require `emulateJSON: true`:

```javascript
this.$http.post(url, data, {emulateJSON: true}).then(...)
```

For JSONP cross-origin calls, the callback parameter defaults to `callback`, but Baidu's search API expects `cb`, so declare it explicitly:

```javascript
this.$http.jsonp(url, data, {jsonp: 'cb'}).then(...)
```

**Complete Example: Baidu Suggestion Dropdown**

Feature: Displays Baidu search suggestions as you type and opens search results on Enter.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Baidu Dropdown Menu</title>
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
        <p v-show="mydata.length==0">No data available...</p>
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
