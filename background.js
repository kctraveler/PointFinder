/**
 * Background script runs continuously from time add-on is loaded
 * Listens for messages from content scripts and updates the browser_action.
 */
//const baseUri = 'http://localhost:3000/';
const baseUri = 'https://point-finder.herokuapp.com/'

const getRequest = (urlPath, callback) => {
    console.log(`Making request to ${urlPath}`);
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        callback(this);
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


/**
 * Updates the extension components according to the deal
 */
const updateBrowser = (tabId, domain) => {
    if (!domain) {
        resetAlert(tabId);
        return false;
    }
    getRequest(`${baseUri}merchant/${domain}`, (res) => {
        let status = res.status;
        if (status === 200) {
            alertDeal(tabId);
            return JSON.parse(res.responseText)
        } else {
            resetAlert(tabId)
            return false;
        }
    });
}

browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'get_promos') {
        let senderId = sender.tab.id;
        let url = sender.tab.url;
        console.log(`MESSAGE RECEIVED\n` +
            `Type: ${message.type}\nFrom Id: ${senderId}\nURL: ${url}`);
        const regEx = new RegExp('[0-9a-zA-Z\-]*(?=(\.com\/|\.org\/))');
        let domain = regEx.exec(url);
        if (domain) {
            domain = domain[0];
        } else {
            domain = null;
        }
        return updateBrowser(senderId, domain);
    }
})