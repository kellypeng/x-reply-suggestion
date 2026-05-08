(() => {
  let panel = null;
  let activeComposer = null;
  let lastTweetText = "";
  let currentMode = "reply"; // "reply" | "compose"

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
      if (currentMode === "compose") {
        const topic = getIntent();
        if (topic) requestTweetIdeas(topic);
      } else {
        if (activeComposer && lastTweetText) requestReplies(lastTweetText, getIntent());
      }
    });
    const intentEl = panel.querySelector(".trh-intent-input");
    intentEl.addEventListener("keydown", (e) => {
      // Enter submits, Shift+Enter inserts newline
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (currentMode === "compose") {
          const topic = intentEl.value.trim();
          if (topic) requestTweetIdeas(topic);
        } else if (activeComposer && lastTweetText) {
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

  function updatePanelMode(mode) {
    currentMode = mode;
    if (!panel) return;
    const titleEl = panel.querySelector(".trh-title");
    const intentEl = panel.querySelector(".trh-intent-input");
    if (mode === "compose") {
      if (titleEl) titleEl.textContent = "Tweet ideas";
      if (intentEl) intentEl.placeholder = "想发什么？Enter 生成推文灵感 / What to tweet? Press Enter";
    } else {
      if (titleEl) titleEl.textContent = "Reply ideas";
      if (intentEl) intentEl.placeholder = "想表达什么？(可选, 中英文都行, 回车提交)";
    }
  }

  function renderLoading(msg) {
    setBody(`<div class="trh-loading">${escapeHtml(msg || (currentMode === "compose" ? "Generating tweet ideas…" : "Generating replies…"))}</div>`);
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

  // Lock for paranoid safety against rapid double-clicks and any other
  // re-entry. The real fix for the double-paste bug is the dispatch
  // strategy below, not this lock.
  let inserting = false;

  function insertIntoComposer(text) {
    if (!activeComposer || !text) return;
    if (inserting) {
      console.warn("[TRH] insertIntoComposer reentered, suppressing duplicate");
      return;
    }
    inserting = true;

    try {
      activeComposer.focus();

      // X's reply box uses Lexical (Facebook's React-controlled editor).
      // Calling document.execCommand("insertText") on Lexical produces a
      // double insertion: the browser's native insert AND Lexical's React
      // pipeline both fire from a single call, leaving the cursor between
      // two copies of the same text.
      //
      // Dispatching a synthetic ClipboardEvent("paste") with text in
      // clipboardData routes through Lexical's paste handler exclusively
      // (Lexical preventDefaults the paste event after consuming it),
      // resulting in exactly one insertion.
      const dt = new DataTransfer();
      dt.setData("text/plain", text);
      activeComposer.dispatchEvent(
        new ClipboardEvent("paste", {
          bubbles: true,
          cancelable: true,
          clipboardData: dt,
        }),
      );

      // Sanity check: if the synthetic paste was filtered by Lexical (some
      // versions check event.isTrusted), the composer text won't have
      // changed. In that case fall back to execCommand. The fallback may
      // still double-paste on Lexical, but that's strictly better than no
      // insertion at all — the user can manually delete the duplicate and
      // we know to investigate further.
      const beforeLen = (activeComposer.textContent || "").length;
      setTimeout(() => {
        const afterLen = (activeComposer?.textContent || "").length;
        if (afterLen === beforeLen) {
          console.warn("[TRH] synthetic paste appears to have been ignored, falling back to execCommand");
          try {
            document.execCommand("insertText", false, text);
          } catch (e) {
            console.warn("[TRH] execCommand fallback failed:", e);
          }
        }
        inserting = false;
      }, 50);
    } catch (e) {
      console.warn("[TRH] insertIntoComposer failed:", e);
      inserting = false;
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

  function requestTweetIdeas(topic) {
    showPanel();
    renderLoading();
    if (!chrome?.runtime?.id) {
      renderError("Extension was reloaded. Please refresh this page (Cmd+R).");
      return;
    }
    try {
      chrome.runtime.sendMessage(
        { type: "generateTweetIdeas", userTopic: topic },
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
      // New composer → fresh intent. (Don't carry the previous tweet's angle over.)
      clearIntent();
      const tweetText = findTweetTextFor(composer);
      if (!tweetText) {
        // No parent tweet found — this is a new tweet composer, not a reply.
        updatePanelMode("compose");
        showPanel();
        setBody(`<div class="trh-compose-hint">输入想发的主题，按回车生成推文灵感<br><br>Enter your topic above, press Enter to generate tweet ideas</div>`);
        return;
      }
      updatePanelMode("reply");
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
