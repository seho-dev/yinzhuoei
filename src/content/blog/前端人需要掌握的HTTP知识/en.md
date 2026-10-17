---
title: "HTTP Essentials for Frontend Developers"
description: "HTTP stands for Hypertext Transfer Protocol, a name with three key parts: hypertext, transfer, and protocol. Hypertext means more than plain text—it can include images, music, videos, and more. Transfer and protocol describe an agreed way for computers to communicate…"
date: 2023-01-28
lang: en
translationKey: "2023-01-28_803_前端人需要掌握的HTTP知识"
categories:
  - "Frontend"
  - "Deep Dive"
views: 5076
draft: false
---

## The Concept

HTTP stands for Hypertext Transfer Protocol. Its name contains three key ideas:

- Hypertext
- Transfer
- Protocol

`Hypertext` means more than plain text: it can also include images, music, videos, and so on. `Transfer` and `protocol` refer to an agreed way for computers to communicate. We can therefore think of HTTP as **a specification that enables two-way exchange of information between computers**.

## Methods

Every HTTP request has a method. Although developers define the actual operation performed by each endpoint, we should try to follow the standard semantics of HTTP methods when implementing that behavior.

- What is the difference between GET and POST?

> According to the RFC definitions, GET retrieves a resource from the server, while POST asks the server to process a resource according to the request payload.

- Are GET and POST safe? Are they idempotent?

> In HTTP, “safe” concerns whether an operation changes data on the server. An operation that makes such changes is not safe. “Idempotent” means that making the same request multiple times has the same effect as making it once. GET only retrieves server resources, so it is both safe and idempotent. By contrast, sending a POST request repeatedly does not necessarily have the same effect as sending it once, so POST is neither safe nor inherently idempotent.

## Caching

HTTP caching falls into two categories:

- Revalidation-based caching
- Freshness-based caching

When a browser requests a resource for the first time, it usually caches the data. If that resource has not expired when it is needed again, the browser uses the cached copy. This is freshness-based caching, often shown as “(from disk cache)” in browser tools. The decision to reuse a fresh cached response is primarily made on the client.

Revalidation-based caching, on the other hand, depends on the server. The server returns the relevant response headers and a 304 status code to tell the browser it can reuse its cached copy. The well-known `Vite` tool uses this approach when serving pre-bundled dependencies to optimize HTTP performance.

When studying cache revalidation, we also need to distinguish between validation based on the `last-modified time` and validation based on an `ETag`. In applications, we tend to prefer ETags, which also take precedence in the browser's validation mechanism, because they address several weaknesses of time-based validation:

- Timestamps are only precise to the second. A file may change within a single second, leaving its last-modified timestamp unable to reflect the difference.
- The server may not be able to obtain the latest modification time.
- What we care about is the file's contents. Its last-modified time can change even when the contents do not.

> ETag: a resource identifier. The server returns an identifier with the first response. The client includes it in a subsequent request, and the server decides whether to return 200 with the latest resource because it has changed, or 304 because it has not.
> 
> 
> 
> Freshness-based caching and revalidation work together: when the cached response is no longer fresh, use revalidation.

## The Evolution of HTTP

When discussing HTTP versions, we usually focus on HTTP/1.1, HTTP/2, and HTTP/3.

First, what were the major improvements in HTTP/1.1 over HTTP/1.0?

- Persistent connections replaced the earlier reliance on short-lived connections.
- Pipelining allowed a second request to be sent without waiting for the previous response.

Despite these improvements, HTTP/1.1 still had plenty of shortcomings:

- Headers were not compressed; only bodies were compressed.
- Head-of-line blocking: requests could be sent without waiting for earlier responses, but responses still had to arrive in request order. A slow earlier response would therefore block those behind it.
- Verbose headers wasted bandwidth.
- Only clients could initiate requests.

HTTP/2 was introduced to address these limitations and security concerns, offering:

- A binary format
- Header compression
- Concurrent transmission to address response blocking
- Server push

### Header Compression

When you send several requests at once, their headers are often identical or similar. HTTP/2 uses the `HPACK` algorithm to handle this. In broad terms, the client and server maintain shared header tables. Instead of repeatedly sending long headers, they can send table indexes.

### Binary Transmission

The binary transmission format also improves efficiency. Messages are divided into `frames`, including header frames and data frames. Earlier HTTP versions used a textual format; HTTP/2 uses a binary format directly rather than expressing the protocol in text.

### How Concurrency Works

How does HTTP/2 transmit messages concurrently? The principle is fairly simple. HTTP/2 introduces the concept of a `stream`. A single TCP connection can contain multiple streams, each with its own ID and its own request and response. Inside those streams are the frames we just discussed. Since streams are independent, their frames can be interleaved, and the client reassembles the HTTP messages using their IDs. That is the basic idea behind HTTP/2 concurrency.

### Server Push

Server push is also closely tied to streams. HTTP/1.0 and HTTP/1.1 use the traditional request-response model: the client requests something, and the server responds. HTTP/2 extends that model. Both clients and servers can initiate streams, with slightly different IDs: client-initiated streams use `odd` IDs, while server-initiated streams use `even` IDs. What is the benefit of server push? Most importantly, fewer network round trips. For example, when a client receives an HTML file that references CSS and JavaScript files, the server can push those files proactively, reducing the number of exchanges needed.

### HTTP/3

HTTP/2 seems to have everything we need. Its streams appear to solve head-of-line blocking perfectly. But look more closely: HTTP/2 is based on TCP, a byte-stream protocol whose defining requirement is that data arrives continuously and completely. TCP has a `buffer`: if bytes are missing from an earlier part of the stream, later data must wait in that buffer until the missing bytes arrive before HTTP, at the application layer, can receive it. In other words, we solved HTTP-level head-of-line blocking, but not TCP-level head-of-line blocking. To address that, we need to use `UDP` instead.

But TCP provides reliable delivery, while UDP does not. How can HTTP/3 use UDP underneath? It does so through `QUIC`, a protocol built on UDP. QUIC addresses head-of-line blocking across streams: packet loss in one stream does not block the others. It also makes several optimizations to connection establishment. Earlier HTTP connections involved TCP connection establishment followed by a TLS handshake. QUIC integrates TLS and uses a newer TLS version, allowing transport and TLS negotiation to be combined so that the TLS handshake no longer needs to be a separate setup phase.

Why not integrate TLS into HTTP/2 in the same way? TCP is a transport-layer protocol implemented in the kernel, while TLS is implemented separately by libraries such as OpenSSL at the presentation layer, so they cannot simply be merged.

## HTTPS

HTTPS is HTTP running over TLS/SSL. Data sent over plain HTTP is unencrypted, which creates security risks. SSL verifies the server's identity and encrypts communication. The connection process can be summarized as follows:

- Initiate an HTTPS request.
- The server returns its SSL certificate and public key.
- The client generates a symmetric encryption key.
- The client encrypts that newly generated key using the certificate's public key and sends it to the server.
- Subsequent client messages are encrypted using the negotiated symmetric key.

### Differences

- SSL certificates may cost money, although many are available for free.
- HTTPS adds a TLS handshake.
- HTTP sends plaintext; HTTPS sends encrypted data.
- HTTP uses port 80 by default; HTTPS uses port 443.

## The Seven-Layer OSI Model

OSI divides network architecture into seven layers. Each layer has its own protocols and responsibilities and communicates through interfaces with its neighboring layers.

### Application Layer

Familiar protocols such as DNS, HTTP, and SMTP belong to the application layer.

### Presentation Layer

Its main purpose is to make data interpretable and exchangeable.

### Session Layer

Establishes and manages sessions.

### ****Transport Layer****

TCP/UDP

### Network Layer

IP

### Data Link Layer

Token Ring

### Physical Layer

Ethernet

## The Four-Layer TCP/IP Model

The TCP/IP model is more abstract than the OSI model. It groups the application, session, and presentation layers into a single application layer, and the data link and physical layers into a network interface layer.

## DNS Resolution

Simply put, DNS is a translator that turns domain names into IP addresses. A DNS lookup can be summarized as:

- Check the browser.
- Check the operating system.
- Query the local DNS resolver.
- Query upstream servers.
- Cache the IP information in the local DNS resolver.
- Cache the IP information in the operating system.
- Cache the IP information in the browser.

## TCP's Three-Way Handshake and Four-Way Termination

The three-way handshake is rather like a phone call between Xiaoming and Xiaohong:

- Xiaoming: “Xiaohong, can you hear me?” (The client can send.)
- Xiaohong: “I can hear you.” (The server can send and receive, but Xiaohong does not yet know whether Xiaoming can receive.)
- Xiaoming: “Great, I'll start talking.” (Both sides can now confirm that sending and receiving work.)

Four-way termination follows a similar idea: ending the call.

- Xiaoming: “I'm finished. Do you have anything else to say?”
- Xiaohong: “Okay, I don't have anything else either.”
- Xiaoming: “Then I'll hang up.”
- Xiaohong: “All right, go ahead. I'll hang up too.”

## The Classic Interview Question: What Happens Between Entering a URL and Seeing a Page?

What frontend developer has not memorized this for an interview? You can hardly call yourself one if you haven't. Hahaha.

Let's quickly go through it, even though it has been covered a million times.

- First, interpret the input.

> The browser determines whether you entered a URL or a search term.

- If it is a URL, perform DNS resolution to obtain the IP address.

> See the DNS lookup process above.

- Establish a TCP connection.

> See the phone-call example with Xiaoming.

- Send the HTTP request.
- Receive the HTTP response.

> Interpret the resource based primarily on content-type, account for compression such as gzip, and process the returned content accordingly.

- Render the page.

> Parse and build the DOM tree → parse and build the CSS tree → combine them into a render tree → calculate layout → paint pixels → instruct the GPU to display the result on screen.
