---
title: "关于ReactJS框架的入门：需要注意的几点"
description: "React 起源于 Facebook 内部项目。因为对市面上所有 JavaScript MVC 框架都不满意，决定自己写一套，用来架设 Instagram 的网站。2013年5月开源了。 几点注意点 1.安装 react 尽量使用 bower，并且要有 git…"
date: 2018-07-11
lang: zh
translationKey: "2018-07-11_8_关于ReactJS框架的入门：需要注意的几点"
categories:
  - "前端"
views: 7792
draft: false
---

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/2443341939.jpg)

React 起源于 Facebook 内部项目。因为对市面上所有 JavaScript MVC 框架都不满意，决定自己写一套，用来架设 Instagram 的网站。2013年5月开源了。

**几点注意点**

1.安装 react 尽量使用 bower，并且要有 git 环境，安装成功后引入 JS 文件即可。

2.也可以直接用在线引用地址。分享几个国内访问速度较快的库：

```html
<script src="http://apps.bdimg.com/libs/jquery/2.1.1/jquery.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>
```

3.准备一个 div 容器：

```html
<div id="main"></div>
```

4.写 JS 代码。React 采用组件化的方式，后续优化方便，也避免了重复代码：

```javascript
var Box = React.createClass({
    render: function () {
        var style = {
            height: '100px',
            color: 'red'
        }
        return <p style={style}>hello world</p>
    }
});
```

注意：JS 代码前要写 `<script type="text/jsx">`，不是 `text/javascript`。jsx 是 js and xml 格式的缩写，是 React 框架特有的写法。

5.渲染到页面：

```javascript
React.render(<Box/>,
    document.getElementById("main"),
    function () {
        console.log("渲染完毕")
    }
)
```

render 函数三个参数：

- 第一个是组件，变量名首字母必须大写
- 第二个是容器位置
- 第三个可选，渲染完成后执行的回调函数
