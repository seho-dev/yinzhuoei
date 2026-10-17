---
title: "One Line of Code to Boost Your PC Network Speed Like a Charm!"
description: "Taking a break from frontend topics tonight to share a quick PC tip. Someone asked what to do when network speed feels sluggish despite fast bandwidth. Try disabling Windows auto-tuning to boost your speeds."
date: 2018-07-21
lang: en
translationKey: "2018-07-21_22_教你一行代码让自己的电脑网速开挂运行！！"
categories:
  - "News"
  - "Life"
views: 5877
draft: false
---

Taking a break from frontend topics tonight to share a quick PC tip. Someone asked in the DMs what to do when network speed feels sluggish—sometimes bandwidth is high, yet speeds crawl. In this scenario, you can try disabling Windows reserved auto-tuning bandwidth to let your connection fly.

**Tutorial (Not applicable to Windows Home Edition)**

Step 1: Press Win+R to open the Run dialog, enter `cmd`, and press Enter.

![v2-0456660dab860b530db072760121845c_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/3354017250.jpg)

Step 2: Paste the following command:

```
netsh int tcp set global autotuninglevel=disabled
```

![v2-0456660dab860b530db072760121845c_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/797309795.jpg)

Press Enter, and the configuration is complete.

Speed test comparison:

Before:

![v2-a09f9ee4e828cb3b9533e8b0c471123a_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/1982188397.jpg)

After:

![v2-bff9eb6db49217ea47f1449a3e0eaeea_hd.jpg](https://www.yinzhuoei.com/usr/uploads/2018/07/1551891645.jpg)

---

Source: Zhihu, Author: Li Yunjing
Original Link: https://www.zhihu.com/question/285586045/answer/444484732
