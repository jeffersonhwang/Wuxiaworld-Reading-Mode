/*
 * Content script injected onto page
 */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		toggleReadingMode(request.toggle);
	}
)

var maximizeClass = "maximize";
var minimizeClass = "minimize";

function toggleReadingMode(inReadingMode) {
	var primary = document.getElementById("primary");
	var secondary = document.getElementById("secondary");
	var articles = document.getElementsByTagName("article");
	var footer = document.getElementById("colophon");
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

	chrome.storage.local.set({"readingMode" : inReadingMode}, function(){
		console.log("Reading mode: " + inReadingMode);
	});
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

var nightClass = "night-mode";
function toggleNightMode(e, inNightMode) {
	var articles = document.getElementsByTagName("article");
	var toggle = document.getElementsByClassName("toggle-button")[0];
	
	var e = e || event;
	if (e)
		inNightMode = e.target.checked;
	
	if (inNightMode) {
		addClassToElements(articles, nightClass);
		// handles when night mode is enabled and page is reloaded
		if (!e) {
			var input = document.getElementById("nightModeToggle");
			input.checked = inNightMode;
		}
	}
	else {
		removeClassFromElements(articles, nightClass);
	}
	

	chrome.storage.local.set({"nightMode" : inNightMode}, function() {
		console.log("Night mode: " + inNightMode);
	});
}

function createSettingsBar() {
	var settingsDiv = document.createElement("div");
	settingsDiv.setAttribute("class", "settings");
	settingsDiv.title = "Settings";

	//   <input class='toggle toggle-skew' id='cb3' type='checkbox'>
	//   <label class='toggle-button' data-tg-off='OFF' data-tg-on='ON' for='cb3'></label>

	var toggleContainer = document.createElement("div");
	toggleContainer.setAttribute("class", "toggleContainer");
	
	settingsDiv.appendChild(toggleContainer);

	var heading = document.createElement("h4");
	heading.setAttribute("class", "setting-heading");
	heading.textContent = "Night Mode";

	toggleContainer.appendChild(heading);

	var toggle = document.createElement("input");
	toggle.setAttribute("class", "toggle toggle-skew");
	toggle.setAttribute("id", "nightModeToggle");
	toggle.setAttribute("type", "checkbox");

	toggleContainer.appendChild(toggle);

	toggle.addEventListener("click", toggleNightMode);

	var label = document.createElement("label");
	label.setAttribute("class", "toggle-button");
	label.setAttribute("data-tg-off", "OFF");
	label.setAttribute("data-tg-on", "ON");
	label.setAttribute("for", "nightModeToggle");

	toggleContainer.appendChild(label);

	var siteNav = document.getElementById("site-navigation");
	siteNav.appendChild(settingsDiv);
}

// persists reading mode if turned on when reloading/going to a new page
function window_OnLoad()
{
	createSettingsBar();

	chrome.storage.local.get("readingMode", function(items){
		if (items.readingMode)
			toggleReadingMode(items.readingMode);
	});

	chrome.storage.local.get("nightMode", function(items){
		if (items.nightMode == undefined || items.nightMode == null) // sets the inital value
			chrome.storage.local.set({"nightMode": false});
		else
			toggleNightMode(null, items.nightMode);
	});
}

window.onload = window_OnLoad;