---
title: "Vue的经典实战练习：bootstrap框架应用留言板（todolist）"
description: "hello，还是熟悉的老沈。今天下午看了智能社的一节课，受益匪浅，学 Vue 的过程中掌握了不少 boot 和 js 的语法，跟着导师自己做了一个留言板小案例。 案例感受 Vue 入门真的简单，学了自定义指令，能很快做一个实用的留言板。只是前端页面不能保存数据…"
date: 2018-07-24
lang: zh
translationKey: "2018-07-24_25_Vue的经典实战练习：bootstrap框架应用留言板（todolist）"
categories:
  - "前端"
  - "唠嗑"
views: 8049
draft: false
---

hello，还是熟悉的老沈。今天下午看了智能社的一节课，受益匪浅，学 Vue 的过程中掌握了不少 boot 和 js 的语法，跟着导师自己做了一个留言板小案例。

**案例感受**

Vue 入门真的简单，学了自定义指令，能很快做一个实用的留言板。只是前端页面不能保存数据，等教师满意度项目做完以后，打算写一个购物网站，把 Vue + Bootstrap + JavaBean 完整做一遍。

**上代码**

HTML：

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

JS：

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

**用到的 Vue 指令**

- `v-model`：表单双向数据绑定
- `v-for`：循环数组内容

**注意**

Vue 2.0 里不能直接用 `$index` 了，要在 for 循环里声明：`v-for="(item,$index) in message"`

点击事件如果方法需要参数，要写成 `@click="submit($index)"` 这种形式。

---

明天继续，结束！
