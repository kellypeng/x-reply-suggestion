# X (Twitter) Reply Helper

<img src="icons/icon-128.png" width="64" align="right" alt="">

**English** | [中文](README.zh-CN.md)

🌐 **Live demo:** [x-reply-helper.kellypeng.com](https://x-reply-helper.kellypeng.com)

A free Chrome extension that suggests 5 reply ideas the moment you focus an X (Twitter) reply box. Pick one, and it's typed into the box for you — in your own voice.

---

## What this does

You're scrolling X. You see a tweet you'd like to reply to. You start typing — and the words just don't come.

This extension fixes that.

The moment you click into any X reply box, a small panel pops up next to it with **5 ready-made reply suggestions**, each from a different angle. Read them, click the one closest to what you'd say, and it's typed into the reply box for you.

It's especially useful if:

- **English isn't your first language.** You know what you want to say, but you don't know how to say it like a native.
- **You're not naturally chatty online.** You don't have an instinct for "what makes a good reply".
- **You're short on time.** You don't have 5 minutes to draft a reply.

## What you get

- **5 different angles every time** — not 5 versions of the same thing. Each suggestion takes a different stance: a specific point, an honest question, a polite disagreement, a personal experience, a playful one-liner. So you actually have something to choose from.
- **Type your own idea, get it phrased for you.** Have a thought but stuck on how to say it in English? Type it in any language (English, Chinese, half-half, anything). The extension writes it as 4 natural English variants.
- **Replies match the tweet's language.** English tweet → English reply. Chinese tweet → Chinese reply. Detected automatically.
- **Replies sound like you, not a robot.** Every reply you actually click gets remembered locally. Future suggestions drift toward your real voice the more you use it.
- **Free, open source, runs on your computer.** No subscription, no servers, no tracking. You just need your own AI key (one-time setup, see below).

## Install (about 60 seconds)

1. **Download** the `.zip` file from the [latest release page](https://github.com/kellypeng/x-reply-helper/releases/latest) — it's the file named `x-reply-helper-vX.Y.Z.zip`.
2. **Unzip it** to a folder you'll keep around (anywhere works, e.g. `Documents/x-reply-helper/`).
3. **Open Chrome** and type this in the address bar: `chrome://extensions`
4. **Turn on "Developer mode"** (top right corner). This is normal — it's how you install extensions that aren't yet on the Chrome Web Store.
5. **Click "Load unpacked"** and pick the folder you just unzipped.
6. **Done.** A small blue chat-bubble icon will appear in your Chrome toolbar.

> **Why not on the Chrome Web Store?** It's coming. For now this is the developer install path. Source code is fully public — feel free to read every line before installing.

## Set up your AI key (one-time, ~2 minutes)

The extension needs an AI key to actually generate replies. You bring your own — that's why the tool stays free.

1. Click the **blue chat-bubble icon** in your Chrome toolbar.
2. **Pick a provider** from the dropdown (see table below to choose).
3. **Paste your API key** in the box, then click **Save**.

### Which provider should I pick?

| Provider | Best if you... | Free option? |
|---|---|---|
| **Zhipu GLM** (智谱) | Are in mainland China, want to start free | ✓ Free tier — easiest start |
| **Kimi** (月之暗面) | Want the best Chinese reply quality | ✓ Free tier with limits |
| **OpenAI** | Already pay for ChatGPT API | ❌ Requires payment |
| **Anthropic** (Claude) | Want the highest reply quality | ❌ Requires payment |

Each provider's signup link is shown right inside the popup — click it, sign up, copy your key, paste it back.

> **What is an "API key" anyway?** It's like an entry pass to talk to an AI. The extension uses your key to ask the AI for reply suggestions. By using your own key, you only pay for what you actually use (often nothing — most providers have free tiers), and your data stays between you and the provider you chose.

## How to use it

1. Go to **x.com** (or twitter.com).
2. **Click into any reply box** under any tweet.
3. **A panel pops up at the bottom-right** with 5 reply suggestions, each from a different angle:
   - **Concrete** — a specific point or fact
   - **Question** — an honest follow-up question
   - **Counter** — a respectful disagreement
   - **Personal** — your own experience
   - **Playful** — a witty one-liner
4. **Click any of the 5** — that reply gets typed into the X reply box for you.
5. Want a different set of suggestions? Click **Regenerate** at the top of the panel.

### Want a reply with your own angle?

Type what you want to say in the small box at the top of the panel — in any language. Press **Enter**. You'll get 4 polished variants of *your* idea, in the right language.

### To close the panel

Press **Esc**, click outside the panel, or click the **×** in the top right corner.

## Privacy

Plain English version:

- ✅ Your API key **never leaves your computer** — except when going to the AI provider you chose (only when generating a reply).
- ✅ The tweet you're replying to + any angle you type **goes to the AI provider you selected** — that's how replies get generated.
- ✅ The replies you actually click are **saved locally on your computer** so suggestions get more "you" over time. They never leave your machine.
- ✅ The extension has **no server, no analytics, no tracking** of any kind.
- ✅ Want to wipe the saved reply history? Open the extension's developer console and run `chrome.storage.local.remove('pickHistory')`. Or just remove and reinstall the extension.

Each AI provider has its own privacy policy — read theirs if you care about how they handle the text you send them.

## Help / Questions

- Found a bug or want to suggest something? [Open an issue](https://github.com/kellypeng/x-reply-helper/issues).
- Want to chat? [DM me on X](https://x.com/kellyyuweipeng).

Built by [Kelly Peng](https://x.com/kellyyuweipeng) — an indie creator on X. This is one of a few small tools I'm making for X creators who want to engage more without losing their own voice.

---

## For developers

Plain HTML / JS Chrome MV3 extension. No build step, no dependencies.

```sh
git clone https://github.com/kellypeng/x-reply-helper.git
cd x-reply-helper
# edit any of: manifest.json, background.js, content.js, content.css, popup.html, popup.js
# then:
# 1. open chrome://extensions and reload the extension
# 2. press Cmd+R (or Ctrl+R) on the X.com tab — content scripts don't auto-reinject
```

License: [MIT](LICENSE) © Kelly Peng
