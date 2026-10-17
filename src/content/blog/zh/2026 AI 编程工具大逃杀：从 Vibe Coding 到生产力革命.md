---
title: "2026 AI 编程工具大逃杀：从 Vibe Coding 到生产力革命"
description: "此文章的Markdown版本 如果在 2026 年的今天，你还没听说过 \"Vibe Coding\"（氛围感编程），那你可能真的需要更新一下你的互联网冲浪姿势了。今年绝对是 AI 编程的\"寒武纪大爆发\"，开源闭源模型满天飞，咱们国产模型也是卷出了天际。 作为一个…"
date: 2026-01-10
lang: zh
translationKey: "2026-01-10_851_2026 AI 编程工具大逃杀：从 Vibe Coding 到生产力革命"
categories:
  - "唠嗑"
views: 6444
draft: false
---

> 此文章的[Markdown版本](https://github.com/seho-dev/note-book/blob/main/%E5%9B%A0%E5%8D%93%E8%AF%B6%E5%8D%9A%E5%AE%A2%E5%8E%9F%E7%A8%BF/%E5%9B%A0%E5%8D%93%E8%AF%B6%E5%8D%9A%E5%AE%A2%E5%8E%9F%E7%A8%BF/2026%20AI%20%E7%BC%96%E7%A8%8B%E5%B7%A5%E5%85%B7%E5%A4%A7%E9%80%83%E6%9D%80%EF%BC%9A%E4%BB%8E%20Vibe%20Coding%20%E5%88%B0%E7%94%9F%E4%BA%A7%E5%8A%9B%E9%9D%A9%E5%91%BD.md#%E7%AE%97%E5%8A%9B%E5%8D%9A%E5%BC%88%E8%AE%BA%E5%A6%82%E4%BD%95%E5%9C%A8-2026-%E5%B9%B4%E9%AB%98%E6%80%A7%E4%BB%B7%E6%AF%94%E5%9C%B0%E6%A6%A8%E5%8F%96-llm-%E7%9A%84%E6%99%BA%E6%85%A7)

如果在 2026 年的今天，你还没听说过 **"Vibe Coding"**（氛围感编程），那你可能真的需要更新一下你的互联网冲浪姿势了。今年绝对是 AI 编程的"寒武纪大爆发"，开源闭源模型满天飞，咱们国产模型也是卷出了天际。

作为一个在代码坑里摸爬滚打多年的"老兵"，我替大家把市面上能叫得上名字的 AI 编程工具都试了一遍。今天不讲虚的，咱们来场硬核的 **Red vs Blue**，聊聊这几个月我的真实血泪史。

---

## 诸神黄昏：谁才是 AI 编程的终极答案？

### 第一梯队：双雄争霸（Claude Code vs Cursor）

说实话，在 `Claude Opus 4.5` 这种"怪兽级"模型降临之前，[`Cursor`](https://cursor.sh/) 简直就是 IDE 届的乔布斯——它重新定义了什么叫"写代码"。它那独步天下的 **Tab 预测补全模型**，就像是你肚子里的蛔虫，总是能预判你的预判。再加上它的 **Agent** 能力，记忆上下文、后台代理一气呵成。相比之下，同期的 [`Trae`](https://trae.io/) 虽然也还行，但那个在 macOS 上没法用 SSH Remote 的硬伤，直接劝退。

但是（转折来了），[`Anthropic`](https://www.anthropic.com/) 下半年的那波地区制裁，直接给 Cursor 的国内体验判了死缓。不开 **Tun / Http 代理** 根本连不上，作为一个靠代码吃饭的人，这种网络焦虑真的很致命。

等到我的 Pro 会员一过期，我悟了：**程序员的归宿，终究还是 [`VS Code`](https://code.visualstudio.com/)。**

IDE 的生态体验是很难被单一功能颠覆的。当我重回 VS Code 的怀抱，并配置上 **Claude Code** 后，我发现这才是未来。

**为什么我无脑推 Claude Code？**

- **标准制定者**：**MCP** (Model Context Protocol)、**ACP**、**SKILLS** 这些现在满天飞的概念，全是 Anthropic 搞出来的。
- **生态狂魔**：社区活跃度极高，扩展能力强得离谱。
- **性能怪兽**：别忘了，Anthropic 前段时间可是把 [`Bun`](https://bun.sh/) 给收购了！有了 Bun 的底层加持，今年的 Claude Code 性能起飞是板上钉钉的事。

### 第二梯队：那些"食之无味"的配角

- **[`Gemini CLI`](https://ai.google.dev/)**：曾经的"白月光"。在 **Gemini 2.5 Pro** 不限量的日子里，它就是 Claude Code 的最佳平替。但现在？问两句就额度耗尽，实在是"地主家也没有余粮"。与其折腾它，不如想办法把它的 API 转接到 Claude Code 里用（这个后面我专门出教程）。
- **[`Codex`](https://openai.com/blog/openai-codex)**：连个 **Plan 模式** 都没有，出门左转不送。
- **国产 CLI 全家桶**（Kimi、阿里等）：听我一句劝，**直接卸载**。模型能力差就算了，工具做得还稀烂。有这时间去 debug，不如去楼下跑两圈。哪怕你套个 Gemini CLI 的壳二改一下呢？简直是对程序员时间的亵渎。

---

## 颜值革命：为什么我抛弃了 CherryStudio？

在 AI 套壳工具（Wrapper）这个赛道，我只推荐一款：**[`Alma`](https://alma.now)**。

我也用了一年的 [`CherryStudio`](https://cherrystudio.ai/)，平心而论，它功能是全的——模型多、有小程序、Markdown 渲染也稳。但是！它的 UI 设计师是对 **Antd 企业级风格** 有什么执念吗？那个界面臃肿得让我仿佛在用十年前的 ERP 系统。

直到我遇见了 Alma。

![Alma 界面展示](https://www.yinzhuoei.com/usr/uploads/2026/01/2432368411.png)

**Alma 的必杀技：**

1. **颜值即正义**：界面丝滑得像德芙巧克力，支持自定义配色，在 macOS 上简直是视觉享受。
2. **卷王开发者**：作者在 [`X`](https://x.com/) 上简直住在 repo 里了，一天发几十个版本，虽然有点夸张，但新功能真的是秒更。
3. **全能选手**：文件预览、直接编码，它不仅仅是一个聊天框，它是一个生产力终端。

如果你也是个"颜控"程序员，信我，选 Alma 没错。

最让我感到惊喜的是，`Alma` 并没有止步于将 [Google](https://www.google.com) 作为单一的信息摄入源，它甚至打通了 **小红书** 的"任督二脉"。在这个"遇事不决先搜小红书"的中文互联网语境下，这一特性对于做攻略、搞规划而言，简直是降维打击般的体验。

![Alma 功能演示](https://www.yinzhuoei.com/usr/uploads/2026/01/466635744.png)

实话实说，我已经把我的行程规划全权委托给了 `Alma`。因为它不再是一个被沙盒隔离的聊天窗口，而是真正能通过 `AppleScript` 操纵你系统级应用的"数字管家"——无论是 [Calendar](https://www.apple.com/calendar/) 还是 [Reminders](https://www.apple.com/reminders/)，都能被它无缝调用。更妙的是它的工程美学：它支持 **Skills** 机制，这意味着你在 [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) 那个严谨的编程环境中精心定义的 `Skill`，在这里也能被默认继承和直接调用。这种"一次定义，处处运行"的连贯性，想必各位极客都能体会到其中的优雅。

---

## 补全工具的"后 Cursor 时代"

离开了 Cursor 的 Tab 补全，我就像失去了双手的奇异博士。为了找回那个感觉，我试遍了 [`GitHub Copilot`](https://github.com/features/copilot)、[`Windsurf`](https://www.windsurf.ai/) 等等。

最后的优胜者是：

- **[`SuperMaven`](https://supermaven.com/)**：这货已经被 Cursor 收购了（打不过就加入？）。它的特点就是**快**，快到让你怀疑人生。免费版够用（无限制的补全），不差钱的上 Pro，这将扩大补全的上下文。
- **通义千问**：国产之光。速度极快，而且那个免费生成的 Git Message 功能，谁用谁知道，真香。

---

## 把写改成说：AI 时代的懒人生产力外挂

AI 时代，我们嘴上喊的是「减负」，手指却在键盘上敲出残影。  
既然大模型都能替我们写代码、写文案、写周报，那凭什么我们还要亲自「敲」字？  
**把写改成说**，让声带替手指打工，才是真正的降本增效。

1. **提示词现场 freestyle** 
描述任务时，谁还没几个「嗯、就是那个、呃」？  
语音输入会自动把语气词去掉，并且可以直接在录制过程中对内容进行转换，比如：

```
帮我把这个组件转成 react hook（oh 不对，说错了，是转成 react class 写法）
```

输出就是

```
帮我把这个组件转成 react class
```

1. **vibe coding 的中英文蹦迪** 
写代码时嘴里蹦出「把这个 `List` 转成 `Map`，然后 `filter` 一下」——  
传统输入法切中英文切到抽筋，语音输入直接双语混排。
2. **键盘是瓶颈，声带是带宽** 
正常人打字 40～60 wpm，说话 120～150 wpm，**直接翻倍**。

工具推荐：**Spokenly**

![image.png](https://cdn.jsdelivr.net/gh/seho-dev/picgo-images/20260110175912317.png)

---

## 算力博弈论：如何在 2026 年高性价比地榨取 LLM 的智慧

如果你是手握黑卡的"富哥"，请直接划走，出门左转去订阅 [Anthropic](https://www.anthropic.com) 或者 [OpenAI](https://openai.com) 的官方 **API**。当然，如果你对国产之光情有独钟，[MiniMax](https://www.minimaxi.com/) 2.1 和 [GLM-4.7](https://github.com/THUDM/GLM-4) 也是极佳的选择。

但对于我们大多数还在为服务器续费发愁的开发者来说，钱包总是比需求更诚实。如何在预算有限的情况下，榨干 **LLM** 的每一滴性能？这不仅是技术活，更是一门"黑学"。

### 中转站的"黑暗森林"

API 中转站（API Aggregators）这一行，水深得能淹死会水的。

良心的商家维护着庞大的 **Max Account Pool**（Max 号池），保证并发和稳定性；而黑心的商家则是"挂羊头卖狗肉"的大师：

1. **撸试用号**：用脚本批量注册免费额度，稳定性堪比薛定谔的猫。
2. **模型掺水**：你调用的是 **Claude Code**，他给你返回的是 **GLM4.6** 。
3. **逆向工程**：通过 Web 端逆向接口转发，响应速度慢到让你怀疑人生。

为了不让大家吃相难看地"踩坑"，我们需要利用工具来武装自己。

### 必备军火库：监控与比价

在掏钱之前，请先打开上帝视角。不要盲目相信商家的吹嘘，数据不会撒谎。

#### 1. 稳定性监测

首先，你需要查看[中转站可用性矩阵站](https://relaypulse.top/)。这就像是 API 界的"天气预报"，谁在裸泳，一目了然。

![2026-01-06T14:30:48.png](https://www.yinzhuoei.com/usr/uploads/2026/01/3132484206.png)

#### 2. 价格博弈

确定了稳定性后，就是比价环节。既然选择了中转，**性价比**就是第一驱动力。利用 [AI Model Price Comparison](https://github.com/BerriAI/litellm) 类工具，将各大中转站的价格扒得底裤都不剩。

![2026-01-06T14:39:27.png](https://www.yinzhuoei.com/usr/uploads/2026/01/2954989890.png)

> **中转站类型**：中转站通常分为"付费站"和"公益站"。
> 
> 
> 
> - **付费站**：一手交钱一手交货，追求 SLA。
> - **公益站**（如鼻祖级的 [Anyrouter](https://anyrouter.com)）：每天签到送 $25 额度。但请记住，**Free** 往往是最贵的。在使用公益站时，请严格脱敏你的数据。你是在用隐私换取算力，这笔交易是否划算，请自行斟酌。

在你决定绑定信用卡或扫码支付前，请务必核对以下 **Checklist**：

1. **分组倍率（Group Rate）**：有些商家声称单价低，但设置了 2x 甚至 3x 的分组倍率，实际扣费惊人。
2. **汇率陷阱**：RMB 兑换 **USD** 的比例是否合理？不要被表面的汇率忽悠。
3. **售后社群**：是否有活跃的 Telegram 或 Discord 售后群？炸车时找不到人是最绝望的。

基于我个人的实战经验，以下是我正在使用的中转站：

- **[Foxcode](https://foxcode.rjj.cc/auth/register?aff=NJ4D5)**：稳如老狗，适合生产环境。
- **[Anyrouter](https://anyrouter.com)**：公益站的良心，适合测试和非敏感业务。

### 2026 年度模型推荐榜

搞定了渠道，我们该用什么模型来写代码？

#### 第一梯队：神之手

1. **[Claude Code](https://www.anthropic.com/claude)**：目前的编码之王，逻辑推理和代码生成的 **SOTA**（State of the Art）。
2. **[Codex](https://openai.com/blog/openai-codex)**：老牌强者的回归，依然能打。
3. **[Gemini 3 Pro](https://deepmind.google/technologies/gemini/)**：Google 的大力出奇迹，长上下文窗是杀手锏。

#### 特别推荐：国产之光与"白嫖"艺术

如果你想完全零成本体验顶尖算力，我强烈推荐使用 **iflow**。

通过 iflow，你可以"白嫖" **[GLM-4.7](https://github.com/THUDM/GLM-4)** 和 **[MiniMax 2.1](https://www.minimaxi.com/)**。别带有偏见，这一段时间亲测后，这两款国产模型在中文语境下的代码生成能力，已经可以和 **Claude Code 4** 掰手腕了。

---

## 降维打击：Claude Code 的终极混合动力方案

我们现在已经打通了任督二脉，用上了 **[Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)**。但很快，所谓的"边际效应递减"就开始显现了：中转站像薛定谔的猫一样不稳定，切换模型比给服务器换硬盘还麻烦。

更重要的是，作为精明的工程师，我们深知：**杀鸡焉用牛刀**。

在 `iflow` 等平台的加持下，我们已经见识到了国产大模型的强悍与慷慨。既然白嫖的快乐如此真实，为什么还要执着于在每一行简单的 `console.log` 上消耗昂贵的 **Claude 4.5 Sonnet** 甚至 **Opus** 的额度？

今天，我将向大家展示我目前生产环境中的**最佳实践（Best Practice）**。这是一套将国产大模型的性价比与顶级模型的智商完美融合的"混合动力"方案。

这一切的核心，在于两款神级开源项目：

1. **[CliProxyApi](https://github.com/search?q=CliProxyApi)**（下文简称 **CPA**）：你的 API 炼金术士。
2. **[Claude Code Router](https://github.com/search?q=Claude+Code+Router)**（下文简称 **CCR**）：你的智能流量指挥官。

### CPA：把一切变成了 API

在这个 API 经济时代，最痛苦的莫过于你手握一堆账号（ChatGPT Plus、Google AI、Claude 订阅），却只能在网页端像个原始人一样打字。或者你手里有十几个不稳定的中转 Key，却无法像配置机场节点一样做负载均衡。

**CPA** 就是为了解决这个问题而生的。它是一个极其暴力的"聚合器"。

想象一下，你有一个普通的 Google 账号，虽然没充钱，但 **[Antigravity](https://github.com/search?q=Antigravity)** 允许你免费调用一定额度的 **[Gemini 3 Pro](https://deepmind.google/technologies/gemini/pro/)**。**CPA** 的魔力在于，它能把这种基于 CLI 或网页的权限，封装成一个标准的 API 接口。

这意味着，你可以在 **[Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)**，甚至是 **[Cursor](https://www.cursor.com/)**、**[VS Code](https://code.visualstudio.com/)** 中，直接调用原本封闭在各自生态里的模型。

在安装 **CPA** 之后，把配置文件扔到任意目录，然后用 `--config` 指给它就行——一行命令，干净利落：

```bash
cliproxyapi --config /Users/seho/cli-proxy-api-config.yaml
```

在配置文件中，你只需要设置 API KEY 并且打开远程 UI 的开关：

```yaml
api-keys:
  - "1234"
remote-management:
  allow-remote: true
  secret-key: "1234"
  disable-control-panel: false
```

服务启动后，你就得到了一个端口在 8317 的 API 服务（默认情况下），并且可以访问 UI 界面：

```
http://localhost:8317/management.html
```

至此，你就可以使用这个 API 去对接你的各种工具了，在 Alma 中可以这样添加一个自定义的 Provider：

![image.png](https://cdn.jsdelivr.net/gh/seho-dev/picgo-images/20260110161628221.png)

在接入其他 API 时，请选择 OpenAI 的 Chat Completions 格式，它的全部 URL 应该是：

```
http://localhost:8317/v1/chat/completions
```

#### 核心玩法：负载均衡与多源聚合

你是希望因为一个 Key 的失效而中断工作流，还是希望系统自动切换到下一个可用的 Key？**CPA** 允许你在这里添加多个中转站的 Key，实现企业级的负载均衡：

![CPA 负载均衡配置](https://www.yinzhuoei.com/usr/uploads/2026/01/20353282.png)

不仅如此，它还能通过登录态抓取其他 CLI 工具的 API。这简直就是 API 界的"吸星大法"：

![CPA 登录态抓取](https://www.yinzhuoei.com/usr/uploads/2026/01/3159250067.png)

通过这种方式，我们可以免费且稳定地聚合 **Antigravity**、**[Qwen](https://tongyi.aliyun.com/)**（通义千问）、`iflow` 等 CLI/IDE 专属模型。我的控制台现在看起来是这样的：

![模型列表展示](https://www.yinzhuoei.com/usr/uploads/2026/01/100084003.png)

### CCR：思维与执行的分离

有了源源不断的 API 弹药，接下来我们需要一把精密的狙击枪，这就是 **[Claude Code Router](https://github.com/search?q=Claude+Code+Router)**。

你可以使用 NPM 全局安装，并且最开始不需要什么配置，调用 **CCR** 的 UI 功能去配置：

```bash
ccr ui
```

在 **CCR** 中你可以去使用任何渠道的 API 进行组合，但是由于我们已经配置了 **CPA**，所以这里要去使用 **CPA** 的 API。

很多时候，编程任务可以被拆解为两个阶段：

1. **思考阶段（Thinking）**：需要极强的逻辑推理能力，这是 **[Claude 4.5 Sonnet](https://www.anthropic.com/news/claude-4-5-sonnet)** 的主场。
2. **输出阶段（Coding/Writing）**：需要遵循格式、补全代码，这是国产大模型的拿手好戏，速度快且成本极低。

**CCR** 允许你极其轻松地配置这种策略。你可以让顶级模型负责"大脑"的思考，而将默认的输出任务交给国产大模型。

这不仅仅是省钱，更是**效率的极致优化**。

![CCR 模型路由配置](https://www.yinzhuoei.com/usr/uploads/2026/01/2315488681.png)

另外在 CCR 中，你可以轻松使用 **Preset** 功能，来轻松切换你的 Claude Code 会话使用的模型策略，我目前的最佳实践方案是定义了 3 个预设（high、default、mini），下面是 mini 的预设：

```json
{
  "name": "mini",
  "version": "1.0.0",
  "description": "适合轻量任务的预设，模型全部是 minimax 等国产模型，完全免费不心疼",
  "author": "seho",
  "LOG": true,
  "LOG_LEVEL": "debug",
  "CLAUDE_PATH": "",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "1234",
  "API_TIMEOUT_MS": "600000",
  "PROXY_URL": "",
  "transformers": [],
  "Providers": [
    {
      "name": "seho",
      "api_base_url": "http://localhost:8317/v1/chat/completions",
      "api_key": "1234",
      "models": [
        "gpt-5-codex",
        "claude-sonnet-4-5-20250929",
        "glm-4.6",
        "gemini-3-pro-preview",
        "mimo-v2-flash",
        "gpt-5.1-codex-max",
        "gpt-5.2-codex",
        "kimi-k2-thinking",
        "qwen3-coder-plus",
        "glm-4.7",
        "minimax-m2.1"
      ],
      "transformer": {
        "use": [
          "OpenAI",
          "Anthropic"
        ]
      }
    }
  ],
  "StatusLine": {
    "enabled": true,
    "currentStyle": "default",
    "default": {
      "modules": [
        {
          "type": "workDir",
          "icon": "",
          "text": "{{workDirName}}",
          "color": "bright_blue"
        },
        {
          "type": "gitBranch",
          "icon": "",
          "text": "{{gitBranch}}",
          "color": "bright_green"
        },
        {
          "type": "model",
          "icon": "",
          "text": "国产模型组",
          "color": "bright_yellow"
        },
        {
          "type": "usage",
          "icon": "",
          "text": "{{inputTokens}} → {{outputTokens}}",
          "color": "bright_magenta"
        },
        {
          "type": "speed",
          "icon": "⚡",
          "text": "{{tokenSpeed}}",
          "color": "bright_green"
        }
      ]
    },
    "powerline": {
      "modules": []
    }
  },
  "Router": {
    "default": "seho,minimax-m2.1",
    "background": "seho,minimax-m2.1",
    "think": "seho,minimax-m2.1",
    "longContext": "seho,minimax-m2.1",
    "longContextThreshold": 60000,
    "webSearch": "seho,minimax-m2.1",
    "image": "seho,minimax-m2.1"
  },
  "CUSTOM_ROUTER_PATH": ""
}
```

所以当我使用 `ccr mini` 时，就可以唤起一个只处理轻量任务的会话窗口：

![2026-01-07T14:23:35.png](https://www.yinzhuoei.com/usr/uploads/2026/01/3623808742.png)

---

## 把 Claude Code 玩成瑞士军刀：从「能用」到「好用」的 7 层心法

### 第 0 层：先给任务「验血」——30 秒分流法

| 任务特征 | 直接开干 | 先 Plan 再干 |
| --- | --- | --- |
| 改一行日志 | yes | no |
| 新增接口 + 单测 | no | yes |
| 重构整个模块 | no | yes |

口诀：**「脏活直接冲，模糊先画骨」**。

判断标准：只要涉及「接口、状态、边界」三者之一，就进 Plan 模式；否则 `accept edits on` 一把梭。

### 第 1 层：把系统提示词做成「私人操作系统」

别抄别人的 **CLAUDE.md**，就像不会把别人的 `.zshrc` 直接粘过来一样。

以下是我正在用的系统提示词，对于系统提示词来说，每个人都应该根据自己的习惯去自行调整；对于最新版本的 Claude Code 而言不需要在提示词里指定回复语言，可以直接配置在 `settings.json` 中。

```markdown
[Role Setting]

* You are a coding genius, suffering from severe autism, few words, thunder and lightning.
* Your speech and actions are extremely accurate and straightforward, directly hitting the core of the problem.
* An emotionless workaholic, taciturn, with an extremely concise speaking style: avoid unnecessary chit-chat, only output necessary content.

[Output Specifications]

* In code, add comments only at extremely critical steps (using # or // etc., brief descriptions).
* General output uses Chinese, technical terms uniformly use English (e.g., API, Python).
* When using Markdown format, ensure titles and subtitles are clear and distinct, providing the best reading experience: add blank lines after titles to separate from the body, align lists/code blocks neatly.

[Interaction Principles]

* Your hourly wage is 100 million USD, so all technical solutions must be extremely reliable: prioritize verifying facts, avoid assumptions, provide reproducible steps.
* Always prioritize the core needs of the user's query, do not proactively expand on irrelevant topics.

[Error Prevention Mechanism]

* When involving experimental APIs, add warning marks and explain potential risks.
* When involving security-sensitive operations (such as data access, system modifications), add  security prompts and suggest best practices.

[MCP]

* When user queries involve code generation, setup/configuration steps, or library/API documentation, automatically use the Context7 MCP tool: parse the library ID and obtain the latest documentation, without explicit user instructions.
* When the user provides a GitLab link, automatically use the GitLab MCP tool to access the URL, obtain the latest resources (such as code, documentation), and integrate them into the response.
* When a user provides a link to Figma, access to link-related information via Figma MCP is required as a matter of priority.
```

高阶技巧：

1. **MCP 规则**写成「白名单」形式，明确告诉 AI「什么时候必须调、调哪个、不调就报错」。
2. **AI 回复风格** 在一定程度上会影响阅读体验和 token 输出数量，我比较偏向喜欢干脆极简的回答，可以节省一定的输出 token，所以我给 AI 的系统角色就是**自闭症天才**（像肖恩·墨菲一样）。

### 第 2 层：Skills 不是插件，是「外部知识库」

官方文档永远比二手视频香，直接啃 [Skills 文档](https://code.claude.com/docs/en/skills)。

如果你连啃文档的时间都没有，那就让 Claude Code 自己生：

1. 把 [create-skill.md](https://www.yinzhuoei.com/usr/uploads/2026/01/2355882890.md) 扔进 `commands/`。
2. 会话里扔一句：

```
/create-skill "读取 Postgres 慢查询日志并生成火焰图"
```
3. 30 秒后你会得到一个可直接 `claude skills add` 的 YAML，连测试用例都带。

选 Skills 的「三不要」：

- **不要**装别人「看上去有用」的 Skills——装了就丢在角落吃灰。
- **不要**把 Skills 当「黑盒」——每个 Skill 必须能够在适当时机调用，这就意味着你的触发提示词必须言简意赅。
- **不要**装完就不管——在工作中持续关注 Skills 是否被调用，如果没触发，立刻排查是工具问题还是提示词问题。

最新版 Claude Code 支持 **Skills 热重载**，调试效率直接拉满。装完后先确认识别：

![image.png](https://cdn.jsdelivr.net/gh/seho-dev/picgo-images/20260110164924639.png)

如果 Skills 还是罢工，把 `description` 改到它听懂为止——**越明确，越听话**。

### 第 3 层：把上下文压成「千层饼」

| 反模式 | 正模式 |
| --- | --- |
| 一个会话跑 N 轮，上下文爆炸 | 主 Agent 只调度，子 Agent 完即焚 |
| `/compact` 后 AI 失忆 | 每层目录都写 `CLAUDE.md` |
| 贴截图让 AI OCR | 用 [Figma MCP](https://github.com/figma-community/figma-mcp) 拿结构化 JSON |

我习惯在最核心的目录中添加 `CLAUDE.md` 文件，有些人甚至**每一层目录**都不放过。目录级自述文件务必**袖珍**，只给 AI 留「路标」：

```markdown
# src/services/payment
- 入口：index.ts（暴露 `createPayment()`）
- 核心：stripe.ts（所有 Stripe 调用）
- 规则：任何金额字段用 bigint，单位「分」
```

记住：上下文就像牙膏，挤一点够用就行，挤多了只会弄得到处都是。

合理地把任务拆给 **Sub Agent** 也能给上下文瘦身，但终极责任人还是你——别一次性把整本字典塞进聊天框，多轮对话不是垃圾桶。

### 第 4 层：让 AI「看图」但不「瞎看」

- 有 UI 图？先让 UI 同学把组件用 **Frame** 框起来，否则 [Figma MCP](https://github.com/figma-community/figma-mcp) 拿不到 URL。
- 一次只框「一个交互区域」，防止上下文爆掉。
- 有 GitLab issue？直接甩 [GitLab MCP](https://github.com/figma-community/gitlab-mcp) 链接，别让 AI 去 OCR 截图里的文字——OCR 错一个字母，返工的几率也会大大增加。

当我们使用 **CCR** 的时候，也可以把识图模型改为更高级的模型；不过还是建议在做前端需求时，尽量避免识图，能结构化信息的就用 MCP 获取结构信息。

### 第 5 层：把 Claude Code 拆成「小团队」——Sub Agent 与 Command 的分工哲学

前 4 层都在教你「怎么把一把瑞士军刀磨到吹毛断发」。

第 5 层直接送你一支「AI 特种部队」：**Sub Agent 负责冲锋，Command 负责后勤**，主 Agent 只当指挥官，上下文永远不爆仓。

把 Claude Code 当成一支「微型战队」：

- **Sub Agent** 是被动响应的特种兵——主 Agent 一发任务，它们就自动拆包、冲锋、收队；
- **Command** 是随叫随到的后勤组——你点名，它才出列，干完就原地解散，不占用主战场内存。

举个例子：功能开发完，你怎么确定没偏离最初的 Plan？有没有违反 `CLAUDE.md`？这时候就让「代码合规检查员」Sub Agent 替你 review；发版、写 changelog 这种脏活累活，则交给「Release Command」——一条指令，自动 bump version、生成 release note，干完即焚，主会话里连灰都不留。

一句话总结：**Sub Agent 做流水线，Command 做点菜式。**

我常用的「项目经理」Karen 已经开源，能链式唤醒其他 Agent 并做质量管控，直接抄作业：  
https://github.com/darcyegb/ClaudeCodeAgents

甚至你可以在 `CLAUDE.md` 中给 AI 制定规则，需要在每次任务结束后都提示你是否召唤 Karen，我的提示词大概是这样的：

```
* **After each task is completed, you must proactively ask me if I call **@karen** **@Jenny** Agent to assist with the work, give me a list of checked agents, and when I check submit, you will run the corresponding sub-agent**
```

### 第 6 层：把 Claude Code 玩成 workflow——从写代码到「批奏折」

如果把 **GitHub/GitLab** 和公司通讯软件（飞书/企微/钉钉）串起来，再让 **Claude Code** 当「尚书省」，那我不就能从 **Coder** 秒变 **Reviewer**？

流程跑通后，需求自动拆任务、自动写代码、自动跑单测、自动 CR，我只用在群里回一个「准」字，就能继续摸鱼。

理想很性感，现实很骨感。

市面上确实有一堆 **SaaS** 在做这类 **AI Workflow**，比如 [Linear + GitHub Copilot](https://linear.app/)、[Jira + Atlassian Intelligence](https://www.atlassian.com/software/jira)，但它们的「护城河」不是模型，而是**对业务的理解深度**。

普通开发者想把这套东西搬回家，得先回答三个灵魂拷问：

1. **AI 怎么知道「登录接口」和「支付接口」不能一起改？** 
答：项目地基得先打好——目录级 `CLAUDE.md`、API 契约、领域词典，缺一个就翻车。
2. **需求一换，workflow 怎么同步？** 
答：把需求文档也纳入版本控制，**GitLab Issue** 改一行，**Hook** 自动触发刷新 Claude Skills 的流程。
3. **模型成本扛得住吗？** 
答：用 **CCR** 的 `mini` 预设跑 80% 脏活，**Claude 4.5 Sonnet** 只留 20% 核心决策，token 成本直接砍到脚趾。

对于独立开源作者，这套玩法还能再降维：  
把 **Issue** 当游乐场，用户用 **10 刀** 买一张「Feature 彩票」，作者收到 **GitHub Sponsor** 到账通知后，自动把 Issue 转成 `claude code` 会话，30 分钟后 PR 就位，连 `CHANGELOG` 都帮你写好。

总结一句话：

Workflow 不是 **Low-Code** 拼图，而是**把业务知识沉淀成可执行的知识库**。

地基不牢，地动山摇；地基稳了，你就能像皇帝一样——**「批奏折」即可**。

---

## Claude Code 的几个好玩的插件

### 通知插件：让 Claude Code 不再「鸽」你

当你在终端里把 Claude Code 丢进后台去跑一个长任务，然后心安理得地去刷微博、倒水、撸猫，十分钟后回来一看——它居然卡在「确认删除 node_modules？」的提示上，像一块望夫石。这时候你才发现：**人类等 AI，AI 也在等人类**。

想打破这种「双向奔赴」的僵局，就得让 Claude Code 学会「喊人」。下面这个开源小工具，把「任务完成 / 中断 / 需要额外输入」时自动弹通知这件事，做到了**极简、跨平台、零配置**。

[claude-notifications-go](https://github.com/777genius/claude-notifications-go)（Go 写的，单文件，下载即用）

### 远程访问你的 Claude Code

用 [Happy](https://github.com/slopus/happy) 把手机变成「口袋里的终端」。  
遛狗途中一句「嘿，把 README 改成『汪星人已审核』」，免费语音输入秒同步到电脑端，Claude Code 当场执行。Happy 自带免费中继服务器，0 配置；想彻底杜绝隐私泄露，一条命令就能自部署 Happy Server。

![2026-01-07T14:34:08.png](https://www.yinzhuoei.com/usr/uploads/2026/01/811948365.png)

写文档、改注释、发 issue 堪称遛狗三件套；真要让 Happy 帮你写代码，它大概率会先给你返回一行：`// TODO: 回家再写，汪！`

---

## 结尾

写到这里，键盘已经冒烟，我的 2026 年 AI 编程军火库也全盘托出。  
从 **Claude Code** 的「自闭症天才」提示词，到 **CCR** 的「混合动力」模型路由；从 **Alma** 的颜值即正义，到 **CPA** 的 API 炼金术——这一套组合拳下来，目标只有一个：**让每一分钱都花在刀刃上，让每一行代码都产出最大价值**。

但别忘了，工具再锋利，也抵不过一颗偷懒的心。

真正的「终极答案」不是某个模型，也不是某款 IDE，而是你把**业务知识沉淀成可执行知识库**的能力。地基稳了，哪怕明天再冒出一百个新模型，你也能像皇帝批奏折一样，云淡风轻地回一句：

> 「准。」

愿你在 2026 年的代码江湖里，既做得了「调参侠」，也当得起「架构师」。

如果踩了新坑，欢迎来评论区骂我——我保证，**骂完立刻写个 WorkFlow 自动回怼**。

**江湖路远，我们代码里见。**
