console.log("Get Back To Work, NOW 😡");

let mode = "Chill";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ mode });
  console.log("Default mode set to 'Chill'.");
});