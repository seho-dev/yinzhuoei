---
title: "ReactJS Basics: Nested Components and State"
description: "Today I studied chapter four of my React course, covering nested components and state. These notes are a way to reinforce what I learned: nesting components with createClass, defining initial state with getInitialState, and updating it with setState."
date: 2018-07-12
lang: en
translationKey: "2018-07-12_13_ReactJS的基础嵌套以及状态"
categories:
  - "Frontend"
views: 5522
draft: false
---

Today I studied chapter four of my React course, which covers nested components and state. I'm writing these notes to help the ideas sink in.

**Nested components**

React uses the `createClass` function to create components. Here's an example:

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

Nesting one component inside another is that simple. Run the example successfully and you'll see two lines of text.

**State**

React uses `getInitialState` to define the initial state:

```javascript
getInitialState: function () {
    return {
        clickCount: 0,
    }
}
```

To change state, call `setState`. I made a small example that increments a counter whenever the button is clicked:

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

The flow is as follows:

1. Define an initial state with a counter value of 0.
2. Define a click handler that adds 1 each time.
3. Use setState to update the state.
4. Render it on the page.

This should be easy to follow with a little JavaScript knowledge.

**Final thoughts**

React treats components as state machines. User interactions move a component between states, and React renders the UI accordingly, keeping the interface in sync with the data.
