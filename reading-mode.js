/*
 * Content script injected onto page
 */

function toggleReadingMode(on)
{
	var primary = document.getElementById("primary");
	var secondary = document.getElementById("secondary");
	var article = document.getElementsByTagName("article")[0];

	if (on) {
		primary.classList.add("maximize");
		article.classList.add("maximize");
		secondary.classList.add("minimize");
	}
	else {
		primary.classList.remove("maximize");
		article.classList.remove("maximize");
		secondary.classList.remove("minimize");
	}
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		toggleReadingMode(request.toggle);
	}
);