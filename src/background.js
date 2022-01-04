console.log("Get Back To Work, NOW 😡");

let mode = "Chill";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Beginning to set default mode to 'Chill'.");
  chrome.storage.sync.set({ mode });
  chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
    if (blockedWebsites === undefined) {
    //   console.log("ha bhai, blockedWebsites nahi hai list me.");
      let blockedWebsites = [];
      chrome.storage.sync.set({ blockedWebsites });
    }
  });
  chrome.tabs.create({
    url: chrome.runtime.getURL("options/options.html"),
  });
});
