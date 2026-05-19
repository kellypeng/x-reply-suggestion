const providerSel = document.getElementById("provider");
const keyInput = document.getElementById("key");
const modelSelect = document.getElementById("modelSelect");
const modelCustom = document.getElementById("modelCustom");
const keyHint = document.getElementById("keyHint");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");

const CUSTOM_OPT = "__custom__";

let providers = [];

function setStatus(msg, kind) {
  status.textContent = msg;
  status.className = kind || "";
}

function findProvider(id) {
  return providers.find((p) => p.id === id);
}

function refreshFieldsForProvider(providerId) {
  const p = findProvider(providerId);
  if (!p) return;
  keyHint.innerHTML = `Get a key from <a href="${p.docsUrl}" target="_blank" rel="noopener">${new URL(p.docsUrl).hostname}</a>.`;

  // Populate the model dropdown for this provider.
  const models = p.models && p.models.length ? p.models : [p.defaultModel];
  const opts = models.map(
    (m) => `<option value="${m}">${m}${m === p.defaultModel ? " (default)" : ""}</option>`,
  );
  opts.push(`<option value="${CUSTOM_OPT}">Custom…</option>`);
  modelSelect.innerHTML = opts.join("");

  chrome.storage.local.get(["keys", "models", "apiKey"], (s) => {
    const keys = s.keys || {};
    const savedModels = s.models || {};
    let savedKey = keys[providerId];
    if (!savedKey && providerId === "anthropic" && s.apiKey) savedKey = s.apiKey;

    keyInput.value = "";
    keyInput.placeholder = savedKey ? "•••• saved ••••" : "paste key here";

    const savedModel = savedModels[providerId];
    if (savedModel && models.includes(savedModel)) {
      modelSelect.value = savedModel;
      modelCustom.hidden = true;
      modelCustom.value = "";
    } else if (savedModel) {
      // User had a custom model name we don't list — keep it.
      modelSelect.value = CUSTOM_OPT;
      modelCustom.hidden = false;
      modelCustom.value = savedModel;
    } else {
      modelSelect.value = p.defaultModel;
      modelCustom.hidden = true;
      modelCustom.value = "";
    }
  });
}

modelSelect.addEventListener("change", () => {
  if (modelSelect.value === CUSTOM_OPT) {
    modelCustom.hidden = false;
    modelCustom.focus();
  } else {
    modelCustom.hidden = true;
    modelCustom.value = "";
  }
  setStatus("");
});

function init() {
  chrome.runtime.sendMessage({ type: "getProviders" }, (resp) => {
    providers = resp?.providers || [];
    providerSel.innerHTML = providers
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("");

    chrome.storage.local.get("provider", ({ provider }) => {
      const active = provider || "anthropic";
      providerSel.value = active;
      refreshFieldsForProvider(active);
    });
  });
}

providerSel.addEventListener("change", () => {
  refreshFieldsForProvider(providerSel.value);
  setStatus("");
});

saveBtn.addEventListener("click", async () => {
  const providerId = providerSel.value;
  const newKey = keyInput.value.trim();
  const selectedModel =
    modelSelect.value === CUSTOM_OPT
      ? modelCustom.value.trim()
      : modelSelect.value;

  const stored = await chrome.storage.local.get(["keys", "models", "apiKey"]);
  const keys = stored.keys || {};
  const models = stored.models || {};

  let existingKey = keys[providerId];
  if (!existingKey && providerId === "anthropic" && stored.apiKey) {
    existingKey = stored.apiKey;
  }

  if (!newKey && !existingKey) {
    setStatus("Please paste an API key.", "err");
    return;
  }

  if (newKey) keys[providerId] = newKey;
  if (selectedModel) models[providerId] = selectedModel;
  else delete models[providerId];

  await chrome.storage.local.set({ provider: providerId, keys, models });

  setStatus(`Saved. Active provider: ${findProvider(providerId)?.name}.`, "ok");
  keyInput.value = "";
  keyInput.placeholder = "•••• saved ••••";
});

keyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveBtn.click();
});

init();
