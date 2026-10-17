---
title: "从0实现一个简易Button，理解WebComponent规范"
description: "写在前面 博主要在西安找一个好工作，前端/全栈岗位，中级前端岗位，希望目标公司双休，做自研产品的最好，技术氛围好的优先，水友们有岗位或者HR朋友看到我这个文章请与我联系，po一下简历吧: 沈昊.pdf 联系方式微信：npminstalls 正文 关于WebCo…"
date: 2021-04-09
lang: zh
translationKey: "2021-04-09_501_从0实现一个简易Button，理解WebComponent规范"
categories:
  - "前端"
  - "精读"
views: 6155
draft: false
---

![微信截图_20210409201630.png](https://static.yinzhuoei.com/typecho/2021/04/09/706033098720605/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210409201630.png)

## 写在前面

博主要在西安找一个好工作，前端/全栈岗位，中级前端岗位，希望目标公司双休，做自研产品的最好，技术氛围好的优先，水友们有岗位或者HR朋友看到我这个文章请与我联系，po一下简历吧:
[沈昊.pdf](https://static.yinzhuoei.com/typecho/2021/04/08/493582078515407/%E6%B2%88%E6%98%8A.pdf)
**联系方式微信：npm_install_s**

## 正文

关于WebComponents的文章其实过年就想写的，但是自身的理解都太片面，所以最近才去边学边写。**webCompoents下文中简称WC**。从毕业开始如果有面试任务我都会尝试地问一下候选人是否了解过WC，很遗憾面试了半百的人，我连了解过ShadowCompoents的人都没遇到过，可能是面试地薪资要求太低，亦或者是有2-3年开发经验的工程师没有留意过类似的规范，今天我们就来好好梳理一下WC是什么，为什么WC影响了我们现在开发前端的方式吧！

## 是什么

WC是一套技术，允许开发者创建一套可以定制的元素(组件)，相关逻辑和样式都会封装在元素中，并且你可以直接使用它。WC的出现解决了以往前端领域中，对多个具有相似性的功能只能复制粘贴从而造成代码臃肿的问题；WC的出现也推动了模块化/组件化的发展，让更多开发者享受封装组件带来的便利。

---

WC有3个要素：

1. Custom Element 自定义元素
2. ShadowDom 影子盒模型
3. HTML模板

在HTML中有大多数的标签已经是运用到WC的技术了，比如熟悉的input,video,audio,select等等，我们从现在开始从0实现一个Button组件。要掌握WC的运用，需从实践开始。

## 影子DOM

我们在写HTML的时候，使用一些标签就可以表达一个具有形式和结构的页面，我们人类去编写这样的代码会很容易，但是机器却不会了，机器需要将HTML转换为真正的文档，而页面结构将会被解析成数据模型（对象/节点），浏览器通过创建这样的节点树（DOM）来确定用户写的HTML的层次结构，DOM最主要的特性是实时的，我们可以通过程序去操控它:

```
const title = document.createElement(\"div\");
title.textContent = \"hello\"
document.body.appendChild(title);
```

这就是为什么我们可以直接通过js来操作页面上的效果就是因为DOM的存在；
那么影子DOM的意思其实已经在字面上了，“隐藏在影子中你看不到”的DOM，举一个简单的例子，我们写一个video标签:

```
<video>
   <source src=\"movie.mp4\" type=\"video/mp4\">
</video>
```

控制台显示如下内容:

![微信截图_20210408113550.png](https://static.yinzhuoei.com/typecho/2021/04/08/52968343242373/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210408113550.png)

在video这样的WC下，有许多DOM都隐藏在其中，这些隐藏DOM都是内置好的功能和样式，在shadowDom中所有的样式和逻辑都是与外部隔绝，不会出现css冲突的问题。

创建一个简单的shadowDom:

```
const title = document.getElementById(\"title\");
const shadowRoot = title.attachShadow({mode: \'open\'});
shadowRoot.innerHTML = \"<div>this is shadowDOM</div>\"
```

此shadowRoot存在于title的节点树之下被称之为**阴影树**，而title就是**阴影根**，shadowRoot独立于title，shadowRoot中的内容样式逻辑都皆在组件本地，所以这就是shadowRoot不会造成css冲突的原因。

但是需要注意，并不是所有元素都可以承载shadowDOM，以下几种情况shadowDOM将无效/报错:

1. 已经承载了shadowDOM的元素比如input,textarea等
2. 元素承载了shadowDOM是img标签

除了我们可以定义”open“的shadowDOM之外，我们还可以定义闭合的shadowDOM:

```
const shadowRoot = title.attachShadow({mode: \'closed\'});
```

HTML内部的Video标签就是一个闭合的shadowDOM，它的意义主要在于外部的JS是无法访问这个shadowDOM的，无论你使用assignedSlot/composedPath等等都是无效的。**请记住闭合的shadowDOM不是很有用处，大可不必使用它，它不是我们理解的“安全的ShadowDOM”。**

## 创建Custom Element

我们创建一个自定义的元素，结合使用shadowDOM，来完成我们开头说的button组件。

```
customElements.define(
  \"i-button\",
  class extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: \"open\" });
      shadowRoot.innerHTML = `
        <div class=\"button\">
            <slot name=\"icon\"></slot>
            <slot></slot>
        </div>
      `;
    }
  }
);
```

我们通过**customElements**对象创建一个自定义组件，组件接收一个类，此时i-button的影子DOM就是我们在构造函数中定义的，影子DOM内容是标签，关于**插槽**稍后再讲述，我们先尝试使用i-button。

```
<i-button>提交</i-button>
```

页面正常渲染我们的button组件，如果不出意外的话，你能在控制台看到我们刚刚编写的自定义元素以及元素下的shadowDOM。

## 组合和插槽

组合在shadowDOM中是一个很重要的概念，我们在HTML中使用各式各样的标签完成页面，页面的构成是各种标签的组合，而组件也是一样，例如video标签，我们通过video的子级source来定义媒介资源地址，但是它却不会渲染。

别着急，我们先来梳理下几个术语概念：

### Light DOM

指的是用户编写的内容，比如在上文中，我们使用了i-button组件，在这个组件中我们写下了字 “提交”那么此时“提交”就是Light DOM，此时“提交”是实际子元素，它是真实存在的，而不像是shadowDOM。

### Shadow DOM

具体的意义上文提到过，补充一下ShadowDOM对组件而言是本地的，它还可以定义一些“**标记**”或者说是“**插槽**”

使用过vue的水友们，应该更能体会插槽带来的便利，插槽是组件内部的占位符，方便使用者编写的LightDOM按照**指定的方式**和组件一起呈现出来，那么这个**指定的方式**也就是插槽的类型了:

#### 具名插槽

在组件内部定义的之后，我们使用组件的时候可以这么使用:

```
<i-button>
    <img slot=\"icon\" src=\"icon.png\"></img>
    提交
</i-button>
```

#### 默认插槽

默认插槽就是我们组件中写的内容，比如就是上文中的提交二字，它没有被slot标记，就会默认放在组件中的位置渲染。如果用户不在组件提供LigntDOM，那么我们可以定义一个**后备插槽**以便备用:

```
/* 默认渲染的位置 */
<slot></slot>
<slot>如果用户没传递内容，那么将会显示我</slot>
```

当用户编写的LightDOM被组件定义的插槽使用了，那么此时，这个元素并不是被插槽移动了位置，插槽没有移动位置的功能，其实就是浏览器把LightDOM元素渲染到了shadowDOM的位置上了而已。

理解了插槽之后，我们就可以使用更多的标签将其组合在一起，构成一个较为完整且实用的组件了，当然还有样式！

## 样式

ShadowDOM最有趣的特型就是作用域CSS了，外部的css选择器不会影响到shadowDOM，内部的也不会影响外部的，css的作用域为**阴影根**。
我们来定义一下Button组件的样式:

```
#shadow-root
<style>
 .button{
   background: red;
 }
</style>
<div class=\"button\">
  <slot name=\"icon\"></slot>
  <slot></slot>
</div>
```

oh, no,尽管它定义成了红色很丑，但是不妨碍我们研究它的作用域CSS;

```
<link rel=\"stylesheet\" href=\"styles.css\">
<div></div>
```

还可以加入link标签引入一个css，这个css也是带有作用域的。
我们在写WC的时候，不仅会需要组件自身维护自己的样式，也需要外部组件可以通过一种方法改变组件内部样式，这样既保证了封装性又有灵活性，那么:host这个伪类是需要了解的。

:host是一个选择宿主的伪类选择器，我们可以使用:host来匹配宿主或者宿主下的元素:

```
<style>
    :host{
        color: #fff;
    }
</style>
```

也可以匹配阴影根下的元素:

```
:host(.button){
    background: blue;
}
```

也可以定义插槽样式:

```
::slotted(.icon){
   width: 2px;
   height: 2px;
}
```

从外部定义自定义组件的样式，直接使用元素名进行设置:

```
i-button:hover{
    opacity: 0.8;
}
```

当外部设置了样式之后，优先级会大于内部的css规则，比如:

```
:host{
   opacity: 0.1;
}
```

通常开发者编写自己的组件的时候，会使用CSS自定义属性，而使用者可以修改其CSS自定义属性:

```
<style>
    i-button{
        /*我很喜欢红色*/
        --diy-bg: red;
    }
</style>
<i-button background></i-button>
```

影子dom这样写:

```
:host([background]){
    background: var(--diy-bg, black);
}
```

我们在使用组件的时候给自定义元素设置了一个值为red，然后在自定义元素中加了一个“background”的属性，然后在其shadowDOM中匹配了元素如果有属性background的话：**就设置背景为外部传入的“red”，如果外部没有传入，则就是默认的“black“。**

当然开发组件的时候，我们需要告知使用者一些内置的css自定义属性。

## 技巧

### 使用css containment

我们可以使用“css遏制”来优化web组件重排重绘的性能，当web组件内部进行了UI/位置变更，势必会引起页面的重排和重绘，使用css遏制之后告诉浏览器，组件这一块是一块独立的DOM，浏览器就不会造成整个页面的重排重绘了，只会在组件内部进行重排和重绘。

```
:host {
  display: block;
  contain: content; /* Boom. CSS containment FTW. */
}
```

### 使用Template

使用Template代替innerHTML,使用template之后你会发现，vue的组件就是使用这种方式来呈现组件的，它们都是一样的！使用template会更清晰地看到组件的DOM结构。

```
<template id=\"i-button\">
    <div class=\"button\">
      <slot name=\"icon\"></slot>
      <slot></slot>
    </div>
</template>
<script>
    customElements.define(
      \"i-button\",
      class extends HTMLElement {
        constructor() {
          super();
          var template = document
            .getElementById(\'i-button\')
            .content;
          const shadowRoot = this.attachShadow({ mode: \"open\" }).appendChild(template.cloneNode(true));
          `;
        }
      }
    );
  </script>
    // 使用Button组件
    <i-button></i-button>
    <style>
         // 增加一些Style样式
    </style>
```
