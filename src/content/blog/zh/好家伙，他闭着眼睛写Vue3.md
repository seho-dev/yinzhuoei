---
title: "好家伙，他闭着眼睛写Vue3"
description: "一个风和日丽的下午，我用了3个小时写了一个Vue3的小应用，这个应用小到不足为奇，但是Vue3的开发体验最值得我吹一波，这个小应用在登录我用了Vuex4，路由管理用到了最新的VueRouter4，而UI框架选择的是Vant3，有赞团队的Vant3最新版也是目前…"
date: 2020-10-28
lang: zh
translationKey: "2020-10-28_425_好家伙，他闭着眼睛写Vue3"
categories:
  - "前端"
  - "资讯"
  - "唠嗑"
  - "精读"
views: 6311
draft: false
---

![好家伙，他闭着眼睛写Vue3](http://static.yinzhuoei.com/typecho/2020/10/28/977471570039863.png)

一个风和日丽的下午，我用了3个小时写了一个Vue3的小应用，这个应用小到不足为奇，但是Vue3的开发体验最值得我吹一波，这个小应用在登录我用了Vuex4，路由管理用到了最新的VueRouter4，而UI框架选择的是Vant3，有赞团队的Vant3最新版也是目前为止Vue3支持度最高的移动UI库，放一个项目预览GIF图

![](http://static.yinzhuoei.com/typecho/2020/10/28/980461307396240.gif)

整个的开发体验，我总结了一下：有近似ReactHook的开发体验，又保留了Vue2的原汁原味，同时因为Vue3的本身设计原因，也提升了在react中没有的hook开发体验，所以如同标题，如果开发者拥有reactHook开发经验和vue2开发经验，可谓是“闭着眼睛”都能撸Vue3。

> Github地址：[https://github.com/1018715564/PlanListForVue3](https://link.zhihu.com/?target=https%3A//github.com/1018715564/PlanListForVue3)

---

main.js

新版的vue一改以前的构造函数去挂载，而是把函数风格贯彻到底了，在入口文件中我们使用链式调用，一直use一直爽。

```
import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router";
import Vuex from "./store";
import Vant from "vant";
import "vant/lib/index.css";

createApp(App).use(Router).use(Vant).use(Vuex).mount("#app");
```

Router

```
import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login/Index.vue";
import Index from "../pages/Index/Index.vue";
const routerHistory = createWebHistory();
const Router = createRouter({
  history: routerHistory,
  routes: [
    {
      name: "Index",
      path: "/",
      component: Index
    },
    {
      name: "Login",
      path: "/Login",
      component: Login
    }
  ]
});

export default Router;
```

可以看到Router还是保留了vueRouter3的路由配置，但是创建路由的方式改为了createRouter，原先的路由模式也从原来的mode: "history"也改为了通过函数引入：

```
"history"：createWebHistory()
"hash"：createWebHashHistory()
"abstract"：createMemoryHistory()
```

Vuex

```
import Vuex from "vuex";
export default Vuex.createStore({
  state: {
    user: null,
    planList: []
  },
  mutations: {
    // 删除一个计划
    deletePlan(state, index) {
      state.planList.splice(index, 1);
    },
    // 新增一个计划
    addPlan(state, plan) {
      state.planList.push(plan);
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {},
  modules: {}
});
```

我们通过vuex4中的createStore创建了实例，其中我们定义了一些方法和state，这些我们在登录和添加删除计划时会用到，下来我们再看看如何在页面中使用Vue3的组合API以及路由和状态管理。

登录页面

```
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";
export default {
  name: "App",
  setup() {
    const store = useStore();
    const router = useRouter();
    // 用户名和密码
    const Form = reactive({
      username: "",
      password: "",
    });
    // 登录
    function handelLogin() {
      store.commit("setUser", {
        username: Form.username,
        password: Form.password,
      });
      Toast(`登录成功，你好: ${Form.username}, 请添加你的计划吧~`);
      // 跳转到首页
      router.push({
        path: "/",
      });
    }
    return {
      Form,
      handelLogin,
      handelNavBack,
    };
  }
```

我们使用路由以及状态管理需要从2个包中引入对应的hook去调用

调用vuex中的mutation：

```
store.commit(fnName, args);
```

路由也沿用了VueRouter3中一些老API，replace, go, back等方法都基本不变

```
const router = useRouter();
 router.push({
   path: "/",
 });
```

如果从来没有使用过组合API的开发者，应该需要了解一下前置知识，例如在老版本中，我们定义变量和方法是这样：

```
data(){
  return {
    count: 0
  }
},
methods: {
  back(){
    return "It is back"
  }
}
{{count}} //在template中这样渲染
```

我们在vue3中需要把这些东西写到setup这个函数中，包括变量，函数，监听，计算属性，生命周期等等，然后把变量return出去供模板使用，很显然我们在登录时候用了reactive这个API，它可以传入一个普通对象，返回一个响应式的代理，我们用这个对象中的用户名和密码与视图绑定最后调用vuex的方法即可让全局状态管理知道此时 “计划APP” 是有身份进入的。

```
const Form = reactive({
  username: "",
  password: "",
});

// 调用vuex登录方法
store.commit("setUser", {
  username: Form.username,
  password: Form.password,
});
```

首页

```
import { ref, reactive, computed, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Toast, Dialog } from "vant";

export default {
  name: "Index",
  setup() {
    const store = useStore();
    const router = useRouter();
    const planList = store.state.planList;
    const addPlanForm = reactive({
      title: "",
      remark: "",
    });
    // 添加的弹出层
    const addPopup = ref(false);
    // 计算计划的个数
    const planCount = computed(() => store.state.planList.length);
    // 如果没登录重定向到登录
    if (store.state.user === null) {
      Toast("未登录，请先登录");
      router.replace("Login");
    }
    const handelNavBack = () => {
      router.go(-1);
    };
    const handelAddPlan = (e) => {
      store.commit("addPlan", {
        ...e,
        id: Math.random().toString(36).substr(2),
        date: new Date().toDateString(),
      });
      Toast("添加计划成功");
      addPopup.value = false;
      addPlanForm.title = "";
      addPlanForm.remark = "";
    };
    const handelDeletePlan = (index) => {
      Dialog.confirm({
        title: "提示",
        message: "您缺点要删除此计划吗？",
      }).then(() => {
        store.commit("deletePlan", index);
        Toast("删除计划成功");
      });
    };
    return {
      handelNavBack,
      planList,
      addPopup,
      addPlanForm,
      handelAddPlan,
      handelDeletePlan,
      planCount,
    };
  },
};
```

引入了vuex和router的hook之后，我们导出了vuex和router的实例，从这个实例中我们可以获得到vuex中的state，则可以判断APP是否有登录用户，如果没有登录就重定向到登录页面。

```
const store = useStore();
if (store.state.user === null) {
  Toast("未登录，请先登录");
  router.replace("Login");
}
```

添加计划额外传递id和时间

```
store.commit("addPlan", {
    ...e, // Form表单的回调，是计划标题和计划备注
    id: Math.random().toString(36).substr(2),
    date: new Date().toDateString(),
  });
```

使用refAPI将传入的参数返回其响应式代理

```
// 控制弹窗显示/隐藏的变量
const addPopup = ref(false);
```

如果传入的是一个对象，那么Vue内部自动会调用reactive，如果需要更改此响应变量，需要对响应式对象中的value属性进行更改。

响应式变量在template渲染时我们不需要写.value

计划APP的全部代码都已经梳理完毕，我们可以在这个APP中学到，状态管理，路由，组合常用的API的简单应用，在组合API中还有一些我们以前经常用到的API，比如计算属性，生命周期，watch等等在组合API拓展阅读中有简单的总结。

---

组合API拓展阅读

- computed

计算属性在vue3中非常简单和vue2中如出一辙，在新版本中计算属性需要从vue引入：

```
import { computed } from "vue"

setup(){
  const planList = computed(() => state.list);
}
```

计算属性默认传入一个get函数，当然可以像以前一样传入一个set函数

```
const planList = computed({
  get(){
    return state.list
  },
  set(list){
    state.list = list
  }
})

planList.value = []; // 重新set值
```

- watchEffect

这个Hook非常简单，如果使用过reactHook的useEffect应该非常好理解，如果这个函数所依赖的内容变化，它会重新执行这个函数。

```
const countEffect = watchEffect(() => {
  console.log(count); // 定义的响应式变量，如果该变量有变更，将会重新打印count
});
```

当组件卸载或者调用返回中的stop方法即可停止监听，这个机制和vue2中的watch是一样滴。

watchEffect我们称之为副作用函数，我们的业务场景中如果有好友列表，鼠标移动上去能异步获取好友详情，那么如果在鼠标在移动新好友之后，上一次好友详情的请求还没结束，这可能会造成数据混淆的Bug，所以我们副作用函数支持我们这样清除副作用：

```
watchEffect((onInvalidate) => {
  const detail = getFriendDetail(id.value)
  onInvalidate(() => {
    // id 改变时 或 停止侦听时
    detail.cancel() // 取消请求
  })
})
```

第一遍看文档时感觉这样清除副作用很麻烦，React是这样清除的：

```
useEffect(() => {
  // do something
  return () => {
    // 清除副作用
  }
})
```

Vue设计副作用返回是通过传入一个回调注册清除函数，是因为使用effect钩子往往是异步请求，而异步请求返回的是Promise，所以清除函数一定要在被resolve之前注册，当然文档还说这样的好处还有可以自动帮助我们处理Promise潜在的错误（这个就是后话了嘻嘻）。

下面就是重头戏了，大胆预测一波，未来关于Vue3面试题必将有它的一席之地：**watchEffect的刷新时机是什么？**

第一次看文档就有猜测过这样傻白甜的问题，副作用监听了依赖它的变量，是如何很好的控制多个变量触发的机制呢，是每个变量触发都会快速的执行一次吗？

> 用户自定义的副作用函数会在全局缓存一遍会异步地刷新它们，Vue组件的更新函数也是一个副作用函数，刷新机制是在更新函数之后去一遍一遍走自定义的副作用函数

- watch

watch和Vue2一样，只不过和watchEffect的区别就是：

1. 仅在依赖数据源变化才会回调副作用函数

2. 可以访问到变化前和变化后的值

3. 可以自由设置哪些值是需要监听的

共同点就是:

1. 清除副作用和停止监听

2. 副作用刷新机制也是一样的哟

```
const star = ref(0);
watch(star, (star, prevStar) => {
  // do something
});

// 监听多个
watch([star, rose, flower], ([star, rose, flower], [prevstar, prevrose, prevflower]) => {
  // do something
});
```

---

结语

这段时间拖得太久，Vue系列还有一个Vite的浅析还没发，也基本差亿点就结束了，因为是国庆节写的，也希望大家多多支持呀，冲鸭！
