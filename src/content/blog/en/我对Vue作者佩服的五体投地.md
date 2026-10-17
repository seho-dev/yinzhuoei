---
title: "Nothing but Respect for Vue's Creator"
description: "Vue's keyboard event handling blew me away. Normally, you would check keyCode to listen for a keypress, but Evan You has wrapped it all up: just add a dot modifier to the keyboard event. For example, @keyup.enter listens for Enter directly. You can also use numbers: Enter is 13, so 13 can replace enter in your code. Delete…"
date: 2018-07-26
lang: en
translationKey: "2018-07-26_28_我对Vue作者佩服的五体投地"
categories:
  - "Frontend"
  - "Life"
views: 5235
draft: false
---

![4afbfbedab64034f29596c8ba6c379310b551da2.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2873996809.jpg)

Vue's keyboard event handling blew me away. Normally, you would check keyCode to listen for a keypress, but Evan You has wrapped it all up: just add a dot modifier to the keyboard event.

For example, `@keyup.enter` listens for the Enter key directly. You can also use numbers: Enter is 13, so writing 13 in your code works in place of enter. Delete, the arrow keys, End, and others have all been wrapped up too. Very nice—it makes the code much simpler.

Evan is also the creator of the HTML5 version of Clear. Impressive stuff.

**A Quick Summary of Vue Events**

Events:

- `v-on:click/mouseover......`
- Shorthand: `@click=""` (recommended)

The event object:

- `@click="show($event)"`

Event bubbling:

- Stop bubbling: `ev.cancelBubble=true`
- Recommended: `@click.stop`

Default behavior:

- Prevent the default: `ev.preventDefault()`
- Recommended: `@contextmenu.prevent`

Keyboard events:

- `@keydown` / `@keyup`, used with `$event` and `ev.keyCode`

Common keys:

- Enter: `@keyup.13` or `@keyup.enter`
- Up, down, left, right: `@keyup/keydown.left/right/up/down`

---

I didn't learn much today because I'm traveling and the signal is poor. I should be back on track tomorrow.
