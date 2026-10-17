---
title: "ReactJS的基础嵌套以及状态"
description: "今天学习了 React 第四章，关于组件嵌套和状态，记录一下希望加深理解。 组件嵌套 React 用 createClass 函数来创建组件。来看个例子： 在一个组件里嵌套另一个组件，就是这么简单。测试通过后会显示两行字。 状态 React 用 getInit…"
date: 2018-07-12
lang: zh
translationKey: "2018-07-12_13_ReactJS的基础嵌套以及状态"
categories:
  - "前端"
views: 5522
draft: false
---

今天学习了 React 第四章，关于组件嵌套和状态，记录一下希望加深理解。

**组件嵌套**

React 用 `createClass` 函数来创建组件。来看个例子：

```javascript
var Part_one = React.createClass({
    render: function () {
        return (
            <div>
                <h1>我爱敲代码</h1>
                <Part_Two/>
            </div>
        );
    }
});

var Part_Two = React.createClass({
    render: function () {
        return (
            <h2>我也爱敲代码</h2>
        )
    }
});
```

在一个组件里嵌套另一个组件，就是这么简单。测试通过后会显示两行字。

**状态**

React 用 `getInitialState` 来定义状态：

```javascript
getInitialState: function () {
    return {
        clickCount: 0,
    }
}
```

改变状态要调用 `setState` 函数。我做了个小项目，点击按钮计数加一：

```javascript
var Click = React.createClass({
    getInitialState: function () {
        return {
            clickCount: 0,
        }
    },
    clickOver: function () {
        this.setState({
            clickCount: this.state.clickCount + 1,
        })
    },
    render: function () {
        return (
            <div>
                <p>点击下面的按钮</p>
                <button onClick={this.clickOver}>点我</button>
                <p>你一共点击了：{this.state.clickCount}</p>
            </div>
        )
    }
});

React.render(<Click/>,
    document.getElementById("window")
)
```

流程是这样的：

1. 定义一个初始状态，返回值是 0
2. 定义一个点击事件，每次 +1
3. 用 setState 更新状态
4. 渲染到页面

有一点点 js 基础的话应该很好理解。

**写在最后**

React 把组件看成状态机。通过用户交互实现不同状态，然后渲染 UI，让界面和数据保持一致。
