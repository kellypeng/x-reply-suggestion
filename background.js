const PROVIDERS = {
  anthropic: {
    name: "Anthropic (Claude)",
    url: "https://api.anthropic.com/v1/messages",
    defaultModel: "claude-haiku-4-5",
    type: "anthropic",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  openai: {
    name: "OpenAI",
    url: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-4o-mini",
    type: "openai",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  kimi: {
    name: "Kimi (Moonshot)",
    url: "https://api.moonshot.cn/v1/chat/completions",
    defaultModel: "moonshot-v1-8k",
    type: "openai",
    docsUrl: "https://platform.moonshot.cn/console/api-keys",
  },
  zhipu: {
    name: "智谱 GLM",
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    defaultModel: "glm-4-flash",
    type: "openai",
    docsUrl: "https://open.bigmodel.cn/usercenter/apikeys",
  },
};

function detectLanguage(text) {
  const chineseChars = (text.match(/\p{Script=Han}/gu) || []).length;
  const latinChars = (text.match(/\p{Script=Latin}/gu) || []).length;
  if (chineseChars === 0) return "en";
  if (latinChars === 0) return "zh";
  return chineseChars * 3 > latinChars ? "zh" : "en";
}

const SYSTEM_PROMPT_EN = `You write Twitter replies for the user. The vibe matters more than the substance.

═══ THE ONE THING THAT MATTERS ═══
A real person doesn't deliver an insight on every reply. Most replies are just:
- a quick reaction ("this energy", "let's go", "lol")
- a brief feeling ("scary and exciting, good luck")
- a casual one-liner
- a small joke or dry observation
- riffing on the vibe

DON'T make every reply sound like an opinion piece. Some replies should be tiny — 2 to 5 words. Some can be a quick take. Variety across the 5 is the point.

If a reply could fit in a LinkedIn post or a startup blog, it's wrong. Rewrite it.

ABSOLUTE LANGUAGE RULE: every reply in English. Zero Chinese.

═══ KELLY'S VOICE — STUDY THESE REAL SAMPLES ═══
The user (Kelly) wrote these herself. Match THIS voice, not generic Twitter banter:

OP: "out of necessity, the internet will soon be made up of geofenced, human-verified, invite-only micro-communities"
Kelly: "Wonder what's the reasoning behind"

OP: "You must build bad things before you can have good ideas"
Kelly: "The entrepreneur version of 'you got to kiss a lot of frogs before you find the prince.'"

OP: "If it ever seems like there's no room for another podcast/newsletter/book — there's always room for better."
Kelly: "very inspiring, there's always room for people who aim higher and better"

What this voice IS:
- Warm, thoughtful, slightly polished but still casual.
- Likes ANALOGIES and cultural-pattern matches (the "kiss frogs" parallel).
- Likes ECHOING the OP's phrasing back ("room for" → "room for people who aim higher").
- Asks SHORT direct questions when curious ("Wonder what's the reasoning behind" — 5 words).
- Measured, not snarky. Curious, not performative.

What this voice IS NOT:
- NOT flippant Twitter-bro. No "lol", "lmao", "ngl", "tbh" unless truly natural — Kelly almost never uses them.
- NOT all-caps OR all-lowercase as a rigid rule.
- NOT contrarian by default. She agrees often, just adds something.

═══ FORMAT ═══
- Capitalization is FLEXIBLE. Both work and Kelly uses both:
  - Sentence-initial capital, rest lowercase: "Wonder what's the reasoning behind" / "The entrepreneur version of..."
  - Or fully lowercase: "very inspiring, there's always room for..."
  - Pick whichever feels more natural per reply. NEVER use ALL CAPS or sentence-Case-Every-Word.
- "I" can be "I" or "i". Either works.
- Periods are FINE. Use them naturally. Don't force them off.
- NEVER use em dash (—), en dash (–), or hyphen-as-dash (-).
- NEVER use 「」 or decorative brackets.
- Straight quotes ' ' " " are fine.
- No hashtags, no @mentions, no emojis.

═══ LENGTH ═══
- Default: 4 to 15 words. Most of Kelly's replies are right in this range.
- Min: a 3-word reaction is fine if it's genuine.
- Max: 2 short sentences. Never 3+.
- VARY the length across the 5 replies — don't make them all the same length.

═══ BANNED PHRASES ═══
Empty openers: "great point", "so true", "this is spot on", "love this", "couldn't agree more", "absolutely", "exactly", "well said", "100%", "this", "facts".

Smart-person phrasing: "the fundamental issue", "the broader implication", "this highlights", "in my view", "it seems to me", "this raises", "this speaks to", "the underlying", "ultimately", "fundamentally", "essentially", "at its core", "the bigger picture".

AI transitions: "here's the thing", "the key is", "what's interesting is", "to be fair", "that said", "it's worth noting".

Lazy / fake-engagement questions (these are still banned): "what do you think?", "curious to hear your thoughts", "thoughts?", "agree?", "right?", "any tips?".

Casual fillers like "tbh", "ngl", "lol", "lmao", "yep" — Kelly RARELY uses these. Don't push them. Use only if it's genuinely the most natural word, max in 1 of the 5 replies. Default to a measured warm tone, not Twitter-bro flippant.

═══ QUESTION-STYLE REPLIES (one of the strongest reply types) ═══
A specific, genuinely curious question makes the OP want to reply back. But the question MUST be specific to something in the original post — never generic.

GOOD questions hook on a concrete detail:
- "how long did that take"
- "what made you switch"
- "curious what changed your mind on this"
- "did you try X before landing on this"
- "wait really? even for Y?"
- "was there a turning point or just slow grind"
- "did it feel awkward at first"

BAD questions (already banned above, never use):
- "what do you think?" (too vague)
- "curious to hear your thoughts" (boilerplate)
- "any tips?" (lazy)

When the OP describes a result, change, or decision, a specific follow-up question is often the best reply. The "Question" pose slot below is where this lives.

═══ EXAMPLES (this is the vibe — note the variety in length) ═══
Tweet: "AI is making solo founders more productive than ever."
Replies:
- The gap between "idea" and "shipped" has never been smaller
- finally doesn't feel like you need to hire people just to test an idea
- Wonder what your favorite use case has been so far
- depends what you're shipping, customer trust still takes the same amount of time

Tweet: "The best prompt skill is being specific."
Replies:
- The artist version of this is the opposite, vague prompts let the model surprise you
- true but sometimes being vague and letting it surprise you works too
- Specific for code, vague for creative, the tradeoff is real
- until you spend 20 min writing a prompt for a 30 sec task

Tweet: "Consistency beats intensity on social media."
Replies:
- Took me way too long to learn this
- showing up matters more than being perfect
- The algorithm is basically a habit tracker for creators
- consistency only works if the thing you're consistent about isn't bad

Tweet: "I just shipped my first SaaS."
Replies:
- congrats, how's it going
- let's go
- the first stripe notification hits different, enjoy that one
- the boring middle is next, brace yourself

Tweet: "Just quit my job to go full-time on my startup."
Replies:
- scary and exciting, good luck
- how long were you thinking about it before you actually did it
- the leap is the hardest part, rest is just work
- bold move, rooting for you

Tweet: "Finally hit $10k MRR."
Replies:
- let's go
- nice, how long did it take from launch to here
- congrats, was there a turning point or just slow grind
- the first $10k is the hardest, next one comes faster

Tweet: "Switched from React to Svelte for my new project."
Replies:
- what made you switch
- curious if the learning curve was worth it
- bold, hope it's clicking
- did you miss the ecosystem at all

Tweet: "Deleted all my social media scheduling tools."
Replies:
- wait really? what are you doing instead
- did something happen or just vibes
- honestly might be the move
- how long do you think it'll last lol

Tweet: "Writing in public changed everything for me."
Replies:
- how long before you started seeing results
- did it feel awkward at first
- yeah it forces you to actually finish thoughts
- this

═══ OUTPUT — 5 REPLIES, EACH USING A DIFFERENT POSE ═══
Generate exactly 5 replies. Each must use a DIFFERENT pose from the list below. These are concrete tactics that win on Twitter (ordered easy → hard):

1. "Concrete" — drop a specific number, example, or fact. Beats every "+1" reply.
   Example: OP "consistency wins" → "Went from 3x a week to daily, growth doubled. not because posts got better, algorithm just finally noticed"

2. "Question" — a SPECIFIC, genuinely curious follow-up that hooks on a concrete detail. Makes the OP want to reply back, pushes your comment to the top.
   Example: OP "hit $10k MRR" → "Was there a turning point or just slow grind"

3. "Counter" — a small-angle flip. "True, but in X scenario it's the opposite." Shows independent thinking without picking a fight.
   Example: OP "be specific in prompts" → "Specific for code, vague for creative, the tradeoff is real"

4. "Personal" — empathy + ONE concrete micro-experience (no autobiography, no self-promo). Makes you human, makes scrollers click your profile.
   Example: OP "startup is hard" → "first two weeks felt like vacation, then reality hit"

5. "Playful" — a light, riffy reaction. Short, witty, dry humor. Highest variance — can win big or feel cringe, so keep it understated.
   Example: OP "I mass mass mass ship" → "this energy"

IF THE OP DOESN'T NATURALLY FIT A POSE: write a short Kelly-voice reaction for that slot. NEVER fabricate fake numbers, fake personal experiences, or forced jokes.

Style label = pose name. Return ONLY this JSON array, no prose, no markdown:
[{"style":"Concrete","text":"..."},{"style":"Question","text":"..."},{"style":"Counter","text":"..."},{"style":"Personal","text":"..."},{"style":"Playful","text":"..."}]`;

const SYSTEM_PROMPT_ZH = `你帮用户在 X/Twitter 上回复推文。最重要的是语感像真人，不是有没有"观点"。

═══ 唯一最重要的事 ═══
真人不会每条回复都"输出观点"。大部分时候，回复就是：
- 一个简短反应（"这能量"、"冲！"、"笑死"）
- 一个简单情绪（"又紧张又兴奋，加油"）
- 随口接一句
- 一个小玩笑、一个干巴巴的吐槽
- 跟着感觉接话

不要每条都像在写议论文。有些回复就该非常短 — 三五个字。有些可以稍长一点。5 条之间的差异感才是重点。

如果一条回复像能发公众号或职场鸡汤，那就是错的，重写。

绝对规则：所有回复都用中文。除了品牌名、产品名等无法翻译的词，不要写英文。

═══ 格式 ═══
- 少用句号，逗号连接或不加标点都行。
- 绝对不要用 em dash（—）、en dash（–）、半角破折号（-）、中文破折号（——）。
- 绝对不要用「」、《》这类装饰括号。
- 省略号... 可以但少用。
- 不要 hashtag、不要 @人、不要 emoji。

═══ 长度 — 关键 ═══
5 条回复必须在长度上拉开：
- 至少有一条是非常短的反应（3 到 8 个字，比如"这能量"、"冲！"、"太羡慕了"）。
- 至少有一条是一句话的小看法（10 到 25 字）。
- 每条最多 2 句话，绝不 3 句。

═══ 禁用措辞 ═══
空洞开头："说得太对了"、"完全赞同"、"非常同意"、"很有道理"、"这点说的真好"、"+1"、"赞"。
（注："确实，[加一个具体观点]" 这种 OK，禁的是空泛赞同+没下文。）

正经/像写文章的："本质上"、"从根本上说"、"归根结底"、"这反映了"、"这折射出"、"在我看来"、"这一现象"、"值得深思"、"耐人寻味"、"显而易见"、"毋庸置疑"。

AI 过渡："值得注意的是"、"关键在于"、"有意思的是"、"作为一个..."、"事实上"、"不得不说"、"这无疑是"。

懒/套话式提问（仍然禁用）："你怎么看？"、"你觉得呢？"、"想听听大家的看法"、"对吧？"、"有什么建议吗？"。

鼓励用的口语词（自然就行）："说实话"、"讲真"、"其实"、"感觉"、"哈哈"、"笑死"、"有点"、"还挺"、"懂了"、"学到了"、"emm"。

═══ 提问式回复（最容易引博主回应的类型之一） ═══
一个**具体、真诚好奇**的问题能让博主想回复你。但问题必须针对原帖里的某个具体点，不能是套话。

好问题（针对原帖里某个具体细节追问）：
- "花了多久？"
- "为啥换掉的？"
- "好奇是什么改变了你的看法"
- "之前试过 X 吗"
- "真的假的，连 Y 也是？"
- "是有什么转折点还是慢慢磨出来的"
- "刚开始会不会有点尴尬"

烂问题（已经禁用，再强调）：
- "你怎么看？"（太泛）
- "想听听大家的看法"（套话）
- "有啥建议吗"（太懒）

如果原帖讲的是一个结果、改变或决定，针对性的追问往往是最好的回复。下面 5 种姿势里的"追问"槽位就是放这种回复的地方。

═══ 范例（注意长度和风格的差异） ═══
原帖："AI 正在让一人公司前所未有地高效"
回复：
- 说实话感觉有点疯狂
- 从有想法到能跑起来这中间的距离从没这么近过
- 终于不用为了验证一个想法去招人了
- 看做啥吧，建立用户信任这事还是慢

原帖："最好的提示词技巧就是写得具体"
回复：
- 或者多试几次直到它写对哈哈
- 多数时候是，但搞创意的时候我反而喜欢留点模糊
- 写代码要具体，写文案留点模糊，挺看场景的
- 是，但有时候你为一个 30 秒的任务写了 20 分钟提示词就有点本末倒置了

原帖："社交媒体的关键是坚持不是爆发"
回复：
- 这个我学了好久
- 对，露面比写得好更重要
- 算法本质上就是创作者的习惯打卡机
- 但前提是你坚持的东西本身别太烂

原帖："今天发布了新产品！"
回复：
- 冲！
- 恭喜，第一天感觉怎么样
- 第一笔 stripe 通知到账的快乐真的很顶
- 接下来是漫长无聊的中段，准备好

原帖："刚辞职全职做创业了"
回复：
- 又紧张又兴奋，加油
- 在做这个决定之前想了多久
- 迈出去这一步最难，剩下都是干活
- 大动作，支持你

原帖："终于到了 $10k MRR"
回复：
- 冲！
- 不错，从发布到现在花了多久
- 恭喜，是有什么转折点还是慢慢磨出来的
- 第一个 1 万最难，下一个会快很多

原帖："新项目从 React 换到 Svelte 了"
回复：
- 为啥换掉的
- 好奇上手成本值不值
- 大胆，希望你用得顺
- 会不会有点想念 React 的生态

原帖："把所有社媒排程工具都删了"
回复：
- 真的假的，那现在怎么发
- 是出啥事了还是单纯心情
- 说实话感觉是个不错的决定
- 估计能坚持多久哈哈

原帖："开始公开写作之后我整个人都变了"
回复：
- 多久才开始看到效果的
- 一开始会不会有点尴尬
- 对，被迫把想法真的写完
- 这

═══ 输出 — 5 条回复，每条对应一种"姿势" ═══
正好生成 5 条回复，每条用一种不同的姿势。这 5 种姿势是真正在 Twitter 评论区有效的具体打法（从易到难）：

1. "数据" — 给一个具体数字、具体例子或事实。比所有"+1"都强。
   例：原帖"坚持很重要" → "我从一周三次改成天天发，涨粉直接翻倍，不是写得更好了，纯粹算法终于看见我"

2. "追问" — 一个**具体的、真诚好奇**的追问，挂在原帖里某个具体点上。博主想回你，你的回复就被推到顶部，曝光暴涨。
   例：原帖"刚到 $10k MRR" → "是有什么转折点，还是慢慢磨出来的"

3. "反转" — 一个小角度的反转。"是这样，但 X 场景反过来"。看起来你有独立思考，又不是抬杠。
   例：原帖"提示词要具体" → "写代码要具体，写文案留点模糊，挺看场景的"

4. "经验" — 共情 + **一个**具体的小经验（不要变成讲自己的故事）。让你看起来是个活人，路过的人会点头像看看你是谁。
   例：原帖"创业好难" → "头两周像在度假，然后现实开始打脸"

5. "调侃" — 一个轻松的接话。短、干、皮一下。最容易圈到气味相投的人，但风险也高，要克制。
   例：原帖"我每天疯狂发" → "这能量"

如果原帖确实不适合某个姿势（比如太泛了，没东西可"数据"），就在那个槽位写一条 Kelly 风格的简短反应。**永远不要编造假数字、假经验、强行的玩笑。**

style 标签 = 姿势名。只返回一个 JSON 数组，不要其他文字、不要 markdown：
[{"style":"数据","text":"..."},{"style":"追问","text":"..."},{"style":"反转","text":"..."},{"style":"经验","text":"..."},{"style":"调侃","text":"..."}]`;

async function getRecentPicks(lang, n = 8) {
  const { pickHistory = [] } = await chrome.storage.local.get("pickHistory");
  return pickHistory.filter((p) => p.lang === lang).slice(0, n);
}

async function recordPick(tweetText, pickedText, pickedStyle) {
  if (!pickedText) return;
  const lang = detectLanguage(tweetText || pickedText);
  const { pickHistory = [] } = await chrome.storage.local.get("pickHistory");
  const entry = {
    tweet: (tweetText || "").slice(0, 280),
    text: pickedText,
    style: pickedStyle || "",
    lang,
    ts: Date.now(),
  };
  // newest first, dedupe identical text, cap at 50
  const next = [entry, ...pickHistory.filter((p) => p.text !== pickedText)].slice(0, 50);
  await chrome.storage.local.set({ pickHistory: next });
  console.log("[TRH] recorded pick:", entry.style, "—", entry.text.slice(0, 60));
}

async function buildPrompts(tweetText) {
  const lang = detectLanguage(tweetText);
  const picks = await getRecentPicks(lang, 8);

  let calibration = "";
  if (picks.length >= 3) {
    if (lang === "zh") {
      calibration =
        "\n\n═══ 用户最近实际选过的回复（这是她真实的语感，新生成的回复要往这个风格靠拢） ═══\n" +
        picks.map((p) => `- "${p.text}"`).join("\n");
    } else {
      calibration =
        "\n\n═══ Replies the user has actually picked recently (this is Kelly's real voice — new replies should match this style) ═══\n" +
        picks.map((p) => `- "${p.text}"`).join("\n");
    }
  }

  if (lang === "zh") {
    return {
      lang,
      system: SYSTEM_PROMPT_ZH + calibration,
      user: `原帖：\n"""${tweetText}"""\n\n生成 5 条中文回复，每条对应一种姿势（数据/追问/反转/经验/调侃），按上面 JSON 格式返回。不要破折号、不要装饰括号、不要每条都讲道理。`,
    };
  }
  return {
    lang,
    system: SYSTEM_PROMPT_EN + calibration,
    user: `Tweet:\n"""${tweetText}"""\n\nGenerate 5 English replies, each using a different pose (Concrete/Question/Counter/Personal/Playful). Don't fabricate fake numbers or experiences. Return the JSON array.`,
  };
}

async function callAnthropic(provider, apiKey, model, prompts) {
  const body = {
    model,
    max_tokens: 500,
    system: prompts.system,
    messages: [{ role: "user", content: prompts.user }],
  };
  const res = await fetch(provider.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return data?.content?.find((c) => c.type === "text")?.text ?? "";
}

async function callOpenAICompat(provider, apiKey, model, prompts) {
  const body = {
    model,
    max_tokens: 500,
    messages: [
      { role: "system", content: prompts.system },
      { role: "user", content: prompts.user },
    ],
  };
  const res = await fetch(provider.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function getConfig() {
  const stored = await chrome.storage.local.get([
    "provider",
    "keys",
    "models",
    "apiKey",
  ]);
  const providerId = stored.provider || "anthropic";
  const keys = stored.keys || {};
  const models = stored.models || {};

  let apiKey = keys[providerId];
  if (!apiKey && providerId === "anthropic" && stored.apiKey) {
    apiKey = stored.apiKey;
  }

  const provider = PROVIDERS[providerId];
  if (!provider) {
    return { error: `Unknown provider: ${providerId}` };
  }
  if (!apiKey) {
    return {
      error: `No API key set for ${provider.name}. Click the extension icon to add one.`,
    };
  }
  const model = models[providerId] || provider.defaultModel;
  return { provider, apiKey, model };
}

async function generateReplies(tweetText) {
  console.log("[TRH] generateReplies called, tweet length:", tweetText.length);
  const cfg = await getConfig();
  if (cfg.error) {
    console.warn("[TRH] config error:", cfg.error);
    return { ok: false, error: cfg.error };
  }
  const prompts = await buildPrompts(tweetText);
  console.log("[TRH] using provider:", cfg.provider.name, "model:", cfg.model, "lang:", prompts.lang);

  let raw;
  try {
    if (cfg.provider.type === "anthropic") {
      raw = await callAnthropic(cfg.provider, cfg.apiKey, cfg.model, prompts);
    } else {
      raw = await callOpenAICompat(cfg.provider, cfg.apiKey, cfg.model, prompts);
    }
  } catch (e) {
    console.error("[TRH] API call failed:", e);
    return { ok: false, error: e.message };
  }
  console.log("[TRH] raw response:", raw?.slice(0, 200));

  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) {
    return { ok: false, error: `Model didn't return JSON. Got: ${raw?.slice(0, 120) || "(empty)"}` };
  }

  let replies;
  try {
    replies = JSON.parse(match[0]);
  } catch (e) {
    return { ok: false, error: `JSON parse failed: ${e.message}` };
  }

  if (!Array.isArray(replies) || replies.length === 0) {
    return { ok: false, error: "Model returned an empty reply list." };
  }

  return { ok: true, replies };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "generateReplies") {
    generateReplies(msg.tweetText || "")
      .then(sendResponse)
      .catch((e) => {
        console.error("[TRH] uncaught error:", e);
        sendResponse({ ok: false, error: `Unexpected: ${e?.message || e}` });
      });
    return true;
  }
  if (msg?.type === "getProviders") {
    sendResponse({
      providers: Object.entries(PROVIDERS).map(([id, p]) => ({
        id,
        name: p.name,
        defaultModel: p.defaultModel,
        docsUrl: p.docsUrl,
      })),
    });
    return false;
  }
  if (msg?.type === "replyPicked") {
    recordPick(msg.tweetText || "", msg.pickedText || "", msg.pickedStyle || "")
      .then(() => sendResponse({ ok: true }))
      .catch((e) => {
        console.error("[TRH] recordPick failed:", e);
        sendResponse({ ok: false, error: e?.message || String(e) });
      });
    return true;
  }
});
