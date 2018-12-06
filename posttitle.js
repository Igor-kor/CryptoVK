function getUrlParam() {
    retparams = window
        .location
        .search
        .replace('?', '')
        .split('&')
        .reduce(
            function (p, e) {
                var a = e.split('=');
                p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            },
            {}
        );
    return retparams;
}

var params = getUrlParam();

function checkboxCheck(value) {
    chrome.runtime.sendMessage(window.extentioncryptovkid, {
        "method": "set",
        "key": params['sel'],
        "value": value
    }, function () {
    });
    if (value) {
        endis();
    } else {
        document.getElementsByClassName('ui_rmenu_item_sel')[0].click();
    }
}

chrome.runtime.sendMessage(window.extentioncryptovkid, {
    "method": "hash",
    "key": params['sel']
}, function (value) {
    var keyhash = getHashFromString(value);

    function decrypt() {
        var messagesObj = document.getElementsByClassName('im-mess--text');
        var messages = Array.from(messagesObj);
        messages.forEach(function (item, i, messages) {
            if (item.innerText.substring(0, 6) == "crypt:") {
                var text = item.innerText.substring(6) + "";
                item.innerHTML = '<div style="color: #000000; display: inline-block;">#</div><div style="color: #dd5a00; display: inline-block;">' + decryptText(text, keyhash) + '</div>';
                messagesObj[i].parentNode.setAttribute("style", "background-color: black;");
            }
        });
    }

    function endis() {
        params = getUrlParam();
        var checkedvk = false;
        chrome.runtime.sendMessage(window.extentioncryptovkid, {
            "method": "get",
            "key": params['sel']
        }, function (val) {
            var oldsel = params['sel'];
            params = getUrlParam();
            if (params['sel'] != oldsel) {
                endis();
            }
            checkedvk = val == 'true';
            var check = checkedvk ? 'checked' : '';
            var checkbox = document.getElementsByClassName('ios8-switch');
            var title = document.getElementsByClassName('im-page--title-main-in')[0];
            if (checkbox.length == 0) {
                title.innerHTML = title.innerHTML +
                    "<input hidden type='checkbox' class='ios8-switch ios8-switch-sm' id='checkbox-100' onchange='checkboxCheck(this.checked)' " + check + "><label for='checkbox-100'>CryptoVK</label>";
            }
            checkbox = document.getElementsByClassName('ios8-switch');
            window.intervalcrypt = setInterval(function () {
                if (checkbox.length == 0) {
                    endis();
                    clearInterval(window.intervalcrypt);
                }
                else if (checkbox[0].checked) {
                    decrypt();
                }
            }, 1000);
            if (checkedvk) {
                var buttonsend = document.getElementsByClassName('im-send-btn')[1];
                var textareasend = document.getElementsByClassName('im-chat-input--text')[0];
                var temptext = "";

                textareasend.onblur = function () {
                    temptext = textareasend.innerText;
                    textareasend.innerText = "crypt:" + cryptText(textareasend.innerText, keyhash);
                };

                textareasend.onfocus = function () {
                    textareasend.innerText = temptext;
                };

                buttonsend.onclick = function () {
                    temptext = "";
                };
            }
            else {
                var buttonsend = document.getElementsByClassName('im-send-btn')[1];
                var textareasend = document.getElementsByClassName('im-chat-input--text')[0];
                textareasend.onblur = function () {
                };
                textareasend.onfocus = function () {
                };
                buttonsend.onclick = function () {
                };
            }
        });
    }

    endis();
});