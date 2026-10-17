---
title: "Nginx: Serious Study Notes (Part 1)"
description: "A deep dive into Nginx fundamentals from a problem-solving perspective, covering forward vs. reverse proxies, CORS configuration, master-worker architecture, and zero-downtime reloads."
date: 2021-03-31
lang: en
translationKey: "2021-03-31_505_Nginx：很正经的学习笔记（一）"
categories:
  - "Backend"
  - "News"
  - "Life"
  - "Deep Dive"
views: 6236
draft: false
---

Nginx is an exceptionally high-performance web server that has seen widespread adoption in recent years. Renowned for its lightweight footprint, high concurrency, and performance, this series won't start from scratch mechanically listing APIs. Instead, we will explore Nginx through practical problems and scenarios.

---

### Key Characteristics:

1. I/O Multiplexing
2. High Performance
3. High Concurrency
4. Minimal System Resource Consumption

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/928422304090411/Untitled.png)

As a web server, Nginx has an enormous market footprint and continues to be one of the fastest-growing web servers worldwide.

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/928733225060364/Untitled.png)

What does a frontend developer need to know about Nginx? We mainly need to understand application deployment, reverse proxying, static asset management, and foundational web hosting practices. If you don't host your own personal blog yet, start learning Nginx and deploy your first website today!

---

## Reverse Proxy vs. Forward Proxy

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/92945539942963/Untitled.png)

When we access external networks (like Google, YouTube, Twitter, Instagram) from networks with restricted outbound connectivity, direct requests fail unless routed through an overseas or regional proxy. Our local network sends requests to this intermediate proxy first; the proxy fetches from the target service, and returns the response back to our client.

Throughout this process, the destination server does not know who the real client is—it only sees the proxy's IP address. From the destination server's perspective, the genuine client is hidden. **This mechanism is called a forward proxy: the proxy acts on behalf of the client.**

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/931491110440250/Untitled.png)

A reverse proxy is the opposite: the proxy acts on behalf of the backend servers. From the client's point of view, the server it contacts is merely an entry proxy that distributes traffic across multiple origin servers. The client has no visibility into the real upstream servers behind the proxy. **This mechanism is a reverse proxy: the proxy acts on behalf of the server.**

How to configure a reverse proxy in Nginx:

```config
server {
    listen 80;
    server_name nginx.yinzhuoei.com;
    location / {
        proxy_pass http://yinzhuoei.com;
    }
}
```

Additional common proxy directives:

```config
proxy_set_header: Modifies client request header information before forwarding it to upstream backend servers.
proxy_connect_timeout: Sets the timeout for establishing a connection with upstream proxied servers.
proxy_read_timeout: Sets the timeout for reading a response from the proxied server after the connection has been established.
proxy_send_timeout: Sets the timeout for transmitting a request to the proxied server.
proxy_redirect: Modifies the Location and Refresh header fields in response headers returned by the proxied server.
```

---

## Resolving CORS Issues

Handling CORS via reverse proxy:

```config
server {
    listen 3003;
    server_name localhost;

    # '=' indicates an exact match for the '/' URL path
    location = / {
        proxy_pass http://localhost:5500;
    }

    # If proxy_pass ends with a slash (e.g., http://localhost:3000/), matching /no/son forwards to http://localhost:3000/son
    location /no {
        proxy_pass http://localhost:3000;
    }

    # '/ok/' matches paths starting strictly with /ok/; /ok2 won't match, but /ok/son will
    location /ok/ {
        proxy_pass http://localhost:3000;
    }
}
```

Allowing CORS by injecting HTTP headers:

```config
server {
    listen 3002;
    server_name localhost;

    location /ok {
        proxy_pass http://localhost:3000;

        # Specify allowed HTTP methods (* allows all methods)
        add_header Access-Control-Allow-Methods *;

        # Cache preflight response to avoid duplicate OPTIONS requests on every invocation
        add_header Access-Control-Max-Age 3600;

        # Credentialed requests (cookies) require this set to true
        add_header Access-Control-Allow-Credentials true;

        # Allow specific origin. $http_origin dynamically extracts the client's request origin.
        # Wildcard '*' is avoided here because credentialed requests do not permit '*'
        add_header Access-Control-Allow-Origin $http_origin;

        # Allow requested headers, dynamically matching client headers
        add_header Access-Control-Allow-Headers $http_access_control_request_headers;

        # Immediately return 200 for OPTIONS preflight checks
        if ($request_method = OPTIONS) {
            return 200;
        }
    }
}
```

---

## Master & Worker Architecture

Once Nginx starts and listens on port 80, its process tree contains one Master process and one or more Worker processes:

![Untitled.png](https://static.yinzhuoei.com/typecho/2021/03/31/93609140201474/Untitled.png)

**Role of the Master process:**
Reads and validates `nginx.conf`, manages Worker processes, receives external process signals, and monitors Worker status—automatically respawning any Worker that crashes.

**Role of Worker processes:**
Workers intercept and process incoming client requests. Each Worker maintains a single thread. The number of Workers is configured in `nginx.conf` and typically aligns with the host's CPU core count to maximize CPU utilization without incurring excessive context-switching overhead.

**Request lifecycle:**

1. Nginx boots up. The Master process initializes based on `nginx.conf`, binds listening sockets, and forks multiple Worker processes.
2. A client initiates a request.
3. Worker processes compete for the connection (accept mutex). The winning Worker performs the TCP three-way handshake, establishes the socket, and handles the request.

---

## Zero-Downtime Hot Reloads

A hot reload in Nginx behaves similarly to frontend hot reloading: updating the configuration file and applying the new settings without restarting the server or dropping in-flight traffic.

```shell
nginx -s reload
```

With this single command, Nginx applies configuration changes dynamically.

How does Nginx handle this internally? Does the Master publish a change message via WebSockets or pub/sub for Workers to subscribe to?

Not quite. When the Master process receives the reload signal, it spawns a fresh batch of Worker processes running the new configuration. Existing Workers continue processing their in-flight requests until completion, after which the Master gracefully terminates them.

---

## How Does Nginx Handle High Concurrency?

Nginx utilizes a **multi-process architecture combined with asynchronous, non-blocking I/O (I/O multiplexing)**.

To understand this thoroughly, let's clarify key concepts:

### Synchronous vs. Asynchronous (Communication Mechanism)

Synchronous and asynchronous describe the **communication mechanism** between caller and callee:

1. **Synchronous**: The caller initiates a request and cannot proceed until a result is returned.
2. **Asynchronous**: The caller initiates a request and continues executing other tasks. The callee notifies the caller or fires a callback once the result is ready.

### Blocking vs. Non-blocking (State While Awaiting Results)

Blocking and non-blocking describe the **execution state of the thread** while waiting:

1. **Blocking**: The calling thread is suspended until the result returns, unable to do anything else.
2. **Non-blocking**: If the result is not ready immediately, the thread is not suspended and can execute other work, periodically polling or checking for readiness.

I will write a dedicated summary on blocking vs. non-blocking I/O and Nginx's Epoll multiplexing model in future posts as I consolidate these deeper systems concepts.

Future Nginx chapters will be published soon, alongside upcoming articles on Shadow DOM and algorithm problem breakdowns. Stay tuned!

---

### Reference Materials:

- [How does Nginx achieve high concurrency?](https://blog.csdn.net/huanglifu520/article/details/106587694)
- [Understand Nginx in 8 Minutes](https://zhuanlan.zhihu.com/p/34943332)
- [Understanding Sync/Async & Blocking/Non-blocking](https://www.zhihu.com/question/19732473)

![WeChat Screenshot](https://static.yinzhuoei.com/typecho/2021/03/31/961022877853286/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20210331210548.png)
