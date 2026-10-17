---
title: "Nginx：很正经的学习笔记（一）"
description: "Nginx是一款高性能服务器，最近这几年非常火，以轻量且高并发，高性能著称，那么此笔记将不会从0开始讲解API，而是会从各种问题入手，通过问题学习nginx。 --- 特点： 1. IO多路复用 2. 高性能 3. 高并发 4. 占用系统资源少 Nginx作为…"
date: 2021-03-31
lang: zh
translationKey: "2021-03-31_505_Nginx：很正经的学习笔记（一）"
categories:
  - "后端"
  - "资讯"
  - "唠嗑"
  - "精读"
views: 6236
draft: false
---

Nginx是一款高性能服务器，最近这几年非常火，以轻量且高并发，高性能著称，那么此笔记将不会从0开始讲解API，而是会从各种问题入手，通过问题学习nginx。

---

特点：

1. IO多路复用
2. 高性能
3. 高并发
4. 占用系统资源少

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/928422304090411/Untitled.png)

Nginx作为一个WEB服务器，有着大好的未来，市场份额非常给力，同时也是份额上升速度最快的web服务器。

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/928733225060364/Untitled.png)

Nginx作为前端来说，需要学习什么？我们只需要学习Nginx在应用部署，反向代理，处理资源的进程，亦或者是搭建网站的基础知识，如果你还没有一个blog，那么就从现在开始学习nginx并且搭建你的第一个网站吧。

---

## 反向代理与正向代理

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/92945539942963/Untitled.png)

我们在平时上外网的时候，比如谷歌，youtube，twitter，Ins等，如果使用我们内地网络，是访问不成功的，只有在香港台湾或者境外才能访问到类似的外网。那我们需要通过内地网络去访问外网只能通过一个proxy代理去做一个请求的转发，我们的内地网络请求在到达外网地址之前，会经过一层代理，这个代理会去请求外网，请求成功之后会把页面呈现给我们的客户端。

在这个过程中，外网服务器不知道我们的内地网络是谁，只知道代理地址，所以对于外网服务器来说，请求的真实客户端是看不到的。那么这个过程就叫做 **正向代理，proxy代理的是客户端。**

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/931491110440250/Untitled.png)

反向代理是相反的，代理的是服务端，对于客户端而言，访问的服务器仅仅是多个真实服务器的一个代理而已，所以对于客户端用户而言，真实服务器的信息是不可见的。**这样的过程也就是反向代理，proxy代理的是服务端**。

Nginx如何去做反向代理？

```config
server{
        listen 80;
        server_name nginx.yinzhuoei.com;
        location / {
               proxy_pass http://yinzhuoei.com;
        }
}
```

其他的proxy配置：

```config
proxy_set_header :在将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息。
proxy_connect_timeout:配置Nginx与后端代理服务器尝试建立连接的超时时间。
proxy_read_timeout : 配置Nginx向后端服务器组发出read请求后，等待相应的超时时间。
proxy_send_timeout：配置Nginx向后端服务器组发出write请求后，等待相应的超时时间。
proxy_redirect :用于修改后端服务器返回的响应头中的Location和Refresh。
```

---

## 解决跨域

通过反向代理解决跨域:

```config
server
{
   listen 3003;
   server_name localhost;
      ##  = /表示精确匹配路径为/的url
   location = / {
       proxy_pass http://localhost:5500;
   }
   ##  若 proxy_pass最后为/ 如http://localhost:3000/;匹配/no/son，则真实匹配为http://localhost:3000/son
   location /no {
       proxy_pass http://localhost:3000;
   }
   ##  /ok/表示精确匹配以ok开头的url，/ok2是匹配不到的，/ok/son则可以
   location /ok/ {
       proxy_pass http://localhost:3000;
   }
}
```

加header头允许跨域:

```config
server
{
    listen 3002;
    server_name localhost;
    location /ok {
        proxy_pass http://localhost:3000;

        #   指定允许跨域的方法，*代表所有
        add_header Access-Control-Allow-Methods *;

        #   预检命令的缓存，如果不缓存每次会发送两次请求
        add_header Access-Control-Max-Age 3600;
        #   带cookie请求需要加上这个字段，并设置为true
        add_header Access-Control-Allow-Credentials true;

        #   表示允许这个域跨域调用（客户端发送请求的域名和端口）
        #   $http_origin动态获取请求客户端请求的域   不用*的原因是带cookie的请求不支持*号
        add_header Access-Control-Allow-Origin $http_origin;

        #   表示请求头的字段 动态获取
        add_header Access-Control-Allow-Headers
        $http_access_control_request_headers;

        #   OPTIONS预检命令，预检命令通过时才发送请求
        #   检查请求的类型是不是预检命令
        if ($request_method = OPTIONS){
            return 200;
        }
    }
}
```

---

## Master&Woker模式

Nginx启动之后，启动了80端口进行服务监听，那么进程中就存在一个Mater主进程和多个Woker进程；

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/93609140201474/Untitled.png)

Master进程的作用就是：读取&验证nginx.conf配置文件并且管理多个woker进程；接受外部信号；监控Woker，如果Woker挂掉，将自动重启Woker；

Woker进程的作用就是：多个Woker会拦截所有的请求并做出处理；每一个woker进程维护一个线程；woker的个数和CPU有关，从nginx.conf配置woker个数，配置几个就是几个，但是要避免配置过多，要充分利用CPU；

**一个请求到响应的流程：**

1. Nginx启动，Matster进程根据nginx.conf初始化；初始化监听socket；fork出多个woker进程；
2. 发起请求
3. woker进程们一起竞争，胜出者通过三次握手，建立socket连接，处理请求。

---

## 如何做热部署呢？

热部署就和前端热部署一样的性质，即修改配置文件，不需要重启服务器就可以使用最新的配置。

```shell
nginx -s reload
```

通过这样的一个命令即可热部署，无需重启，随时改随时用。

一般情况下，我们做热部署可以有几个方案，比如前端，webpack的本地开发工具，webpack-dev-server，即本地启动一个服务，开启一个websocket，当我们的文件改动，就重新加载这个css/js。

而nginx也是同样的方式么？我们的主进程master去发布一个修改请求，然后woker去订阅这个消息，实现类似这样的热部署？

其实不然，nginx使用的是如下的方案，当master监听到配置文件的更改，会创建一批新的woker去执行新的请求，老的woker进程会在任务处理完毕之后，再由master杀掉进程。

---

## 如何做到高并发？

Nginx采用多进程+异步非阻塞方式（IO多路复用）：

关于异步和同步，我需要做一些概念上的整理；

同步和异步指的是**消息的通信机制**，我们做web开发是最能理解同步异步的区别的，因为我们天天和接口打交道；

1）所谓**同步**指的就是发起一个请求/调用，在没有得到结果之前就不会返回，一旦得到结果就立即返回；

2）所谓**异步**指的就是发起一个请求/调用，调用者不会主动去care被调用者，而被调用者拿到结果之后会通知调用者

而阻塞非阻塞指的是程序在**等待调用结果时的状态**；

1）阻塞调用指的就是，结果返回之前当前线程被挂起，调用线程在返回之后才返回；那么挂起的这个线程是会被阻塞的；

2）非阻塞调用指的就是，不能立刻得到结果之前，线程是不会被挂起的，仍然可以做其他事情；那么非阻塞调用如何知道得到结果了呢，需要定时去check的；

关于阻塞IO和非阻塞IO等我总结完了再说哈，还有关于Nginx的IO多路复用Epoll模型，这个是延申知识了，我也需要学习整理哈，现在还不清楚这一块的东西。

Nginx后续章节过段时间发，中间要发几篇shadowDom和剑指题解的文章，大家耐心等待...

---

学习资料如下:

[nginx如何做到高并发?](https://blog.csdn.net/huanglifu520/article/details/106587694)
[8分钟带你深入浅出搞懂Nginx](https://zhuanlan.zhihu.com/p/34943332)
[理解同步异步&阻塞非阻塞](https://www.zhihu.com/question/19732473)

![微信截图_20210331210548.png](https://static.yinzhuoei.com/typecho/2021/03/31/961022877853286/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210331210548.png)
