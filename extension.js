/*
    This event triggers when the browser has committed to loading a webpage.
    As opposed to e.g. webNavigation.onCompleted, this will start to run early
    so that we can begin to remove ads as soon as possible.
*/
chrome.webNavigation.onCommitted.addListener(function (tab) {
    console.log("EVENT:", tab);
    console.log("Bar");
    // Prevents script from running when other frames load
    if (tab.frameId == 0) {

        console.log("MAIN FRAME");
        console.log(JSON.stringify(tab, null, 2));
        console.log("tab.url =", tab.url);
        console.log("tabId =", tab.tabId);

    let url = tab.url;
            // Remove unnecessary protocol definitions and www subdomain from the URL
            let parsedUrl = url.replace("https://", "")
                .replace("http://", "")
                .replace("www.", "")

            // Remove path and queries e.g. linkedin.com/feed or linkedin.com?query=value
            // We only want the base domain
            let domain = parsedUrl.slice(0, parsedUrl.indexOf('/') == -1 ? parsedUrl.length : parsedUrl.indexOf('/'))
                .slice(0, parsedUrl.indexOf('?') == -1 ? parsedUrl.length : parsedUrl.indexOf('?'));

            try {
                if (domain.length < 1 || domain === null || domain === undefined) {
                    return;
                } else if (domain == "linkedin.com") {
                    console.log("Linkedin Detected");
                    runLinkedinScript(tab.tabId);
                    return;
                }
            } catch (err) {
                throw err;
            }

        };
});

function runLinkedinScript(targetTabId) {
    console.log("RUNNNNNNNNNN");
    // Inject script from file into the webpage
    chrome.scripting.executeScript({
        target: { tabId: targetTabId },
        files: ['linkedin.js']
    });
    return true;
}
