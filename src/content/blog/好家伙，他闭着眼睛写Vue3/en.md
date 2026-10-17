---
title: "Well, Look at That—He Can Write Vue 3 with His Eyes Closed"
description: "One sunny afternoon, I spent three hours building a tiny Vue 3 app. The app itself is nothing remarkable, but the development experience deserves some praise. I used Vuex 4 for login state, Vue Router 4 for routing, and Vant 3 for the UI—the mobile component library with the strongest Vue 3 support at the time…"
date: 2020-10-28
lang: en
translationKey: "2020-10-28_425_好家伙，他闭着眼睛写Vue3"
categories:
  - "Frontend"
  - "News"
  - "Life"
  - "Deep Dive"
views: 6311
draft: false
---

![Well, Look at That—He Can Write Vue 3 with His Eyes Closed](http://static.yinzhuoei.com/typecho/2020/10/28/977471570039863.png)

One sunny afternoon, I spent three hours building a small Vue 3 app. The app itself is nothing remarkable, but the Vue 3 development experience really deserves some praise. I used Vuex 4 for login state, the latest Vue Router 4 for routing, and Vant 3 for the UI. At the time, the Youzan team's latest Vant 3 release was the mobile UI library with the strongest Vue 3 support. Here's a GIF preview of the project:

![](http://static.yinzhuoei.com/typecho/2020/10/28/980461307396240.gif)

Here's how I'd sum up the experience: it feels similar to React Hooks while preserving the familiar flavor of Vue 2. Vue 3's own design also improves aspects of the Hooks experience that React doesn't offer. So, as the title suggests, developers familiar with both React Hooks and Vue 2 can practically write Vue 3 "with their eyes closed."

> GitHub repository: [https://github.com/1018715564/PlanListForVue3](https://link.zhihu.com/?target=https%3A//github.com/1018715564/PlanListForVue3)

---

main.js

The new Vue moves away from mounting through a constructor and embraces a functional style throughout. In the entry file, we can chain calls—just keep using use to our heart's content.

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

As you can see, the route configuration remains familiar from Vue Router 3, but we now create the router with createRouter. The old mode: "history" setting has also been replaced by imported functions:

```
"history":createWebHistory()
"hash":createWebHashHistory()
"abstract":createMemoryHistory()
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
    // Delete a plan
    deletePlan(state, index) {
      state.planList.splice(index, 1);
    },
    // Add a plan
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

We create the store instance with createStore from Vuex 4, defining the state and methods we'll use for login and for adding and deleting plans. Next, let's see how to use Vue 3's Composition API together with routing and state management inside our pages.

Login Page

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
    // Username and password
    const Form = reactive({
      username: "",
      password: "",
    });
    // Log in
    function handelLogin() {
      store.commit("setUser", {
        username: Form.username,
        password: Form.password,
      });
      Toast(`Login successful, hello: ${Form.username}, add your plans~`);
      // Navigate to the home page
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

To access routing and state management, import and call the corresponding Hooks from the two packages.

Call a Vuex mutation:

```
store.commit(fnName, args);
```

The router also retains older Vue Router 3 APIs. Methods such as replace, go, and back are essentially unchanged.

```
const router = useRouter();
 router.push({
   path: "/",
 });
```

If you've never used the Composition API, a little background will help. In older versions, we defined variables and methods like this:

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
{{count}} //Render like this in template
```

In Vue 3, we put these things inside the setup function: variables, functions, watchers, computed properties, lifecycle hooks, and so on. We then return the variables we want to expose to the template. In the login example, we use the reactive API. Pass it a plain object and it returns a reactive proxy. Bind the username and password properties to the view, then call the Vuex mutation so the global store knows that someone has logged in to our "Plan App."

```
const Form = reactive({
  username: "",
  password: "",
});

// Call the vuex login method
store.commit("setUser", {
  username: Form.username,
  password: Form.password,
});
```

Home Page

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
    // Add plan popup
    const addPopup = ref(false);
    // Count the plans
    const planCount = computed(() => store.state.planList.length);
    // Redirect to login if not logged in
    if (store.state.user === null) {
      Toast("Not logged in, please log in first");
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
      Toast("Plan added successfully");
      addPopup.value = false;
      addPlanForm.title = "";
      addPlanForm.remark = "";
    };
    const handelDeletePlan = (index) => {
      Dialog.confirm({
        title: "Notice",
        message: "Are you sure you want to delete this plan?",
      }).then(() => {
        store.commit("deletePlan", index);
        Toast("Plan deleted successfully");
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

After importing the Vuex and router Hooks, we obtain the store and router instances. Through the store instance, we can read Vuex state and check whether the app has a logged-in user. If not, we redirect to the login page.

```
const store = useStore();
if (store.state.user === null) {
  Toast("Not logged in, please log in first");
  router.replace("Login");
}
```

When adding a plan, we also pass an ID and a date:

```
store.commit("addPlan", {
    ...e, // Form callback with the plan title and notes
    id: Math.random().toString(36).substr(2),
    date: new Date().toDateString(),
  });
```

Use the ref API to wrap a value in a reactive reference:

```
// Variable controlling popup visibility
const addPopup = ref(false);
```

If you pass an object, Vue automatically calls reactive internally. To change the value held by this reactive reference, update its value property.

When rendering a ref in the template, we don't need to write .value.

That's all the code for our Plan App. It gives us a simple introduction to state management, routing, and common Composition API functions. The Composition API also includes familiar features such as computed properties, lifecycle hooks, and watch. The additional notes below offer a brief overview.

---

Further Reading: The Composition API

- computed

Computed properties are straightforward in Vue 3 and work much like they did in Vue 2. In the new version, import computed from Vue:

```
import { computed } from "vue"

setup(){
  const planList = computed(() => state.list);
}
```

By default, computed accepts a getter function. As before, you can also provide a setter:

```
const planList = computed({
  get(){
    return state.list
  },
  set(list){
    state.list = list
  }
})

planList.value = []; // set the value again
```

- watchEffect

This Hook is simple. If you've used React's useEffect, the idea should be easy to grasp: when a dependency used by the function changes, the function runs again.

```
const countEffect = watchEffect(() => {
  console.log(count); // The reactive variable; log count again whenever it changes
});
```

The watcher stops when the component unmounts or when you call the returned stop function. This is the same basic mechanism as watch in Vue 2.

The function passed to watchEffect is an effect. Suppose a friends list fetches a friend's details asynchronously when you hover over their entry. If you move to another friend before the previous request completes, the results could get mixed up. Effects let us clean up in cases like this:

```
watchEffect((onInvalidate) => {
  const detail = getFriendDetail(id.value)
  onInvalidate(() => {
    // When id changes or watching stops
    detail.cancel() // Cancel the request
  })
})
```

When I first read the docs, this cleanup approach felt cumbersome. React handles cleanup like this:

```
useEffect(() => {
  // do something
  return () => {
    // Clean up side effects
  }
})
```

Vue registers cleanup through a callback because effects often involve asynchronous requests, and an async function returns a Promise. The cleanup function needs to be registered before that Promise resolves. The docs also explain that this design allows Vue to handle potential Promise errors automatically—but that's a topic for another time.

Now for the main event. I'll boldly predict that this will become a Vue 3 interview question: **When does watchEffect flush its effects?**

Reading the docs for the first time, I had a seemingly innocent question. If an effect tracks several reactive variables, how are multiple changes coordinated? Does every variable change immediately trigger another run?

> User-defined effects are buffered in a global queue and flushed asynchronously. A Vue component's update function is itself an effect. During the flush, user-defined effects are processed after the update functions.

- watch

watch works much as it did in Vue 2. Compared with watchEffect, the differences are:

1. It calls the effect only when its watched source changes.

2. It gives you access to both the old and new values.

3. You can explicitly choose which values to watch.

They share these features:

1. Effect cleanup and the ability to stop watching.

2. The same effect-flushing mechanism.

```
const star = ref(0);
watch(star, (star, prevStar) => {
  // do something
});

// Watch multiple sources
watch([star, rose, flower], ([star, rose, flower], [prevstar, prevrose, prevflower]) => {
  // do something
});
```

---

Closing Thoughts

I've let this sit for far too long. There's still a brief look at Vite in the Vue series that I haven't published; it's almost done—give or take a million little things. I wrote it during the National Day holiday, so I hope you'll keep supporting the series. Let's go!
