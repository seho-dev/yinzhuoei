---
title: "Vue Music App Project Notes: Building a Reusable Carousel Component (Part 2)"
description: "Now let's turn the previous code into a reusable component. Last time, we fetched the carousel data through JSONP; this time, we will define a carousel component. Template The <slot> serves as a placeholder. Component Data Initialize it in a lifecycle hook with a 20 ms delay. Calculating the Width Dynamically add class names to child elements to match the CSS styles. Looping playback requires two extra slide widths…"
date: 2018-10-22
lang: en
translationKey: "2018-10-22_61_基于vue音乐APP的项目笔记：轮播图组件封装（下）"
categories:
  - "Frontend"
views: 6004
draft: false
---

![Screenshot 20181022125102.png](https://www.yinzhuoei.com/usr/uploads/2018/10/3912784574.png)

Now let's turn the previous code into a reusable component. Last time, we fetched the carousel data through JSONP. This time, we will define a carousel component.

**Template**

```html
<template>
<div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
        <slot></slot>
    </div>
    <div class="dots">
        <span class="dot" v-for="(item,index) in dot" :key="index" :class="{active:pageIndex===index}"></span>
    </div>
</div>
</template>
```

The `<slot>` serves as a placeholder for the content.

**Component Props**

```javascript
props: {
    loop: {
        type: Boolean,
        default: true
    },
    autoPlay: {
        type: Boolean,
        default: true
    },
    interval: {
        type: Number,
        default: 4000
    }
}
```

Initialize the component in a lifecycle hook, with a 20 ms delay:

```javascript
setTimeout(() => {
    this._setSliderWidth()
    this._initDots()
    this._initSlider()
    if (this.autoPlay) {
        this._autoPlay()
    }
}, 20)
```

**Calculating the Width**

Dynamically add a class to the child elements so the CSS rules apply:

```javascript
_setSliderWidth(resize) {
    this.children = this.$refs.sliderGroup.children
    let width = 0
    let sliderWidth = this.$refs.slider.clientWidth
    for (let i = 0; i < this.children.length; i++) {
        let childDom = this.children[i]
        addClassName(childDom, "slider-item")
        childDom.style.width = sliderWidth + 'px'
        width += sliderWidth
    }
    if (this.loop && !resize) {
        width += 2 * sliderWidth
    }
    this.$refs.sliderGroup.style.width = width + 'px'
}
```

For looping playback, add two slide widths.

**DOM Helpers**

```javascript
export function addClassName(el, className) {
    if (hasClassName(el, className)) return
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
}

export function hasClassName(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}
```

**CSS Styles**

```css
.slider { min-height: 1px }
.slider-group { position: relative; overflow: hidden; white-space: nowrap }
.slider-item { float: left; box-sizing: border-box; overflow: hidden; text-align: center }
.slider-item a { display: block; width: 100%; overflow: hidden; text-decoration: none }
.slider-item img { display: block; width: 100% }
```

**Initializing better-scroll**

```javascript
this.slider = new BScroll(this.$refs.slider, {
    scrollX: true,
    scrollY: false,
    momentum: false,
    snap: true,
    snapLoop: this.loop,
    snapThreshold: 0.3,
    snapSpeed: 400,
    click: true
})
```

**Initializing the Dots**

```javascript
_initDots() {
    this.dots = new Array(this.children.length)
}
```

**Autoplay**

```javascript
_autoPlay() {
    let pageIndex = this.pageIndex + 1
    if (this.loop) {
        pageIndex += 1
    }
    this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
    }, this.interval)
}
```

Increment the index by one more when looping, because better-scroll creates an extra copy of a slide.

Listen for the end of scrolling and restart autoplay:

```javascript
this.slider.on('scrollEnd', () => {
    let pageIndex = this.slider.getCurrentPage().pageX
    if (this.loop) {
        pageIndex -= 1
    }
    this.pageIndex = pageIndex
    if (this.autoPlay) {
        clearTimeout(this.timer)
        this._autoPlay()
    }
})
```

**Switching Slides on Click**

Bind a dynamic class to each dot:

```html
<span class="dot" v-for="(item,index) in dots" :class="{active:pageIndex===index}"></span>
```

**Listening for Viewport Changes**

```javascript
window.addEventListener('resize', () => {
    if (!this.slider) return
    this._setSliderWidth(false)
})
```

The argument passed here is false; the idea is to avoid adding the extra width again when looping has already accounted for it.

```javascript
if (this.loop && !resize) {
    width += 2 * sliderWidth
}
```

That completes the carousel component.
