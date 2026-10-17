---
title: "The Elegant Way to Escape Callback Hell: Async and Await"
description: "When learning ES6, Promise was the newer solution to callbacks. Later async/await became widespread and even cleaner. A quick look at callbacks, Promises, and async/await."
date: 2019-01-18
lang: en
translationKey: "2019-01-18_79_解决回调地狱的优雅姿势asynac和await"
categories:
  - "Life"
views: 5582
draft: false
---

![u=426744177,1467744783&fm=11&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2019/01/2564611637.jpg)

When learning ES6, Promise was the newer solution to handle asynchronous callbacks. Lately async/await has taken center stage, offering an even cleaner approach.

**Callback Hell**

```javascript
function ajax(fn) {
    setTimeout(() => {
        console.log('Hello')
    }, 1000)
}

// Callback hell
ajax(() => {
    console.log("Execution finished")
    ajax(() => {
        ajax(() => {
            ajax(() => {
            })
        })
    })
    console.log("Execution finished")
})
```

Deep nesting like this easily scrambles parameters and makes refactoring painful.

**The Promise Approach**

A Promise represents a commitment with two outcomes: resolve and reject, handled via `.then()`:

```javascript
function delay(word) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(word)
        }, 2000)
    })
}

delay('Sun Wukong')
    .then((word) => {
        console.log(word)
        return delay('Zhu Bajie')
    })
    .then((word) => {
        console.log(word)
        return delay('Sha Wujing')
    })
    .then(word => {
        console.log(word)
    })
```

Much better than raw nested callbacks.

**The async/await Approach**

Even cleaner, straightforward synchronous-looking syntax:

```javascript
async function start() {
    const word1 = await delay('Sun Wukong')
    console.log(word1)
    const word2 = await delay('Zhu Bajie')
    console.log(word2)
    const word3 = await delay('Sha Wujing')
    console.log(word3)
}
```

`await` must be used inside an `async` function. It pauses until the promise settles, eliminating asynchronous callback nesting altogether.

In the next chapter, Koa middleware is implemented using async/await.
