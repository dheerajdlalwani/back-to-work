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
    } else {
      mode = "Chill";
      bgColor = "#00d660";
      color = "#000000";
      console.log("Mode was 'Work'. Now setting to 'Chill'.");
    }
    chrome.storage.sync.set({ mode });
    modeButton.innerHTML = mode;
    modeButton.style.backgroundColor = bgColor;
    modeButton.style.color = color;
  });
}

modeButton.addEventListener("click", changeMode);
