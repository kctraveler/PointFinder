let reportError = (error) => {
    console.error(`Error running extension: ${error}`);
}

let reportExecuteScriptError = (error) => {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute PointFinder Content Script: ${error.message}`);
}
let showSuccess = () => {
    document.getElementById("current_page").innerText = "Success!!!";
}

browser.tabs.executeScript({
        file: "pointfinder.js"
    })
    .then(showSuccess)
    .catch(reportExecuteScriptError);