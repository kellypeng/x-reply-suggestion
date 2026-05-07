(() => {
  let panel = null;
  let activeComposer = null;
  let lastTweetText = "";

  function findTweetTextFor(composer) {
    const tweets = document.querySelectorAll('[data-testid="tweetText"]');
    if (tweets.length === 0) return "";

    const cRect = composer.getBoundingClientRect();
    let best = null;
    let bestDist = Infinity;
    tweets.forEach((t) => {
      const tRect = t.getBoundingClientRect();
      if (tRect.top >= cRect.top) return;
      const dist = cRect.top - tRect.bottom;
      if (dist >= 0 && dist < bestDist) {
        bestDist = dist;
        best = t;
      }
    });
    return (best?.innerText || "").trim();
  }

  function ensurePanel() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.className = "trh-panel";
    panel.innerHTML = `
      <div class="trh-header">
        <span class="trh-title">Reply ideas</span>
        <div class="trh-actions">
          <button class="trh-btn-regen" type="button">Regenerate</button>
          <button class="trh-btn-close" type="button" aria-label="Close">×</button>
        </div>
      </div>
      <div class="trh-intent">
        <textarea
          class="trh-intent-input"
          rows="2"
          placeholder="想表达什么？(可选, 中英文都行, 回车提交)"
        ></textarea>
      </div>
      <div class="trh-body"></div>
      <div class="trh-credit">
        Made by <a href="https://x.com/kellyyuweipeng" target="_blank" rel="noopener">@kellyyuweipeng</a>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector(".trh-btn-close").addEventListener("click", hidePanel);
    panel.querySelector(".trh-btn-regen").addEventListener("click", () => {
      if (activeComposer && lastTweetText) requestReplies(lastTweetText, getIntent());
    });
    const intentEl = panel.querySelector(".trh-intent-input");
    intentEl.addEventListener("keydown", (e) => {
      // Enter submits, Shift+Enter inserts newline
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (activeComposer && lastTweetText) {
          requestReplies(lastTweetText, intentEl.value.trim());
        }
      }
    });
    return panel;
  }

  function getIntent() {
    const el = panel?.querySelector(".trh-intent-input");
    return el ? el.value.trim() : "";
  }

  function clearIntent() {
    const el = panel?.querySelector(".trh-intent-input");
    if (el) el.value = "";
  }

  function hidePanel() {
    if (panel) panel.style.display = "none";
    activeComposer = null;
  }

  function showPanel() {
    ensurePanel().style.display = "block";
  }

  function isPanelVisible() {
    return panel && panel.style.display !== "none";
  }

  function shouldKeepPanelVisible(target) {
    if (!target) return false;
    if (panel?.contains(target)) return true;
    if (target.closest?.('div[data-testid^="tweetTextarea_"]')) return true;
    return false;
  }

  function setBody(html) {
    ensurePanel();
    panel.querySelector(".trh-body").innerHTML = html;
  }

  function renderLoading() {
    setBody(`<div class="trh-loading">Generating replies…</div>`);
  }

  function renderError(msg) {
    setBody(`<div class="trh-error">${escapeHtml(msg)}</div>`);
  }

  function renderReplies(replies) {
    const cards = replies
      .map(
        (r, i) => `
      <div class="trh-card" data-idx="${i}">
        <div class="trh-style">${escapeHtml(r.style || "Reply")}</div>
        <div class="trh-text">${escapeHtml(r.text || "")}</div>
      </div>`,
      )
      .join("");
    setBody(cards);
    panel.querySelectorAll(".trh-card").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = Number(el.dataset.idx);
        const reply = replies[idx];
        if (!reply) return;
        insertIntoComposer(reply.text || "");
        recordPick(reply);
      });
    });
  }

  function recordPick(reply) {
    if (!chrome?.runtime?.id) return;
    try {
      chrome.runtime.sendMessage(
        {
          type: "replyPicked",
          tweetText: lastTweetText,
          pickedText: reply.text || "",
          pickedStyle: reply.style || "",
        },
        () => {
          // Swallow runtime.lastError silently — pick recording is best-effort.
          void chrome.runtime.lastError;
        },
      );
    } catch (e) {
      console.warn("[TRH] recordPick send failed:", e);
    }
  }

  function insertIntoComposer(text) {
    if (!activeComposer || !text) return;
    activeComposer.focus();

    // X's reply box uses Lexical (Facebook's editor framework). Using
    // document.execCommand("insertText") on a Lexical editor sometimes
    // produces a double insertion — the browser fires beforeinput which
    // Lexical handles via its React-controlled state, and then the
    // browser ALSO performs the native DOM insertion if Lexical didn't
    // preventDefault. Dispatching a synthetic InputEvent of type
    // "insertFromPaste" lets Lexical handle it exactly once via its
    // paste pipeline, with no double-insertion race.
    try {
      const data = new DataTransfer();
      data.setData("text/plain", text);
      activeComposer.dispatchEvent(
        new InputEvent("beforeinput", {
          inputType: "insertFromPaste",
          dataTransfer: data,
          bubbles: true,
          cancelable: true,
        }),
      );
    } catch (e) {
      console.warn("[TRH] insertIntoComposer failed:", e);
      // Last-resort fallback for very old browsers that don't support
      // the InputEvent constructor.
      try {
        document.execCommand("insertText", false, text);
      } catch (e2) {
        console.warn("[TRH] execCommand fallback also failed:", e2);
      }
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function isExtensionContextLost(e) {
    const msg = String(e?.message || e || "");
    return (
      !chrome?.runtime?.id ||
      msg.includes("Extension context invalidated") ||
      msg.includes("reading 'sendMessage'") ||
      msg.includes("reading 'lastError'")
    );
  }

  function requestReplies(tweetText, userIntent = "") {
    showPanel();
    renderLoading();
    if (!chrome?.runtime?.id) {
      renderError("Extension was reloaded. Please refresh this page (Cmd+R).");
      return;
    }
    try {
      chrome.runtime.sendMessage(
        { type: "generateReplies", tweetText, userIntent },
        (resp) => {
          if (chrome.runtime.lastError) {
            renderError(chrome.runtime.lastError.message);
            return;
          }
          if (!resp?.ok) {
            renderError(resp?.error || "Unknown error");
            return;
          }
          renderReplies(resp.replies);
        },
      );
    } catch (e) {
      if (isExtensionContextLost(e)) {
        renderError("Extension was reloaded. Please refresh this page (Cmd+R).");
      } else {
        renderError(e?.message || String(e));
      }
    }
  }

  document.addEventListener("focusin", (e) => {
    try {
      const composer = e.target.closest?.('div[data-testid^="tweetTextarea_"]');
      if (!composer) return;
      if (composer === activeComposer) return;

      activeComposer = composer;
      // New tweet → fresh intent. (Don't carry the previous tweet's angle over.)
      clearIntent();
      const tweetText = findTweetTextFor(composer);
      if (!tweetText) {
        showPanel();
        renderError("Couldn't find the tweet text. Try clicking on the tweet first.");
        return;
      }
      lastTweetText = tweetText;
      requestReplies(tweetText);
    } catch (err) {
      console.warn("[TRH] focusin handler error:", err);
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (!isPanelVisible()) return;
    if (shouldKeepPanelVisible(e.target)) return;
    hidePanel();
  });

  document.addEventListener("focusout", () => {
    if (!isPanelVisible()) return;
    setTimeout(() => {
      if (!isPanelVisible()) return;
      if (shouldKeepPanelVisible(document.activeElement)) return;
      if (activeComposer && !activeComposer.isConnected) {
        hidePanel();
        return;
      }
      hidePanel();
    }, 250);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isPanelVisible()) {
      hidePanel();
    }
  });
})();
