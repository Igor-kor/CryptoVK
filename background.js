var filter = {
    url:
        [
            {hostContains: "vk.com"},
            {hostPrefix: "im*"}
        ]
};

chrome.runtime.onMessageExternal.addListener(function(request, sender, callback) {
    if(request.method == "get"){
        callback(window.localStorage.getItem(request.key));
    }
    if(request.method == "set"){
        window.localStorage.setItem(request.key, request.value);
        callback(window.localStorage.getItem(request.key));
    }
    if(request.method == "hash"){
        callback(window.localStorage.getItem(request.key+"keysha256"));
    }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    chrome.tabs.executeScript(null, {file: "content_script.js"});
    chrome.tabs.insertCSS(null,{file:"style.css"});
},filter);

