---
title: "Vuex：项目中的关于资源共享的复习"
description: "最近做项目用到了 Vuex，写了很长时间 Java，再写 Vue 有些生疏。直接进入正题，复习一下 Vuex，做一个简单的数据共享存储。 目录结构 index.js getter.js mutations-type.js mutation.js store 配…"
date: 2018-11-07
lang: zh
translationKey: "2018-11-07_66_Vuex：项目中的关于资源共享的复习"
categories:
  - "前端"
views: 5666
draft: false
---

最近做项目用到了 Vuex，写了很长时间 Java，再写 Vue 有些生疏。直接进入正题，复习一下 Vuex，做一个简单的数据共享存储。

**目录结构**

```
store/
├── action.js        // 异步操作（本例没用到）
├── getter.js        // 对属性包装，通过 getter 获取值
├── index.js         // Vuex 入口文件
├── mutations-type.js // 定义变量类型
├── mutation.js      // 对属性赋值
└── state.js         // 定义数据对象
```

**index.js**

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './action'
import * as getters from './getter'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
```

**getter.js**

```javascript
export const singer = state => state.singer
```

**mutations-type.js**

```javascript
export const SET_SINGER = 'SET_SINGER'
```

**mutation.js**

```javascript
import * as types from './mutations-type'

const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    }
}

export default mutations
```

store 配置完成后，在 main.js 中引入即可。

**组件中使用**

设置值：

```javascript
import { mapMutations } from 'vuex'

...mapMutations({
    setSinger: 'SET_SINGER'
})
```

调用 `this.setSinger(item)` 就能把值存到仓库。

取值：

```javascript
import { mapGetters } from 'vuex'

computed: {
    ...mapGetters([
        'singer'
    ])
},
created() {
    console.log(this.singer)
}
```

这样就能在控制台看到对象和 Vuex 的 debug 信息了。

![QQ截图20181107113821.png](https://www.yinzhuoei.com/usr/uploads/2018/11/549315360.png)
