---
title: "Preventing Overflowing Text from Breaking an HTML Table's Layout"
description: "Text overflowing and stretching a table is a common problem. Here's a CSS solution: set fixed dimensions for the table and fixed widths for its rows and cells, add the table-fix class to the table, and apply txt-ell to cells that should truncate text with an ellipsis."
date: 2018-08-08
lang: en
translationKey: "2018-08-08_32_Html-Table表格中，字溢出撑破表格的处理"
categories:
  - "Frontend"
views: 5416
draft: false
---

Text overflowing and stretching a table beyond its intended size is a common problem. Here's how to fix it.

**CSS code**

```css
/* Overflow styles */
.txt-ell {
    white-space: nowrap;      /* Force a single line */
    overflow: hidden;         /* Hide overflowing content */
    text-overflow: ellipsis;  /* Show an ellipsis for overflow */
    word-break: keep-all;     /* Allow line breaks within words */
    padding: 0 7px;            /* Leave some space from the edges */
}

.table-fix {
    table-layout: fixed;
}
```

**How to use it**

1. Give the table a fixed width and height, and set fixed widths for its tr and td elements.
2. Add the `table-fix` class to the table.
3. Add the `txt-ell` class to cells where overflowing text should be replaced with an ellipsis.

![Download.jpg](https://www.yinzhuoei.com/usr/uploads/2018/08/3593852342.jpg)
