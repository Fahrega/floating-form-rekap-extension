chrome.action.onClicked.addListener((tab) => {
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['Content_script.js']
  }).catch(() => {});
});