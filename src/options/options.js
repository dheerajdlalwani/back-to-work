let list = document.querySelector("#list");
console.log(list);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Load ho gaya window.");
  chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
    if (blockedWebsites.length == 0) {
      console.log("ha bhai, undefined bata raha hai.");
      let emptyListMessage = `<p id="empty_message">You have added no websites. Add now </p>`;
      list.innerHTML = emptyListMessage;
      return;
    }
    console.log(blockedWebsites);
    let listItems = "";
    // inserting the buttons links & delete buttons on the page.
    for (let i = 0; i < blockedWebsites.length; i++) {
      listItems += `<li class="website_list_item"><span tabindex=0>${blockedWebsites[i]}</span> <button class="delete_button" id="${i}" value="${i}">Delete</button></li>`;
    }
    list.innerHTML = listItems;
    let deleteButtons = document.querySelectorAll(".delete_button");
    for (let j = 0; j < deleteButtons.length; j++) {
      // implementing the delete website logic
      deleteButtons[j].addEventListener("click", () => {
        chrome.storage.sync.get("mode", ({ mode }) => {
          // checking if mode is work.
          if (mode === "Work") {
            alert("Cannot delete when in work mode!"); // TODO while refactoring, replace alert with a modal or a message toast.
          } else {
            let btnToBeDeleted = deleteButtons[j].value;
            console.log(btnToBeDeleted);
            chrome.declarativeNetRequest.getDynamicRules((rules) => {
              for (let k = 0; k < rules.length; j++) {
                if (
                  rules[k].condition.urlFilter ===
                  blockedWebsites[btnToBeDeleted]
                ) {
                  chrome.declarativeNetApi.updateDynamicRules(
                    {
                      removeRuleIds: [rules[k].id],
                    },
                    () => {
                      console.log(
                        "Deleted: " + blockedWebsites[btnToBeDeleted]
                      );
                    }
                  );
                }
              }
            });
            blockedWebsites.splice(btnToBeDeleted, 1);
            chrome.storage.sync.set({ blockedWebsites });
            location.reload();
          }
        });
      });
    }
  });
});

// implementing logic for adding new website.
let addButton = document.querySelector("#add_button");
console.log(addButton);
addButton.addEventListener("click", () => {
  console.log("Ha bhai click ho gaya...");
  let newWebsite = document.querySelector("#new_website");
  if (newWebsite.value.trim() !== "") {
    chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
      blockedWebsites.push(newWebsite.value);
      chrome.storage.sync.set({ blockedWebsites });
    });
    location.reload();
  } else {
    newWebsite.value = "";
    newWebsite.placeholder = "Field is empty!";
    newWebsite.style.border = "solid rgb(255, 93, 93) 2px";
    newWebsite.classList.add("new_website_field");
  }
});
