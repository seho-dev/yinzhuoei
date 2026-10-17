---
title: "基于vue音乐APP的项目笔记：轮播图组件封装（下）"
description: "现在对之前的代码进行封装。上次已经通过 jsonp 获取到轮播图数据了，这次定义一个轮播图组件。 模板 <slot 插槽起占位作用。 组件数据 在钩子中初始化，延迟 20ms 加载： 计算宽度 动态给子元素添加类名，匹配 CSS 样式： 需要循环播放时要 ×2…"
date: 2018-10-22
lang: zh
translationKey: "2018-10-22_61_基于vue音乐APP的项目笔记：轮播图组件封装（下）"
categories:
  - "前端"
views: 6004
draft: false
---

![QQ截图20181022125102.png](https://www.yinzhuoei.com/usr/uploads/2018/10/3912784574.png)

现在对之前的代码进行封装。上次已经通过 jsonp 获取到轮播图数据了，这次定义一个轮播图组件。

**模板**

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

`<slot>` 插槽起占位作用。

**组件数据**

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

在钩子中初始化，延迟 20ms 加载：

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

**计算宽度**

动态给子元素添加类名，匹配 CSS 样式：

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

需要循环播放时要 ×2 宽度。

**DOM 操作封装**

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

**CSS 样式**

```css
.slider { min-height: 1px }
.slider-group { position: relative; overflow: hidden; white-space: nowrap }
.slider-item { float: left; box-sizing: border-box; overflow: hidden; text-align: center }
.slider-item a { display: block; width: 100%; overflow: hidden; text-decoration: none }
.slider-item img { display: block; width: 100% }
```

**初始化 better-scroll**

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

**初始化点**

```javascript
_initDots() {
    this.dots = new Array(this.children.length)
}
```

**自动播放**

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

循环播放时自动加一，因为 better-scroll 会多拷贝一页。

监听滚动结束事件，重新执行自动播放：

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

**点击切换**

给点绑定动态 class：

```html
<span class="dot" v-for="(item,index) in dots" :class="{active:pageIndex===index}"></span>
```

**监听视口变化**

```javascript
window.addEventListener('resize', () => {
    if (!this.slider) return
    this._setSliderWidth(false)
})
```

传递 false 是因为 loop 循环时已经 ×2，不需要重复乘。

```javascript
if (this.loop && !resize) {
    width += 2 * sliderWidth
}
```

这样轮播图组件就完成了。
