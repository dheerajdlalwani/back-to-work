let modeButton = document.getElementById("mode_button");
let optionsPageButton = document.getElementById("options_page");
console.log("Yo bro. From popup.js");

// Initializing background color as per default mode
chrome.storage.sync.get("mode", ({ mode }) => {
  console.log("popup.js line 7, mode = ", mode);
  modeButton.innerHTML = mode;
  if (mode === "Chill") {
    document.getElementsByTagName("body")[0].className =
      "chill_mode_background";
    modeButton.innerHTML = "Chilling...";
  } else {
    document.getElementsByTagName("body")[0].className = "work_mode_background";
    modeButton.innerHTML = "Working.";
  }
  //   modeButton.innerHTML = mode;
  console.log("Default mode was: ", mode);
});

function changeMode() {
  console.log("Button clicked.");
  chrome.storage.sync.get("mode", ({ mode }) => {
    if (mode === "Chill") {
      mode = "Work";
      modeButton.innerHTML = "Working.";
      document.getElementsByTagName("body")[0].className =
        "work_mode_background";
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
      modeButton.innerHTML = "Chilling...";
      document.getElementsByTagName("body")[0].className =
        "chill_mode_background";
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
  });
}

let openOptionsPage = () => {
  console.log("Opening options page");
  chrome.tabs.create({
    url: chrome.runtime.getURL("options/options.html"),
  });
};

// Note to self: Refactor this with a better approach using <template> tags or custom helper function to recursively handle creating elements (like how React.createElememt works)
// Reference: https://twitter.com/anuraghazru/status/1484925459154767873
let loadQuotes = async () => {
  const quotesFilePath = "quotes.json";
  const request = new Request(quotesFilePath);
  const response = await fetch(request);
  const quotes = await response.json();
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quoteTarget = document.getElementById("quote_section");
  let quoteParagraph = document.createElement("p");
  let authorEmphasis = document.createElement("em");
  let quoteTextNode = document.createTextNode(quotes[randomIndex].quote);
  let authorTextNode = document.createTextNode(
    " -" + quotes[randomIndex].author
  );
  quoteParagraph.className = "quote";
  authorEmphasis.className = "author";
  quoteParagraph.appendChild(quoteTextNode);
  authorEmphasis.appendChild(authorTextNode);
  quoteParagraph.appendChild(authorEmphasis);
  quoteTarget.appendChild(quoteParagraph);
  console.log(quoteParagraph);
  console.log(quotes);
};

loadQuotes();
modeButton.addEventListener("click", changeMode);
optionsPageButton.addEventListener("click", openOptionsPage);
