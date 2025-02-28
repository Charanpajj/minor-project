chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "notify") {
    const notificationMessage = request.message || "A fee has been found on the page.";

    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("demo.png"), 
      title: "Add-On Prices Detected",
      message: notificationMessage,
      priority: 2,
      requireInteraction: true 
    }, function(notificationId) {
      console.log("Notification shown with ID:", notificationId);
    });
  }
});
