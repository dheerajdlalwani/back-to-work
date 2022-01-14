console.log("Get Back To Work, NOW 😡");

// Setting initial mode as Chill
let mode = "Chill";
chrome.runtime.onInstalled.addListener(() => {
  console.log("Beginning to set default mode to 'Chill'.");
  chrome.storage.sync.set({ mode });
  chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
    if (blockedWebsites === undefined) {
      // checking if there is a list of empty websites in storage. if not initializing an empty list.
      console.log("ha bhai, blockedWebsites nahi hai list me.");
      let blockedWebsites = [];
      chrome.storage.sync.set({ blockedWebsites });
    }
  });
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    // removing old persisted dynamic rules from storage
    console.log(
      "Hello, here in the service worker. Deleting the old persisted rules."
    );
    let rulesToBeDeleted = [];
    for (let i = 0; i < rules.length; i++) {
      rulesToBeDeleted.push(rules[i].id);
    }
    console.log("Rules to be deleted: " + rulesToBeDeleted);
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: rulesToBeDeleted,
      },
      () => {
        console.log("Done deleting 🥰");
      }
    );
  });
  // showing options page. TODO make an onboarding page.
  chrome.tabs.create({
    url: chrome.runtime.getURL("options/options.html"),
  });
});
