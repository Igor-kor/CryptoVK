function addScript(src) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false; // чтобы гарантировать порядок
    script.charset = "utf8";
    document.head.appendChild(script);
}
function addScriptText(text) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = text;
    document.head.appendChild(script);
}
function addCSS(src) {
    var link = document.createElement('link');
    link.href = src;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
}
addScriptText("window.extentioncryptovkid = '"+chrome.runtime.id+"';");
addCSS(chrome.extension.getURL('/style.css'));
addScript(chrome.extension.getURL('aes-js/index.js'));
addScript(chrome.extension.getURL('/crypt.js'));
addScript(chrome.extension.getURL('/posttitle.js'));


