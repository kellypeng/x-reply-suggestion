const providerSel = document.getElementById("provider");
const keyInput = document.getElementById("key");
const modelInput = document.getElementById("model");
const keyHint = document.getElementById("keyHint");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");

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
  modelInput.placeholder = p.defaultModel;
  keyHint.innerHTML = `Get a key from <a href="${p.docsUrl}" target="_blank" rel="noopener">${new URL(p.docsUrl).hostname}</a>.`;

  chrome.storage.local.get(["keys", "models", "apiKey"], (s) => {
    const keys = s.keys || {};
    const models = s.models || {};
    let savedKey = keys[providerId];
    if (!savedKey && providerId === "anthropic" && s.apiKey) savedKey = s.apiKey;

    keyInput.value = "";
    keyInput.placeholder = savedKey ? "•••• saved ••••" : "paste key here";
    modelInput.value = models[providerId] || "";
  });
}

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
  const newModel = modelInput.value.trim();

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
  if (newModel) models[providerId] = newModel;
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
