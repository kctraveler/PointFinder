let sendPageDetails = async () => {
    try {
       const URL = location.hostname;
       let message = {
        "type": 'has_deals',
        "host": URL
        };
        console.error(message);
       await browser.runtime.sendMessage(message);
       return;
    } catch(error){
        console.error('no reply of page details');
    }
};

sendPageDetails().then(console.log("Script Called"));