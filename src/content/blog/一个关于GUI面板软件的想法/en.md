---
title: "An Idea for a GUI Developer Dashboard"
description: "A while ago, a group chat happened to turn to GUIs. We wanted a GUI application that could replace frontend tools for tasks such as code style checks and validation. Looking into it, though, I found very few GUI applications for managing code—almost an untapped area. A few likely reasons: 1. Security concerns: users don't want to upload their code to a server. 2. GUI…"
date: 2023-09-26
lang: en
translationKey: "2023-09-26_824_一个关于GUI面板软件的想法"
categories:
  - "Frontend"
  - "Backend"
  - "News"
  - "Life"
  - "Rust"
  - "Design"
views: 5678
draft: false
---

A while ago, a group chat happened to turn to GUIs. We wanted a GUI application that could replace frontend tools for tasks such as code style checks and validation. Looking into it, though, I found very few GUI applications for managing code—almost an untapped area. I think there are a few reasons for this:

1. Security concerns: users don't want to upload their code to a server.
2. GUIs aren't designed around programmers' needs, so they don't improve productivity.
3. Extensibility is extremely limited. Most code-management SaaS services don't let programmers develop plugins to extend the available functionality.

If you're a Mac user, you've probably heard of Raycast. At its core, Raycast replaces the Mac's application launcher, but its powerful plugin system makes it easy for frontend developers to build all kinds of extensions: translation, dictionaries, screenshots, and so on. Here's a color picker extension I've installed:

![](https://static.yinzhuoei.com/typecho/2023/09/26/387091485415193/1695738690030.jpg)

Raycast's thoughtful design doesn't stop there. It also supports keyboard shortcuts, letting you bring up a specific installed extension with a predefined shortcut. For example, there's a well-known Mac clipboard application called [Paste](https://pasteapp.io/). Raycast offers similar functionality for free. Once you've installed the appropriate extension, a keyboard shortcut is all it takes to open the clipboard tool:

![](https://static.yinzhuoei.com/typecho/2023/09/26/40619726934963/1695740604678.jpg)

Anyone who has done operations work may also know the Chinese server control panel Baota. Although aimed at entry-level operations staff, its free, easy-to-use interface lets plenty of developers without specialist experience manage servers too. This blog, for instance, runs on Baota. I used it to set the blog up in high school, and it's been running for five or six years. Setting security concerns aside, the fact that someone who knew nothing about operations could become so reliant on it and keep using it all these years might be the appeal of a GUI.

GUI applications are familiar to all of us. Operating systems such as macOS and those on our iPhones serve us through GUIs every day. Developers also have some excellent GUI applications, such as ClashX and SourceTree, that help with everyday work.

But is there a tool that could change our development habits, genuinely improve efficiency, and keep security in mind? Take frontend development: tools such as ESLint keep appearing, package managers come in every variety, and good developers constantly use tools to reduce repetitive work. We need plenty of supporting utilities: JSON validation, mock services, local servers, even code optimization and daily reporting or logging tools.

Unfortunately, we don't currently have an application that brings all these different tools together. You might be thinking, “I can just open a tool website in my browser and solve all of this. Why do I need a GUI application?” That's exactly what this article is about.

## Dependency Management

Frontend developers are no strangers to npm. Installing a library often involves considerable research: checking its last update, download numbers, issue count, and so on. But suppose you decide to write a Rust application one day. You may not know which library provides the functionality you need, or how those libraries depend on one another. That inevitably takes time. How could we unify dependency management across languages?

The underlying implementation is straightforward: install the dependencies the user wants through command-line tools. The important part of the GUI is helping developers find the right dependencies. Here's what npm returns when searching for `PDF`:

![](https://static.yinzhuoei.com/typecho/2023/09/27/267424150122259/1695826533701.jpg)

Even with such a specific keyword, the default search results don't turn up the core pdf.js library. If I were unfamiliar with frontend development, I'd probably install the first dependency in the list. This example may be a little extreme and a bit `nitpicky`, but a cross-platform code project management tool should provide package management for several popular languages. If you frequently work across languages, you should no longer have to open multiple browser tabs or remember installation commands. It should take just two steps:

- Find an accurate list of matching dependencies.
- Right-click, and your dependency downloads automatically.

If you spot a dependency you've already installed, you could uninstall it by double-right-clicking. That would be especially useful—and save time—when frequently searching for and installing dependencies.

The dependency search would build on npm's approach, combining it with a search engine and ChatGPT to provide intelligent recommendations. Even if your search terms are completely different from the actual dependency's name, you'd still be able to install it quickly! These recommendations would be connected to the web, so you wouldn't need GPT-4: the application would feed search engine results to GPT and ask it to extract usable dependency information.

## A Code Health Check? Doesn't That Sound a Bit Like 360?

The code health check is still a feature under discussion, so what I describe here may differ substantially from the final version. Some code-management SaaS products offer this, but it tends to be time-consuming and expensive. How would we implement it? When a code project is added to the application, it would undergo a very fast preprocessing step to identify its technology stack, dependency relationships, and basic module count.

The actual health check would produce a report without making any network requests. Everything would happen locally, without GPT. Having GPT analyze large chunks of code consumes a lot of tokens, which most people can't really afford (laughing through tears). Instead, we might use open-source analysis tools to scan the codebase for potentially duplicated functions and excessively long functions. The number of comments would also affect the report's score.

You could manually turn off individual checks, since developers have different habits. Some don't tend to write comments, and some projects inevitably contain very long functions. Disabling a check would also let the application skip that step and produce the report faster.

## Workflows

The application would offer a basic workflow system, connecting software projects to keyboard shortcuts and even to other applications. Think of it as a miniature version of Shortcuts, with workflow logic you can write in code. Say you're working on a large, heavyweight project. After restarting your computer or having applications crash, you need to open everything again. You could define a workflow so that, when you bring up the project with a keyboard shortcut, your database, Docker, and Redis all start in the order you've specified!

While you're coding, the application would also periodically inspect the module you're working on, identify the code blocks you change frequently, and automatically suggest optimizations. These would appear as notifications, rather than working like Copilot.

There would be plenty of opportunities to use GPT. For instance, by the time you stage your code, the application could already have analyzed the changes, summarized them, and generated a commit message. You'd simply review the message, click confirm, and make the commit.

Beyond explicitly defined workflows, internal outputs could also support other features—whether preprocessing analysis files from a health check or information produced while you're coding. For example, a logging or daily report plugin could summarize the day's commit messages and specific tasks. You could define a daily report template, make a few edits, and publish with one click. Publish where? GitHub, GitLab, DingTalk—if an application exposes a third-party API, you could write the integration logic and send it there directly!

## Plugins

Remember what lies at the heart of a successful application? Plugins. Users would be able to define interfaces in HTML/JS and implement the underlying functionality in Rust/WASM. What about Node.js support? We'll see later.

There would be two kinds of plugins:

- Official core plugins (all the features above would fall into this category)
- Third-party plugins

This takes inspiration from Obsidian. Third-party plugins would have to provide their source code and be subject to review. Particularly popular third-party plugins could be incorporated into the official plugin collection, while continuing to be maintained jointly by open-source community contributors and official developers.

With third-party plugins, all those tools you have in mind—JSON validation, mock services, formatting, and so on—could be a keyboard shortcut away. Say goodbye to those tool websites~ A local application would have the advantage in both performance and convenience.

## Conclusion

By the way, the application is called YourPanel, and it's already open source:

https://github.com/yourpanel/core (Next.js + Tauri)

All the GPT-related features mentioned here could be disabled. With those GPT calls turned off, you would be notified whenever a plugin that uses a network connection runs. You would also be able to clearly see whether a plugin requires network access before installing it!

As a local code-management dashboard, I want your code to be accessible only to you, with tasks completed using as few network connections as possible. We don't plan to introduce user management in the initial version. That means no login, and no access on our side to your code or tasks.

Our original goal is simple: give developers convenient tools in a secure environment.
