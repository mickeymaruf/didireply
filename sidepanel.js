document.addEventListener("DOMContentLoaded", function () {
  const notesContainer = document.getElementById("notesContainer");
  const searchInput = document.getElementById("searchNoteInput");

  const displayNotes = (notesArray) => {
    notesContainer.innerHTML = ""; // Clear existing notes

    notesArray.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.classList.add("note");

      noteElement.innerHTML = `
        <a href="https://www.linkedin.com${note.username}" target="_blank" style="display:flex; text-decoration: none; color: #000000;">
          <img src="${note.profilePic}" alt="${note.name}" width="40" height="40" style="border-radius: 50%; vertical-align: middle; margin-right: 8px;">
          <div>
            <strong style="font-size: 14px;">${note.name}</strong> 
            <p style="margin: 0; margin-top: 5px;">${note.headline}</p>
          </div>
        </a>
        <p>${note.message}</p>
      `;

      // Delete button
      const noteDeleteBtnElement = document.createElement("button");
      noteDeleteBtnElement.innerText = "Delete";
      noteDeleteBtnElement.onclick = () => {
        chrome.storage.local.remove(note.username, () => {
          console.log("Note deleted:", note.username);
          location.reload();
        });
      };
      noteElement.appendChild(noteDeleteBtnElement);

      notesContainer.appendChild(noteElement);
    });
  };

  // Fetch and display all notes initially
  chrome.storage.local.get(null, (data) => {
    let notesArray = Object.values(data)
      .filter((note) => note.createdAt)
      .sort((a, b) => b.createdAt - a.createdAt); // Sort in descending order (newest first)

    // Display all notes by default
    displayNotes(notesArray);

    // Search functionality
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();

      const filteredNotes = notesArray.filter(
        (note) => note.name.toLowerCase().includes(searchTerm) // Match the name of the note
      );

      displayNotes(filteredNotes); // Display filtered notes
    });
  });
});
