---
title: "Uni-app from Zero to One: An Essential Guide for Cross-Platform Beginners"
description: "A quick note: this is not a sponsored post. Uni-app has become a popular cross-platform framework among Vue developers, with documentation and tools that are especially accessible to Chinese developers. Its many target platforms also bring plenty of pitfalls. Drawing on two years of experience, this guide walks beginners from getting started to avoiding common problems…"
date: 2020-08-29
lang: en
translationKey: "2020-08-29_309_uniapp从0到1开发指南, 跨平台开发新手必看"
categories:
  - "Frontend"
  - "News"
  - "Life"
  - "Deep Dive"
views: 7960
draft: false
---

A quick note up front: this is not a sponsored post.

WeChat Official Account: Yinzhuoei. This article is also published on the Yinzhuoei blog.

Over the past two years, Uni-app has become a popular cross-platform framework among Vue developers. Developed in China, its documentation and surrounding tools are especially accessible to Chinese developers. But because the framework targets so many platforms, developers have complained about its "countless pitfalls" ever since it appeared. Drawing on my two years of Uni-app experience, this article offers beginners a from-scratch guide and a tour of the pitfalls to watch out for.

---

**Contents**

-
**History**

1. The evolution of the Uni-app compiler

-
**Lessons Learned: The Framework**

1. Conditional compilation
2. onLoad and onShow: choosing the right lifecycle hooks
3. Infinite scrolling and pull-to-refresh examples
4. Working with the DOM
5. Uploading images and files
6. WebSocket
7. An introduction to nvue
8. An introduction to subNVue
9. Global communication
10. An introduction to the HTML5+ API
11. In-app updates and WGT packages
12. Custom app tab bars
13. Working with native plugins
14. An introduction to manifest.json
15. Making requests in Uni-app
16. Choosing how to create a Uni-app project

-
**Community**

-
**Plugin Marketplace**

-
**HbuilderX**

1. Introduction and setup for rapid development
2. Preparing to package an app
3. Debugging Uni-app
4. Packaging an app
5. A note on iOS

-
**Further Reading**

---

History
From its inception to today, Uni-app has gone through three major changes. It first borrowed Mpvue's template syntax, using a mode without custom components. This version had the weakest performance and many gaps in Vue syntax support. At the time, I didn't think Uni-app could meet enterprise requirements for app development, though it was quite promising as a mini-program framework.

![](http://static.yinzhuoei.com/typecho/2020/08/28/29916384478875.png)

During 2018–2019, when Uni-app used template compilation mode, opinions online were mixed. Its community resources and official UI support were still underdeveloped. One bright spot was its very active QQ groups, where the official team answered questions and fixed bugs quickly. Personally, I think web-based cross-platform frameworks faced a lot of pushback from native Android and iOS developers, who criticized generated code quality and performance—sometimes, perhaps, without having tried them.

A few months after I first encountered Uni-app, custom component mode arrived. This was a revolutionary update: it could turn user-written Vue components into WeChat mini-program custom components. As part of this architecture, Uni-app introduced JSCore on Android. From then on, more native developers gradually began accepting Uni-app, because the benefits of cross-platform development were simply too substantial to ignore.

The next update really blew me away. I hadn't worked with Uni-app for a while toward the end of 2019, and only returned to it this year. That's when I discovered its major new update: the "v3 engine."

The v3 engine was also developed in-house by DCloud. In my view, the main improvements were on Android and iOS, with a new focus on startup speed and package size. You can see this in the v3 release notes.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299172572061192.png)

At this point, I think Uni-app is ready for wider adoption. It's time to get frontend developers on board the cross-platform development train.

Lessons Learned: The Framework

First, most APIs described on the Uni-app website—device information, memory, Bluetooth, and so on—cover capabilities commonly used in native development. This is where Uni-app's strengths become clear. APIs vary slightly between platforms, so read the documentation carefully.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299172623206288.png)

If the documentation marks an API as having [platform differences], look for [tips] like these below its description:

![](http://static.yinzhuoei.com/typecho/2020/08/28/29918402138803.png)

This is also an easy detail to miss. Beginners who don't read carefully may call an API without considering compatibility, then find that a mini-program or app behaves differently on Android and iOS. Read the docs closely: more than 99% of these issues are explained in the tips.

**Comment Magic: Conditional Compilation**

Uni-app also has a very powerful feature that you'll use frequently: [conditional compilation]. As shown below, special comment directives, reminiscent of C preprocessor directives, include a code fragment only on the specified platform—or exclude it, depending on the directive.

```
<!-- #ifdef APP-PLUS -->Code snippet; APP-PLUS targets APP, ifdef includes, ifndef excludes; separate multiple platforms with spaces<!--#endif-->
<!--#ifndefAPP-PLUS-NVUEAPP-NVUEMP-->Compile for multiple platforms<!--#endif-->
```

Conditional compilation can be used anywhere: templates, CSS, or JavaScript. Uni-app supports more advanced uses too, such as conditions in page.json to configure different subpackages for different targets. Static assets can also be compiled conditionally: create platform directories under static to include different resources for different platforms. The same idea applies to pages, letting each platform use different pages.

**onLoad&onShow**

Now that we've covered Uni-app's distinctive conditional compilation, let's look at its essential lifecycle hooks. The current version supports all Vue lifecycle hooks and most Vue APIs. Notable exceptions include **nextTick** and **compile**; among component options, the **render** function is also unsupported. For the full feature support table, see the official website (https://uniapp.dcloud.io/use?id=vue%e7%89%b9%e6%80%a7%e6%94%af%e6%8c%81%e8%a1%a8). Below are some frequently used hooks and their typical use cases:

```
onLoad(e){// Hook after creation but before rendering, similar to Vue's create; use onLoad instead of create// Parameter e contains the current path parameters; for example, if the current page is b and a navigates to b using this url:///pages/index/a?type=1 console.log(e.type); // \"1\"}

onShow(){//Triggered when the page appears on screen, including when the APP moves from the background to the APP foreground//Use this hook to refresh data on non-list pages (for example, when returning from the previous page)}
```

**Infinite Scrolling and Pull-to-Refresh in Practice**

Loading more content when the user reaches the bottom is a very common app interaction. For **page-level** scrolling in an app, the callback is onReachBottom:

```
onReachBottom(){//Increment the current page by 1this.listConfig.nowPage ++;// Call the list-loading method this.initList();}methods: {async initList(){consttoList=awaitgetALLTodoList({limit:this.listConfig.pageSize,offset:(this.listConfig.nowPage-1)*this.listConfig.pageSize),})}}
```

Pull-to-refresh is another common app feature. Enable it under the corresponding page's style node in page.json:

```
\"enablePullDownRefresh\": true
```

The matching page lifecycle hook will then fire:

```
onPullDownRefresh(){//The user pulled down to refresh the page}
```

[Important] Both the infinite-scroll and pull-to-refresh examples above apply at the **page level**. If you're not sure what that means, take the time to read Uni-app's component documentation. Uni-app provides a scroll-view component with its own scrolling area and its own pull-to-refresh and end-of-scroll events. If your page contains this component, carefully distinguish **component-level scrolling from page-level scrolling**. This is very important.

Lists are common in development. For long lists in Uni-app, prefer page-level scrolling over component-level scrolling in scroll-view; page-level scrolling offers better performance.

![](http://static.yinzhuoei.com/typecho/2020/08/28/29918556465500.png)

;

**How Do You Work with the DOM?**

When developing Vue apps, we rarely manipulate the DOM directly. Uni-app doesn't expose the DOM as such, but it does provide specific APIs for querying it. Although direct manipulation is strongly discouraged, in certain business scenarios

it is undeniably convenient:

```
lettabInfo=uni.createSelectorQuery().select(\"#tab\");tabInfo.boundingClientRect((data)=>{//Target area information}).exec();
```

**Selecting Files**

Uni-app offers plenty of file selection options. Take images, for example: the relevant API is easy to find in the documentation. Configure chooseImage with the desired options, obtain temporary file paths, and then upload the files.

```
uni.chooseImage({count: 6, //Default: 9    sizeType: [\'original\', \'compressed\'], //Choose original or compressed images; both by default    sourceType: [\'album\'], //Select from the album    success: function (res) {//Temporary paths res.tempFilePathsuni.uploadFile({url: \'\', //Example only; not a real endpoint            filePath: tempFilePaths[0],name: \'file\',formData: {\'user\': \'test\'            },success: (uploadFileRes) => {console.log(uploadFileRes.data);            }        });    }});
```

Here's the tricky part: uploading images is straightforward, but uploading arbitrary files is much harder. For a file upload feature in an app, you may need the help of HTML and an input with type="file". First, let's briefly look at how to upload a file through HTML.

1. First, use the WebView APIs provided by HTML5+.

let wv = plus.webview.create(\"\", \"/hybrid/html/index.html\", {\'uni-app\': \'none\', // Do not load the uni-app rendering framework, to avoid style conflicts  top: 0,height: \'100%\',background: \'transparent\'  }, {    url,    header,key: name,    ...formData,  });wv.loadURL(\"/hybrid/html/index.html\"); // Load the local HTML file currentWebview.append(wv);// Append the HTML to the current page
 After loading the local HTML over the app page, include the corresponding uni.webview script and your business JavaScript in that HTML file. Here is the core HTML code:
 <scripttype=\"text/javascript\"src=\"https://js.cdn.aliyun.dcloud.net.cn/dev/uni-app/uni.webview.1.5.2.js\">    <scriptsrc=\"js/h5-uploader.js\"type=\"text/javascript\"charset=\"utf-8\">

In our local application JavaScript:

```
xhr.onreadystatechange=(ev)=>{if(xhr.readyState == 4) {if (xhr.status == 200) {progress.innerText=\'Success\';//After upload succeeds, return the result by changing the html title        title.innerText = `${file.name}|^$%^|${src}|^$%^|${suffix}`;      }else {        progress.innerText = \'Upload failed\';}      setTimeout(()=>{        tis.style.display = \'none\';// Upload succeeded; close the upload webview window        plus.webview.currentWebview().close();},1000);    }  };  xhr.send(formData);
```

When index.html's title changes, we can listen for that change on the WebView, after the code that creates it in the Vue component.

```
//wv is the return value of plus.webview.create, as shown above wv.addEventListener(\'titleUpdate\', ({  title}) => {  console.log(title)}
```

Once the Vue component receives the callback data, it can obtain the image information and render it on the page as usual.

By the way, later in this article I'll introduce the Uni-app ecosystem, where you can find plugins and components for various business needs.

**websocket**

Oh, here we go again with this troublesome thing. For a while this year, using WebSocket in Uni-app was genuinely painful. Here's what happened: our app already had chat functionality, and we added another WebSocket connection for a separate feature that needed real-time updates. During testing, we found that with two simultaneous WebSocket connections, only one could successfully send and receive messages. With no other option, I went back to the documentation.

> In custom component mode on the App platform, and in Alipay mini-programs, all Vue pages can use only one WebSocket connection. On the App platform, use the plus-websocket
> plugin to implement multiple connections instead. Since version 2.2.6, the App platform supports multiple socket connections without a limit on their number.
> Uni-app WebSocket documentation

```
import socket from\'plus-websocket\'// #ifdef APP-PLUSObject.assign(uni, socket)// #endif
```

Merge the dependency's socket methods into uni, replacing Uni-app's original socket implementation.

**Nvue**

Uni-app supports components written as .nvue files. These use an improved Weex engine for native rendering. If you're already a Weex user, writing nvue feels essentially the same. If you're coming from ordinary Vue development, however, be aware that nvue places many restrictions on CSS and JavaScript. In particular, many common CSS shorthands are unsupported, so you'll need to consult the corresponding Weex documentation.

Does every page in an app need to use nvue's native rendering? What's wrong with rendering ordinary Vue components in a WebView? **My recommendation is to use nvue for core pages, frequently visited pages, or pages with demanding performance requirements. Ordinary pages can still use Vue.**

If you're moving from Weex to Uni-app, you can use nvue throughout the project. Uni-app supports a fully native rendering mode that reduces both package size and memory usage, since the WebView-related dependencies are no longer included. Developing with nvue preserves familiar Weex practices while adding a powerful set of APIs—a genuinely exciting development experience.

**SubNvue**

subNVue is essentially an nvue component that can run over an ordinary Vue page. It can cover native components such as map and video. Uni-app offers several ways to overlay native components, but I consider subNVue the best. Compared with cover-view-style components, which cannot be freely nested and couple the overlay code to the original page, and compared with WebViews, which require native HTML5+ APIs, nvue is more approachable for Vue developers.

Example: the home page contains a swiper, and a floating header needs to sit over it. Register the overlay in pages.json:

```
\"subNVues\":[{\"id\":\"indexTitle\",//Unique ID\"path\":\"pages/index/subNVue/indexTitle\",//Page path\"style\":{\"position\":\"fixed\",\"dock\":\"top\",\"background\":\"transparent\"}}]
```

**Global Communication with uni**

Passing information between Vue and nvue components in Uni-app can be difficult, especially across the Vue/nvue boundary. Global events provide a way to implement this communication.

```
uni.$emit(\'update\',{msg:\'Home page: the user scrolled down\'})

uni.$on(\'update\',function(data){console.log(\"I am the subnvue header; you scrolled down, so I will animate my opacity\")})
```

Use cases:

> Communication from Vue to nvue and from nvue to Vue
> Communication between tab bar pages
> Communication between a parent page and nested child pages
> Uni-app emit documentation

Things to keep in mind:

1. Registration and listening are only possible while the page is open.

**HTML5+ API**

In my view, the HTML5+ API has helped drive the technology behind frameworks like Uni-app and other cross-platform tools. Before these frameworks existed, developers were already using HTML5+ APIs to build excellent apps. That owes a great deal to this powerful API set.

We've already seen traces of HTML5+ in the earlier examples. Let's go over a few important points about using it in Uni-app.

First, Uni-app includes the HTML5+ engine, so you can call its APIs directly. Mini-programs and H5 targets don't provide these extensions, however, and won't recognize the plus variable. We therefore need conditional compilation:

```
// #ifdef APP-PLUSconsole.log(plus)//#endif
```

In an ordinary H5 project, you need to wait for the HTML5+ ready event before using its APIs. In Uni-app, you don't need that step—just jump straight in.

Also, because Uni-app doesn't provide a document object, use the following when subscribing to certain events:

```
plus.globalEvent.addEventListener(\"Enter the h5+ extension event here\")
```

**In-App Updates and WGT Packages**

In-app updates and WGT packages are essential topics for app development, so I'll cover them here in a little more detail, with practical examples.

First, what is WGT for? A WGT is an app resource update package. It's usually small, around 1–2 MB. As long as you haven't added native modules or added or changed native plugins—I'll explain those concepts later—the app can be updated with a WGT resource package. The entire update can be invisible to the user. The familiar update prompt in an app is a visible update; sometimes, however, you haven't explicitly updated an app but its UI or functionality changes anyway. That is a silent update. There are several ways to implement it, including updating code from the cloud; in Uni-app, WGT packages provide this capability.

Let's start with a conventional, user-visible app update in Uni-app. Request the latest version's download URL from the server. Before doing that, we need to check the app's current version number. Here's a small trap: do not use the following API to obtain it.

```
plus.runtime.version
```

If you use WGT resource updates, the version returned by this API is not the one you need: it reports the packaged app runtime's version. Instead, use:

```
plus.runtime.getProperty(plus.runtime.appid,function(inf){console.log(inf.version)});
```

Compare the version obtained through this API with the version in your database. Pseudocode follows:

```
// Version comparison method, contributed online; remove if it infringes copyright const compare = (curV, reqV) => {if (curV && reqV) {//Split both version strings into numbers var arr1 = curV.split(\'.\'),        arr2 = reqV.split(\'.\');var minLength = Math.min(arr1.length, arr2.length),        position = 0,        diff = 0;//Compare version segments in order; stop when they differ (briefly explained below) while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)) {        position++;      }      diff = (diff != 0) ? diff : (arr1.length - arr2.length);//If curV is greater than reqV, return truereturn diff >= 0;    } else {//Empty input returnfalse;    }}
const downLoadFail=()=>{    uni.hideToast();    uni.showToast({title: \"Failed to download the new version; check for updates in Settings and try again\",duration: 2000,icon: \"none\",position: \"bottom\"    });}

// Fetch the update list and select the latest package constupdatePackageList=awaitgetUpdatePackageList();if(compare(updatePackageList[0].version,\"Version number obtained using the method above\")){// If an update is available// Full-package update  uni.downloadFile({url: \"Full APK download URL (not the wgt package URL)\",success: res => {if (res.statusCode === 200) {//Open the downloaded file at its temporary path        plus.runtime.openFile(res.tempFilePath);      }else {        downLoadFail(); // Call the update failure handler      }    },fail: error => {      downLoadFail(); // Call the update failure handler    }  });}
```

The above is pseudocode for a normal full-package update. For mandatory versus optional updates, you'll need to control the corresponding buttons yourself; I won't go into that here.

WGT updates differ somewhat from full-package updates. A full update is simple: download the APK, open it, and let the user install it. WGT packages are generated in HBuilderX, which we'll cover later. Upload the WGT package to your server, then use code along these lines:

```
uni.downloadFile({url:\"wgt download URL\",success: res => {if (res.statusCode === 200) {// Install wgt        plus.runtime.install(res.tempFilePath, {  force: false        }, function() {  // wgt installed successfully if(silence){            uni.showToast({title: \"Resources are up to date; restart the app for a better experience\",duration: 4000,icon: \"none\",position: \"bottom\"            });          }else {            plus.runtime.restart();// Restart the app immediately for non-silent updates          }        }, function(e) {if(!silence){            downLoadFail();          }        });       }else {        downLoadFail();      }    },fail: error => {      downLoadFail();    }  });
```

You may have noticed that a WGT update only takes effect after the app restarts. That's why we include a silence option. When it's true, perform a silent update by installing the package and letting it take effect on the next restart. Otherwise, restart the app automatically.

**Custom App Tab Bars**

In enterprise projects, some product manager will inevitably dream up a "raised" or otherwise "unusual" tab bar. (I hope ours doesn't read this.) In practice, these custom tab bars can be challenging for Uni-app developers. A fully customized solution requires a solid understanding of WebViews or subNVue.

A custom tab bar involves quite a lot of code, so plugins can help. One important caveat: including the custom tab bar separately on every page can cause flickering and jitter. Instead, draw it in main.js:

```
Vue.prototype.$tabbarView=newTabbarView();
```

Then watch the relevant route changes on each tab bar page and update the selected item:

```
onShow(){//#ifdef APP-PLUS  this.$tabbarView.$watch();//#endif},onHide() {//#ifdef APP-PLUS  this.$tabbarView.$watch();//#endif},
```

Methods such as $watch here belong to the API of the component we're currently using at work. Once you understand the general approach, using a third-party plugin can help you avoid some of the pitfalls.

**Adding Native Android/iOS Plugins**

You can find native iOS and Android plugins in the [Plugin Marketplace], which I'll introduce later. Configure local plugins in manifest.json. For marketplace plugins, click the option to add them directly to the app.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299182323158587.png)

If you're using cloud packaging—a concept we'll cover later—I recommend purchasing the plugin through the community marketplace and adding it there. Then select it in the configuration file.

```
constPluginName=uni.requireNativePlugin(PluginName);
```

This API exists only on the App target, so use conditional compilation. Pass the plugin name, and it looks for the corresponding plugin added to the app. If this is unfamiliar, see the next section, "manifest.json: Half the Uni-app Story." Once the plugin has been added, you can use it normally.

For this example, we'll use the demo from Uni-app's official documentation: DCloud's enhanced native alert dialog plugin.

```
constdcRichAlert=uni.requireNativePlugin(\'DCloud-RichAlert\')dcRichAlert.show({    position: \'bottom\',    title: \"Notice\",    titleColor: \'#FF0000\',    content: \"<a href=\'https://uniapp.dcloud.io/\' value=\'Hello uni-app\'>uni-app</a> is a frontend framework using Vue.js to build cross-platform apps!\\nFree\\nFree\\nFree\\nImportant things bear repeating three times\",    contentAlign: \'left\',    checkBox: {        title: \'Do not show again\',        isSelected: true    },    buttons: [{        title: \'Cancel\'    }, {        title: \'No\'    }, {        title: \'Confirm\',        titleColor: \'#3F51B5\'    }]}, result => {console.log(result)});
```

The API for loading native plugins works in both Vue and nvue pages.

To debug a native plugin, you must rebuild a custom runtime package—another concept we'll cover below—or it won't be available.

**manifest.json: Half the Uni-app Story**

This file contains some of Uni-app's most important configuration. HBuilderX provides a visual editor and formats it for you, but a little explanation may make the settings easier to understand.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299193490118743.png)

The app ID is very important. Once created, it generally doesn't need to change. Registering with the WeChat Open Platform, Alipay, Amap, and similar services requires an app ID and package name (packageName). We'll cover the package name later. The basic settings include two important fields: the app version name and version code. Increment the version when publishing an update, including when generating a WGT package.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299201262170543.png)

Here you can visually configure app modules and permissions. Uni-app makes these modules very straightforward to set up: configure the relevant platform's key and secret, then call the corresponding Uni-app API. Naturally, including these modules increases package size.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299214124113501.png)

You can also add native plugins. Apps with special requirements can include custom-built native plugins; we discussed importing local plugins earlier.

The remaining settings target mini-programs and H5. Consult the documentation for the options relevant to your project.

**Which Request Library Should Uni-app Use? Does It Support Axios?**

Uni-app is a cross-platform framework, so we need a request mechanism that works across targets. We can't use Axios here: it doesn't support the native App target, only the web target in this context. The provided uni.request API is usually enough. If you want an Axios-like configuration experience, though, I strongly recommend flyio.js. It will be installed when we create the project.

**Should You Create a Uni-app Project with the CLI or HBuilderX?**

There are two ways to create a Uni-app project:

1. Through the command-line CLI
2. Through HBuilderX

My recommendation: prefer the CLI. For Vue
web developers, the command line is already familiar, and a CLI-created Uni-app project's directory structure resembles that of an ordinary Vue
web project. You can quickly install dependencies with npm and import them as usual. New Uni-app features also tend to arrive in CLI projects first. For beginners, learning a new set of tags is another cost to consider; CLI-created projects allow ordinary HTML tags, for example:



These are converted into Uni-app component tags at compile time (**although writing them this way is not recommended**).

A project created in HBuilderX updates along with the HBuilderX software. For a CLI-created project, run:

```
npm update
```

to update to the latest version. **So I recommend creating your project with the CLI, but using Uni-app's own tags rather than HTML tags during development.**

Community

Uni-app has a very active community—I can personally vouch for that. Many development problems can be answered there (https://ask.dcloud.net.cn/）).

When you encounter a bug, first check whether it's a problem in your own code. If your own testing rules that out, post a bug report in the community, as shown below:

![](http://static.yinzhuoei.com/typecho/2020/08/28/299221038224762.png)

After publishing, use the invitation option at the bottom of the post and enter dcloud to invite an official team member to respond. You can also upload a ZIP file of your code with access restricted to official staff, helping them reproduce and resolve the problem more quickly.

Plugin Marketplace

**A quick plug: the alpha version of my UI library is listed in the marketplace. Downloads aren't open yet, but I plan to refactor it around the end of the year and deliver high-quality components. It's called i-uniapp—please keep an eye on it!**

https://ext.dcloud.net.cn/ — the Plugin Marketplace

The marketplace offers plenty of Vue components, native SDKs, and more. We covered installation earlier. If you develop a Uni-app project in HBuilderX, you can click to import a plugin directly into the project.

HBuilderX: A Powerful Tool for Uni-app Development (the Main Focus of This Article)

**An Introduction to HBuilderX and a Quick-Start Guide**

I can say this confidently: although its core is based on Eclipse, HBuilderX is a Chinese-developed editor/IDE whose Vue support genuinely impressed me. For Vue development, I honestly prefer it to VS Code. It also attracts plenty of criticism, including high memory usage and a UI that some consider inferior to VS Code or Sublime. But editor wars are outside the scope of this article. **For developing a Uni-app project, HBuilderX is my top recommendation.**

If you're used to VS Code or Sublime, you can adjust HBuilderX's keyboard shortcuts to match:

![](http://static.yinzhuoei.com/typecho/2020/08/28/299231538641488.png)

These are the plugins I currently have installed. To follow this tutorial smoothly and make later development easier, be sure to install these basic plugins.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299242096116716.png)

**Preparing to Package an App**

First, let's see what packaging an app requires:

![](http://static.yinzhuoei.com/typecho/2020/08/28/299252736086825.png)

We need an Android signing certificate. Let's generate one.

1. First, install the JDK if you haven't already, then open a command prompt in its bin directory.
keytool-genkey-aliasYOUR_CERTIFICATE_ALIAS-keyalgRSA-validity36500-keystoreYOUR_CERTIFICATE_NAME.keystore

> The -validity parameter specifies how many days the certificate remains valid; you can use a large value. The value after -alias is the certificate alias.
> Nothing is displayed while you type the password, so just enter it. Backspace, Tab, and similar keys count as password input. You'll need this password when signing the .apk file. After running the command, you'll be prompted for the keystore password.
> You'll then be asked for your name, organizational unit, organization, city or locality, state or province, country/region code, and key password. Check the details, enter y, and press Enter.
> Author: Caozitou Wujun
> Link: https://www.jianshu.com/p/14add4a02ed6 Source: Jianshu
> Be sure to remember the keystore password. The original instructions mention using another command to look it up if you forget it.
> After successfully generating the keystore, you'll find a file in the bin directory with your chosen name and the .keystore extension.

1. Enter the package name

The usual convention is for a package name to begin with com, following Java package naming conventions. I'm less familiar with iOS; ask an iOS developer about the specifics there. Choosing a package name is important because it identifies the app. In app stores, it represents the app's unique identity, so choose something closely related to your company or yourself. For a company called "Qiangjinjiu," for example:

```
com.qiangjinjiu.andriod
```

If your company has its own naming convention, follow that instead. I won't go further into that here.

1. Channel package options

Channel-specific packages can identify the distribution platform, letting you view usage figures for each channel in the backend. Enable this if your project needs it; usually, I leave it off.

1. Native obfuscation

You can apply native obfuscation to JavaScript and nvue files to improve security.

1. Advertising options

Uni-app includes an advertising plugin. Choose whether to use it based on your project's needs.

**Debugging: Custom Runtimes and Mini-Program Simulators**

We just covered app packaging and the preparations it requires. You may have noticed this option in the packaging dialog:

![](http://static.yinzhuoei.com/typecho/2020/08/28/299262864820036.png)

What is a custom runtime? It's a package used for everyday debugging. It isn't compressed, so it's larger than a release package. When publishing, make sure to choose a release package, not a runtime package. Install the custom runtime app on your phone and connect it to HBuilderX for debugging. Here's how to build and use one:

1. Cloud packaging: the compilation stage before publishing

![](http://static.yinzhuoei.com/typecho/2020/08/28/299262887472107.png)

1. A successful build returns a confirmation for the custom runtime package

![](http://static.yinzhuoei.com/typecho/2020/08/28/299262148811810.png)

Once packaging succeeds, pick up your trusty Nokia and enable USB debugging. (If you don't know how, Google it.) After enabling debugging, be sure to select your project in HBuilderX's left sidebar, then choose Run and run it on a phone or emulator, as shown below. This step matters:

![](http://static.yinzhuoei.com/typecho/2020/08/28/29927623383735.png)

For the runtime, make sure to select the custom runtime. This option won't appear if you haven't built one. Wait for the phone to prompt you to install the runtime app, then install it. The app opens automatically. You can now change code and UI, and see those changes update on the phone immediately.

What should you watch out for when debugging with a custom runtime?

1.When debugging features that require native capabilities, such as login, sharing, or maps, configure the relevant platform's key and secret. Whenever you add or change native plugin configuration, or modify a native plugin itself, rebuild the custom runtime to test the changes.

2.Never publish a custom runtime as a release package.

3.Don't build release packages just to debug. Cloud packaging only provides 20 free release builds per day; use a custom runtime for debugging instead.

You may be wondering: third-party login and maps need testing on a real phone, but do routine UI layout changes really require going through a custom runtime too?

No. Although layouts may vary between devices, you can use a mini-program simulator for everyday development, then do an initial check on real devices afterward. Look for UI or functional differences and adjust as needed. The mini-program simulator is close to the App environment, and most layout and UI behavior is a reasonable approximation of what users will see on their phones.

There are a few things to remember when debugging in a mini-program simulator. If this is your first time running the project as a WeChat mini-program, enable the simulator's service port under Security beforehand:

![](http://static.yinzhuoei.com/typecho/2020/08/28/29928961372126.png)

Settings → Security → Enable the service port

You can now launch the WeChat mini-program from HBuilderX and start developing.

**Packaging an App**

After developing and iterating on the project, we need to package it as an app. There are two approaches:

1. Cloud packaging
2. Offline packaging

There is also the special WGT resource package, used for the resource updates discussed earlier.

Cloud packaging uses build servers provided by DCloud. After HBuilderX compiles the project locally, it enters the cloud packaging queue. Once DCloud's server finishes building it, a temporary download link is returned to the HBuilderX console.

We discussed custom runtimes earlier. Building a custom runtime rather than a release package is simply a matter of choosing the corresponding option. Cloud packaging provides 20 free builds per day, so remember not to generate release packages just for debugging.

Offline packaging means generating a native project from the Uni-app project and building it yourself. Developers with a native background may welcome that option. But a word of caution: many issues reported in the community stem from offline packaging. For a more stable development process, I recommend cloud packaging.

Generate the WGT resource package as shown below. Once it is built, upload it to your server and use the update process from the earlier demo.

![](http://static.yinzhuoei.com/typecho/2020/08/28/299294041053807.png)

**A Note on iOS**

I don't know a great deal about iOS, but I can offer a few brief points that may be especially useful to beginners.

1.Uni-app applications can pass App Store review. At the end of 2019, Apple issued a notice essentially warning that poorly performing wrapper apps would not be accepted. But in 2020, it's important to understand that Uni-app is not merely a wrapper: it offers native rendering too, and its WebView rendering performs well. It isn't as bad as some online claims suggest.
 2.If you use Windows, I recommend a Mac for Uni-app development. Submitting an iOS package built from Windows can be inconvenient; macOS avoids that complication.
 3.If you're new to publishing from Windows, you can download ApplicationLoader. For Mac users, I strongly recommend the Transporter app. Experienced developers can use Xcode's built-in upload tools.

**Further Reading**
1.Uni-app Analytics is free, secure, and provides detailed statistics, including support for custom event tracking.

```
https://tongji.dcloud.net.cn/
```

2.Uni-app cloud development: cloud development and cloud databases are all the rage now, although mini-programs have had similar tools for years. Cloud development is another major Uni-app update this year. It currently supports Tencent Cloud and Alibaba Cloud, and is reportedly quite affordable. Take a look if you're interested.

```
https://unicloud.dcloud.net.cn/login
```

3.Uni-app's advertising platform is particularly useful for independent developers, who can use it to monetize their apps.

```
https://uniad.dcloud.net.cn/login
```
