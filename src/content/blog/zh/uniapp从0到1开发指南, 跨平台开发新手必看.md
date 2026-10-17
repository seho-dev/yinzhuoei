---
title: "uniapp从0到1开发指南, 跨平台开发新手必看"
description: "前排提示:非推广软文 微信公众号: 因卓诶；此文已同步到因卓诶blog Uniapp这两年是Vue开发者很喜欢的跨平台开发框架，作为一个国产开发框架，其实文档和周边工具都对国人非常友好，但是由于框架本身的跨多端所以从诞生以来都被很多开发者诟病“坑太多”，那么这…"
date: 2020-08-29
lang: zh
translationKey: "2020-08-29_309_uniapp从0到1开发指南, 跨平台开发新手必看"
categories:
  - "前端"
  - "资讯"
  - "唠嗑"
  - "精读"
views: 7960
draft: false
---

前排提示:非推广软文

微信公众号: 因卓诶；此文已同步到因卓诶blog

Uniapp这两年是Vue开发者很喜欢的跨平台开发框架，作为一个国产开发框架，其实文档和周边工具都对国人非常友好，但是由于框架本身的跨多端所以从诞生以来都被很多开发者诟病“坑太多”，那么这篇文章将结合本人2年Uniapp开发经验，给新手小白一个从0到1的教程&踩坑说明。

---

**目录**

-
**历史**

1. uniapp编译器发展历程

-
**踩坑经验（框架部分）**

1. 条件编译
2. onLoad和onShow 用合适的生命周期
3. 触底加载和下拉加载的实例
4. 如何操作DOM
5. 上传图片/文件
6. websocket
7. Nvue介绍
8. SubNvue介绍
9. 全局通信
10. h5+API介绍
11. 应用内更新和wgt的介绍和使用
12. APP自定义tabbar
13. 如何协同原生插件来工作
14. manifest.json简介
15. uniapp如何请求数据
16. uniapp应该用什么方式创建项目

-
**社区**

-
**插件市场**

-
**HbuilderX**

1. 简介和快速开发的准备工作
2. 打包APP前的准备
3. uniapp的debug
4. APP打包
5. 关于IOS

-
**拓展阅读**

---

历史
Uniapp从诞生到目前，经历了3次重大变革，首先是最初借鉴了Mpvue的模板语法（非自定义组件模式）这个模式是性能最差且支持Vue语法有很多欠缺的版本，在当时我认为Uniapp开发APP是满足不了企业需要的，倒是做一款小程序开发框架很是不错。

![](http://static.yinzhuoei.com/typecho/2020/08/28/29916384478875.png)

在2018-2019这个时间段，也就是uniapp是模板编译模式的时代，网上对于uniapp也是褒贬不一，社区的完善度还有官方的UI支持都是非常落后的，唯一吹一吹的就是QQ群当时很火，官方的解答和处理BUG的速度还很快。我个人认为web前端跨平台框架受到了很多原生安卓&IOS开发者的排挤，拿生成的代码质量和性能说事，说不定自己也没有使用过。

在我接触uniapp不久之后（大概几个月）就出了自定义组件模式，这个组件模式相当于革命性的更新，支持用户编写的Vue组件转换成微信小程序的自定义组件，基于这个uniapp在安卓平台上放置了JSCore，从这个时候开始uniapp开始慢慢的被更多的原生开发者接受，因为跨平台开发的好处是在是太大了。

那么接下来的一次更新让我瞠目结舌，因为由于19年的年底这一段时间我没有从事uniapp开发，直到今年才继续开发uniapp，发现了uniapp的一次重大更新：“v3引擎”。

V3引擎同样也是Dcloud自研，我认为主要的更新在于安卓和IOS端，开始注重了启动速度和包体积大小，我们可以在V3更新说明中看到。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299172572061192.png)

到此为止，我认为uniapp到此刻应该是推广的时候，让前端开发人员坐上跨平台开发的小车车。

踩坑经验（框架部分）

首先，uniapp绝大部分官网描述的API，比如设备信息，内存，蓝牙等等都是原生开发比较常用的，uniapp的优点就体现出来了，不同平台的各种API都会略微有差异，那么我们应该仔细看文档。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299172623206288.png)

如果文档已经说明此API存在【平台差异】，那么我们应该注意API下方可能会有这样的【tips】

![](http://static.yinzhuoei.com/typecho/2020/08/28/29918402138803.png)

这也是文档的一个小坑，很多新手如果不仔细看文档，在调API的时候不考虑兼容问题，导致在小程序/APP中，比如出现安卓和ios功能不一致的问题，如果看仔细文档，那么百分之99以上的问题都会在tips中说明。

**注释魔法：条件编译**

其次uniapp还有一个非常强大的功能【条件编译】，这也是开发中非常常用的功能，如下，我们可以使用像C语言中核心注释，注释中的代码片段将在指定的平台出现，反之亦然；

```
<!-- #ifdef APP-PLUS -->代码片段，APP-PLUS代表着APP端，ifdef包含，ifndef不包含，多个平台可以用空格隔开<!--#endif-->
<!--#ifndefAPP-PLUS-NVUEAPP-NVUEMP-->编译多个平台<!--#endif-->
```

条件编译可以存在于任何地方，template css js；同样uniapp支持更强大的条件编译：比如支持在page.json中进行判断，达到不同端不同的分包功能；静态资源也可以进行条件编译，通过static下构建platform目录即可把不同的静态资源编译到不同的平台上去；那么同理也可以把页面进行条件编译，即不同平台不同页面;

**onLoad&onShow**

我们已经了解了uniapp极具特色的条件编译之后，我们可以了解一下uniapp必不可少的生命周期，uniapp在目前版本支持vue的所有生命周期以及绝大多数API；比较重要的**nextTick**和**compile**不支持，组件选项中比较重要的是**render**函数不支持，具体更多的支持特性表请移步官网查看(https://uniapp.dcloud.io/use?id=vue%e7%89%b9%e6%80%a7%e6%94%af%e6%8c%81%e8%a1%a8)，下面我们将推荐开发中常用的生命周期以及应用场景：

```
onLoad(e){// 组件渲染未完成但是已创建的钩子，与Vue的create同理，这里推荐使用onLoad代替create// 行参e可以获取当前路径的参数，比如当前页面是b，如果a跳转到b页面是如下url：///pages/index/a?type=1 console.log(e.type); // \"1\"}

onShow(){//用于监听：页面在屏幕上显示时触发，从APP应用后台到APP前台也会触发//通常我们可以使用这个钩子做一些非列表页面的数据刷新（比如从上一个页面返回，然后此页面刷新）}
```

**触底加载&下拉加载的实践**

APP中有一个非常常见的场景叫做触底加载，那么针对**APP页面级别**的滚动触底回调就是onReachBottom

```
onReachBottom(){//在这里进行当前页加1this.listConfig.nowPage ++;// 调用加载列表的方法this.initList();}methods: {async initList(){consttoList=awaitgetALLTodoList({limit:this.listConfig.pageSize,offset:(this.listConfig.nowPage-1)*this.listConfig.pageSize),})}}
```

那么下拉加载这个功能在APP中非常常见，我们需要在page.json中对应的节点style下开启下拉加载

```
\"enablePullDownRefresh\": true
```

那么对应页面的监听钩子将会触发

```
onPullDownRefresh(){//用户下拉了页面}
```

【注意事项】不管是触底加载和下拉刷新此实例都是针对**页面级别**，如果你不知道何为页面级，那么请耐心看完uniapp的组件相关内容，在uniapp组件中有一个，它提供一个滚动视图，在这个滚动视图中有着自己的下拉加载和触底加载方法，因此如果页面中存在此组件，开发者应该妥善处理**组件级别的滚动和页面级别的滚动**，这是非常重要的。

在开发中，我们经常会出现一些列表的场景，那么在uniapp中处理长列表，我们不应该使用scroll-view组件级别的滚动，而应该使用页面级别的滚动，这样性能会更好

![](http://static.yinzhuoei.com/typecho/2020/08/28/29918556465500.png)

；

**如何操作DOM？**

我们通常在开发Vue应用时，很少直接操作DOM，在uniapp中没有暴漏DOM这个概念，但是我们可以通过指定的API去操作DOM，尽管这是非常不建议的，但是在某些业务场景不得不说

它是很方便的；

```
lettabInfo=uni.createSelectorQuery().select(\"#tab\");tabInfo.boundingClientRect((data)=>{//目标区域的信息}).exec();
```

**文件的选择**

uniapp在文件的选择上非常丰富，举一个例子比如说图片，我们可以在文档中很清楚的查询到对应的API，通过封装的API我们可以通过配置参数来chooseImage，然后拿到临时路径再继续上传；

```
uni.chooseImage({count: 6, //默认9    sizeType: [\'original\', \'compressed\'], //可以指定是原图还是压缩图，默认二者都有    sourceType: [\'album\'], //从相册选择    success: function (res) {//临时路径 res.tempFilePathsuni.uploadFile({url: \'\', //仅为示例，非真实的接口地址            filePath: tempFilePaths[0],name: \'file\',formData: {\'user\': \'test\'            },success: (uploadFileRes) => {console.log(uploadFileRes.data);            }        });    }});
```

重点来了，我们上传图片固然简单，但是上传文件是非常难的，我们如果在APP端想做一个上传文件的功能，就要尽量使用html的帮助，由html的input type=“file”来做上传，那么首先得简单了解一下利用html如何上传文件。

1. 首先我们需要使用h5+API中的webview相关的API

let wv = plus.webview.create(\"\", \"/hybrid/html/index.html\", {\'uni-app\': \'none\', //不加载uni-app渲染层框架，避免样式冲突  top: 0,height: \'100%\',background: \'transparent\'  }, {    url,    header,key: name,    ...formData,  });wv.loadURL(\"/hybrid/html/index.html\"); // 加载本地的html文件currentWebview.append(wv);//把html追加到当前页面中
 把本地的HTML加载到APP之上之后，我们在本地编写的HTML文件中引入对应uni.webview文件以及需要的业务JS文件，我们在HTML是这样做的（核心代码）
 <scripttype=\"text/javascript\"src=\"https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.2.js\">    <scriptsrc=\"js/h5-uploader.js\"type=\"text/javascript\"charset=\"utf-8\">

我们在本地编写的业务JS

```
xhr.onreadystatechange=(ev)=>{if(xhr.readyState == 4) {if (xhr.status == 200) {progress.innerText=\'成功\';//从这里可以看出，上传成功之后，我们通过改变html的title把信息返回        title.innerText = `${file.name}|^$%^|${src}|^$%^|${suffix}`;      }else {        progress.innerText = \'上传失败了\';}      setTimeout(()=>{        tis.style.display = \'none\';// 上传成功，关闭了上传webview的窗口        plus.webview.currentWebview().close();},1000);    }  };  xhr.send(formData);
```

当index.html的title变化之后，在vue组件创建webview的代码之后，我们可以在当前webview去监听标题的变化。

```
//wv就是plus.webview.create的返回，上述代码有举例子wv.addEventListener(\'titleUpdate\', ({  title}) => {  console.log(title)}
```

那vue组件拿到回调信息之后，就可以正常拿到图片信息去在页面中渲染。

顺便说一句，在文档的后面，会给大家介绍uniapp相关生态，一些业务组件插件都会在相关生态中查询到。

**websocket**

oh，又到了这个该死的东西了，今年的一段时间内，在uniapp上使用websocket可是真的太难了，先说一下事情的经过，我司开发的APP中本来使用了聊天相关功能，之后在部分业务中加入了websocket，前端需要根据websocket实时获取一些信息，在测试APP的时候发现，当2个websocket并行连接的时候，发现只有一个连接能有效的发送和接受消息，无奈只好去文档中寻找答案。

> App平台自定义组件模式下，以及支付宝小程序下，所有 vue 页面只能使用一个 websocket 连接。App下可以使用 plus-websocket
> 插件替代实现多链接。App平台，2.2.6+起支持多个socket链接，数量没有限制。
> uniapp-websocket文档

```
import socket from\'plus-websocket\'// #ifdef APP-PLUSObject.assign(uni, socket)// #endif
```

通过把依赖中的socket合并到uni中，把uni中原本封装的socket进行替换；

**Nvue**

uniapp支持用户编写.nvue的组件，那么此组件将会使用改进后的weex引擎进行渲染，提供了原生渲染的能力，那么如果你是weex用户如果用nvue写，那么全程和weex的写法无异，如果是普通的vue开发者使用nvue开发，那么将注意，nvue对于css和js的限制有非常多，尤其是css很多常用的简写都将不能支持，所以我们需要额外查询对应的weex框架的文档。

那么我们在APP中有必要全部使用nvue原生渲染么，使用普通vue组件进行webview渲染有什么缺点么？**那么我建议APP中核心/用户访问次数多/需要更强劲的性能的页面可以使用nvue，其余普通页面我们仍然可以使用vue页面。**

那么如果是weex用户转uniapp，可以全项目使用nvue，uniapp支持纯原生渲染模式，可以减少APP包体积，也可以减少内存占用，因为此时webview相关依赖是不存在的。使用nvue开发，即保留了原weex开发者的习惯又可以提供强大的API能力，这是非常让人兴奋的开发体验。

**SubNvue**

subNvue本质上是一个nvue组件，支持在普通vue页面之上运行，subNvue能覆盖map，video等原生组件，uniapp有很多办法支持覆盖原生组件，subNvue是我认为最好的方法，因为相比组件，不能嵌套，而且写起来和原页面耦合；又和webview相比，需要原生h5+api做技术支撑，nvue相对来说更多vue开发者友好。

实例：由于首页有swiper那么悬浮的头部需要遮挡住swiper，在pages.json中注册即可

```
\"subNVues\":[{\"id\":\"indexTitle\",//唯一标识\"path\":\"pages/index/subNVue/indexTitle\",//页面路径\"style\":{\"position\":\"fixed\",\"dock\":\"top\",\"background\":\"transparent\"}}]
```

**uni全局通信**

在uniapp中，vue，nvue组件中进行信息传递是很难的，尤其是vue和nvue中的信息传递我们可以通过全局通信的方式来做业务逻辑。

```
uni.$emit(\'update\',{msg:\'我是首页，用户下滑了\'})

uni.$on(\'update\',function(data){console.log(\"我是subnvue头部，你下滑了，那我就改变自身的透明度动画\")})
```

适用场景：

> vue与nvue，nvue与vue间的通讯
> tabbar页面之间的通讯
> 父页面与多级子页面间的通讯
> uniapp-emit文档

注意事项：

1. 只有在页面打开时候才能注册或者监听

**h5+API**

其实像uniapp这样的框架（或者其他的跨平台框架）我认为h5+api带动了整个相关技术，我们在没有这样框架的时候，都是使用h5+api完成一个又一个优秀的APP，这都离不开这个非常强大的API

在前面的demo中，我们或多或少地看到了h5API的影子，下面我们再复述一遍在uniapp中使用h5+API时的一些注意事项，这非常重要。

首先uniapp内置了HTML5+引擎，我们可以直接调用h5+相关规范，但是在小程序，H5端并没有对应的规范拓展，所以在这些平台不会识别“plus”这个变量，所以我们需要写条件编译

```
// #ifdef APP-PLUSconsole.log(plus)//#endif
```

在普通的H5项目中，我们如果要使用H5+API，我们需要进行ready，但是在uniapp不需要ready，直接上去就是一套军体拳就是干。

还有我们使用一些监听事件的时候，由于uniapp没有document这个对象，所以需要使用

```
plus.globalEvent.addEventListener(\"这里写h5+拓展的事件\")
```

**应用内更新&WGT的使用**

应用内更新和WGT这一块是每一个APP不可缺少的部分，所以我这里会比较详细的做一些介绍和实践。

首先我们来了解一下WGT是干嘛的。wgt是APP资源更新包，通常来讲这个包体积很小，只有1m2m左右，APP在没有拓展原生模块下或者没有增加修改一些原生的插件情况（如果不懂这个概念，后面会讲到）APP是可以使用wgt资源包升级的，整个升级过程用户可以是“无感知的”，我们通常在APP中可以看到所谓的升级提示，这个是有感知的；而有的时候你并没有升级这个APP缺发现ui变化，功能变化，那么这个时候就是无感知升级，技术手端也有很多，比如云端更新代码，在uniapp中我们可以用wgt来实现这样的功能。

我们先来APP普通的有感知更新，uniapp的实例。首先请求接口去请求服务器，拿到最新版本的下载地址，在这之前我们需要判断当前APP的版本号，那么这里就有一个小坑，我们千万不要使用下面这个API获取版本号。

```
plus.runtime.version
```

我们如果使用wgt作为资源升级包的话，那么此API获取的版本号不是准确的，它会获取APP内核的应用版本号，我们必须要使用

```
plus.runtime.getProperty(plus.runtime.appid,function(inf){console.log(inf.version)});
```

我们用此API获取到的版本号去数据库比对（前方伪代码）：

```
// 比对版本方法, 此方法网友提供，侵权删除const compare = (curV, reqV) => {if (curV && reqV) {//将两个版本号拆成数字var arr1 = curV.split(\'.\'),        arr2 = reqV.split(\'.\');var minLength = Math.min(arr1.length, arr2.length),        position = 0,        diff = 0;//依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {        position++;      }      diff = (diff != 0) ? diff : (arr1.length - arr2.length);//若curV大于reqV，则返回truereturn diff >= 0;    } else {//输入为空returnfalse;    }}
const downLoadFail=()=>{    uni.hideToast();    uni.showToast({title: \"下载新版本失败，请在设置页面检查更新再试\",duration: 2000,icon: \"none\",position: \"bottom\"    });}

// 获取更新列表，取最新的更新包constupdatePackageList=awaitgetUpdatePackageList();if(compare(updatePackageList[0].version,\"根据上面的方法获取的版本号\")){// 如果存在更新// 整包更新  uni.downloadFile({url: \"整包APK的下载地址（非wgt包地址）\",success: res => {if (res.statusCode === 200) {//下载之后打开临时路径的文件        plus.runtime.openFile(res.tempFilePath);      }else {        downLoadFail(); // 调用更新失败的方法      }    },fail: error => {      downLoadFail(); // 调用更新失败的方法    }  });}
```

以上是普通的整包升级的伪代码，如果遇到强制更新，非强制更新，即开发者需要自己控制对应的button，这里就不阐述了。

对于wgt的更新，相比整包更新有一定区别，因为整包更新非常简单，无非就是下载apk文件，然后下完之后打开，让用户自己安装。wgt的生成需要在hbuilderx中操作（后续hbuilderx篇会讲到），我们需要把wgt包上传在服务器上，前方伪代码：

```
uni.downloadFile({url:\"wgt下载地址\",success: res => {if (res.statusCode === 200) {// 安装wgt        plus.runtime.install(res.tempFilePath, {  force: false        }, function() {  // wgt安装成功if(silence){            uni.showToast({title: \"已更新最新的资源，重启应用获取更佳的用户体验\",duration: 4000,icon: \"none\",position: \"bottom\"            });          }else {            plus.runtime.restart();// 不是静默升级，就立即重启应用          }        }, function(e) {if(!silence){            downLoadFail();          }        });       }else {        downLoadFail();      }    },fail: error => {      downLoadFail();    }  });
```

细心的同学已经发现了，wgt安装需要用户重启，否则不会生效。所以我们在开发中会有一个silence的选项，如果是true那么会选择静默更新（用户无感知）这个时候我们只需要install安装即可，如果不是无感知，那么需要自动重启。

**APP自定义tabbar**

我们在企业级开发中，总会有一些沙雕产品想这种“凸起”或者“奇奇怪怪”的tabbar（希望我司产品不会看到）事实上，这种自定义tabbar对于uniapp开发者来说，是有一定的难度，首先如果是完全定制，那么需要有较强的webview功底或者subnvue功底。

由于自定义tabbar代码较多，我们可以借助一些插件来实现，但是值得注意的事情是，如果自定义tabbar在每一个页面都引用，会出现抖动闪烁的问题，所以我们应该在main.js中去draw这个tabbar

```
Vue.prototype.$tabbarView=newTabbarView();
```

然后在每一个tabbar页面去watch对应的路径变化，然后改变当前选中是第几项item

```
onShow(){//#ifdef APP-PLUS  this.$tabbarView.$watch();//#endif},onHide() {//#ifdef APP-PLUS  this.$tabbarView.$watch();//#endif},
```

这个watch等方法，是目前我司使用的组件的API，所以具体的定制tabbar思路知道了，我们使用一些第三方插件，可以尽量少踩一些坑。

**引入原生安卓/IOS插件**

ios/安卓原生的插件我们可以在【插件市场】(之后会讲到)中找到，我们在manifest.json配置本地插件即可，那么具体的插件的添加办法，如果是在插件市场直接点击添加到APP中。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299182323158587.png)

如果我们是云打包（之后会说到这个概念）那么建议大家去社区直接购买然后添加，在配置文件中选中即可。

```
constPluginName=uni.requireNativePlugin(PluginName);
```

此API只存在于APP端，所以需要条件编译，传入插件名称，就会在对应的APP中找已添加的插件是否存在（如果不懂这块，可以看下面一篇说明：《manifest.json：uniapp的半壁江山》），如果插件已被添加则正常使用。

我们这边实例选用的是uniapp官方文档中的demo例子，插件是官方提供的原生增强提示框：

```
constdcRichAlert=uni.requireNativePlugin(\'DCloud-RichAlert\')dcRichAlert.show({    position: \'bottom\',    title: \"提示信息\",    titleColor: \'#FF0000\',    content: \"<a href=\'https://uniapp.dcloud.io/\' value=\'Hello uni-app\'>uni-app</a> 是一个使用 Vue.js 开发跨平台应用的前端框架!\\n免费的\\n免费的\\n免费的\\n重要的事情说三遍\",    contentAlign: \'left\',    checkBox: {        title: \'不再提示\',        isSelected: true    },    buttons: [{        title: \'取消\'    }, {        title: \'否\'    }, {        title: \'确认\',        titleColor: \'#3F51B5\'    }]}, result => {console.log(result)});
```

说明一下引入原生插件的API，不管是vue还是nvue页面都可以使用。

如果要debug，那么就必须重新打一个自定义基座包（下面会讲到这个概念）否则不会生效。

**manifest.json：uniapp的半壁江山**

由于这个地方是uniapp配置项重中之重的地方，虽然用hbx直接预览它会帮助我们自动格式化，但是可能我的解释能让这块变得更简单。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299193490118743.png)

app的ID是非常重要的，一般建立成功之后就不需要再更改，我们在注册微信开放平台，支付宝或者高德等等，都需要用到APP的ID和包名（packageName），包名设置会在之后介绍到，基本设置中包含了几个重要的信息，一个是应用版本名称一个是应用版本号，我们在做更新的时候需要+1，包括生成wgt包的时候。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299201262170543.png)

我们可以在此处可视化的配置APP的模块权限，那么uniapp封装的模块权限真的是傻瓜式的，配置一些平台的key和secret然后再使用uniapp对应的api即可，那么肯定的事是这是增加包体积的。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299214124113501.png)

引入原生插件，app如果有对应特殊的业务需求也可以编译原生的插件，具体如何引入本地原生插件，我们之前也提到过。

剩余的配置都是针对于小程序/H5的配置，所以根据我们自己的业务可以自己去查询文档。

**uniapp应该使用哪种请求库呢？axios支持么？**

uniapp是跨端框架，为了迎合跨端，我们不可以使用axios，因为axios不支持APP原生端，它仅仅支持网页端，所以我们可以使用uniapp提供的API（uni.request）一般这种API就够用，但是如果你想有像axios一样的配置体验的话，强烈建议你使用flyio.js这个库我们在新建项目时候会帮助我们安装好的。

**uniapp项目是cli创建好还是hbx创建好？**

创建uniapp项目，可以分为2种模式：

1. cli命令行创建
2. hbuilderX创建

结论：优先使用cli命令行创建，因为对于开发vue
web的人来说，cli命令行是最熟悉的，那么uniapp的cli方式创建的项目整体的目录结构类似于普通vue
web项目，而且我们直接使用npm快速安装依赖，像普通方式去引入；uniapp在版本支持上也是在cli项目上最先上线，可以使用cli体验到最新的功能，对于初学者来说，标签的学习是一个必须考虑进去的成本，cli方式创建的工程允许使用普通html标签，比如



它们在编译的时候会转换成uniapp的标签组件（**尽管这样写并不推荐**）

hbx创建的uniapp项目，是随着hbx软件的版本升级而升级，cli创建的版本必须执行

```
npm update
```

才能更新到最新版本，**所以我建议大家搭建项目使用cli项目，在开发中使用uniapp的标签不要使用html标签。**

社区

uniapp有着非常活跃的社区，这是真的切身体验过，使得整个开发遇到的问题我们都可以在社区找到（https://ask.dcloud.net.cn/）

我们遇到了所有的bug，首选需要查询是否是自身开发问题，如果自测确认没问题那么就可以在社区发布bug贴，如图

![](http://static.yinzhuoei.com/typecho/2020/08/28/299221038224762.png)

发布成功之后我们在文章底部邀请，输入dcloud就可以邀请官方人员解答，如果出现bug，也可以上传代码压缩包（指定官方人员查看）这样可以更快地让官方找到问题帮助你解决问题。

插件市场

**打一个广告先，我的UI库的alpha版本在插件市场发布，尽管现在不开放下载，大概在年底左右会重构给大家带来高质量的组件（名子叫i-uniapp）希望大家关注一下**

https://ext.dcloud.net.cn/ 插件市场地址

插件市场有很多vue组件/原生sdk等等，具体的安装方法我们已经在前面提到了，使用hbx开发uniapp项目可以直接点击导入插件到项目中

HbuilderX：开发uniapp神器（本文章重点）

**介绍Hbx和快速开发指南**

我可以很负责任的说，虽然内核是eclipse，但是也算是国产的编辑器IDE，它在Vue的支持程度上足以让我震惊，说实话从Vue开发角度来说，HbuilderX比vscode好。但是hbx被吐槽地点也有很多，比如占用内存高，UI不如vscode/sublime等等，但是这是IDE之争不在我们文章的讨论重点之内，**所以我们如果要开发uniapp项目，使用hbx开发是上上策**

我们如果是使用vscode或者sublime，可以在hbx调整快捷键语法

![](http://static.yinzhuoei.com/typecho/2020/08/28/299231538641488.png)

插件安装，我目前安装的是这些，为了教程的顺利和以后开发者的开发顺利，请务必装这几个基础插件。

![](http://static.yinzhuoei.com/typecho/2020/08/28/299242096116716.png)

**打包APP前的准备**

我们首先来看一下打包APP需要什么

![](http://static.yinzhuoei.com/typecho/2020/08/28/299252736086825.png)

我们需要一个安卓证书，我们来生成一下这个安卓证书

1. 首先需要安装jdk，如果没有jdk，就去安装，然后在其bin文件夹下运行cmd
keytool-genkey-alias这里写证书别名-keyalgRSA-validity36500-keystore这里写证书名称.keystore

> 其中参数-validity为证书有效天数，我们可以写的大写。-alias后面是证书别名
> 输入密码的时候没有显示，就输入就行了。退格,tab等都属于密码内容，这个密码在给.apk文件签名的时候需要。输入这个命令之后会提示您输入秘钥库的口令
> 接着是会提示你输入：姓氏，组织单位名称，组织名称，城市或区域名称，省市，国家、地区代码，密钥口令。确认正确输入y，回车
> 作者：草字头乌君
> 链接：https://www.jianshu.com/p/14add4a02ed6 来源：简书
> keystore的密码一定要记住，如果忘记需要执行另外一个命令去查询
> 生成keystore成功之后我们可以在其bin目录下发现一个以你设置为名字后缀为keystore文件

1. 填写包名

这个包名一般标准是以com开始的（java工程中的包名标准）,ios不清楚，具体可以询问具体的ios开发，命名包名是一个非常重要的事情，因为包名关系着一个APP的主要信息，在上架应用商店的时候，包名则代表着APP的唯一性，所以一定要设置一个尽量贴合企业/个人的信息相关的名字，比如公司叫“将进酒”：

```
com.qiangjinjiu.andriod
```

或者公司有具体的规定，则按照自身公司进行设置，这里就不阐述了

1. 渠道包选项

对应的渠道包，可以在对应的平台做一个标识，可以在后台看到每个平台的使用指数，这个根据业务需求可以打开，一般不会选择

1. 原生混淆

可以对js和nvue文件进行原生混淆，提高安全性

1. 广告投放选择

uniapp自带的广告插件，根据业务需要自行选择

**debug：自定义基座/小程序模拟器**

我们在上一段讲解了如何打包APP，打包APP之前的准备工作，那么细心的同学会发现，打包APP中有这样的一个选项

![](http://static.yinzhuoei.com/typecho/2020/08/28/299262864820036.png)

什么是自定义基座，自定义基座是我们开发日常debug的包，这个包没有压缩，所以会比正式包大，正式包记得选择正式包不要选择基座包。自定义基座APP包安装到手机上，可以连接HbuilderX上，进行调试，下面介绍一下如何打自定义基座然后debug调试

1. 云打包：发布之前的编译阶段

![](http://static.yinzhuoei.com/typecho/2020/08/28/299262887472107.png)

1. 打包成功会返回成功信息，自定义基座打包

![](http://static.yinzhuoei.com/typecho/2020/08/28/299262148811810.png)

打包成功之后，我们拿起我们的诺基亚手机，打开usb调试模式（作为开发，如果连这个都不知道咋打开，那就去google吧），调试模式打开之后，一定要选中hbx左边的项目，然后点击运行，运行手机模拟器，如图（重点）:

![](http://static.yinzhuoei.com/typecho/2020/08/28/29927623383735.png)

基座选择一定要选择自定义基座（如果你没打包自定义基座这里就没有这个选项），然后等待手机，会出现安装基座（app）的提示，点击安装，然后手机会自动打开APP，然后这个时候我们就可以更改代码，ui，然后手机及时更新变化。

那么debug自定义基座有什么注意事项呢？

1.当我们要调试登录，分享，地图等具有原生权限功能的话，需要配置对应平台的key和secret。那么我们增加，修改了原生插件配置/原生插件的修改，这个时候我们需要重新打包自定义基座查看最新的代码。

2.切记不要把自定义基座当成正式包发布

3.不要打包打正式包debug，因为云打包正式包一天只有免费20次，我们debug用自定义基座就行了。

那么我们觉得，日常的开发除了调试第三方登录，地图等需要用手机去实际测试，那么平时我们更改UI布局，难道也用自定义基座这么麻烦么？

答案是否定的，我们要知道，虽然布局UI在不同机型可能会产生偏差，但是我们日常可以使用小程序模拟器进行开发，然后开发完毕，在实体机型上进行初步测试，看看是否Ui或者功能有偏差，再具体更改，因为小程序模拟器是最接近APP的，大部分UI布局功能都是最贴近用户手机的。

那么使用小程序模拟器调试，这里也有一些注意事项，我们如果运行项目到微信小程序，如果是第一次，我们需要提前在小程序模拟器中的安全打开RFC调用

![](http://static.yinzhuoei.com/typecho/2020/08/28/29928961372126.png)

设置->安全->端口开启

然后此时我们可以使用hbx来启动微信小程序进行开发啦。

**APP打包**

我们项目模块迭代开发之后，需要打包成APP，那么我们有2种途径打包

1. 云打包
2. 离线打包

以及特殊的wgt资源包（对应之前提到的wgt更新）

首先我们来说一下云打包，云打包是dcloud提供的云打包服务器，我们在客户端HBX编译之后就会进入云打包的队列，由dcloud打包服务器打包成功之后返回给hbx控制台临时的下载链接。

那么在之前，我们已经了解了自定义基座，那么这个自定义基座的打包和云打包（正式包）只是一个选项的问题，云打包每天有20次的免费机会，所以切记我们debug千万不要生成线上包

离线打包指的是我们可以把uniapp工程生成出原生工程，由我们开发者自己去打包，那么我相信如果有原生基础的开发者会很乐意这样做，但是务必提醒一点就是社区很多的问题都是离线打包造成的，那么为了更稳定的APP开发，我建议使用云打包。

我们在之前提到的wgt资源包，我们应该这样生成，生成成功的wgt资源包上传到服务器，然后按照前面的demo进行更新

![](http://static.yinzhuoei.com/typecho/2020/08/28/299294041053807.png)

**关于IOS**

其实关于IOS，本人并不是了解很多，我可以简单讲一下，可能对于新手很重要。

1.uniapp的应用是可以被审核成功的，因为19年年底苹果发了一则通知，大概是性能差劲的套壳APP不会被上架，但是2020年，必须知道uniapp不是套壳APP，它也有原生宣传，webview渲染性能也是非常强劲的，没有网上说的那么不堪。
 2.如果是windows用户那么我建议你使用mac开发uniapp，因为windows开发打包出的ios包不太方便去上架等等，而mac系统没有这个顾虑。
 3.windows新手如果没有上架过，可以在windows下载ApplicationLoader, 如果是mac用户那么强烈推荐你下载Transporter App ，老司机就用xcode内置的上传吧~

**拓展阅读**
1.uniapp统计功能，免费，安全，统计数据非常详细，支持自定义埋点。

```
https://tongji.dcloud.net.cn/
```

2.uniapp云开发，现在云开发，云数据库这么火，早在几年前小程序就有这样的东西，云开发也是今年uniapp非常大的更新，现在支持腾讯云和阿里云，据说还比较便宜，感兴趣的小伙伴可以去看看。

```
https://unicloud.dcloud.net.cn/login
```

3.uniapp广告平台，非常适用于个人，个人做的APP可以通过这个广告平台变现。

```
https://uniad.dcloud.net.cn/login
```
