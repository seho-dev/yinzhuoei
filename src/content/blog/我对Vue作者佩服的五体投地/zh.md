---
title: "我对Vue作者佩服的五体投地"
description: "Vue 的键盘事件监控让我很震惊。往常要调用 keyCode 方法来监听按键，但尤大大直接封装了，在键盘事件后面加点就能用。 比如 @keyup.enter，直接监控回车键。还可以用数字，比如 enter 是 13，代码里写 13 也能代替 enter。del…"
date: 2018-07-26
lang: zh
translationKey: "2018-07-26_28_我对Vue作者佩服的五体投地"
categories:
  - "前端"
  - "唠嗑"
views: 5235
draft: false
---

![4afbfbedab64034f29596c8ba6c379310b551da2.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2873996809.jpg)

Vue 的键盘事件监控让我很震惊。往常要调用 keyCode 方法来监听按键，但尤大大直接封装了，在键盘事件后面加点就能用。

比如 `@keyup.enter`，直接监控回车键。还可以用数字，比如 enter 是 13，代码里写 13 也能代替 enter。delete、方向键、end 键等都做了封装，非常 nice，代码简化了不少。

尤大大也是 HTML5 的 Clear 的作者，确实厉害。

**Vue 事件知识点总结**

事件：

- `v-on:click/mouseover......`
- 简写：`@click=""`（推荐）

事件对象：

- `@click="show($event)"`

事件冒泡：

- 阻止冒泡：`ev.cancelBubble=true`
- 推荐：`@click.stop`

默认行为：

- 阻止默认：`ev.preventDefault()`
- 推荐：`@contextmenu.prevent`

键盘事件：

- `@keydown` / `@keyup`，配合 `$event` 和 `ev.keyCode`

常用键：

- 回车：`@keyup.13` 或 `@keyup.enter`
- 上、下、左、右：`@keyup/keydown.left/right/up/down`

---

今天学习的内容不多，因为在旅途中，信号不好。明天就能回归正轨了。
