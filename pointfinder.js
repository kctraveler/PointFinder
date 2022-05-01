/**
 * Content Script added to all webpages.
 * When the page is loaded, a message is sent to the background script
 * to update the browser_action.
 */
let requestPromoDetails = async () => {
    try {
        let message = {
            "type": 'get_promos'
        };
        return browser.runtime.sendMessage(message);
    } catch (error) {
        console.error('no reply of page details');
    }
};

let promoDetails = requestPromoDetails();


browser.runtime.onMessage.addListener(message => {
    if (!message.type == 'promo_request') return false;
    console.log(`PointFinder Browser Action Clicked\nSending promo details`);
    return promoDetails;
})