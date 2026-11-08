// Clicar no ícone abre a página em uma aba (ou foca a que já existe).
const url = chrome.runtime.getURL('index.html');
chrome.action.onClicked.addListener(async () => {
  const [tab] = await chrome.tabs.query({ url });
  if (tab?.id !== undefined) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url });
  }
});
