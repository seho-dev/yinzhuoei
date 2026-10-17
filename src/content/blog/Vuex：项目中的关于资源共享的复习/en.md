---
title: "Vuex: A Refresher on Sharing Data in a Project"
description: "A recent project called for Vuex. After spending a long time writing Java, I was a little rusty with Vue. Let's get straight to a Vuex refresher and build a simple shared data store, covering the directory structure, getters, mutation types, mutations, and store configuration…"
date: 2018-11-07
lang: en
translationKey: "2018-11-07_66_Vuex：项目中的关于资源共享的复习"
categories:
  - "Frontend"
views: 5666
draft: false
---

A recent project called for Vuex. After spending a long time writing Java, I was a little rusty with Vue. Let's get straight to a Vuex refresher and build a simple shared data store.

**Directory Structure**

```
store/
├── action.js        // Async operations (not used in this example)
├── getter.js        // Wrap properties and retrieve values through getter
├── index.js         // Vuex entry file
├── mutations-type.js // Define variable types
├── mutation.js      // Assign property values
└── state.js         // Define data objects
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

Once the store is configured, import it in main.js.

**Using It in a Component**

Setting a value:

```javascript
import { mapMutations } from 'vuex'

...mapMutations({
    setSinger: 'SET_SINGER'
})
```

Call `this.setSinger(item)` to save the value to the store.

Retrieving a value:

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

You should now see the object and Vuex debug information in the console.

![QQ screenshot 20181107113821.png](https://www.yinzhuoei.com/usr/uploads/2018/11/549315360.png)
