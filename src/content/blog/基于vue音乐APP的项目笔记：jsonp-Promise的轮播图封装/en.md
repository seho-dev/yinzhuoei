---
title: "Vue Music App Project Notes: Wrapping Carousel Requests with JSONP and Promises"
description: "Use JSONP to fetch QQ Music data across origins. First, install the jsonp package. Wrapping JSONP Create jsonp.js in the common directory. A JSONP request has two parts: the endpoint URL and the parameters. The param function iterates over the parameters and builds a URL-encoded query string, then a Promise wraps the call…"
date: 2018-10-22
lang: en
translationKey: "2018-10-22_57_基于vue音乐APP的项目笔记：jsonp-Promise的轮播图封装"
categories:
  - "Frontend"
views: 5569
draft: false
---

![Downloaded image.jpg](https://www.yinzhuoei.com/usr/uploads/2018/10/3023813468.jpg)

We will use JSONP to fetch data from QQ Music across origins. First, install the jsonp package:

```bash
npm install jsonp --save
```

**Wrapping JSONP**

Create `jsonp.js` in the `common` directory:

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

A JSONP request has two parts: the endpoint URL and the parameters. The `param` function iterates over the parameters and builds a URL-encoded query string. We then call the jsonp library inside a Promise.

**Extracting Shared Configuration**

Many parameters, such as character encoding and the callback name, are shared. Put them in a separate `config.js` file:

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

export const ERR_OK = 0;  // 0 means success
```

**Making a Request**

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

**Calling It from a Component**

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

I was pretty lost the first time I wrote this. It only clicked when I organized my notes. Once you get used to working with these layers of encapsulation, it is a nice approach.
