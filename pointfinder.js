/**
 * Content Script added to all webpages.
 * When the page is loaded, a message is sent to the background script
 * to update the browser_action.
 */

let sendPageDetails = async () => {
    try {
        let message = {
            "type": 'has_deals'
        };
        await browser.runtime.sendMessage(message);
    } catch (error) {
        console.error('no reply of page details');
    }
};

sendPageDetails().then(console.log("POINT_FINDER: Message Sent"));