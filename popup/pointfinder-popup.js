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

// Stores data about each airline for display
const airlineDetails = {
    'AAL': {
        displayName: 'American Airlines'
    },
    'DAL': {
        displayName: 'Delta Air Lines'
    },
    'LUV': {
        displayName: 'Southwest Airlines'
    },
    'UAL': {
        displayName: 'United Airlines'
    }
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
    // create a template from the original html file
    let listTemplate = listItem.cloneNode(true);
    // keep a blank copy of the template for each deal
    let placeholder = listTemplate.cloneNode(true);
    listNode.removeChild(listItem); // remove the template node
    for (let i = 0; i < promos.length; i++) {
        let deal = promos[i];
        // update displayed Airline Name
        let airlineName = airlineDetails[deal.airline].displayName;
        let span = listTemplate.firstElementChild;
        span.innerText = airlineName;
        // update deal link and details
        let a = span.nextElementSibling;
        a.href = deal.href;
        a.innerHTML = deal.value;
        // add new deal to the list
        listNode.append(listTemplate);
        // reset the template to blank
        listTemplate = placeholder.cloneNode(true);
    }
    // display the list
    listNode.classList.remove("hidden");
}

let promos = getPromos();
build(promos);