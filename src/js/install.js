chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.set({
    fontSize: 16,
    darkLayout: true,
    readingMode: true
  });
});