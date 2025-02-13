function addButton() {
  const parentDivs = document.getElementsByClassName("ph5 pb5");

  // Remove existing button before adding a new one
  const existingButton = document.querySelector(".custom-btn");
  if (existingButton) existingButton.remove();

  // Remove any existing dropdown before adding a new one**
  const existingDropdown = document.querySelector(".custom-dropdown");
  if (existingDropdown) existingDropdown.remove();

  if (parentDivs.length > 0) {
    const name = document.querySelector(
      ".artdeco-hoverable-trigger a h1"
    )?.innerText;
    const username = window.location.pathname;

    console.log("Current username:", username);

    const button = document.createElement("button");
    button.innerText = "Did I reply?";
    button.classList.add("custom-btn");

    const badge = document.createElement("span");
    Object.assign(badge.style, {
      width: "8px",
      height: "8px",
      background: "red",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      right: "2px",
      display: "none",
    });
    button.appendChild(badge);

    Object.assign(button.style, {
      backgroundColor: "#F8C77E",
      color: "#22292A",
      border: "none",
      padding: "6px 12px",
      fontSize: "15px",
      fontWeight: "600",
      borderRadius: "20px",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "8px",
      position: "relative",
    });

    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("custom-dropdown");
    Object.assign(dropdownContainer.style, {
      display: "none",
      position: "absolute",
      width: "300px",
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "0 8px 8px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      zIndex: "1000",
      border: "1px solid #E7E7E7",
    });

    // Ensure we fetch the correct note when switching profiles**
    chrome.storage.local.get([username], (result) => {
      const existingMessage = result[username]?.message || "";
      if (existingMessage) {
        badge.style.display = "block";
      }

      dropdownContainer.innerHTML = `
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Add a Note</h3>
        <textarea id="noteInput" placeholder="Your Message" style="width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;" rows="4">${existingMessage}</textarea>
        <div style="display: flex; justify-content: flex-end;">
          <button id="submitForm" style="background: #0a66c2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">Send</button>
          <button id="closeForm" style="background: #f0f2f5; color: #0a66c2; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-left: 8px;">Cancel</button>
        </div>
      `;
    });

    button.onclick = () => {
      const rect = button.getBoundingClientRect();
      dropdownContainer.style.left = `${rect.left}px`;
      dropdownContainer.style.top = `${rect.bottom + window.scrollY + 8}px`;
      const isVisible = dropdownContainer.style.display === "block";
      dropdownContainer.style.display = isVisible ? "none" : "block";
    };

    dropdownContainer.addEventListener("click", (event) => {
      if (event.target.id === "submitForm") {
        const message = dropdownContainer.querySelector("#noteInput").value;
        const profilePic = document.querySelector(`img[alt="${name}"]`)?.src;
        const headline = document.querySelector(
          "[data-generated-suggestion-target]"
        )?.innerText;

        const data = {
          name,
          username,
          profilePic,
          headline,
          message,
          createdAt: Date.now(),
        };

        console.log("Form submitted:", data);

        chrome.storage.local.set({ [username]: data }, () => {
          console.log("Form data saved to chrome.storage:", data);
          badge.style.display = message.trim() ? "block" : "none";
          dropdownContainer.style.display = "none";
        });
      }

      if (event.target.id === "closeForm") {
        dropdownContainer.style.display = "none";
      }
    });

    document.body.appendChild(dropdownContainer);
    parentDivs[0].appendChild(button);
  }
}

// Ensure we reset the popup when navigating to a new profile**
let lastProfile = "";

const observer = new MutationObserver(() => {
  const currentProfile = window.location.pathname;
  if (currentProfile !== lastProfile) {
    lastProfile = currentProfile;
    addButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

addButton();
