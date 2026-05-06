<div align="center">

<img src="docs/favicon.svg" width="84" height="84" alt="X Reply Helper logo" />

# X Reply Helper

**A free Chrome extension that helps you reply on X (Twitter). Click into any reply box, pick from 5 suggestions, you're done.**

[**↓ Download for Chrome**](https://github.com/kellypeng/x-reply-helper/releases/latest) · [Visit website](https://x-reply-helper.kellypeng.com) · [Follow on X](https://twitter.com/kellyyuweipeng)

[English](README.md) · [中文](README.zh-CN.md)

</div>

---

## What it does

X Reply Helper sits beside the X (Twitter) reply box and gives you **5 ready-made reply suggestions** the moment you focus it. Each suggestion takes a different angle. You read them, click the one closest to what you'd say, and it's typed into the reply box for you.

A typical example:

> A tweet says *"AI is making solo founders more productive than ever."* You click into the reply box. The panel pops up with 5 takes — a specific point, a question, a polite counter, a personal experience, a playful one-liner. Pick whichever sounds like you.

That's the whole product. Click reply box → pick a take → hit Reply. About 10 seconds.

## What problem it solves

You probably ran into one of these recently:

- 🥶 **Empty-reply-box paralysis.** You start typing, the words won't come, you close the tab.
- 🌍 **You know what you want to say — in Chinese.** But you don't know how to say it like a native English speaker.
- ⏰ **No time to draft three versions.** You don't have 5 minutes for a reply.
- 🤖 **The "ChatGPT in another tab" dance is clunky.** You copy the tweet, paste, ask for ideas, copy back — your flow breaks.
- 💭 **Disagree without sounding like a jerk.** Every draft sounds either too soft or too combative.
- 📉 **You want to engage more, but every reply feels generic.** "Great point!" "100%!" "This!"

X Reply Helper fixes all of those by giving you 5 different stances every time, in your own voice, without leaving the X tab.

## How to install

### Step 1 — Download

[**↓ Download X Reply Helper**](https://github.com/kellypeng/x-reply-helper/releases/latest) — grab the file named `x-reply-helper-vX.Y.Z.zip` from the latest release.

Unzip it to a folder you'll keep around. Anywhere works — `Documents/x-reply-helper/` is fine.

### Step 2 — Load it into Chrome

Open Chrome and paste this into the address bar: `chrome://extensions`

Then:

1. **Turn on "Developer mode"** (top right corner).
2. Click **"Load unpacked"**.
3. Pick the folder you just unzipped.

A small blue chat-bubble icon will appear in your Chrome toolbar.

> **About "Developer mode":** this is normal. It's just how Chrome installs extensions that aren't on the Web Store yet. The source code for X Reply Helper is fully public — you can read every line right here on GitHub before installing. Web Store listing will come later.

### Step 3 — Add an AI key

X Reply Helper needs an AI provider to actually generate replies. You bring your own key — that's why the tool stays free.

1. Click the **blue chat-bubble icon** in your Chrome toolbar.
2. Pick a provider. Most people should start with **Zhipu GLM** (free) or **Anthropic Claude** (best quality).
3. Click the link in the popup to sign up at that provider, copy your API key, paste it back into the popup, and click **Save**.

That's it — you're set up.

## How to use

**Click into any reply box on X (Twitter).** The panel pops up at the bottom-right with 5 reply suggestions, each from a different angle:

- **Concrete** — a specific point or fact
- **Question** — an honest follow-up question
- **Counter** — a respectful disagreement
- **Personal** — your own experience
- **Playful** — a witty one-liner

**Click any of the 5 suggestions** — it gets typed into the reply box for you. Then hit Reply on X like normal.

That's the whole flow. Click reply box. Pick a take. Reply.

### Useful things to know

- **Want a reply with your own angle?** Type your idea into the small box at the top of the panel — in any language. Press **Enter**. You'll get 4 polished variants of *your* idea, in the right language.
- **Don't like the 5 suggestions?** Click **Regenerate** at the top of the panel for a fresh set.
- **Languages match automatically**: English tweet → English reply, Chinese tweet → Chinese reply. Detected automatically — you don't toggle anything.
- **It learns your voice**: every reply you actually click gets remembered locally. Future suggestions drift toward your real voice the more you use it.
- **Switch AI providers anytime**: each provider's key is stored separately. Open the popup, pick a different provider, save. Your other keys are still there.
- **Close the panel**: press `Esc`, click outside it, or click the **×** in the top right.
- **Your originals are safe**: the extension only inserts text into the reply box. It never sends a tweet for you. You always click Reply yourself.

## Common questions

**Is it really free?**
Yes. Free to download, free to use, free forever. The code is on GitHub under an open-source license. The only thing that costs money is the AI provider you choose — and most providers (Zhipu, Kimi) have a free tier that's plenty for everyday X use.

**Does X Reply Helper send my data anywhere?**
The tool itself has no server, no analytics, no tracking — it's just static code running in your browser. The tweet you're replying to (plus any angle you type) goes to the **AI provider you chose** when generating a reply. That's the only network call. Your API key, settings, and reply history all stay on your computer.

**Why do I need an API key?**
The extension needs to talk to an AI to generate replies. The API key is your "entry pass" to that AI. By using your own key, you only pay for what you use (often nothing, on free tiers), and your data stays between you and the provider you picked. It also means I don't need to run any servers, which is what keeps the tool free.

**What if the 5 suggestions don't fit what I want to say?**
Type your own idea into the small box at the top of the panel — in any language — and hit Enter. You'll get 4 polished variants of *your* idea instead of 5 generic angles. Or just click Regenerate for a fresh set of 5.

**How is this different from just using ChatGPT?**
ChatGPT is a chat window in another tab. You'd have to: copy the tweet, paste it, type "give me reply ideas", read paragraphs, copy a reply, switch tabs, paste, edit. X Reply Helper is a panel that already knows the tweet, gives you 5 distinct takes (not 5 versions of the same take), and clicks straight into the reply box. The whole flow is 3 seconds instead of 60.

**Will the replies sound generic?**
The first few might. The extension remembers every reply you actually clicked and feeds the recent ones back into the system prompt — so the more you use it, the more the suggestions sound like *you* specifically, not "average Twitter user".

**Why isn't this on the Chrome Web Store?**
It will be. For now this is the developer-install path. The Web Store has a review process and a one-time fee, which I'll get to once the tool is more polished and used. The code is fully open in the meantime.

**Will there be a Firefox or Safari version?**
Maybe later. Chrome (and Chromium browsers like Edge / Brave / Arc) is the only supported browser for now.

## Made by

[Kelly Peng](https://twitter.com/kellyyuweipeng) — independent creator on X.

I built X Reply Helper for myself. English isn't my first language, and I kept having moments on X where I had something to say but couldn't phrase it the way I wanted. The replies I'd come up with felt either too generic or slightly off. Sometimes I'd open ChatGPT in another tab, paste the tweet, ask for ideas — but that broke my flow and the suggestions all sounded the same.

So I built a panel that sits beside the reply box and gives me 5 different takes the moment I focus it. I made it free and open-source for anyone with the same problem.

If X Reply Helper is useful to you, the kindest thing you can do:

- ⭐ **[Star this project on GitHub](https://github.com/kellypeng/x-reply-helper)** — it helps other people find it
- 🐦 **[Follow me on X (@kellyyuweipeng)](https://twitter.com/kellyyuweipeng)** — I post when I ship new tools and write about indie building
- 🐛 **[Report a bug](https://github.com/kellypeng/x-reply-helper/issues)** — I read every issue

---

<details>
<summary><strong>For developers</strong> — how to run, modify, and contribute</summary>

### Develop locally

It's a plain Chrome MV3 extension. No build step, no dependencies.

```bash
git clone https://github.com/kellypeng/x-reply-helper.git
cd x-reply-helper
```

Edit any of `manifest.json` / `background.js` / `content.js` / `content.css` / `popup.html` / `popup.js`. Then:

1. Open `chrome://extensions` and reload the extension.
2. Press `Cmd+R` (or `Ctrl+R`) on the X.com tab — content scripts don't auto-reinject after a reload.

### Project layout

- `manifest.json` — Chrome MV3 manifest
- `background.js` — service worker; LLM calls, language detection, prompt building, voice calibration via `chrome.storage.local.pickHistory`
- `content.js` — injected into x.com / twitter.com; renders the floating panel beside the reply box
- `content.css` — panel styles, light + dark mode
- `popup.html` / `popup.js` — settings popup (provider, API key, model override)
- `icons/` — 16 / 48 / 128 PNGs + source SVG
- `docs/` — landing page deployed to `x-reply-helper.kellypeng.com` via GitHub Pages

### LLM provider abstraction

`PROVIDERS` in `background.js` lists 4 supported providers (Anthropic, OpenAI, Kimi/Moonshot, Zhipu GLM). Each provider has `type: "anthropic"` (uses `callAnthropic`) or `type: "openai"` (uses `callOpenAICompat`). Adding a new OpenAI-compatible provider is a one-line addition.

### License

[MIT](LICENSE) © Kelly Peng.

</details>
