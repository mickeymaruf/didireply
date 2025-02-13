chrome.action.onClicked.addListener(function (tab) {
  // Check if the tab is already in the right state
  if (tab.url && tab.url.includes("linkedin.com")) {
    // Open the side panel on click
    chrome.sidePanel.setOptions({
      // Display the side panel with your content
      path: "sidepanel.html",
      enabled: true,
    });
  }
});
