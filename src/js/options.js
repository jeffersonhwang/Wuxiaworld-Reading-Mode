'use strict'

function saveOptions() {
  var fontSize = document.getElementById('fontSize').value;
  var darkLayout = document.getElementById('nightModeToggle').checked;
  var readingMode = document.getElementById('readingModeToggle').checked;

  chrome.storage.sync.set({
    fontSize: fontSize,
    darkLayout: darkLayout,
    readingMode: readingMode
  }, 
  function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function loadOptions() {
  chrome.storage.sync.get({
    fontSize: 16,
    darkLayout: true,
    readingMode: true
  }, function(items) {
    document.getElementById('fontSize').value = items.fontSize;
    document.getElementById('nightModeToggle').checked = items.darkLayout;
    document.getElementById('readingModeToggle').checked = items.readingMode;
  });
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);