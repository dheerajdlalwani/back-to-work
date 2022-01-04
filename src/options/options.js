let list = document.querySelector("#list");
// let deleteButtonsContainer = document.querySelector("#delete_buttons");
console.log(list);
// console.log(delete_buttons);

let isValidURL = (testString) => {
  let url;
  try {
    url = new URL(testString);
  } catch (err) {
    console.log("Bhai tera to try/catch me hi kat gaya.");
    console.log(err);
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

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
    // let deleteButtons = "";
    for (let i = 0; i < blockedWebsites.length; i++) {
      listItems += `<li class="website_list_item"><a href="${blockedWebsites[i]}">${blockedWebsites[i]}</a> <button class="delete_button" id="${i}" value="${i}">Delete</button></li>`;
    }
    list.innerHTML = listItems;
    let deleteButtons = document.querySelectorAll(".delete_button");
    for (let j = 0; j < deleteButtons.length; j++) {
      deleteButtons[j].addEventListener("click", () => {
        console.log(deleteButtons[j].value);
        blockedWebsites.splice(deleteButtons[j].value, 1);
        chrome.storage.sync.set({ blockedWebsites });
        location.reload();
      });
    }
  });
});

let addButton = document.querySelector("#add_button");
console.log(addButton);
addButton.addEventListener("click", () => {
  console.log("Ha bhai click ho gaya...");
  let newWebsite = document.querySelector("#new_website");
  if (newWebsite.value !== "") {
    if (isValidURL(newWebsite.value)) {
      chrome.storage.sync.get("blockedWebsites", ({ blockedWebsites }) => {
        blockedWebsites.push(newWebsite.value);
        chrome.storage.sync.set({ blockedWebsites });
      });
      location.reload();
    } else {
      newWebsite.value = "";
      newWebsite.placeholder = "Invalid URL!";
      newWebsite.style.border = "solid rgb(255, 93, 93) 2px";
      newWebsite.classList.add("new_website_field");
    }
  } else {
    newWebsite.placeholder = "Field is empty!";
    newWebsite.style.border = "solid rgb(255, 93, 93) 2px";
    newWebsite.classList.add("new_website_field");
  }
});
