# X (Twitter) Reply Helper

A small Chrome extension that suggests reply ideas when you focus an X (Twitter) reply box. Bring your own LLM API key, get 5 reply variants in your own voice, and click one to drop it into the composer.

If you can't think of how to phrase something in English, just type your idea (in any language) in the panel and it'll rewrite it as 4 English-language variants for you.

> Status: early personal tool. Works for me. Issues and pull requests welcome.

## Features

- **Auto mode** — every time you focus a reply box, get 5 distinct reply suggestions across 5 different "poses": Concrete / Question / Counter / Personal / Playful (Chinese: 数据 / 追问 / 反转 / 经验 / 调侃).
- **Rewrite mode** — type your own angle (in any language) into the panel, get 4 English (or Chinese) variants of *your* idea: Short / Sentence / Playful / Echo.
- **Hard language matching** — English tweet → English reply, Chinese tweet → Chinese reply. Detected via JS-side script analysis, not by asking the model to guess.
- **Multi-provider** — pick from Anthropic, OpenAI, Kimi (Moonshot), or Zhipu GLM. Use whichever key you already have.
- **Persistent voice calibration** — every reply you actually click into the composer gets recorded locally; the most recent ones are fed back into the system prompt so future suggestions drift toward your real voice over time.

## Install

1. **Download** `x-reply-suggestion-vX.Y.Z.zip` from the [latest Release](https://github.com/kellypeng/x-reply-suggestion/releases/latest).
2. **Unzip** to any folder you'll keep around (e.g. `~/Applications/x-reply-suggestion/`).
3. **Load it into Chrome:**
   - Open `chrome://extensions`
   - Toggle **Developer mode** on (top right)
   - Click **Load unpacked**
   - Select the unzipped folder
4. The icon will appear in your toolbar.

> Why not the Chrome Web Store? Not yet — this is an early personal tool. Web Store listing may come later.

## Configure

1. Click the extension's toolbar icon to open the popup.
2. Pick a **Provider** from the dropdown.
3. Paste your **API Key**. Each provider remembers its own key, so you can switch any time.
4. Optional: override the **Model** if you want a specific one. Leave blank for the provider's default.
5. Click **Save**.

Where to get a key:

| Provider | Default model | Get a key |
|---|---|---|
| Anthropic (Claude) | `claude-haiku-4-5` | https://console.anthropic.com/settings/keys |
| OpenAI | `gpt-4o-mini` | https://platform.openai.com/api-keys |
| Kimi (Moonshot) | `moonshot-v1-8k` | https://platform.moonshot.cn/console/api-keys |
| Zhipu GLM | `glm-4-flash` | https://open.bigmodel.cn/usercenter/apikeys |

## Use

1. Open `x.com` (or `twitter.com`).
2. Click into any tweet's reply box.
3. The panel pops up bottom-right with 5 suggestions. Click any card to insert it into the composer.
4. To regenerate, click **Regenerate** in the panel header.
5. To use rewrite mode: type your angle into the textarea at the top of the panel (any language), press **Enter**. You'll get 4 variants of your idea.
6. To dismiss the panel: press **Esc**, click outside, or click the **×**.

## Privacy

Take a minute to read this — you're about to send tweet text to a third-party LLM.

- Your API key is stored **only** in `chrome.storage.local` on your machine. It is never sent anywhere except the LLM provider's API endpoint when generating replies.
- The text of the tweet you're replying to, plus any angle you type, is sent to the **LLM provider you selected** — Anthropic, OpenAI, Moonshot, or Zhipu — for the sole purpose of generating reply suggestions. Each provider has its own data-handling policy; consult theirs.
- The replies you click and insert into the composer are recorded locally in `chrome.storage.local` (capped at 50 entries) for voice calibration. This data never leaves your machine.
- The extension does **not** send any analytics, telemetry, or tracking. There is no server.
- To wipe the local pick history: open the extension's service worker DevTools console and run `chrome.storage.local.remove('pickHistory')`.

## Development

```
git clone https://github.com/kellypeng/x-reply-suggestion.git
cd x-reply-suggestion
```

Edit any of `manifest.json`, `background.js`, `content.js`, `content.css`, `popup.html`, `popup.js`. Then:

1. `chrome://extensions` → reload the extension
2. Cmd+R (or Ctrl+R) on the X.com tab — content scripts don't auto-reinject

There are no build steps and no dependencies. It's just static files and the Chrome extension APIs.

## License

[MIT](LICENSE) © Kelly Peng
