---
title: "Frontend Column: Master the World's Best CSS Layout Technique in Three Minutes"
description: "Web layout is something frontend engineers deal with almost every day, from tables, positioning, floats, margins, and padding to the more modern Flexbox. Before Flexbox, our layout tools often felt inadequate. Flexbox brought a breath of fresh air—but there is a newer contender: CSS Grid…"
date: 2019-03-25
lang: en
translationKey: "2019-03-25_91_前端专栏：三分钟搞定世界第一的css布局技巧"
categories:
  - "Life"
views: 6448
draft: false
---

As we all know, web layout is something frontend engineers work with almost every day in the world of CSS.
We started with table layouts, positioning, floats, margins, and padding,
and eventually moved on to the more modern Flexbox.
Honestly, before Flexbox, our layout tools often felt inadequate. Flexbox brought a breath of fresh air. But in IT, the newer technology always seems to be the most impressive—we have seen that happen with plenty of frameworks and techniques. This time, that technology is Grid!

Grid is a modern, grid-based layout system that is quick and easy to pick up. Yet plenty of frontend developers who write CSS for a living still do not know about it, or have never even heard of it. It clearly has not caught on as widely as Flexbox. So today, I promise you can learn all the essentials in three minutes and start trying them out in a real project.

---

Minute one:

Set up the DOM and initialize the Grid layout.

HEADER
MENU
CONTENT
FOOTER

.container {
 display: grid;
 grid-template-columns: repeat(12, 1fr);
 grid-template-rows: 50px 350px 50px;
 grid-gap: 5px;
 }
The grid container:
1. Declare display:grid.
2. Columns: use the repeat function to divide the grid into 12 columns, each 1fr wide. A fraction means that, after fixed sizes are accounted for, the remaining space is distributed proportionally; 1fr is one share.
3. Rows: define three rows, with heights of 50px, 350px, and 50px respectively.
4. (Optional) Set the gap between grid cells. You can also supply two values to set the row and column gaps separately.

---

Finished minute one? Let's see how it looks.

![QQ screenshot 20190325142412.png](https://www.yinzhuoei.com/usr/uploads/2019/03/1187606891.png)

---

Minute two:
Next, to make good use of the grid, we need to fill its cells with divs.
1. On a child div, grid-column-start and grid-column-end specify the starting and ending grid lines. Note that a grid 12 columns wide has 13 grid lines when you count the outer edges (11 internal lines plus 2 edges). To fill the entire first row, you therefore need to span lines 1 through 13:

grid-column-start:1
 grid-column-end:13
The shorthand is grid-column:1/13.
2. The same principle applies to rows.

---

Finished minute two? Let's see the result.

## ![QQ screenshot 20190325143906.png](https://www.yinzhuoei.com/usr/uploads/2019/03/1392284816.png)

Minute three

Let's try a different way to build the layout. If counting grid lines feels too clunky, is there a simpler option? Yes!
We can use:

grid-template-areas:
 "h h h h h h h h h h h h"
 "m m c c c c c c c c c c"
 "f f f f f f f f f f f f";
Does that look confusing at first? What are all those h's, m's, c's, and f's? They are names you choose yourself. This code defines the layout on the parent. The children simply match those names, so you no longer have to count cells. How do you make the match?

.header {
 grid-area: h;
 }

Pretty neat, right? And that is not all. What if you want empty space?

grid-template-areas:
 ". h h h h h h h h h h ."
 "m m c c c c c c c c c c"
 "f f f f f f f f f f f f";

Use a dot as a placeholder to leave a cell empty. Combine this with a media query, and you can create a simple responsive layout:

---

@charset "utf-8";
.container {
 display: grid;
 grid-template-columns: repeat(12, 1fr);
 grid-template-rows: 50px 350px 50px;
 grid-gap: 5px;
 /* Visual representation of the layout */
 grid-template-areas:
 "m m h h h h h h h h h h"
 "m m c c c c c c c c c c"
 "f f f f f f f f f f f f";
}

.header {
 grid-area: h;
 background: red;
}
.menu {
 grid-area: m;
 background: blue;
}
.content {
 grid-area: c;
 background: yellowgreen;
}
.footer {
 grid-area: f;
 background: black;
}
@media screen and (max-width: 640px){
 .container {
 display: grid;
 grid-template-columns: repeat(12, 1fr);
 grid-template-rows: 50px 350px 50px;
 grid-gap: 5px;
 /* Visual representation of the layout */
 grid-template-areas:
 "h h h h h h h h h h m m"
 "c c c c c c c c c c c c"
 "f f f f f f f f f f f f";
 }
}

---

That's it! If you repost this article, please credit Lao Shen at Yinzhuoei.
