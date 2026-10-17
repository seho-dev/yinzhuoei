---
title: "2022 Year in Review"
description: "Introduction. This is a rather hastily written review of 2022. I'll focus more on technical directions, in the hope of giving fellow developers some ideas for the coming year. How would I describe 2022? In short: progress was too slow—or perhaps there was no meaningful progress at all. There were many reasons, but to put it simply, I got tangled up in lousy work…"
date: 2022-12-31
lang: en
translationKey: "2022-12-31_793_2022年终总结"
categories:
  - "Life"
views: 13469
draft: false
---

## Introduction

This is a rather hastily written review of 2022. I'll focus more on technical directions, in the hope of giving fellow developers some ideas for the coming year. How would I describe 2022? In short: “**progress was too slow—or perhaps there was no meaningful progress at all**.” There were many reasons, but to put it simply, I got tangled up in **lousy work**.

### Work

I stayed in Xi'an in 2022, and 2023 will be my fourth year working. As a software developer, I might appear to be doing reasonably well here, but only I know that I'm really nothing special. Xi'an just doesn't have much of an internet industry culture, and there are too few technically strong developers around me. I used to think that might be down to my social circle or the city itself. In practice, simply spending a little more time reading and learning after work is enough to get ahead of most people. Learning is the easiest part of being a programmer. Why don't most programmers make a habit of it? Because they're caught up in marriage, children, parents, idiot bosses, and all sorts of other things. I suspect that when I'm older, I may lose my enthusiasm for learning too.

This year, I met plenty of developers from China's top-tier cities and realized that the entire Chinese software industry is too impatient and hype-driven. In other words, genuinely good teams are rare. Companies want quick money. Most don't care about technology; they care about results and gaming their **KPIs**. Sometimes they don't even need a working demo—a PowerPoint is enough to win management over. These companies usually have a few things in common:

1. Daily and weekly reports
2. A love of meetings
3. No overtime pay
4. Releases every week or two, dressed up as “agile development”
5. An overwork champion who commits code in the middle of the night—who knows how much the company is paying them
6. QA, frontend, and backend teams passing the blame around
7. Nepotism
8. Regional discrimination

If your company happens to have all these symptoms, start studying as soon as you get off work. Work on improving yourself so you can escape that environment. I had quite a few opportunities to coast this year, and complained on WeChat Moments and elsewhere about various roles—particularly product managers and frontend developers, the two most superficial and hype-driven roles in my view. Sometimes I even think two high school students could do those jobs. If I were the boss, I'd hire high school students to replace them. (Yes, I'm a frontend developer myself.)

Here's the job description I'd write for a product manager:

1. Proficient in WeChat (for example, forwarding messages)
2. Proficient in Tencent Meeting
3. Familiar with internet industry jargon (“Could you squeeze this in?” | “Can we quickly put together a version to show the boss?”)

And here's what I'd write for frontend developers:

All right, I admit the entry barrier for frontend is much higher than for product management. At least product managers can get away without high-fidelity prototypes or documentation. Just forwarding messages is enough to get the product done—something I think anyone in China could manage.

I gained a lot at work this year and had help from many people who supported my growth: Kang Kai, Joe, Cheng, Cong, the QA duo, and the rest of the technical department at my previous company. They were sincere and responsible, and helped me solve or share plenty of problems. Kai and Joe in particular helped me enormously on the technical side. Kai remains a role model to me: he's talented and endlessly patient about answering my questions. The same goes for Joe; working with him was an unforgettable experience. At my new company, working alongside an old classmate and close friend has been the best experience of my career. It brings back the wonderful feeling of learning programming together. Collaborating with him is better than joining a big tech company. So when I changed jobs, I didn't prepare for any interviews—I simply committed to joining him in the trenches.

### Technology

I'll spend more time on technology. Let's start with work projects. This year, I encountered the dreaded Flutter while building a shitty app. We had no architecture to speak of, and wrote code as long and foul as what I'd produce after twenty days of constipation. But once we built it, we were amazed by how smoothly the app ran. That taught me four things:

1. Flutter is fucking awesome.
2. I both love and hate JS.
3. React Native is in trouble.
4. Native development is going to lose a substantial share of the market.

But Flutter's development experience is terrible. Compared with ES6, Dart's standard library design is worlds apart. The ecosystem remains the biggest headache: maps and charts, for example, still lack good support. It's also quite difficult for frontend developers to get started, because moving from HTML to Flutter's UI abstraction requires a complete shift in thinking. And the Flutter/Dart compiler is awful; debugging is extremely difficult. Without Google and AI, I seriously doubt I could build a second Flutter app.

I hope Dart's standard library keeps improving and takes some cues from ES6's design. Flutter is an excellent framework for cross-platform app development, and Dart's sole purpose is to serve that framework. That's different from JS: its core standard stays the same, but APIs must be extended for different devices and environments. When browser developers move into app development, for example, they learn new things that challenge their existing knowledge, which can be confusing. App development, by contrast, has a relatively consistent environment and a clear purpose. All we need to know is that websites use JS and apps use Flutter. That's enough; it's the best solution. Here's hoping Flutter defeats React Native in 2023 and rules cross-platform app development.

If someone asks me which technology to use for a cross-platform app, I'll say Flutter without hesitation, despite its many flaws.

[Flutter in Action, Second Edition](https://book.flutterchina.club/)
[Ducafecat's Flutter Courses](https://ducafecat.tech/)

---

Now for frontend frameworks. This year, I've become a React critic—and a Vue 3 critic too. I've used Vue 3 for over two years, wrote a Vue 3 tutorial back in 2020, and even started a Vue 3 ebook last year. I later abandoned it because I gradually lost interest in browser-related work. Building so many web pages at my previous company made me realize it wasn't good for my career development. Is React difficult? I learned React Hooks in an hour and could build a complete production application. Is Vue 3 difficult? After a few hours, I could write a tutorial. That's not because I'm particularly good—it's because the framework teams are so strong. They've “**made developers lazy; they're technological criminals**.”

When a technology becomes especially easy, the rat race begins. Frameworks try to let developers meet more requirements with less code. But to land a job you actually want, you're forced to compete on source code knowledge, just like in Java: you have to accurately name functions in the JVM source during an interview. Some names run to dozens of words, and pronouncing them in proper English is enough to intimidate an idiot interviewer. Frontend is becoming almost as cutthroat as Java. Modern frontend development has only been around for a short time, while Java has existed for decades, which shows how astonishingly fast frontend has developed. If we want more opportunities, we need to get out and change tracks.

Every framework has its flaws. React Hooks are full of programming traps. While developing an online IDE this year, React's many pitfalls drove me mad; the same functionality would take 60% less code in Vue 3. On the other hand, Vue 3's TypeScript support is also terrible. Without excellent ecosystem tools such as Vite and Volar, Vue 3 wouldn't be my first choice. Several frameworks deserve our attention this year: Next, Nuxt, Astro, Qwik, Svelte, SolidJS, and Preact.

1. If you like React's API design and virtual DOM frameworks, I strongly recommend Preact.
2. If you want minimal, clean, compact JS running on your website, I recommend Svelte.
3. If you like islands architecture, I recommend Astro.
4. If you want to explore full-stack frameworks, I recommend Nuxt 3 and Next.js. Next.js has SWC; Nuxt 3 has some of my code and a powerful API engine.

---

Vite has been the frontend world's darling this year, and it's a personal favorite too. Evan You is a talented programmer—a genius with distinctive ideas—and the Vite team is outstanding. Vite is already at 4.0, and I really must read its source when I have time. I think its room for optimization in 2023 is limited, because its core principles aren't especially complicated. It further simplifies development and improves the experience, freeing us from the Webpack nightmare. Thanks to its plugin system, Vite can theoretically support many Node.js-based extensions in the frontend space. Even plenty of Node.js frameworks are integrating it.

Later this year, the Turbo team released its build tool, Turbopack. I'm optimistic about it, but I don't think it will beat Vite. Vite has a huge ecosystem, and in frontend, ecosystem is king. Just look at npm: however much people complain about npm and node_modules, it's still the most popular dependency manager. What we should watch in Turbopack is its core technology, Turbo. The same team also makes Turborepo, a killer tool for monorepos. They're very good at optimizing pipelines through caching, and Turborepo can even share caches with CI/CD, if I remember the features I've seen correctly. They've also launched a cloud service. For enterprise users building micro-apps, large codebases, and frameworks, the Turbo team's tools are a very good fit.

One more thing: stop learning Webpack. We have to acknowledge that it's an excellent build system and can theoretically handle output of any complexity. But it's too heavy, most teams lack deep Webpack expertise, and most business applications don't need such a large build system. Simply bundling with Vite's default configuration might even perform better.

---

This year, I wrote a Node.js framework called Sword.js. I really like Node.js and using it to build backend applications: it's simple and easy to use. But Sword.js will also be my last open-source backend project written in Node.js. I have to move away from it because it conflicts somewhat with where I want to go next. I'll still use Node.js frequently in frontend work. If you're a frontend developer, please learn Node.js—it's so simple, and you can use it to do all sorts of cool things. But let me introduce Deno and explain why I want to use it.

Deno is a JS runtime with native support for JS, TS, and WASM. Remember that last technology: WASM. Deno is written in Rust and built on V8. My next direction is blockchain, which involves a lot of Rust. WASM connects Deno and Rust: I can develop APIs in languages I know, TypeScript or ReScript, and use Deno to run Rust smart contract code directly, since contracts compiled from Rust/ink produce WASM. WASM is an assembly-like, low-level language designed as a compilation target for low-level languages such as C++ and Rust.

WASM performs exceptionally well. It has already been hugely successful in frontend audio and video processing, and it complements JS in the browser. It can run more efficiently and closer to native speed than equivalent JS code, so I think WASM is the future—and the future of blockchain too. You might ask: can't Node.js also build blockchain applications? Am I choosing Deno just because it can run WASM directly?

No. Six months ago, I wouldn't have used Deno, because, as I said, ecosystem matters most. But in the second half of the year, Deno gained compatibility with most Node.js APIs. Node.js's creator also created Deno, and once said he wouldn't support Node.js APIs, but has now compromised for the sake of the ecosystem. Today, Deno can run Node.js code as well as TS and WASM directly, with unparalleled security and speed. I'm firmly on its side!

---

Let's talk about TypeScript. I used to be a huge TS fan, but after finishing the medium-level Type Challenges this year, I changed my mind. I don't need type gymnastics; they rarely come up in business applications. Although they bring major benefits for refactoring and application development, we have to admit that mastering TS isn't easy. At work, basic TS syntax already delivers substantial benefits: “good type hints for developers and fewer hidden bugs.”

But have we considered whether even the most elaborate TS code improves application performance or speed? It doesn't. The compiled JS can still contain performance problems and type errors, especially since so many people love any and disabling type error messages. We need a language that can replace TypeScript in specific situations. I think that's ReScript, which can compile to better-performing JS. I won't go into all its benefits here. Deno + ReScript + Rust/ink + Flutter would be my ideal frontend and backend stack for entering blockchain.

---

As for open source, I spent most of this year working on my Sword.js framework. It currently runs on both Node.js servers and uniCloud's Node.js environment, with features such as excellent runtime validation for TypeScript. Combined with the VS Code extension and compiler, it provides a smooth experience in both development and production. In practice, it speeds up the development of Node.js backend API applications.

## Closing Thoughts

That's all for now. I hope 2023 goes well for everyone. Here are my plans for the coming year; hopefully they offer some inspiration:

1. Enter the blockchain industry (important).
2. Reevaluate every part of my technology stack and overhaul it (important).
3. Learn Rust, Deno, ReScript, and their related stacks (important).
4. Learn English.
5. Deliberately train in programming language theory and programming fundamentals: relevant books, compilers, programming languages, algorithms, and so on (important).
6. Learn street dance when I have time.
7. Gradually move away from frontend, especially routine business work such as browser and mini-program development.
8. Strengthen my knowledge of backend languages, such as Go. I'm quite fond of Go; it's genuinely good for writing APIs.
9. Learn a little Docker and Kubernetes as needed.
10. Keep developing new ideas in design and product, with occasional practice projects and startup experiments.
