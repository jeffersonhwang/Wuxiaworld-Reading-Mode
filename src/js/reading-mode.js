/*
 * Content script injected onto page
 */

var maximizeClass = "maximize";
var minimizeClass = "minimize";

function toggleReadingMode(inReadingMode) {
	var primary = document.getElementById("primary");
	var secondary = document.getElementById("secondary");
	var articles = document.getElementsByTagName("article");
	var footer = document.getElementById("footer-wide");
	var comments = document.getElementById("comments");

	if (inReadingMode) {
		primary.classList.add(maximizeClass);
		footer.classList.add(maximizeClass);
		addClassToElements(articles, maximizeClass);
		if (comments)
			comments.classList.add(maximizeClass);
		
		secondary.classList.add(minimizeClass);
	}
	else {
		primary.classList.remove(maximizeClass);
		footer.classList.remove(maximizeClass);
		removeClassFromElements(articles, maximizeClass);
		if (comments)
			comments.classList.remove(maximizeClass);

		secondary.classList.remove(minimizeClass);
	}
}

function addClassToElements(elements, cls)
{
	for (var i = 0;i < elements.length;i++)
		elements[i].classList.add(cls);
}

function removeClassFromElements(elements, cls)
{
	for (var i = 0;i < elements.length;i++)
		elements[i].classList.remove(cls);
}

function toggleNightMode(inNightMode) {
	var main = document.getElementById("main");
	var footer = document.getElementById("footer-wide");
	var secondary = document.getElementById("secondary");
	
	var nightClass = "night-mode";
	if (inNightMode) {
		footer.classList.add(nightClass);
		main.classList.add(nightClass);
		secondary.classList.add(nightClass);
	}
	else {
		footer.classList.remove(nightClass);
		main.classList.remove(nightClass);
		secondary.classList.remove(nightClass);
	}
}

function bindStorageListener() {
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if (namespace === "sync")
		{
			loadSettings(changes);
		}
	});
}

function getSettings() {
	var keys = ["darkLayout", "readingMode", "fontSize"];
	chrome.storage.sync.get(keys, function(items) {
		loadSettings(items);
	});
}

function loadSettings(items) {
	if (items.readingMode) {
		var readingMode = items.readingMode.newValue !== undefined && items.readingMode.newValue !== null ? items.readingMode.newValue : items.readingMode;
		toggleReadingMode(readingMode);
	}

	if (items.darkLayout){ // sets the inital value
		var nightMode = items.darkLayout.newValue !== undefined && items.darkLayout.newValue !== null ? items.darkLayout.newValue : items.darkLayout;
		toggleNightMode(nightMode);
	}

	if (items.fontSize) {
		var fontSize = items.fontSize.newValue ? items.fontSize.newValue : items.fontSize;
		setFontSize(fontSize);
	}
}

function setFontSize(fontSize) {
	var articles = document.getElementsByTagName("article");
	for (var i = 0;i < articles.length;i++) {
		articles[i].style.fontSize = fontSize+"px";
	}
}

// persists reading mode if turned on when reloading/going to a new page
function window_OnLoad()
{
	bindStorageListener();
	getSettings();
}

window.onload = window_OnLoad;