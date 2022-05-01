/**
 * Popup-script run when user clicks the browserAction.
 * @author Shane Panchot
 */

/**
 * shortcut to get element by id.
 */
let $ = (id) => {
    return document.getElementById(id)
};

/**
 * Get the ID of the current tab.
 * @returns {Promise} - the int id of the active tab.
 */
const getId = async () => {
    let tabId = await browser.tabs.query({
        active: true
    });
    tabId = tabId[0].id;
    return tabId;
};

/**
 * Request promotions from content script for active tab
 * @returns {Promise} the reply from the message to get promos
 */
const getPromos = async () => {
    let tabId = await getId();
    let message = {
        type: "promo_request"
    };
    try {
        let promosResponse = browser.tabs.sendMessage(tabId, message);
        return promosResponse;
    } catch (e) {
        console.error(`POPUP:\n${e}`);
    }
}

const airlineNames = {
    'AAL': 'American Airlines',
    'DAL': 'Delta Air Lines',
    'LUV': 'Southwest Airlines',
    'UAL': 'United Airlines'
};

/**
 * Build the HTML for the promos response
 * @param {Promise} promosResponse response object for the promotions
 */
let build = async (promosResponse) => {
    let res = await promosResponse;
    if (res.status != 200) return;
    let merchant = JSON.parse(res.responseText);
    let promos = merchant.deals;
    // Update placeholder headers if promos available. 
    if (promos.length > 0) {
        $('no_promos').classList.add("hidden");
        $('available').classList.remove("hidden");
    }
    // Add promotions to the list
    let listNode = $('promotions');
    let listItem = document.querySelector('.promo');
    let listTemplate = listItem.cloneNode(true);
    listNode.removeChild(listItem);
    for (let i = 0; i < promos.length; i++) {
        let deal = promos[i];
        let airlineName = airlineNames[deal.airline];
        console.log(listTemplate);
        let span = listTemplate.firstElementChild;
        span.innerText = airlineName;
        let a = span.nextElementSibling;
        a.href = deal.href;
        a.innerHTML = deal.value;
        listNode.append(listTemplate);
        listTemplate = listTemplate.cloneNode(true);
    }
    console.log(listNode.childNodes);
    listNode.classList.remove("hidden");
}


let promos = getPromos();
build(promos);