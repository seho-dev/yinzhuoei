---
title: "时间紧迫，我们快速过一下最新的Vue3.3"
description: "久别重逢，最近换了新工作，三个月很忙碌，以后博客会定期更新；前几天Vue发布了3.3，我今年没写过Vue，但是也关注Vue的进展，总的来说Vue的发展方向在version 3这个版本中基本稳定了，反而DX的设计上会越来越好，如果你不使用Typescript，那…"
date: 2023-05-13
lang: zh
translationKey: "2023-05-13_818_时间紧迫，我们快速过一下最新的Vue3.3"
categories:
  - "前端"
  - "唠嗑"
  - "精读"
views: 6011
draft: false
---

久别重逢，最近换了新工作，三个月很忙碌，以后博客会定期更新；前几天Vue发布了3.3，我今年没写过Vue，但是也关注Vue的进展，总的来说Vue的发展方向在version 3这个版本中基本稳定了，反而DX的设计上会越来越好，如果你不使用Typescript，那么Vue3的许多新特性你可能并不适用，今天我们简单看一下Vue3.3的内容。

## 概览 (GPT总结)

- defineOptions：可以在 setup 中使用它来声明组件名称等组件属性，避免了需要再写一个script标签，使得新手和 Vue2 -> Vue3 的用户更容易理解。
- setup 中的 TypeScript 类型改进：支持从其他类型文件中导入类型，不再需要在  内使用 defineProps 等宏定义类型，但是目前还不支持复杂的类型操作。
- defineModel：简化了父组件和子组件双向通信（v-model）的代码，使得双向绑定的逻辑更加明了。
- defineSlots：可以自定义组件的 slot 类型，适用于在复杂场景下 Volar 不能准确推导组件类型的情况。
- 泛型组件：对于带有 slot 的复杂组件来说，可以自动推断传入的类型。
- setup 中的提升变量：支持将基础数据类型（除了 Symbol）的变量提升到顶部，解决了之前在 defineProps 时只能使用字面量的问题。

## defineOptions

在之前的setup语法糖里面，如果要声明组件名称等组件属性，需要再写一个script标签，这会给新手和Vue2 -> Vue3的用户带来困惑，并且会给Eslint/Volar带来一定的难度，现在可以使用defineOptions宏来指定这样的信息，但是defineOptions不允许指定props/emits，因为这两者可以使用其他宏指定。

```javascript
<script setup lang=\"ts\">
defineOptions({
  name: \'HelloWorld\',
})
</script>
```

## setup中的Typescript类型改进

这是一个很旧的问题，在使用defineProps时，是不能从其他地方引入类型使用的，可以具体查看[RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md#type-only-propsemit-declarations)。在这个版本将支持从其他类型文件中导入，比如这样：

```javascript
<script setup lang=\"ts\">
import type { Props } from \'./foo\'

defineProps<Props & { extraProp?: string }>()
</script>
```

只不过目前并不支持复杂的类型操作，在之前我们使用defineProps做类型声明时，如果传入了类型，编译器将会将类型转换为运行时代码；而现在如果要支持外部的类型要么就调用Typescript的龟速编译器，要么就自己实现一个基础的编译器，让其识别到导入的“是什么类型”。目前Vue采用了第二种方案，并且支持一个复杂类型的例子（如上代码所示）。

## defineModel

简化了父组件和子组件双向通信（v-model）的代码，比如在以前我们编写v-model相关逻辑，需要写这么多代码：

```javascript
<script setup lang=\"ts\">
const props = defineProps<{
  modelValue: number
}>()

const emit = defineEmits<{
  (evt: \'update:modelValue\', value: number): void
}>()

emit(\'update:modelValue\', props.modelValue + 1)
</script>
```

现在使用defineModel：

```javascript
<script setup>
const modelValue = defineModel<number>()
modelValue.value++
</script>
```

## defineSlots

在复杂场景下，有时候Volar并不能准确推导组件类型，或者有时你想自定义组件的slot类型，可以使用defineSlots：

```javascript
defineSlots<{
  default(props: { item: T }): any
}>()
```

```javascript
<HelloWorld :data=\"[\'foo\', \'bar\']\">
  <template #default=\"{ item }\">{{ item }}</template>
</HelloWorld>
```

## 泛型组件

这对于普通组件来说意义不大，但是对于带有slot的复杂组件来说很有用，意味着可以自动推断传入的类型，在组件中使用，比如以下的场景：

```javascript
<script setup lang=\"ts\" generic=\"T extends string | number, U extends Item\">
import type { Item } from \'./types\'
defineProps<{
  id: T
  list: U[]
}>()
</script>
```

T和U都可以被用作emit/ts代码逻辑中，它和defineSlot在一起用最好

## scripts中的提升变量

Vue3在之前在编译sfc的template时，会将静态内容提升，这样在大型项目中重复的静态内容会用这样的优化手段会得到提升，可以看一下[之前的Vue文章](https://www.yinzhuoei.com/index.php/archives/794/)。但是现在在setup中，也支持这样的优化了，如果在script中编写了基础数据类型（除了Symbol）的变量，都会被提升到顶部。这个改进主要解决了之前的问题，比如defineProps时，只能使用字面量：

```javascript
<script setup>
const hello = \'world\'
defineOptions({
  hello,
})
</script>
```

这样的代码在之前是会有编译错误的，现在不会了，原因是defineProps宏编译之后，会变成下面的代码：

```javascript
const __sfc__ = {
  props: [propName],
  setup(__props) {

  },
}
```

显然这是错误的，无法访问到propName，经过提升优化之后，将会解决这个问题：

```javascript
const __sfc__ = {
  propName: \"hello\",
  props: [this.propName],
  setup(__props) {

  },
}
```

(伪代码)

## 更符合人体工学 的 defineEmits

同样的，这次改进主要是少写一些代码：

```javascript
const emit = defineEmits<{
  (e: \'foo\', id: number): void
  (e: \'bar\', name: string, ...rest: any[]): void
}>()
```

现在可以这么写:

```javascript
const emit = defineEmits<{
  foo: [id: number]
  bar: [name: string, ...rest: any[]]
}>()
```

## 解构Props不失去其响应式（实验性）

如下代码所示，这更好的提供props的默认值：

```javascript
const { msg = \'hello\' } = defineProps([\'msg\'])
```

此时，msg仍然还是一个响应式变量，并且如下代码可能也不会再需要了：

```javascript
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: \'hello\',
  labels: () => [\'one\', \'two\']
})
```

在此前经常使用withDefaults宏去提供props默认值，现在有更好的趋近于es6的写法，所以建议大家之后可以使用这个功能，但是这个功能是实验性质的，需要自行斟酌。
