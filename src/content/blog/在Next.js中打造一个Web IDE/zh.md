---
title: "在Next.js中打造一个Web IDE"
description: "前言 最近遇到一些需求场景, 就是需要在next.js中嵌入一个ide功能; 那么在完成这个任务过程中遇到了非常非常多的坑, 那么如果你也有类似的需求, 那么相信我, 你看完我的文章之后就不需要在找其他资料了; 因为这篇文章我会把所有的实现细节一一描述到位;…"
date: 2022-10-30
lang: zh
translationKey: "2022-10-30_786_在Next.js中打造一个Web IDE"
categories:
  - "前端"
views: 5407
draft: false
---

## 前言

最近遇到一些需求场景, 就是需要在next.js中嵌入一个ide功能; 那么在完成这个任务过程中遇到了非常非常多的坑, 那么如果你也有类似的需求, 那么相信我, 你看完我的文章之后就不需要在找其他资料了; 因为这篇文章我会把所有的实现细节一一描述到位;

## 准备工作

在准备开始之前, 我们需要确定我们的技术背景, 我们需要在next.js (v12+)中嵌入monaco编辑器; 不仅如此, 我们要仿照codesandbox (一款知名的在线ide代码盒子), 实现其中的依赖检索&安装&卸载, 而依赖的增删改查将直接导致编辑器的语法提示是否有效 (无效则爆红)

- next.js
- monaco

### 需要完成的需求

- 依赖检索&增删改查
- typescript类型提示
- 仿原生ide的用户习惯, 比如实现(实时保存 + 手动保存)
- 全屏功能
- 调试/运行脚本功能 + 调试结果输出

## 在Next.js中集成Monaco

我们立即安装`@monaco-editor/react`并且使用, monaco是一个框架无关的库, 我们需要一些现成的react组件来辅助完成ide的开发. 按照官网的文档, 一路顺下来0错误. 我们可以轻易的得到一个完美的ide编辑器, 并且它支持typescript的类型提示:

```html
<Editor
   language={props.defaultLanguage ?? 'typescript'}
   defaultValue={props.defaultValue ?? '// some comment'}
   value={props.value}
/>
```

### 遇到的问题

ok, 那么问题来了, 如果你在使用这个react组件过程中出现了一些css的错误, 不要着急, 请先看看是不是这个原因:

```js
CSS Modules cannot be imported from within node_modules
```

这是因为你在使用monaco的时候, monaco的底层在组件内部引入了css. 是的, 源码没有在这里进行打包, 其实这个问题在普通的程序中(react/vue)中不会出现问题; 但是此时在next.js的dev环境下, next由于本身的css设计, 它并不确定这个在内部依赖里写的css代码该如何处理它:

```js
import "./banner.css"
```

next.js很懵逼, 它是global.css? 那我如何处理全局css的顺序呀; 如果是模块化css, 那么也不确定这个css的写法规范(是小写还是驼峰等等); 也正是因为next.js本身设计原因, 遇到这种事情是没办法在dev环境解决的, 因为dev环境不会对node_modules进行打包.

所以我们为了解决这个问题, 有以下3个方案:

1. 预编译nodemodules
2. 给库的作者说, 让它改, 哼!
3. 自己改, 呜呜呜

首先第二个方法首先pass, 我们不是在next.js中遇到这个问题的第一个人, 相关pr&issue讨论monaco css的问题有很多, 不是一个pr就可以解决的.

接着说回第一个解决方案, 好在我们有很多优秀的库去帮助我们解决预编译, 我在这里仅仅做一个小小的展示, 我们需要使用`next-transpile-modules`这个库, 按照文档进行一个配置:

```
// next.config.js

const withTM = require("next-transpile-modules")([
  "monaco-editor"
]);
```

我们把需要预编译的包写在数组中, 并且导出原有的next.config即可:

```js
module.exports = withTM({
    ...
});
```

如果看到这里, 你仍然会出现很多错误, 那么你就有福了, 我们可以用第三个方案, 即自己fork仓库进行修改, 只需要把最底层的css代码去掉即可, 听起来非常简单, 但是涉及的代码非常多而且我们要想`@monaco-editor/react`正常使用, 我们需要依次向下去编译所有包, 这个工作量还是蛮大的. 所以我们在下一个部分将简述需要编译的所有包, 并且我会在下一个部分开头将我改好的包名提前声明, 方便读者快速安装, 跳过改写的部分.

## 改写Vscode底层核心以及相关React库

我们在使用`monaco`或者相关基于此库的组件时, 都有可能会导致next.js中的错误; 我们去编译底层的库需要耗费很长时间; 在我们罗列出编译好的依赖版本之前, 我们需要预告一下后续用到的monaco插件`monaco-editor-auto-typings`它是自动导入ts类型的, 也在本次更改源码的任务中.

```json
{
"dependencies": {
   "@swordjs/monaco-editor": "*",
   "@swordjs/monaco-editor-auto-typings": "*",
   "@swordjs/monaco-editor-react": "*",
   "@swordjs/monaco-editor-webpack-plugin": "^7.0.1",
 }
}
```

如果你现在比较急迫的想解决错误, 那么此时你安装你需要的包即可解决问题, 然后就可以跳转到下一个部分.

### 改写细节

我们既然知道了next.js的报错原因, 去解决也非常容易, 我们直接定位到`monaco-core`也就是vscode的github代码仓库, 找到这样的[代码](https://github.com/microsoft/vscode/blob/f195c00f1e471b14778012b020472ce88484c8af/src/vs/base/browser/ui/actionbar/actionbar.ts#L15)

![WX20221018-161133@2x.png](http://static.yinzhuoei.com/typecho/2022/10/18/807061554729849/WX20221018-161133@2x.png)

同理, 仓库中所有包含这样的css引入代码, 我们都需要注释, 大约有几十处, 我们修改之后打包即可; 那么有朋友就会问, 我们修改了vscode在浏览器的样式, 那么在程序中会导致样式异常么;

答案是: 不会

因为我们用的是基于monaco的封装库, 在封装库的内部实现, 它其实是有一个cdn的存在的, 其cdn指向的是[jsdelivr](https://www.jsdelivr.com/), 然而这样的cdn是不受next.js限制的, 因为它并不在node_modules内; 我们之所以要大费周章重新编译几个库是因为:

1. 依赖一层套一层
2. 只要存在于node_modules就会报错

如果你不想使用cdn的库, 你可以从github下载原版的vscode源码到public中, 通过loader来显式调用, 这样既可以保证程序不会报错, 也可以保证vscode样式的正确显示:

```js
// 在public下建立modules文件夹
import { loader } from '@swordjs/monaco-editor-react';
loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } });
```

我们改造完最核心的core之后, 其实剩下的`monaco-editor` 和  `monaco-editor-react`只需要掌握好其库的编译方法, 有些库的编译方法比较简单直接调用一个命令, 但是对于core库来说需要根据ci的任务编排分析, 才能正确编译, 但是好在大厂的编译流水线实在是很成熟; 基本上找对了方法, 过程中也没有出现编译失败的问题.

至此, 我们一层一层修改源码以及依赖包, 所有的`monaco`家族全部编译完毕.

## Web IDE组件实现

终于到了最核心的ide组件实现了, 我们在这一个部分主要完成ide的绝大多数需求, 并且我会简述ide背后的调试实现; 前端我会将ide整理为一个组件对外发布, ide所需要的后端支持是go + nodejs, 后端服务主要对我们的ts脚本编译并且执行, 并且返回给前端做展示.

### 剖析IDE功能

我们把ide分为几个重要的部分

- header组件, 最核心的功能就是手动保存按钮, 以及[保存状态]的展示
- action组件, 最核心的功能就是input参数输入, 调试运行 & 运行结果展示
- code组件, 最核心的代码code组件, 在这个组件我们主要做monaco绝大部分配置项
- depend-list, 我们需要从外部控制脚本的依赖, 需要一个列表展示, 并且对depend进行crud
- index, 在对外暴露的组件首页中, 我们在index中完成了很多核心的逻辑, 比如其所有子组件的回调和业务逻辑

在本次的业务需求中, 我们的ide信息需要通过一个path变量来从后端获取不同的代码, 但是不仅仅要获取脚本, 还要我们的depend依赖信息以及脚本是否启用信息, 还有最重要的调试参数, 所以我们需要用一个hookinfo来保存这一系列信息.

```js
export type Depend = { [key: string]: string }
export type Input = { [key: string]: any }
export type HookInfo = {
       script: string,
       scriptType: string,
       type: string,
       path: string,
       depend: Depend[] | null,
       input: Input | null,
       switch: boolean
};

const [hookInfo, setHookInfo] = useState<HookInfo>();
```

### 代码保存

代码保存, 本质上还是将我们的脚本内容进行获取, 通过api, 在后端中把api的内容进行io文件写入即可; 在你能见到的所有web ide产品, 它都尽可能的模仿了我们桌面应用程序版本ide的操作习惯, 比如ctrl+s, 自动上传代码&手动保存. 那么我们可以将代码保存的逻辑分类为:

- 主动
- 被动

那么保存的状态可以分为:

- 已加载最新的代码 (第一次进入ide时)
- 正在编辑
- 保存中
- 已保存

`正在编辑`指的是代码`被动保存`(自动保存)时, 如果你键入了代码, 此时如果和之前的代码不一样(diff), 那么就会显示`正在编辑`, 在停止编辑之后的`特定时间(1000ms)`, 将会触发`保存中`, `保存成功`之后会显示`已保存`

所以我们可以轻松的定义2个状态:

```ts
// 保存的4种状态
export enum AutoSaveStatus {
  LOADED = 'loaded',
  SAVEING = 'saveing',
  SAVED = 'saved',
  EDIT = 'edit'
}

// 保存的payload类型
export type AutoSavePayload = {
  // 是主动还是被动
  type: 'active' | 'passive',
  // 保存状态
  status: AutoSaveStatus | null
}
```

首先我们需要当monaco准备好之后, 去注册保存事件, 所以我们需要定义2个变量:

```js
const [editor, setEditor] = useState<any>();
const [monaco, setMonaco] = useState<any>();
```

在monaco-react组件中的`onMount`中对2个变量进行set

```js
const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    setEditor(monacoEditor)
    setMonaco(monaco)
}
```

其次我们要定义变量来保存代码的payload, 它的类型就是上文定义的`AutoSavePayload`

```js
const [savePayload, setPayload] = useState<AutoSavePayload>({
  type: 'passive',
  status: null
});
```

注册ctrl+s的回调函数, 监听键盘事件即可

```js
useEffect(() => {
    // 监听键盘的ctrl+s事件
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // 执行主动保存
        handleSave('active')
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, monaco])
```

在handleSave中我们需要判断当前保存的状态, 比如需要我们进行防抖

```js
const handleSave = useCallback(debounce((type: AutoSavePayload['type'] = 'passive') => {
    // 如果正在保存中，不再重复保存
    if (savePayload.status === AutoSaveStatus.SAVEING) {
      return
    }
    setPayload({
      type,
      status: AutoSaveStatus.SAVEING
    })
    // 保存脚本内容, 调用api
    void saveHookScript(props.hookPath, editor.getValue()).then(() => {
      setPayload({
        type,
        status: AutoSaveStatus.SAVED
      })
    })
  }, 1000), [editor])
```

我们的`ctrl+s保存`已经实现完毕了, 接下来我们实现一下被动保存即自动保存; 自动保存顾名思义, 我们需要监听编辑器的内容变化, 那么在监听这一块其实`monaco-react`组件已经提供了对应的回调函数给到我们; 但是我们在这里需要讲解一下`monaco-react`的`value`,`defaultValue`属性;

首先`defaultValue`非常简单我们可以给编辑器传递一个默认的代码片段, 在编辑器内部其实也维护了一个变量来保存代码, 这个值其实就是作为了内部变量的初始化值; 那么同样的我们可以传递`value`这样的属性, 使其完全受我们的控制.

那么问题来了, 脚本的value从哪里来, 那自然是通过接口返回的, 还记得我们在上文提到的`hookInfo `吗? 我们调用接口之后要把代码的payload状态保存为`LOADED`并且将data赋值给hookInfo

```js
useEffect(() => {
    void getHook<HookInfo>(props.hookPath).then(data => {
      // 更新payload
      setPayload({
        type: 'passive',
        status: AutoSaveStatus.LOADED
      })
      setHookInfo(data);
    })
  }, [])
```

我们再给编辑器组件传递`value`属性, 让编辑器的内容受控并且调用一个props钩子onChange, 我们需要在它的父组件中做自动保存逻辑.

```html
<Editor
    // other options
    value={hookInfo.script}
    onChange={(value) => {
        if (props.onChange) {
           props.onChange(value)
        }
    }}
/>
```

在onChange函数中, 我们定义一个函数专门处理自动保存逻辑

```js
const codeChange = (value?: string) => {
    if (hookInfo) {
     // 同步hookInfo中的脚本内容
      setHookInfo({
        ...hookInfo,
        script: value ?? ''
      })
    }
    if (![AutoSaveStatus.EDIT, AutoSaveStatus.SAVEING].includes(savePayload.status ?? AutoSaveStatus.LOADED)) {
        setPayload({
          type: 'passive',
          status: AutoSaveStatus.EDIT
        })
        saveTimer.current = setTimeout(() => {
          handleSave('passive')
        }, SAVE_DELAY);
    }
  }
```

在这段代码中, 我们在里面判断了保存的状态, 比如当前的逻辑执行不允许在保存中以及编辑中; 这种状态的权限判断我们都很容易理解.  但是我们在codeChange中是否需要和script进行判断, 以及`saveTimer`是什么变量?

首先我们为什么需要保存`script`? 当然是使用value和当前script进行判断, 如果它压根没有更改, 那么就不需要做自动保存; 那么你可能就会问这都`onChange`了, 代码一定是变更了的, 其实并不一定, 当用户快速的输入`A`之后又删除`A`虽然会造成回调, 但是并不能代表代码一定不是相同的; 所以我们这里做了一层判断, 只需要在codeChange函数的第一行加入以下代码即可:

```js
if (hookInfo?.script === value) return;
```

那么`saveTimer`主要做什么呢? 我们前提可知保存分为`主动`和`被动`, 我们被动保存从触发到执行保存接口是需要时间的, 这个时间就是`SAVE_DELAY`; 那么在这个延迟未执行之前我们可能会手动保存, 即`ctrl+s`, 所以我们在主动保存的时候需要判断, 如果`saveTimer`存在值, 就清空这个被动保存任务.

```js
const handleSave = useCallback(debounce((type: AutoSavePayload['type'] = 'passive') => {
    // other
    if (type === 'active' && saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    // 接下来执行保存
  }, 1000), [editor])
```

如果不做这一层的处理, 那么我们的ide将会在`被动保存`和`主动保存`之间彻底绕晕, 会请求很多没用的保存接口.

### 全屏功能

ide在编写代码时, 我们希望用户是沉浸式的; 所以全屏的实现非常非常简单; 在我们的ide组件的header中会存在一个`全屏小图标`, 我们只需要定义好一个`是否全屏`的状态即可;

```js
// 是否全屏显示
const [fullScreen, setFullScreen] = useState(false)
```

我们需要用到一个全屏插件将ide组件包裹住

```js
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const handle = useFullScreenHandle();

<FullScreen handle={handle} onChange={(state) => {
   if (!state) {
    setFullScreen(false);
   }
 }}>

// ide组件
</FullScreen>
```

现在只需要将状态传递给header组件, 在内部控制一下不同小图标的展示, 注册一个点击事件控制是否全屏就可以啦

```js
<IdeHeaderContainer {...{
  // 其他props
  fullScreen,
  onFullScreen: () => {
    setFullScreen(!fullScreen)
    handle.active ? void handle.exit() : void handle.enter()
  }
}} />
```

### 检索Npm Package

我们在上一个部分编写了最简单的全屏功能, 这个章节同样的简单; 我们在做ide依赖需求时, 不太可能专门去做一个镜像同步npm仓库; 我们可以需要一个npm开放api, 我们去请求api去检索就可以啦; 在这里我们选择`unpkg`. 我们可以由此写出这样的`service`代码

```js
import axios from 'axios'

const CDN = 'https://api.cdnjs.com/libraries'

export const getDependList = async (keys: string) => {
  type Return = Record<'results', { name: string; latest: string }[]>
  const data = await axios.get<any, { data: Return }>(`${CDN}?search=${keys}&limit=20`)
  // 处理data为select的label和value格式
  return data.data.results.map(item => ({ label: item.name, value: item.name }))
}

export const getDependVersions = async (keys: string) => {
  const data = await axios.get<any, { data: { versions: string[], version: string } }>(`${CDN}/${keys}`)
    // 处理data为select的label和value格式
    // 倒序且筛选前100条
    return {
      list: data.data.versions.reverse().slice(0, 100).map(item => ({ label: item, value: item })),
      latest: data.data.version
    }
}
```

可以注意到, 一个是请求依赖列表, 一个是请求该依赖的版本列表, 这个过程是异步的, 所以我们可以将其设计为一个`微任务`去请求版本列表. 在前端ui展示中, 我们选择了一个antd的search-select, 它自带一个防抖, 也是很容易实现的, 基本就是antd官方的demo

```js
export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>
    debounceTimeout?: number
}

function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState<ValueType[]>([])
    const fetchRef = useRef(0)
    const selectRef = useRef(null)

    const debounceFetcher = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/require-await
        const loadOptions = async (value: string) => {
            fetchRef.current += 1
            setOptions([])
            setFetching(true)

            void fetchOptions(value).then(newOptions => {
                setOptions(newOptions)
                setFetching(false)
            })
        }

        return debounce(loadOptions, debounceTimeout)
    }, [fetchOptions, debounceTimeout])

    return (
        <Select
            labelInValue
            ref={selectRef}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            getPopupContainer={triggerNode => triggerNode.parentElement}
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            onChange={(value, options) => {
                if (props.onChange && selectRef.current) {
                    // 调用blur
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    (selectRef.current as any).blur()
                    props.onChange(value, options)
                }
            }}
            options={options}
        />
    )
}
```

这样我们就封装好了一个带防抖的search-select了, 直接使用即可

```js
<DebounceSelect
 mode="multiple"
 value={value}
 placeholder="搜索依赖"
 fetchOptions={getDependList}
 onChange={newValue => {
   if (Array.isArray(newValue) && newValue.length > 0) {
     addDepend(newValue[0].label)
   }
   setValue([])
 }}
/>
```

想到这里我们在组件中需要一个变量存储`依赖列表`, 我希望这个数据结构不是对象,而是可以轻松的获取以及替换, 总而言之我想要有更多方便的API让我去操作依赖列表, `map`最合适不过了.

```js
const [dependList, setDependList] = useState<Map<string, string | null>>(new Map([]))
```

`key`为依赖名称, `value`为version版本, 之所以`value`可以为`null`在下文会有详细的解释.

我们初始化了依赖列表变量以及调用了`onAddDepend`函数之后, 我们可以看看添加逻辑如何处理的

```js
const addDepend = async (name: string) => {
     // 查询版本列表是一个异步过程, 在这里进行异步操作
     void getVersions(name, dependList.size).then(res => {
         // 重新渲染, 设置version
         setDependList(prev => {
              const newDependList = new Map(prev)
              newDependList.set(name, res.latest)
              return newDependList
         })
      })
     // 默认设置一个null作为version, 为null的version其代表了暂时不显示
     dependList.set(name, null)
     setDependList(new Map([...dependList]))
}
```

oh吼, 可以清楚的看到, 在用户点击依赖之后就会请求一个`versions`接口, 在结果返回之前的同步代码中, 我们将其version设置为`null`, 这个`null`则代表了version未加载完毕的`中间状态`. 我们可以用这个中间状态在ui上做一些文章, 比如显示一个loading图标, 让用户可以知道这个版本在加载中.

我们设想一下, 如果依赖加载完毕之后, 用户想要切换版本怎么办呢, 那就必然还需要重新加载一次`version`?, 这必不可能, 我们一直都以节省用户流量为目标写代码(`说的我自己都信了`), 所以我们简单的将版本和依赖名称建立一个缓存就行啦

```js
// 存储版本列表, 使用对象存储, key为依赖名, value为版本列表
const [versionList, setVersionList] = useState<{
 [key: string]: { label: string; value: string }[]
}>({})
```

所以我们在`getVersions`函数中, 就需要这么做

```js
const getVersions = async (
     dependName: string,
     index: number
): Promise<{ versions: any; latest: string }> => {
  if (versionList[dependName]) {
    return { versions: versionList[dependName], latest: versionList[dependName][0].value }
  }
  const { list: versions, latest } = await getDependVersions(dependName)
  setVersionList(prev => ({ ...prev, [dependName]: versions }))
  return { versions, latest }
}
```

在`addDepend`逻辑结束之后, 我们就要添加ide上的删除/更新依赖功能, 那么我们都知道诸如codesandbox, 都会有对应的小图标对依赖进行增删改查. 所以我们也打算使用这种方式

```js
// 删除依赖
const removeDepend = (name: string) => {
   dependList.delete(name)
   props.onDependDelete?.(name)
   setDependList(new Map([...dependList]))
}

// 更新依赖
const updateDepend = (name: string, version: string) => {
   dependList.set(name, version)
   setDependList(new Map([...dependList]))
}
```

更新依赖非常简单, 我们只需要重新调用`setDependList`就可以了, 但是我们删除依赖需要单独调用一个`props子函数`, 因为我们在之后的开发中会对删除的依赖做特殊处理.

那么我们就可以将depend作为依赖项放到`useEffect`中, 当依赖有变更时将会调用对应的`props子函数`

```js
useEffect(() => {
  const dependListObj: Depend = {};
  dependList.forEach((value, key) => {
  if (value !== null) {
      dependListObj[key] = value
   }
  })
// 依赖为空, 则调用回调
// 或者dependListObj和versionList的key长度不一致, 造成不一致的原因是部分依赖value为null, 则不需要调用回调
if (dependList.size === 0 || Object.keys(dependListObj).length === dependList.size) {
    props.onDependChange?.(dependListObj)
  }
}, [dependList])
```

至此, 我们已经完成了依赖列表的增删改查, 我们可以在父组件中的`onDependChange`和`onDependDelete`回调中获取依赖变化

### 自动导入Package Type

在web ide中最重要的就是ts的类型提示, 也是我们此次开发web ide的重点, 也是在这一章我们会要了解一点`monaco`的相关知识; 在我们ide设计中, 我们需要在左侧的依赖列表中添加依赖, 并且在代码区域动态做出类型提示, 这听起来有点难度, 在此之前我们需要搞清楚`monaco-API`

```js
monaco.languages.typescript.typescriptDefaults.addExtraLib(content, "")
```

我们可以使用这个api在`monaco`中添加文件, 可以指定名称和文件内容, 那么我们可以以`lodash`为例子, 可以这样把lodash的api类型添加到`monaco`中

```js
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_index, '@types/lodash/index.d.ts');
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_common, '@types/lodash/common/common.d.ts');
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_array, '@types/lodash/common/array.d.ts');
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_collection, '@types/lodash/common/collection.d.ts');
```

由此我们可以得知, 我们需要获取类型文件具体内容和文件名. 其次我们还需要了解`model`这个概念, 在`monaco`中初次加载时, 如果你没有指定`model`参数, 那么会帮助你创建一个默认的`model`, 我们在切换不同的`代码视图`时, 没有必要重复的创建和销毁, 我们通常只需要保存当前的代码视图到内存中, 再切换时, 使用不同的`model`注入到同一个`monaco`实例中即可.

那么如何处理我们左侧依赖列表的类型呢, 我们仍然可以使用unpkg去下载这个包, 并且去分析它们的`package.json`

```js
private async resolveFile(url: string) {
    const res = await fetch(url, { method: 'GET' });
    if (res.ok) {
      return await res.text();
    } else if (res.status === 404) {
      return '';
    } else {
      throw Error(`Error other than 404 while fetching from Unpkg at ${url}`);
    }
  }
```

首先通过这个函数传入一个包链接, 将包的`package.json`内容返回, 我们就可以获取其中的`types`或者`typings`字段, 我们来实现一段伪代码

```js
const pkg = JSON.parse(pkgJsonTypings);
 if (pkg.typings || pkg.types) {
     const typings = pkg.typings || pkg.types;
     this.createModel(
     content,
     this.monaco.Uri.parse(`node_modules/${typingPackageName}/package.json`)
 );
}
```

我们只需要递归一个函数, 解析文件中的相对路径依赖, 以这样的方式将类型相关文件一一添加到`monaco`中就好了, 然后你可能会说:

> 好难, 有没有相关库去解决这个问题呢?

相关库非常少, 但是我们能根据我们的需求找到一个最符合我们的库, 这个库就是`monaco-editor-auto-typings`; 我们可以从官网的广场中了解, 它会分析你写的代码, 比如这样

```js
import * as axios from "axios"
```

它就会自动去下载axios包, 并且原理和我们上面描述的类似, 并且它还会把下载过的依赖缓存到本地(`localstorage`), 它不会重复调用unpkg的api; 同样的它还提供了一些非常方便的的配置, 比如`只使用指定的版本和依赖`以及`预先下载包`, 现在我们只需要将这个库集成到`monaco`中就可以了.

```js
<IdeCodeContainer {...{
  onMount: handleEditorMount
}} />
```

将初始化后的`monaco`实例保存在state中

```
const [editor, setEditor] = useState<any>();
const [monaco, setMonaco] = useState<any>();
const handleEditorMount: OnMount = (monacoEditor, monaco) => {
  setEditor(monacoEditor)
  setMonaco(monaco)
}
```

在初始化之后, 装载`monaco-editor-auto-typings`插件

```js
const typingsRef = useRef<any>(null);
  useEffect(() => {
    if (editor && monaco) {
      // depend数组转换为对象
      const depend = hookInfo?.depend?.reduce((acc, cur) => {
        acc[cur.name] = cur.version
        return acc
      }, {} as Depend) || {}
      // 装载typings插件
      void AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        monaco: monaco,
        onlySpecifiedPackages: true,
        preloadPackages: true,
        versions: depend,
      }).then(t => {
        typingsRef.current = t;
      })
    }
  }, [editor, monaco, hookInfo?.depend])
```

可以注意到的是, 这个副作用函数的依赖项是`hookInfo?.depend`, 指的就是当前脚本的依赖发生变化时, 就会装载插件, 而插件中定义了3个非常关键的配置项

```js
onlySpecifiedPackages: true, // 只加载versions指定的包
preloadPackages: true, // 预先加载
versions: depend, // 指定依赖版本
```

由此我们就完成了一个初步的类型提示插件, 但是不要高兴的太早, 因为当依赖发生变化时, 你需要对`monaco-editor-auto-typings`插件做一些额外的处理, 比如这样

```js
// dependchange回调
  const dependChange = (depend: Depend) => {
    // 在typings类中的原型上调用setVersions
    if (typingsRef.current) {
      typingsRef.current.setVersions(depend)
      void handleDependChange(depend);
    }
  }

  const dependRemove = (name: string) => {
    typingsRef.current.removePackage(name)
  }
```

我们注册了左侧依赖组件的函数, 然后调用了`typings插件的内部方法`, 请记住这些方法的实现在原版`monaco-editor-auto-typings`是没有的, 你只有下载了`@swordjs/monaco-editor-auto-typings`(我的魔改版本)这些函数才会生效; 鉴于篇幅有限, 我会在`《扩展阅读》`中简述我是如何魔改的.

如果你想让ide拥有内部依赖提示的功能, 即后端会保存一部分的`.d.ts`文件, 用于前端类型提示, 也是可以用同样的道理去做, 我们只需要注册`monaco-react`组件中的`beforeMount`函数即可

```js
const handleEditorBeforeMount: BeforeMount = (monaco) => {
    void getTypes<Record<string, string>>().then(res => {
      // 循环types
      Object.keys(res).forEach(key => {
        const libUri = `inmemory://model${key.replace(/^\\./, '')}`;
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          res[key],
          libUri);
        monaco.editor.createModel(res[key], 'typescript', monaco.Uri.parse(libUri));
      }
      )
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    })
  }
```

这样我们等待接口的返回, 将依赖名称和内容进行简单处理, 就可以直接添加到`monaco`中, 就可以在ide中写下这样的预定义类型

```js
import * as a from "./auto/index"
```

到这一步, 你的ide就已经初具规模了, 它是一个拥有外部类型提示&内部类型提示功能的ide, 可以满足绝大部分的需求了, 事实上你完全可以加上分享功能当作codesandbox来用了.

### 运行代码 & 编译代码

由于技术栈特殊, 我们的后端采用`go`语言, 但是运行ts脚本最好还是需要一个`node`服务端, 尽管现在的js runtime在go上也有很好的实现, 但是运行ts, 在node中有更多非常成功的案例, 并且我在这一块也是经验丰富, 毕竟我和`ts运行时`打过一段时间的交道; 所以打算使用go调用一个命令指向node, 让node执行ts文件, 并且返回日志输出以及运行结果;

首先在nodejs和go中, 我们为了通信方便, 就直接让go读取`stdout`即可, 在nodejs的实现我们也很简单, 我们可以实现一个简单的包装器, 用于执行脚本

```js
const { register } = require('esbuild-register/dist/node');
const { join } = require('path');

register();

const hookPath = join(__dirname, './.wundergraph/new_hook/auth/demo');

// console.log日志
const logs = [];
let result;
var log = console.log;
// 重写console.log
console.log = function () {
  logs.push([...arguments]);
};

const init = async () => {
  try {
    await require(hookPath).default();
  } catch (e) {
    result = e;
  }
  log(
    JSON.stringify({
      logs,
      result,
    })
  );
};

init();
```

在这个脚本中, 我们重写了`console`, 将脚本中的所有日志保存下来并且添加到一个数组中, 然后我们使用了一个运行时register工具`esbuild-register/dist/node`, 相关工具你们可以使用其他, 比如`ts-node`, `swc-register`都可以啦! 这样go调用nodejs时, 只需要传递一个`脚本路径`(后端文件路径)即可, 同理客户端在执行运行的时候, 也仅仅需要传递一个`脚本路径`; 当go读取`stdout`会读取到一个json字符串, 把这个字符串返回给前端即可!

在前端中, 我们还需要一个`monaco`编辑器作为参数代码输入框, 那么在这个编辑器中的代码将会在nodejs中成为函数的入参; 比如这样

```js
{
 "hello": "seho"
}
```

```js
export default(params){
 console.log(params); // {"hello": "seho"}
}
```

我们只需要简单校验一下输入框只支持输入json就可以啦, so easy

```js
let parseCode;
try {
   const code: string = editorRef.current.getValue().replace(/\\s/g, '');
   parseCode = JSON.parse(code) as { [key: string]: any };
} catch (error) {
   // 不是json格式
   void message.warning('脚本内容不是json格式');
   return;
}
```

### [扩展阅读] 浅析monaco-editor-auto-typings库

在上文中, 我们简单了解了`monaco-editor-auto-typings`相关作用, 也在开发中自己魔改了一些函数, 并且完成了原作者还在`TODO`的内容, 尽管可能实现和原作者想法有出入, 并且由于时间紧迫, 未窥插件全貌, 也有可能有一部分副作用, 所以这里仅仅只是简单的介绍, 以完成需求为目的

首先我们实现了`setVersions`内部方法, 完成了作者的`TODO`

```js
public setVersions(versions: { [packageName: string]: string }) {
    this.importResolver.setVersions(versions);
    this.options.versions = versions;
    this.refresh();
  }
```

在方法内部, 我调用了`importResolver`实例的`setVersions`

```js
public setVersions(versions: { [packageName: string]: string }) {
    this.versions = versions;
    this.loadPackage(versions);
    this.options.onUpdateVersions?.(versions);
  }
```

首先重新设置了最新的`versions`变量, 并且调用了新增的方法`loadPackage`

```js
// load / reload package
  private async loadPackage(versions: Options['versions']) {
    for (const [packageName, version] of Object.entries(versions || {})) {
      this.resolveImport(
        {
          kind: 'package',
          packageName: packageName,
          importPath: '',
        },
        new RecursionDepth(this.options)
      ).catch(e => {
        console.error(e);
      });
    }
  }
```

这个函数的含义就是重新调用预定义好的`resolveImport`, 它内部则是分析整个`code`去实现类型加载, 值得注意的是, 当前`monaco-editor-auto-typings`如果配置了`preloadPackages`和`versions`也可以调用这个函数

```js
if (options.preloadPackages && options.versions) {
  this.versions = this.options.versions;
  this.loadPackage(this.versions);
}
```

在`resolveImport`方法内部, 我也根据自己业务做了一点变更, 具体大家可以看一下我写的注释

```js
let hash = this.hashImportResourcePath(importResource);
    // typings will infer the imported package based on the existing code, and download it actively, and record it through an array of loadfiles;
    // This variable is mainly used to optimize the performance of the plugin to avoid repeated loading; but if the onlySpecifiedPackages of the current option is true, then typings will not be able to rely on code to import packages, so in this case, the function should not return an empty return , but try another import
    // hash root demo: react/package.json
    if (this.options.onlySpecifiedPackages) {
      let _hash = hash;
      // If the hash exists in package.json
      if (hash.indexOf('/package.json') > -1) {
        _hash = hash.substring(0, hash.indexOf('/package.json'));
      }
      if (!Object.keys(this.versions || []).includes(_hash)) return;
    }
    if (this.loadedFiles.includes(hash)) {
      return;
    }
    this.loadedFiles.push(hash);
```

简单的就是说, 每次下载依赖, 内部都会有一个hash去记录, 避免重复下载, 这也是插件内部的优化手段; 但是由于业务不同, 我们需要根据外部依赖版本来重新导入依赖, 所以在一定规则下, 这种优化手段将会被跳过.

那么如果当前是删除依赖, 那么就不能简单的设置`versions`了, 我新增了一个`removePackage`方法

```js
public async removePackage(packageName: string) {
    const packageRootPath = `${packageName}/package.json`;
    this.removeModel(this.monaco.Uri.parse(this.options.fileRootPath + path.join(`node_modules/${packageRootPath}`)));
    // delete version
    if (this.versions && this.versions[packageName]) {
      delete this.versions![packageName];
      // delete hashfiles
      const index = this.loadedFiles.indexOf(packageRootPath);
      if (index > -1) {
        this.loadedFiles.splice(index, 1);
      }
      this.setVersions(this.versions);
    }
    // 查找package.json下的type, 并且删除type对应的model
    let pkgJson = await this.resolvePackageJson(packageName);
    if (pkgJson) {
      const pkg = JSON.parse(pkgJson);
      if (pkg.typings || pkg.types) {
        const typings = pkg.typings || pkg.types;
        this.removeModel(this.monaco.Uri.parse(this.options.fileRootPath + path.join(`node_modules/${packageName}/${typings.startsWith('./') ? typings.slice(2) : typings}`)));
      }
    }
  }
```

我们不仅要删除对应依赖包的`package.json-model`, 也需要删除对应的`types/typings-model`, 同样的, 也需要删除内部缓存的hash, 让下一次重新导入依赖正常提供服务.

```js
private removeModel(uri: monaco.Uri) {
    uri = uri.with({ path: uri.path.replace('@types/', '') });
    const model = this.monaco.editor.getModel(uri);
    if (model) {
      model.dispose();
      this.newImportsResolved = true;
    }
  }
```

新实现的`removeModel`方法也是非常容易理解的, 找到model之后去`dispose`就可以啦, 到最后我们在实现一个刷新函数即可, 在外部调用`setverions`/`remove`都可以让`code`视图准确提供类型声明; 在`monaco`中并没有提供一个函数来表达`刷新`, 但是有一种机制可以实现类似效果, 暂且就把它当作刷新吧

```js
public refresh(){
    const model = this.editor.getModel();
    model?.setValue(model.getValue());
  }
```

到这里, `monaco-editor-auto-typings`插件已经修改完毕, 完美符合业务需求, 改动也很简单, 大家有兴趣跟着我的注释还是很容易理解的.

## 结束

我们已经完整的实现了一个web ide基本功能, 并且带大家踩了在next.js上的坑, 希望能带给大家一点感悟, 尤其是初次接触web ide的同学, 相信你看了这篇文章, 能对`monaco`有一个大概的了解, 一切的成长都会在实践中慢慢开始, 希望大家多思考问题, 多动手, 在现有工具满足不了的情况下, 要勇于探索和扩充.
