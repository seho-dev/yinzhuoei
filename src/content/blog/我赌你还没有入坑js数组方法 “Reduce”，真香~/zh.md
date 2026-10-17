---
title: "我赌你还没有入坑js数组方法 “Reduce”，真香~"
description: "这段时间一直没有更新文章，实在是有点忙，所以以后基本都会每周周更，文章其实就是自己学习的一个成果展示，并不是什么科普文章哟 今天我们来聊聊reduce，之前呀我们在写业务的时候，循环非常喜欢forEach, for in,map等循环api，但是reduce和…"
date: 2019-11-10
lang: zh
translationKey: "2019-11-10_134_我赌你还没有入坑js数组方法 “Reduce”，真香~"
categories:
  - "前端"
views: 6096
draft: false
---

这段时间一直没有更新文章，实在是有点忙，所以以后基本都会每周周更，文章其实就是自己学习的一个成果展示，并不是什么科普文章哟

今天我们来聊聊reduce，之前呀我们在写业务的时候，循环非常喜欢forEach, for in,map等循环api，但是reduce和这些有什么区别呢，其实reduce循环和刚刚提到这几个循环作用都是一样，但是适用于场景也不一样，它能干其他循环干的了的，也能干其他循环干不了的，还有一个很好的优点就是：很装逼~~， 而且reduce毕竟是高阶函数，在公司中合适的用到它，也能适当提示代码质量。

我喜欢用例子去解决一个知识点，所以我们从例子出发

```
let arr = [1, 2, 3, 4, 5];
let result1 = arr.reduce((prev, current, index, arr) => {
  console.log(prev, current, index, arr);
  return prev + current;
});
console.log("最后结果:" + result1);
```

> 这是一个数组值求和的例子，result1就是结果

![微信截图_20191110204719.png](https://www.yinzhuoei.com/usr/uploads/2019/11/2684707566.png)

下来描述一下reduce的用法： reduce为数组提供遍历方法，每一次遍历都会执行一次回调函数；

prev: 上一次回调函数返回的值
current: 当前遍历的数组元素
index: 循环当前索引
arr: 调用reduce函数的数组

reduce方法除了回调函数的四个参数，还有一个参数叫做**initialValue**，字面意思： 初始化值，那么设置这个初始化值有什么用呢？

上面的那个图片例子中的第三个参数分别是1，2，3，4，只循环了4次，执行了4次回调函数，这并不符合常理，但是如果我们把initialValue设置成0，会如何呢？

![微信截图_20191110211155.png](https://www.yinzhuoei.com/usr/uploads/2019/11/1143094933.png)

设置了初始值，我们就从0开始了，可见如果不设置初始值，reduce会自动跳过第一个直接进行第二次循环；

那么数组为空，我们看会造成什么？

![微信截图_20191110212059.png](https://www.yinzhuoei.com/usr/uploads/2019/11/494531973.png)

浏览器会提示我们当数组为空，如果不设置初始值会报错，所以我们在循环的时候，为了代码严谨和安全：

务必要设置**initialValue**

---

## reduce：简单场景

1. 数组求和

```
let arr = [1,2,3,4];
 let sum = arr.ruduce((pre,cur) => pre*cur);
```

## reduce: 高级场景

1. 统计数组中的元素出现的次数

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

结果：

![微信截图_20191110214157.png](https://www.yinzhuoei.com/usr/uploads/2019/11/2642640018.png)

1. 数组去重复

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

![微信截图_20191110214645.png](https://www.yinzhuoei.com/usr/uploads/2019/11/4232860085.png)

1. 二维数组转换为一维数组

```
let arr = ["昊儿", "王航", "范冰冰", "王航", [1, 2, 3]];
 let result1 = arr.reduce((prev, current, index, arr) => {
   return prev.concat(current);
 }, []);
 console.log(result1);
```

![微信截图_20191110215557.png](https://www.yinzhuoei.com/usr/uploads/2019/11/2437055366.png)

1. 多维数组转换为一维数组

```
let arr = ["昊儿", "王航", "范冰冰", "王航", [1, 2, 3, [2, 3, 4]]];

 let test = function(cur) {
   return cur.reduce((prev, current, index, arr) => {
 return prev.concat(Array.isArray(current) ? test(current) : current);
   }, []);
 };
 console.log(test(arr));
```

看完这些例子，我会说：真香...哈哈哈

![timg.jpg](https://www.yinzhuoei.com/usr/uploads/2019/11/1522782276.jpg)
