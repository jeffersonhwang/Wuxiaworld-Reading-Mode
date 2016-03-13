/*
 * Content script injected onto page
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		toggleReadingMode(request.toggle);
	}
);

function toggleReadingMode(inReadingMode) {
	var primary = document.getElementById("primary");
	var secondary = document.getElementById("secondary");
	var article = document.getElementsByTagName("article")[0];

	if (inReadingMode) {
		primary.classList.add("maximize");
		article.classList.add("maximize");
		secondary.classList.add("minimize");
	}
	else {
		primary.classList.remove("maximize");
		article.classList.remove("maximize");
		secondary.classList.remove("minimize");
	}

	chrome.storage.local.set({"readingMode" : inReadingMode}, function(){
		console.log("Reading mode: " + inReadingMode);
	});
}

// persists reading mode if turned on when reloading/going to a new page
function window_OnLoad()
{
	// look it up from local storage
	// if true, toggle it on
	chrome.storage.local.get("readingMode", function(items){
		if(items.readingMode)
			toggleReadingMode(items.readingMode);
	});
}

window.onload = window_OnLoad;