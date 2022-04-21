/**
 * Background script runs continuously from time add-on is loaded
 * Listens for messages from content scripts and updates the browser_action.
 */
const baseUri = 'http://localhost:3000/';

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type = "has_deals") {
        let senderId = sender.tab.id;
        let url = sender.tab.url;
        console.log(`MESSAGE RECEIVED\n` +
            `Type: ${message.type}\nFrom Id: ${senderId}\nURL: ${url}`);
        //TODO replace with evaluation of the url for a merchant id or send host to the backend
        let merchantId = 0;
        if (url === 'https://www.adidas.com/us') {
            merchantId = 1;
        }
        // Make the request to backend to get deals for that merchantId
        updateTab(senderId, merchantId);

    }
})

/******************************************************************************
 * HELPER FUNCTIONS
 */
// Makes a synchronous get request. Callback handles the response.

const getRequest = (urlPath, callback) => {
    console.log(`Making request to ${urlPath}`);
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(this.status);
    }
    xhr.open('GET', urlPath, true);
    xhr.send(null);
}

//Update the browserAction button to indicate a deal was found
const alertDeal = (tabId) => {
    browser.browserAction.setBadgeText({
        text: "!",
        tabId: tabId
    });
    browser.browserAction.setBadgeBackgroundColor({
        color: "red",
        tabId: tabId
    });
    browser.browserAction.setBadgeTextColor({
        color: "white",
        tabId: tabId
    });
}

// Reset the browserAction button to show a deal was not found. 
const resetAlert = (tabId) => {
    browser.browserAction.setBadgeText({
        text: "",
        tabId: tabId
    });
    browser.browserAction.setBadgeBackgroundColor({
        color: null,
        tabId: tabId
    });
    browser.browserAction.setBadgeTextColor({
        color: null,
        tabId: tabId
    });
}

// used as a callback to call appropriate browserAction update.
const updateTab = (tabId, merchantId) => {
    getRequest(`${baseUri}deals/${merchantId}`, (status) => {
        status == 200 ? alertDeal(tabId) : resetAlert(tabId);
    });
}