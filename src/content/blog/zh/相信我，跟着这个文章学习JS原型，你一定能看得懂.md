---
title: "相信我，跟着这个文章学习JS原型，你一定能看得懂"
description: "这两天一直在搜集关于JS的原型方面的知识，今天我来总结一下关于原型和原型链等周边相关知识，在这里做一个易于理解的解释。 如果文章有误区或者有错误，请评论欢迎指出; 首先原型是什么？ 原型是js继承的基础，js的继承就是原型的继承 Function的原型对象 我…"
date: 2019-09-29
lang: zh
translationKey: "2019-09-29_116_相信我，跟着这个文章学习JS原型，你一定能看得懂"
categories:
  - "前端"
views: 5966
draft: false
---

这两天一直在搜集关于JS的原型方面的知识，今天我来总结一下关于原型和原型链等周边相关知识，在这里做一个易于理解的解释。
如果文章有误区或者有错误，请评论欢迎指出;

## 首先原型是什么？

原型是js继承的基础，js的继承就是原型的继承

## Function的原型对象

我们先来看一张图，画的比较草率

![微信图片_20190929202953.jpg](https://www.yinzhuoei.com/usr/uploads/2019/09/3985109539.jpg)

> 首先我们创建了一个函数person，那我们通过打印这个函数，会发现里面有一个prototype这个属性，那么这个prototype指的是这个person函数的**原型**，那么我们的函数原型中有一个**构造函数（construtor）**指向的就是person函数

那么我们就知道了函数中的prototype就是原型，原型里面的构造函数指的其实就是我们声明的函数；
搞清楚这个关系之后，我们可以通过new操作符去创建一下构造函数指向新的对象：

var obj = new person();

打印这个obj显示的是_proto_，这个_proto_其实指的就是person中的原型，那么_proto_中的构造函数也就是person构造函数**（印证了我们上一条的观点）**

---

*1. 当new了构造函数之后，和原构造函数没有什么关系了，它只和原构造函数中的原型有关系；*
*2. 当我们new了多个构造函数之后，它们的对象的隐式原型都指向原构造函数的原型，因此它们共享原型中的属性和方法；*
*3. 当我们访问对象中的属性的时候，如果对象本身没有，回去对象中的原型中去查询，如果都没找到则返回未定义，如果对象本身和原型中有同样的属性和方法，会返回对象中的不会返回原型中的（查找的过程就叫**原型链**）*
*4. 我们在对象中想这样修改原型中的值是不可能的：p1.name = "test"; 它只能读取原型中的值不能修改，这样操作是在本身的对象中添加一个name属性*

---

## 证明它们

// 声明一个函数
 function person(){};
 person.prototype.name = "原型中的name";
 person.prototype.age = "原型中的age";
 // 1. new构造函数得出的新对象共享原型的属性和方法
 var person1 = new person();
 var person2 = new person();
 console.log("new构造函数得出的新对象共享原型的属性和方法:" + person1.name); // 原型中的 name
 console.log("new构造函数得出的新对象共享原型的属性和方法:"+ person1.name); // 原型中的name
 // 2. 对象添加/修改属性不会操作原型中的
 person1.others = "对象中的others";
 console.log("对象添加/修改属性不会操作原型中的:" + person1.others); // 对象中的others
 // 3. 对象和原型中存在同一个属性会返回对象中的
 person1.name = "对象中的name";
 console.log("对象和原型中存在同一个属性会返回对象中的:" + person1.name); // 对象中的name

---

## 关于原型的一些属性/方法

> prototype属性： 存在于任何函数（不仅仅是构造函数，其他函数我们不关注而已），指向的是函数中的原型；
> construtor属性：指向的是原构造函数；

function person(){}; 
 console.log(person.prototype.construtor === person); // true
 var person1 = new person();
 console.log(person1 instanceof person); // true

如果要重新赋值新的prototype，比如这样：

person.prototype = {namespace: "1"};
那么会造成这样的情况：
 var person1 = new person();
 console.log(person.prototype.construtor === person); // false
为了避免这样的情况（构造函数指向不正确）:
 person.prototype = {construtor: person, namespace: "1"};

---

> _proto_：隐式原型

所有对象都有一个隐式原型，指向了构造函数的原型,这个原型不可访问，只有在谷歌浏览器，firefox浏览器支持直接._proto_这样的方式去访问，尽量开发者不要操作_proto_，因为不慎会影响继承原型链；
 var person1 = new person();
 console.log(person1._proto_ === person.prototype); // true

> hasOwnProperty：判断属性是否来自对象本身/还是继承了原型中的属性

var person1 = new person();
 person1.name = "shenhao";
 console.log("name属性是不是来自对象本身的呢？" + person1.hasOwnProperty("name")); // true
 console.log("age属性是不是来自对象本身的呢？" + person1.hasOwnProperty("age")); // false
 console.log("sex属性是不是来自对象本身的呢？" + person1.hasOwnProperty("sex")); // false

我们可以看到，hasOwnProperty只能判断对象中的属性，不能判断原型中的属性，而且如果对象中的属性如果为空那么也会返回false;

***那么我们如何判断这个属性是原型上的属性呢？***

> in操作符：查找对象中的属性，如果查找不到会在原型中去查询

var person1 = new person();
 person1.name = "shenhao";
 person.prototype.sex = "男"
 console.log("sex" in person1); // true

但是有一个问题，in操作符查询对象中的属性，如果找到了就会返回对象中的，就不会去查询原型中的了，所以我们这个方案也失败；

所以我们可以用2者结合的方式去写一个函数：

function hasProto(obj, context){
 if(!(context in obj)){
 // 如果原型和对象中都没有属性
 console.log(`${context}不存在${obj}的原型和对象上`)
 }else if(obj.hasOwnProperty(context)){
 console.log(`${context}存在${obj}的对象上`)
 }else {
 // in操作符查询了（成功），但是hasOwnProperty查找却是失败，那么此属性在原型中存在
 console.log(`${context}存在${obj}的原型上`)
 }
 }

## 创建对象的几种“模式”

> 原型的模式，如果在原型中创建了几个属性和方法，所有的构造函数出来的对象都会共享它们，方法共享比较nice，但是属性共享往往是不符合业务的，所以这是它最大的一个缺陷
> 
> 
> 
> 构造函数的模式：每一个构造函数都会创建自己独立的属性和函数，属性自己独一份这没有错误，但是可能同样的函数要写很多份，势必会造成浪费；

但是在构造函数的模式，我们可以对function进行一个封装

function person(){
 this.name = "shenhao";
 this.age = "12";
 this.story = story;
 };

function story(){
 return "一个开心的故事"
 }

var person1 = new person();
 console.log(person1.story()); //一个开心的故事

*作为面向对象的语言，为了性能把方法从对象抽离出来，是非常emmmmm的，你们懂的*

> 组合模式： 封装构造函数（传参）+ 原型模式

function person(name, age){
 this.name = name;
 this.age = age;
 };

person.prototype.story = function(context){
 return context;
 }

var person1 = new person("shenhao", "18");
 console.log(person1.story("123"));

> 动态原型模式： 更优的解决方案，把构造函数和原型都写在了构造函数中

// 声明一个函数
 function person(name, age){
 this.name = name;
 this.age = age;
 if(typeof this.story !== "function"){
 // 说明是第一次创建这个对象, 在原型上绑定
 person.prototype.story = (context) => {
 return this.name + context
 }
 }
 };

var person1 = new person("shenhao", "18");
 console.log(person1.story("你大爷"));

ok, 全部结束，希望你能有所收获
