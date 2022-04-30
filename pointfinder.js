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

let run = async (promise) => {
    console.log(await promise);
}

run(promoDetails);

// browser.runtime.onMessage.addListener(message => {
//     if (!message.type == 'promo_request') return false;
//     console.log("BrowserAction Clicked. Sending promo details");
//     promos = await promoDetails;
//     console.log(promos);
//     return Promise.resolve({
//         response: promos
//     });
// })