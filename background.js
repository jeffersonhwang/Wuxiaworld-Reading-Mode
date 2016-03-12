var toggleOn = false;

var port;

function toggleRequest() {
  toggleOn = !toggleOn;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {toggle: toggleOn});
  });
}

chrome.browserAction.onClicked.addListener(toggleRequest);