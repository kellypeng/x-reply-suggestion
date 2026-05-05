# X (Twitter) Reply Helper

[English](README.md) | **中文**

一个小巧的 Chrome 扩展。点开 X (Twitter) 的回复框时会自动弹出 5 条回复建议 —— 用你自己的 LLM API key 生成、贴合你的语感，点一下就能插入到回复框。

如果你想表达某个意思但不知道怎么用英文说，直接在面板顶部用任何语言写下你的想法，它会给你 4 条英文（或中文）改写。

> 状态：早期个人工具，自用为主。Issue 和 PR 都欢迎。

## 功能

- **自动模式** —— 每次点击回复框，弹出 5 条不同"姿势"的建议：数据 / 追问 / 反转 / 经验 / 调侃（英文是 Concrete / Question / Counter / Personal / Playful）
- **改写模式** —— 在面板顶部输入你想表达的意思（任何语言），得到 4 条变体：短 / 句 / 幽默 / 呼应
- **硬语言匹配** —— 英文推文 → 英文回复，中文推文 → 中文回复。在 JS 端用脚本检测，不让模型自己猜
- **多家 LLM 支持** —— Anthropic、OpenAI、Kimi（月之暗面）、智谱 GLM 任选，用你已有的 key 即可
- **持续语感校准** —— 你每次点击插入的那条回复都会本地记录，最近选过的会喂回 system prompt，让未来的建议越来越贴近你的真实语感

## 安装

1. **下载** [最新 Release](https://github.com/kellypeng/x-reply-helper/releases/latest) 页面里的 `x-reply-helper-vX.Y.Z.zip`
2. **解压**到一个你能稳定保留的目录（比如 `~/Applications/x-reply-helper/`）
3. **加载到 Chrome**：
   - 浏览器地址栏输入 `chrome://extensions` 回车
   - 右上角打开 **开发者模式 / Developer mode**
   - 点击 **加载已解压的扩展程序 / Load unpacked**
   - 选择刚才解压的目录
4. 工具栏右侧会出现这个扩展的蓝色气泡图标

> 为什么不上 Chrome Web Store？暂时没上 —— 现在是早期个人工具，后续可能会上架。

## 配置

1. 点击工具栏的扩展图标打开设置弹窗
2. 在 **Provider** 下拉框里选一个服务商
3. 粘贴对应的 **API Key**。每个 Provider 各自记住自己的 key，可以随时切换
4. 可选：在 **Model** 里指定具体模型。留空就用 Provider 的默认
5. 点 **Save**

获取 key 的链接：

| Provider | 默认模型 | 获取 key |
|---|---|---|
| Anthropic (Claude) | `claude-haiku-4-5` | https://console.anthropic.com/settings/keys |
| OpenAI | `gpt-4o-mini` | https://platform.openai.com/api-keys |
| Kimi (月之暗面) | `moonshot-v1-8k` | https://platform.moonshot.cn/console/api-keys |
| 智谱 GLM | `glm-4-flash` | https://open.bigmodel.cn/usercenter/apikeys |

**国内用户推荐**：智谱 GLM-Flash 有免费额度，上手最容易；Kimi 中文回复质量也很好；Anthropic 和 OpenAI 需要海外信用卡。

## 使用

1. 打开 `x.com`（或 `twitter.com`）
2. 点开任意推文的回复框
3. 右下角弹出面板，里面 5 条建议。点任意一条就直接插入到回复框
4. 想重新生成 → 点面板顶部的 **Regenerate**
5. **改写模式**：在面板顶部的输入框里写下你想表达的意思（任何语言都行），按 **回车**，会得到 4 条变体
6. 想关掉面板：按 **Esc**、点面板外的地方、或点 **×**

## 隐私

发推前花一分钟看下这段 —— 你的推文文本会被发给第三方 LLM。

- 你的 API key **只**保存在本机的 `chrome.storage.local` 里。除了在生成回复时发到你选的 LLM 服务商接口，其他任何地方都不会发出去
- 你正在回复的那条推文文本 + 你输入的想法会发到**你选的 LLM 服务商**（Anthropic / OpenAI / Moonshot / 智谱），仅用于生成回复建议。每家服务商有各自的数据政策，请自行查看
- 你点击插入的回复会本地记录在 `chrome.storage.local`（最多保留 50 条），用于语感校准。这些数据**永远不出本机**
- 这个扩展**完全不**做任何统计、追踪、上报。**没有服务器**
- 想清空本地的选择历史：打开扩展的 service worker DevTools console，运行 `chrome.storage.local.remove('pickHistory')`

## 开发

```
git clone https://github.com/kellypeng/x-reply-helper.git
cd x-reply-helper
```

直接改 `manifest.json`、`background.js`、`content.js`、`content.css`、`popup.html`、`popup.js` 任意一个，然后：

1. `chrome://extensions` → reload 这个扩展
2. 在 X.com 的标签页按 Cmd+R（或 Ctrl+R）—— content script 不会自动重新注入

没有构建步骤、没有依赖。就是几个静态文件 + Chrome 扩展 API。

## License

[MIT](LICENSE) © Kelly Peng
