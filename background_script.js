chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, () => {
        if (chrome.runtime.lastError) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => { window.__rekapAutoShow = true; }
            }).then(() => chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['Content_script.js']
            })).catch(() => {});
        }
    });
});
