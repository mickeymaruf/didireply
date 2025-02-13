document.addEventListener("DOMContentLoaded", function () {
  const notesContainer = document.getElementById("notesContainer");

  // Retrieve saved notes from chrome.storage
  chrome.storage.local.get(null, (data) => {
    // Iterate over each saved note and create a UI for it
    for (const key in data) {
      if (data[key]) {
        const note = data[key];
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");

        // Display the user data and message
        noteElement.innerHTML = `
          <a href="https://www.linkedin.com${note.userId}" target="_blank" style="display:flex; text-decoration: none; color: #000000;">
            <img src="${note.profilePic}" alt="${note.userName}" width="40" height="40" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
            <div>
              <strong style="font-size: 14px;">${note.userName}</strong> 
              <p style="margin: 0; margin-top: 5px;">${note.headline}</p>
            </div>
          </a>
          <p>${note.message}</p>
        `;

        // delete button
        const noteDeleteBtnElement = document.createElement("button");
        noteDeleteBtnElement.innerText = "Delete";
        noteDeleteBtnElement.onclick = () => {
          // delete note from storage
          chrome.storage.local.remove(note.userId, () => {
            console.log("Note deleted:", note.userId);
            // Refresh the popup after deletion
            location.reload();
          });
        };
        noteElement.appendChild(noteDeleteBtnElement);
        //

        notesContainer.appendChild(noteElement);
      }
    }
  });
});
