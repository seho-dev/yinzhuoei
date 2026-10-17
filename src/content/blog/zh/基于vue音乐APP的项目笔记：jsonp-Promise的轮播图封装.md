---
title: "基于vue音乐APP的项目笔记：jsonp-Promise的轮播图封装"
description: "用 jsonp 跨域获取 QQ 音乐的数据。先安装 jsonp 插件： 封装 jsonp 在 common 目录下新建 jsonp.js： jsonp 请求分两部分：url 接口和参数。param 方法把参数循环处理，拼成 URL 编码格式，然后通过 Prom…"
date: 2018-10-22
lang: zh
translationKey: "2018-10-22_57_基于vue音乐APP的项目笔记：jsonp-Promise的轮播图封装"
categories:
  - "前端"
views: 5569
draft: false
---

![下载.jpg](https://www.yinzhuoei.com/usr/uploads/2018/10/3023813468.jpg)

用 jsonp 跨域获取 QQ 音乐的数据。先安装 jsonp 插件：

```bash
npm install jsonp --save
```

**封装 jsonp**

在 common 目录下新建 jsonp.js：

```javascript
import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

export function param(data) {
    let url = '';
    for (var i in data) {
        let value = data[i] !== undefined ? data[i] : '';
        url += `&${i}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : ''
}
```

jsonp 请求分两部分：url 接口和参数。param 方法把参数循环处理，拼成 URL 编码格式，然后通过 Promise 调用 jsonp 库。

**抽离公共配置**

很多参数是共用的，比如编码、callback 等，单独放一个 config.js：

```javascript
export const commonParams = {
    g_tk: 5381,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
}

export const options = {
    param: "jsonpCallback"
}

export const ERR_OK = 0;  // 0 表示成功
```

**调用方式**

```javascript
import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options);
}
```

**组件中调用**

```javascript
created() {
    this._getData();
},
methods: {
    _getData() {
        getRecommend().then((val) => {
            if (val.code === ERR_OK) {
                this.recommend = val.data.slider;
            }
        })
    }
}
```

第一次写的时候很懵，整理笔记才发现原来是这样。适应这种封装环境就好，很不错。
