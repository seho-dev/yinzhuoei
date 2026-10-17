---
title: "I Bet You Haven't Fallen for JavaScript's reduce Yet—It's Surprisingly Good!"
description: "I haven't posted for a while because I've been busy, so from now on I'll aim for weekly updates. These posts are really a record of what I've learned, rather than formal tutorials. Today, let's talk about reduce. When writing application code, we often reach for forEach, for...in, or map—but what makes reduce different…"
date: 2019-11-10
lang: en
translationKey: "2019-11-10_134_我赌你还没有入坑js数组方法 “Reduce”，真香~"
categories:
  - "Frontend"
views: 6096
draft: false
---

I haven't posted for a while because I've been pretty busy. Going forward, I'll generally aim for weekly updates. These posts are really a record of what I've learned, not formal educational articles.

Today, let's talk about reduce. When writing application code, we often reach for iteration tools such as forEach, for...in, and map. So how is reduce different? It serves a similar purpose, but suits different situations. It can handle the things those other methods do, as well as some things they can't. It also has one other great advantage: it makes you look pretty slick~~. And since reduce is a higher-order function, using it appropriately at work can improve code quality, too.

I like to work through concepts with examples, so let's start with one.

```
let arr = [1, 2, 3, 4, 5];
let result1 = arr.reduce((prev, current, index, arr) => {
  console.log(prev, current, index, arr);
  return prev + current;
});
console.log("最后结果:" + result1);
```

> This example sums the values in an array. The result is stored in result1.

![WeChat screenshot_20191110204719.png](https://www.yinzhuoei.com/usr/uploads/2019/11/2684707566.png)

Here's how reduce works: it iterates over an array, executing a callback on each iteration.

prev: the value returned by the previous callback invocation
current: the array element currently being processed
index: the current iteration index
arr: the array on which reduce was called

In addition to the callback's four parameters, reduce takes another argument called **initialValue**. As the name suggests, this is the initial value. What does setting it actually do?

In the screenshot above, the third parameter takes the values 1, 2, 3, and 4. There are only four iterations and four callback invocations. That may seem surprising. What happens if we set initialValue to 0?

![WeChat screenshot_20191110211155.png](https://www.yinzhuoei.com/usr/uploads/2019/11/1143094933.png)

With an initial value, we start at index 0. Without one, reduce uses the first element as the initial accumulator and starts the callback at the second element.

Now, what happens if the array is empty?

![WeChat screenshot_20191110212059.png](https://www.yinzhuoei.com/usr/uploads/2019/11/494531973.png)

The browser tells us that reducing an empty array without an initial value throws an error. So, to make our code more robust and safe:

Always set **initialValue**.

---

## reduce: A Simple Use Case

1. Summing an array

```
let arr = [1,2,3,4];
 let sum = arr.ruduce((pre,cur) => pre*cur);
```

## reduce: Advanced Use Cases

1. Counting how often each element appears in an array

```
let arr = ["昊儿", "王航", "范冰冰", "王航"];
 let result1 = arr.reduce((prev, current, index, arr) => {
   if (current in prev) {
    // 如果存在，就加一
    prev[current]++;
   } else {
    prev[current] = 1;
   }
   return prev;
 }, {});

 console.log(result1);
```

Result:

![WeChat screenshot_20191110214157.png](https://www.yinzhuoei.com/usr/uploads/2019/11/2642640018.png)

1. Removing duplicates from an array

```
let arr = ["昊儿", "王航", "范冰冰", "王航"];
 let result1 = arr.reduce((prev, current, index, arr) => {
   if (!prev.includes(current)) {
 // 如果不存在
 prev.push(current);
   }
   return prev;
 }, []);
 console.log(result1);
```

![WeChat screenshot_20191110214645.png](https://www.yinzhuoei.com/usr/uploads/2019/11/4232860085.png)

1. Flattening a two-dimensional array into a one-dimensional array

```
let arr = ["昊儿", "王航", "范冰冰", "王航", [1, 2, 3]];
 let result1 = arr.reduce((prev, current, index, arr) => {
   return prev.concat(current);
 }, []);
 console.log(result1);
```

![WeChat screenshot_20191110215557.png](https://www.yinzhuoei.com/usr/uploads/2019/11/2437055366.png)

1. Flattening a multidimensional array into a one-dimensional array

```
let arr = ["昊儿", "王航", "范冰冰", "王航", [1, 2, 3, [2, 3, 4]]];

 let test = function(cur) {
   return cur.reduce((prev, current, index, arr) => {
 return prev.concat(Array.isArray(current) ? test(current) : current);
   }, []);
 };
 console.log(test(arr));
```

After those examples, all I can say is: okay, I'm sold… hahaha.

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2019/11/1522782276.jpg)
