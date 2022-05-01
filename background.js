/**
 * Background script runs continuously from time add-on is loaded
 * Listens for messages from content scripts and updates the browser_action.
 */
//const baseUri = 'http://localhost:3000/';
const baseUri = 'https://point-finder.herokuapp.com/'

/**
 * Makes a get request and returns a promise.
 * @param {String} urlPath - URL to make get request to
 */
const getRequest = (urlPath) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', urlPath, true);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                    status: xhr.status,
                    responseText: xhr.response
                });
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        }
        xhr.onerror = () => {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

/**
 * Sets an alert on the BrowserAction button for the given id.
 * @param {int} tabId - the id of the tab to set alert on
 */
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

/**
 * Removes alert on BrowserAction for given tabid.
 * @param {int} tabId - id of the tab to remove alert
 */
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
 * Updates browser alerts and responds with promo details
 * @param {int} tabId - id of tab being updated
 * @param {Promise} response Promise from a getRequest
 */
const updateBrowser = async (tabId, response) => {
    let res = await response;
    console.log(res);
    if (res.status === 200) {
        alertDeal(tabId);
        console.log(200)
    } else {
        resetAlert(tabId)
    }
}

/**
 * Gets the available promotions from the backend api for the 
 * tabs url. 
 * @param {String} tabUrl - the url of the users tab.
 * @return {Promise} Promise from the get request.
 */
let getPromos = async (tabUrl) => {
    const regEx = new RegExp(/(?!www)\b(\w+\.{0,1})[0-9a-zA-Z\-]*(?=(\.com[$/.\*]|\.org[$/.\*]|\.net[$/.\*]))/);
    let tabDomain = regEx.exec(tabUrl);
    if (tabDomain) {
        tabDomain = tabDomain[0];
        let url = `${baseUri}merchant/${tabDomain}`;
        return getRequest(url)
    } else {
        return false;
    }
}

/**
 * Handles messages from the content script requesting available promotions
 * for the tabs URL.
 * Updates the Browser Action alert
 * Returns a promise to the content script resolving to the status and text from
 * the request.
 */
browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === 'get_promos') {
        const senderId = sender.tab.id;
        const url = sender.tab.url;
        console.log(`MESSAGE RECEIVED\n` +
            `Type: ${message.type}\nFrom Id: ${senderId}\nURL: ${url}`);
        let resPromise = getPromos(url);
        updateBrowser(senderId, resPromise);
        return resPromise;
    }
})