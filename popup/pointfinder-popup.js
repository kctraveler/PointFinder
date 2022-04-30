/**
 * Popup-script run when user clicks the browserAction.
 */
/**
 * Get the ID of the current tab.
 * @returns {Promise} - promise resolving to an integer.
 */
const getId = async () => {
    let tabId = await browser.tabs.query({
        active: true
    });
    tabId = tabId[0].id;
    return tabId;
};

const getPromos = async () => {
    let tabId = await getId();
    let message = {
        type: "promo_request"
    };
    try {
        let promos = await browser.tabs.sendMessage(tabId, message);
        console.log(promos);
    } catch (e) {
        console.error(e);
    }
}



getPromos();