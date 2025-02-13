function addButton() {
  const parentDivs = document.getElementsByClassName("ph5 pb5");
  if (parentDivs.length > 0 && !document.querySelector(".custom-btn")) {
    // Extract user's info
    const name = document.querySelector(
      ".artdeco-hoverable-trigger a h1"
    )?.innerText;
    const username = window.location.pathname;

    // Create button
    const button = document.createElement("button");
    button.innerText = "Did I reply?";
    button.classList.add("custom-btn");

    // Create notification badge (hidden by default)
    const badge = document.createElement("span");
    Object.assign(badge.style, {
      width: "8px",
      height: "8px",
      background: "red",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      right: "2px",
      display: "none", // Initially hidden
    });
    button.appendChild(badge);

    // LinkedIn button styling
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

    // Create dropdown container (hidden by default)
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

    // Fetch existing note
    chrome.storage.local.get([username], (result) => {
      const existingMessage = result[username]?.message || "";
      if (existingMessage) {
        badge.style.display = "block"; // Show red dot if a note exists
      }

      // Populate dropdown form
      dropdownContainer.innerHTML = `
        <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Add a Note</h3>
        <input type="hidden" id="userName" value="${name}" style="width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;" readonly/>
        <input type="hidden" id="userId" value="${username}"/>
        <textarea id="noteInput" placeholder="Your Message" style="width: 100%; padding: 8px; margin-bottom: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;" rows="4">${existingMessage}</textarea>
        <div style="display: flex; justify-content: flex-end;">
          <button id="submitForm" style="background: #0a66c2; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px;">Send</button>
          <button id="closeForm" style="background: #f0f2f5; color: #0a66c2; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; margin-left: 8px;">Cancel</button>
        </div>
      `;
    });

    // Show dropdown when button is clicked
    button.onclick = () => {
      const rect = button.getBoundingClientRect();
      dropdownContainer.style.left = `${rect.left}px`;
      dropdownContainer.style.top = `${rect.bottom + window.scrollY + 8}px`; // 5px below the button
      const isVisible = dropdownContainer.style.display === "block";
      dropdownContainer.style.display = isVisible ? "none" : "block";
    };

    // Handle form submission
    dropdownContainer.addEventListener("click", (event) => {
      if (event.target.id === "submitForm") {
        const message = dropdownContainer.querySelector("#noteInput").value;
        const userName = dropdownContainer.querySelector("#userName").value;
        const userId = dropdownContainer.querySelector("#userId").value;
        const profilePic = document.querySelector(
          `img[alt="${userName}"]`
        )?.src;
        const headline = document.querySelector(
          "[data-generated-suggestion-target]"
        )?.innerText;

        const data = { userName, userId, profilePic, headline, message };

        console.log("Form submitted:", data);

        // Save the data in chrome.storage.local
        chrome.storage.local.set({ [userId]: data }, () => {
          console.log("Form data saved to chrome.storage:", data);

          // Show or hide the red badge
          badge.style.display = message.trim() ? "block" : "none";

          dropdownContainer.style.display = "none"; // Close dropdown
        });
      }

      // Close dropdown when clicking cancel button
      if (event.target.id === "closeForm") {
        dropdownContainer.style.display = "none";
      }
    });

    // Append dropdown to body and button to the target div
    document.body.appendChild(dropdownContainer);
    parentDivs[0].appendChild(button);
  }
}

// Observe changes to detect when the target div appears
const observer = new MutationObserver(addButton);
observer.observe(document.body, { childList: true, subtree: true });

// Try adding the button immediately in case the div is already available
addButton();
