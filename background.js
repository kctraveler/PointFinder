/**
 * Background script runs continuously from time add-on is loaded
 * Listens for messages from content scripts and updates the browser_action.
 */
browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type = "has_deals") {
        let senderId = sender.tab.id;
        let url = sender.tab.url;
        console.log(`MESSAGE RECEIVED\n` +
            `Type: ${message.type}\nFrom Id: ${senderId}\nURL: ${url}`);
        //TODO add evaluation for the page for deals.
        if (url === "https://github.com/") {
            browser.browserAction.setBadgeText({
                text: "!",
                tabId: senderId
            });
            browser.browserAction.setBadgeBackgroundColor({
                color: "red",
                tabId: senderId
            });
            browser.browserAction.setBadgeTextColor({
                color: "white",
                tabId: senderId
            });
        } else {
            browser.browserAction.setBadgeText({
                text: "",
                tabId: senderId
            });
            browser.browserAction.setBadgeBackgroundColor({
                color: null,
                tabId: senderId
            });
            browser.browserAction.setBadgeTextColor({
                color: null,
                tabId: senderId
            });
        }
    }
})