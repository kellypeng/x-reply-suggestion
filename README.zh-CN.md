<div align="center">

<img src="docs/favicon.svg" width="84" height="84" alt="X Reply Helper logo" />

# X Reply Helper

**一个免费的 Chrome 扩展。点开 X（Twitter）的回复框，5 条不同角度的回复就在旁边。挑一条点一下，搞定。**

[**↓ 下载安装**](https://github.com/kellypeng/x-reply-helper/releases/latest) · [访问网站](https://x-reply-helper.kellypeng.com) · [在 X 上找我](https://twitter.com/kellyyuweipeng)

[English](README.md) · [中文](README.zh-CN.md)

</div>

---

## 这是什么

X Reply Helper 常驻在 X（Twitter）的回复框旁边。点开任意一条推文的回复框，**5 条已经写好的回复建议**会自动弹出来，每一条都从不同角度切入。看一眼，挑最像你说的那条，点一下，就直接填到 X 的回复框里。

举个例子：

> 你看到一条推文写：*"AI 让独立创业者比以往任何时候都能打。"* 你点进回复框，面板弹出 5 个角度 —— 一个具体的点、一个顺势提问、一个礼貌反驳、一个个人经验、一个玩梗。挑最像你的那条，发出去。

整个产品就这一件事。点开回复框 → 挑一条 → 发推。10 秒搞定。

## 解决什么问题

下面这些场景你大概都遇到过：

- 🥶 **盯着空白回复框 30 秒**，脑子里啥也没有，最后默默关掉。
- 🌍 **想说什么是有的 —— 中文里有**。但不知道怎么用英文说得地道。
- ⏰ **没那么多时间琢磨好几个版本**。一条回复哪能花 5 分钟。
- 🤖 **打开 ChatGPT 复制粘贴的流程很 break flow**。复制推文、粘贴、问 AI、复制回去 —— 思路都断了。
- 💭 **想礼貌反驳但写出来不是太软就是太冲**。每个版本读完都觉得不对劲。
- 📉 **想多发声，但每条回复都是"说得对"、"+1"、"赞"** —— 太套话。

X Reply Helper 让你**每次都有 5 种不同立场可挑**，听起来像你自己说的话，全程不离开 X。

## 安装

### Step 1 — 下载

[**↓ 下载 X Reply Helper**](https://github.com/kellypeng/x-reply-helper/releases/latest) —— 在最新 release 页面里找到叫 `x-reply-helper-vX.Y.Z.zip` 的文件。

下载完解压到一个固定文件夹，哪儿都行（比如 `Documents/x-reply-helper/`）。

### Step 2 — 装到 Chrome 里

打开 Chrome，地址栏输入：`chrome://extensions`

然后：

1. **打开右上角的"开发者模式"**。
2. 点击 **"加载已解压的扩展程序"**。
3. 选你刚才解压的那个文件夹。

工具栏右边会出现一个**蓝色对话气泡图标**。

> **关于"开发者模式"：** 这是正常步骤。所有还没上 Chrome 商店的扩展都是这么装的。X Reply Helper 的代码在 GitHub 上完全公开，安装前可以放心检查每一行。后续会上 Chrome 商店。

### Step 3 — 加 AI key

X Reply Helper 需要一个 AI 服务商来生成回复。Key 是你自己的 —— 这样工具能保持免费。

1. 点工具栏的**蓝色对话气泡图标**。
2. 选一个服务商。多数人推荐从 **智谱 GLM**（免费）或 **Anthropic Claude**（最高质量）开始。
3. 点 popup 里的链接去注册，拿到 API key，复制粘贴回来，点 **Save**。

搞定，开始用了。

## 怎么用

**点开任意推文下面的回复框。** 右下角弹出面板，里面是 5 条不同角度的回复建议：

- **数据** —— 一个具体的点
- **追问** —— 顺势问一句
- **反驳** —— 礼貌不同意
- **经验** —— 你自己的故事
- **调侃** —— 玩个梗

**点击任意一条**，就自动填进 X 的回复框。然后像平时一样在 X 上点 Reply 发出去。

整个流程：点回复框 → 挑一条 → 发推。

### 几个有用的小技巧

- **想要按你自己的角度回复？** 在面板顶部的小输入框里写下你想表达的意思（中文、英文、中英混合都行），按 **回车**。会得到 4 条按你的角度生成的变体，自动用对的语言。
- **5 条不满意？** 点面板顶部的 **Regenerate** 重新生成。
- **语言自动匹配**：英文推 → 英文回复，中文推 → 中文回复。你不用切换。
- **越用越像你**：你点击插入过的回复会被记住，下次的建议会越来越接近你的语感。
- **随时换 AI 服务商**：每个服务商的 key 单独存。打开 popup 选不同的服务商保存就行，其他 key 还在。
- **关闭面板**：按 `Esc`、点面板外的地方、或点面板右上角的 **×**。
- **不会自动发推**：扩展只把文字填进回复框，**永远不会替你发推**。最后一步永远是你自己点 Reply。

## 常见问题

**真的免费吗？**
是的。免费下载、免费使用、永远免费。代码在 GitHub 上开源。唯一花钱的是你选的 AI 服务商 —— 但智谱、Kimi 都有免费额度，日常使用够了。

**X Reply Helper 会把我的数据传走吗？**
扩展本身没有服务器、没有统计、没有任何追踪 —— 就是一段在你浏览器里跑的静态代码。**只有生成回复的时候**，原推文加上你输入的角度文字会发给**你选的 AI 服务商**。这是唯一的网络请求。你的 API key、设置、回复历史都只在你本机。

**为什么需要 API key？**
扩展需要跟 AI 说话才能生成回复，API key 就是那个"入场券"。用你自己的 key 意味着：你按用量付费（很多免费额度），数据只在你和你选的服务商之间。这也是工具能保持免费的原因 —— 我不需要养服务器。

**5 条建议都不合适怎么办？**
在面板顶部的输入框里写下你想表达的意思（任何语言），按回车，就能得到 4 条按你的角度生成的变体。或者点 Regenerate 换一组 5 条。

**和直接用 ChatGPT 有什么区别？**
ChatGPT 是另一个标签页里的聊天窗口。要用它你得：复制推文 → 粘贴 → 打字让 AI 给建议 → 读一段一段的回复 → 复制一条 → 切回 X → 粘贴 → 编辑。X Reply Helper 是个面板，已经知道你要回复什么推文，直接给 5 个不同角度（不是同一句话改 5 遍），点一下就填进回复框。整个流程从 60 秒变成 3 秒。

**回复会不会很 AI 味、很套话？**
头几次可能会。扩展会记住你**实际点击插入**的回复，把最近选过的喂回 prompt —— 用得越多，建议越像**你自己**说话的样子，不是"普通 Twitter 用户的平均值"。

**为什么没在 Chrome 商店上架？**
后续会上。商店有审核流程和上架费，等工具更稳定、用户更多了再走。在那之前代码是开源的。

**会有 Firefox / Safari 版本吗？**
可能后续会做。现在只支持 Chrome（以及 Chromium 系的 Edge / Brave / Arc）。

## 作者

[凯莉彭](https://twitter.com/kellyyuweipeng) —— 一个 X 上的独立创作者。

X Reply Helper 是我做给自己用的。英语不是我的母语，我经常在 X 上有想法、但不知道怎么用英文表达得自然。自己写的回复不是太套话就是有点别扭。有时候我会开个 ChatGPT 标签页粘贴推文找灵感 —— 但流程被打断，AI 给的几条又都长得差不多。

所以我做了一个面板，常驻在回复框旁边，点开就给我 5 种不同的接法。我把它做成免费 + 开源 —— 给所有有同样问题的人。

如果 X Reply Helper 对你有帮助，最让我开心的是：

- ⭐ **[在 GitHub 给项目点个 Star](https://github.com/kellypeng/x-reply-helper)** —— 帮更多人发现它
- 🐦 **[在 X 上关注我 @kellyyuweipeng](https://twitter.com/kellyyuweipeng)** —— 我会在那里发新工具和独立开发的思考
- 🐛 **[反馈 bug 或建议](https://github.com/kellypeng/x-reply-helper/issues)** —— 每个 issue 我都会看

---

<details>
<summary><strong>给开发者</strong> —— 怎么跑、改、贡献代码</summary>

### 本地开发

纯 Chrome MV3 扩展，无构建步骤，无依赖。

```bash
git clone https://github.com/kellypeng/x-reply-helper.git
cd x-reply-helper
```

改 `manifest.json` / `background.js` / `content.js` / `content.css` / `popup.html` / `popup.js` 任意一个，然后：

1. 打开 `chrome://extensions`，reload 这个扩展。
2. 在 X.com 的 tab 按 `Cmd+R`（或 `Ctrl+R`）—— content script 不会自动重新注入。

### 项目结构

- `manifest.json` —— Chrome MV3 manifest
- `background.js` —— service worker；LLM 调用、语言检测、prompt 构建、用 `chrome.storage.local.pickHistory` 做语感校准
- `content.js` —— 注入到 x.com / twitter.com；在回复框旁边渲染浮动面板
- `content.css` —— 面板样式，明色 + 暗色模式
- `popup.html` / `popup.js` —— 设置面板（服务商、API key、模型覆盖）
- `icons/` —— 16 / 48 / 128 PNG + 原始 SVG
- `docs/` —— Landing page，通过 GitHub Pages 部署到 `x-reply-helper.kellypeng.com`

### LLM 服务商抽象

`background.js` 里的 `PROVIDERS` 列了 4 家（Anthropic、OpenAI、Kimi/Moonshot、智谱 GLM）。每家有 `type: "anthropic"`（走 `callAnthropic`）或 `type: "openai"`（走 `callOpenAICompat`）。加一个新的 OpenAI 兼容服务商只需要加一行配置。

### License

[MIT](LICENSE) © 凯莉彭。

</details>
