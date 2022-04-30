let reportExecuteScriptError = (error) => {
    document.querySelector("#popup_content").classList.add("hidden");
    document.querySelector("#error_content").classList.remove("hidden");
    console.error(`Failed to execute PointFinder Content Script: ${error.message}`);
}


browser.tabs.executeScript({
        file: "pointfinder.js"
    })
    .then(showSuccess)
    .catch(reportExecuteScriptError);