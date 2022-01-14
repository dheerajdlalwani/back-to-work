let modeButton = document.getElementById("mode_button");

console.log("Yo bro. From popup.js");

// Initializing button color as per default mode
chrome.storage.sync.get("mode", ({ mode }) => {
  console.log("popup.js line 7, mode = ", mode);
  modeButton.innerHTML = mode;
  if (mode === "Chill") {
    bgColor = "#00d660";
    color = "#000000";
  } else {
    bgColor = "#f95050";
    color = "#ffffff";
  }
  modeButton.innerHTML = mode;
  modeButton.style.backgroundColor = bgColor;
  modeButton.style.color = color;
  console.log("Default mode was: ", mode);
});

function changeMode() {
  console.log("Button clicked.");
  chrome.storage.sync.get("mode", ({ mode }) => {
    if (mode === "Chill") {
      mode = "Work";
      bgColor = "#f95050";
      color = "#ffffff";
      console.log("Mode was 'Chill'. Now setting to 'Work'.");
      chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
        console.log("The following websites shall be blocked.");
        blockedWebsites.forEach((url, index) => {
          // actually updating the rules.
          let id = index + 1;
          chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
              {
                id: id,
                priority: 1,
                action: { type: "block" },
                condition: {
                  urlFilter: url,
                  resourceTypes: [
                    "main_frame",
                    "sub_frame",
                    "xmlhttprequest",
                    "other",
                    "script",
                    "stylesheet",
                  ],
                },
              },
            ],
            removeRuleIds: [id],
          });
        });
      });
    } else {
      mode = "Chill";
      bgColor = "#00d660";
      color = "#000000";
      console.log("Mode was 'Work'. Now setting to 'Chill'.");
      chrome.declarativeNetRequest.getDynamicRules((rules) => {
        console.log(
          "Hello, here in popup.js, deleting rules because work mode is turned off."
        );
        // deleting rules when mode changed to chill.
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
    }
    chrome.storage.sync.set({ mode });
    modeButton.innerHTML = mode;
    modeButton.style.backgroundColor = bgColor;
    modeButton.style.color = color;
  });
}

modeButton.addEventListener("click", changeMode);
