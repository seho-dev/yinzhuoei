---
title: "Html-Table表格中，字溢出撑破表格的处理"
description: "表格里文字溢出撑破表格的问题，很常见。来看怎么解决。 CSS 代码 使用步骤 1. table 要有固定宽高，内部的 tr、td 也要设置固定宽度 2. table 加上 table-fix 类 3. 需要省略号的单元格加上 txt-ell 类"
date: 2018-08-08
lang: zh
translationKey: "2018-08-08_32_Html-Table表格中，字溢出撑破表格的处理"
categories:
  - "前端"
views: 5416
draft: false
---

表格里文字溢出撑破表格的问题，很常见。来看怎么解决。

**CSS 代码**

```css
/* 溢出部分样式 */
.txt-ell {
    white-space: nowrap;      /* 强制一行显示 */
    overflow: hidden;         /* 溢出内容隐藏 */
    text-overflow: ellipsis;  /* 溢出部分显示省略号 */
    word-break: keep-all;     /* 允许在单词内换行 */
    padding: 0 7px;            /* 与边线留点距离 */
}

.table-fix {
    table-layout: fixed;
}
```

**使用步骤**

1. table 要有固定宽高，内部的 tr、td 也要设置固定宽度
2. table 加上 `table-fix` 类
3. 需要省略号的单元格加上 `txt-ell` 类

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/08/3593852342.jpg)
