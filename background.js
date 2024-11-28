
chrome.runtime.onInstalled.addListener(() => {
    // Check if user is already registered
    chrome.storage.local.get("userRegistered", (data) => {
        if (!data.userRegistered) {
            setTimeout(() => {
                // Redirect to registration page if not registered
                chrome.tabs.create({ url: 'introduction.html' });
            }, 2000); // 2000ms = 2 seconds delay
        }
    });
});

