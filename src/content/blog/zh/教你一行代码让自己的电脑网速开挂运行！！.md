---
title: "教你一行代码让自己的电脑网速开挂运行！！"
description: "今晚不更新前端知识了，分享一个电脑使用小技巧。有人在后台问我电脑网速慢怎么办——有时候带宽明明很快，网速却很慢。这种情况可以试试关闭 Windows 保留的带宽，让网速飞起来。 教程开始（Windows 家庭版不适用） 第一步：按 Win+R 打开运行窗口，输…"
date: 2018-07-21
lang: zh
translationKey: "2018-07-21_22_教你一行代码让自己的电脑网速开挂运行！！"
categories:
  - "资讯"
  - "唠嗑"
views: 5877
draft: false
---

今晚不更新前端知识了，分享一个电脑使用小技巧。有人在后台问我电脑网速慢怎么办——有时候带宽明明很快，网速却很慢。这种情况可以试试关闭 Windows 保留的带宽，让网速飞起来。

**教程开始（Windows 家庭版不适用）**

第一步：按 Win+R 打开运行窗口，输入 cmd，回车。

![v2-0456660dab860b530db072760121845c_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/3354017250.jpg)

第二步：把下面这段代码复制进去：

```
netsh int tcp set global autotuninglevel=disabled
```

![v2-0456660dab860b530db072760121845c_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/797309795.jpg)

按回车，就设置好了。

测速对比：

设置前：

![v2-a09f9ee4e828cb3b9533e8b0c471123a_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/1982188397.jpg)

设置后：

![v2-bff9eb6db49217ea47f1449a3e0eaeea_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/1551891645.jpg)

---

内容来源于知乎，作者：李云景
原文链接：https://www.zhihu.com/question/285586045/answer/444484732
