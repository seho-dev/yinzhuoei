---
title: "A Classic Vue Practice Project: A Bootstrap Message Board (Todo List)"
description: "Hello again—it's Lao Shen. This afternoon I watched a lesson from Zhinengshe and learned a lot. While studying Vue, I picked up quite a bit of Bootstrap and JavaScript syntax and followed the instructor to build a small message board. Getting started with Vue really is easy…"
date: 2018-07-24
lang: en
translationKey: "2018-07-24_25_Vue的经典实战练习：bootstrap框架应用留言板（todolist）"
categories:
  - "Frontend"
  - "Life"
views: 8049
draft: false
---

Hello again—it's your old friend Lao Shen. This afternoon I watched a lesson from Zhinengshe and learned a lot. While studying Vue, I picked up quite a bit of Bootstrap and JavaScript syntax, and followed the instructor to build a small message board.

**Thoughts on the Project**

Getting started with Vue really is easy. After learning about custom directives, I was able to put together a useful message board in no time. The only catch is that the frontend page can't persist its data. Once I finish the teacher satisfaction project, I plan to build a shopping website and work through the full Vue + Bootstrap + JavaBean stack.

**The Code**

HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="bootstrap.min.css">
    <script src="jquery-3.0.0.js"></script>
    <script src="bootstrap.min.css"></script>
    <script src="vue.js"></script>
</head>
<body>
<div id="window">
    <h1 class="text-center">简易留言板</h1>
    <form>
        <label for="user" class="text-center">用户名
            <input type="text" class="form-control" id="user" v-model="username">
        </label>
        <label for="age" class="text-center">年龄
            <input type="text" class="form-control" id="age" v-model="age">
        </label>
        <label for="button" class="text-center">
            <input type="button" class="btn btn-danger" id="button" value="提交" v-on:click="submit">
        </label>
    </form>
    <table class="table table-bordered table-hover">
        <tr>
            <th class="text-center">序号</th>
            <th class="text-center">用户名</th>
            <th class="text-center">年龄</th>
            <th class="text-center">操作</th>
        </tr>
        <tr v-for="(item,$index) in message">
            <td class="text-center">{{$index+1}}</td>
            <td class="text-center">{{item.username}}</td>
            <td class="text-center">{{item.age}}</td>
            <td>
                <button class="btn btn-primary btn-danger" @click="nowdelete($index)">删除</button>
            </td>
        </tr>
        <tr v-show="message.length!=0">
            <td colspan="4">
                <button class="btn btn-primary btn-danger" @click="nowdelete(-2)">删除全部</button>
            </td>
        </tr>
        <tr v-show="message.length==0">
            <td colspan="4" class="text-center">
                <p>暂无数据。。。</p>
            </td>
        </tr>
    </table>
</div>
<script src="index.js"></script>
</body>
</html>
```

JS:

```javascript
new Vue({
    el: '#window',
    data: function () {
        return {
            message: [],
            username: '',
            age: '',
            Nowindex: '-99'
        }
    },
    methods: {
        submit: function () {
            this.message.push({
                name: this.username,
                age: this.age
            });
            this.age = '';
            this.username = '';
        },
        nowdelete: function (index) {
            if (index == -2) {
                this.message = []
            } else {
                this.message.splice(index, 1);
            }
        }
    }
})
```

**Vue Directives Used**

- `v-model`: Two-way data binding for forms
- `v-for`: Iterate over an array

**Notes**

In Vue 2.0, you can no longer use `$index` directly. You must declare it in the loop: `v-for="(item,$index) in message"`

If a click handler needs an argument, write it in a form such as `@click="submit($index)"`.

---

More tomorrow. That's it for today!
