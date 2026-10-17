---
title: "Frontend Column: A Good Programmer Understands How Browsers Work, Part 1"
description: "Winter says that 70% of the frontend developers he has interviewed or met have only a superficial understanding of browsers. Since we use them every day, we should take time to understand how browsers work and how HTTP fits in—both are common interview topics. This series covers the browser knowledge every frontend developer should have…"
date: 2019-03-22
lang: en
translationKey: "2019-03-22_88_前端专栏：不懂浏览器工作原理的程序员不是一个好程序员（一）"
categories:
  - "Frontend"
views: 5287
draft: false
---

Winter says that 70% of the frontend developers he has interviewed or met have only a superficial understanding of browsers. Since a browser is a development tool we use every single day, we should take time to understand how it works and how HTTP fits in. Both are very common interview topics.
 These next few articles cover browser knowledge that frontend developers need, not the knowledge required to develop a browser itself.
 First, how does a browser work? At a high level, it requests a URL and provides a view to display the result. That's the basic job from a browser developer's perspective.
 Breaking down the process: request a page from the server over HTTP or HTTPS -> build a DOM tree from the returned HTML -> calculate the CSS properties of the DOM tree ->
render each part according to those CSS properties to produce bitmaps -> optionally composite those bitmaps to speed up subsequent painting -> draw the composited result on the screen.
 This is the complete journey from making a request to parsing the response and displaying the page. You may be asked about it in an interview, but there's no need to memorize a rigid script.
 Request -> build the DOM -> calculate CSS properties -> render the DOM -> composite -> draw the page
 P.S. The browser processes the returned HTML as a stream: it doesn't necessarily wait for one stage to finish completely before starting to produce output. That's why, on a slow connection, you sometimes see a page appear piece by piece. That's streaming in action.

--The HTTP Protocol
1.HTTP1.1 https://tools.ietf.org/html/rfc2616
2.HTTP1.1 https://tools.ietf.org/html/rfc7234
The two documents above are authoritative references for HTTP.

HTTP is built on TCP and defines two kinds of messages: REQUEST and RESPONSE. TCP provides a bidirectional communication channel, while HTTP requires the browser to initiate the exchange.

Here's how we could describe manually making an HTTP request over TCP: first establish a TCP connection to the server -> write the request-line, which has three parts: the HTTP method, the request path, and the protocol and version -> the first line of the response is the response-line, which also has three parts: the protocol version, status code, and status text.

--HTTP Methods
HTTP methods will look familiar if you've used Java or REST-style web programming: get, post, delete, put, connect, head, options, and trace.
get is the default method when you enter a URL in the address bar.
post is generally used to submit forms.
put performs an addition operation.
delete removes a resource.
connect is commonly associated with WebSocket connections.
head returns header information.
options and trace are generally used for testing in companies and aren't usually seen in production environments.

--HTTP Status Codes
1** Informational responses, telling the client to continue.
2** Success.
3** Changes involving the target resource: 301 and 302 indicate permanent or temporary redirects; 304 means the client's cached resource hasn't changed.
4** Client request errors: 403 means permission denied, 404 means the resource is missing, and 418 is an April Fools' Easter egg. P.S. I hadn't encountered that last one until Winter mentioned it.
5** Server errors: 500 indicates an internal server error; 503 means a temporary problem—try again later.

--HTTP Headers (Let's Use Screenshots Here): Fields and Their Values
request head

![2be3e2457f08bdf624837dfaee01e4a2.png](https://www.yinzhuoei.com/usr/uploads/2019/03/3225780889.png)

response head

![efdeadf27313e08bf0789a3b5480f7c9.png](https://www.yinzhuoei.com/usr/uploads/2019/03/2979256516.png)

P.S. You should be able to recognize these headers and understand what they mean.

--HTTPS and HTTP2

https://tools.ietf.org/html/rfc2818
HTTPS is, as the name suggests, a kind of "super HTTP." It's also built on TCP. When connecting, it first establishes a TLS connection with the server, effectively wrapping HTTP in a layer of encryption. The HTTP content being transmitted is unchanged, and TLS itself runs over TCP. Its main purposes are to verify the server's identity and prevent the eavesdropping and tampering that can happen at intermediate network nodes with unencrypted HTTP/1.1.

HTTP2 is an upgrade to HTTP1.1.
Advantages: server push and TCP connection multiplexing.

Server push lets the server proactively send some content to the client and place it in the cache when the client makes its first request. This helps avoid performance problems caused by the limited parallelism of sequential client requests.

TCP connection multiplexing sends multiple HTTP requests over the same TCP connection. It avoids the overhead of repeated three-way handshakes and the small transmission window at the start of a new TCP connection.

--Wrapping Up

I'll write the second installment soon. I hope this helps both you and me understand how browsers work. There's a lot to take in, so give yourself time to digest it. Some examples come from Winter's
"Relearning Frontend." If you republish this article, please credit: Yinzhuoei — Lao Shen.
