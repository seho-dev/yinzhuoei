---
title: "解决回调地狱的优雅姿势asynac和await"
description: "学 ES6 的时候，Promise 是比较新的解决回调方案。去年开始流行 async/await，更简洁。 回调地狱 这样嵌套，参数容易乱，修改也不好改。 Promise 方案 Promise 就是一个承诺，两个参数：resolve 和 reject，用 th…"
date: 2019-01-18
lang: zh
translationKey: "2019-01-18_79_解决回调地狱的优雅姿势asynac和await"
categories:
  - "唠嗑"
views: 5582
draft: false
---

![u=426744177,1467744783&fm=11&gp=0.jpg](https://www.yinzhuoei.com/usr/uploads/2019/01/2564611637.jpg)

学 ES6 的时候，Promise 是比较新的解决回调方案。去年开始流行 async/await，更简洁。

**回调地狱**

```javascript
function ajax(fn) {
    setTimeout(() => {
        console.log('你好')
    }, 1000)
}

// 回调地狱
ajax(() => {
    console.log("执行结束")
    ajax(() => {
        ajax(() => {
            ajax(() => {
            })
        })
    })
    console.log("执行结束")
})
```

这样嵌套，参数容易乱，修改也不好改。

**Promise 方案**

Promise 就是一个承诺，两个参数：resolve 和 reject，用 then 方法接收：

```javascript
function delay(word) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(word)
        }, 2000)
    })
}

delay('孙悟空')
    .then((word) => {
        console.log(word)
        return delay('猪八戒')
    })
    .then((word) => {
        console.log(word)
        return delay('沙悟净')
    })
    .then(word => {
        console.log(word)
    })
```

比原始方式好多了。

**async/await 方案**

更简洁，傻瓜式写法：

```javascript
async function start() {
    const word1 = await delay('孙悟空')
    console.log(word1)
    const word2 = await delay('猪八戒')
    console.log(word2)
    const word3 = await delay('沙悟净')
    console.log(word3)
}
```

`await` 必须跟在 `async` 函数里用，等待执行结果，完美解决异步回调造成的代码混乱。

下一章 Koa 的中间件就是用 async/await 实现的。
