console.log("Background logs here");
browser.runtime.onMessage.addListener((message) => {
    console.log(`message received: ${message}`);
    if (message.type === 'has_deals' & message.host === "github.com") {
        //TODO Run the check to see if deals exist
        browser.browserAction.setBadgeText({text: "!"});
    }  else {
        browser.browserAction.setBadgeText({text: ""});
        console.error("Couldn't evaluate message");
    }
})
