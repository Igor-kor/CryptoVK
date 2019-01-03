var params = getUrlParam();
var keyhash = getHashFromString();

// Получаем хэш для текущего диалога
var promise = new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(window.extentioncryptovkid, {
        "method": "hash",
        "key": params['sel']
    }, function(value){resolve(value)}
);
});

// Сохраняем хэш и запускаем главную функцию
promise.then(
    result => {
    keyhash = getHashFromString(result);
    endis();
});


// Возвращает параметры из урла
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

// Запускает главную функцию либо кликает по ссылке на этот диалог, для сбрасывания всех расшифрованных сообщений
function checkboxCheck(value) {
        chrome.runtime.sendMessage(window.extentioncryptovkid, {
            "method": "set",
            "key": params['sel'],
            "value": value
        });
        if (value) {
            endis();
        } else {
            document.getElementsByClassName('ui_rmenu_item_sel')[0].click();
        }
}

// Расшифровывает все сообщения
function decrypt(keyhash) {
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

// Главная фунция, проверяет включено шифрование и делает все преобразования
function endis() {
    params = getUrlParam();
    var promise = new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(window.extentioncryptovkid, {
                "method": "get",
                "key": params['sel']
            },  function(value){resolve(value)}
        );
    });

    promise.then(
        result => {
            var oldsel = params['sel'];
            params = getUrlParam();
            if (params['sel'] != oldsel) {
                endis();
            }
            var checkedvk = (result === 'true');
            var check = checkedvk ? 'checked' : '';
            var checkbox = document.getElementsByClassName('ios8-switch');
            var title = document.getElementsByClassName('im-page--title-main-in')[0];
            // если чекбокс не отрисован то отрисуем
            if (checkbox.length == 0) {
                title.innerHTML = title.innerHTML +
                    "<input hidden type='checkbox' class='ios8-switch ios8-switch-sm' id='checkbox-100' onchange='checkboxCheck(this.checked)' " + check + "><label for='checkbox-100'>CryptoVK</label>";
                // заного получим отрисованный чекбокс
                checkbox = document.getElementsByClassName('ios8-switch');
            }
            // С интервалом вызываем главную функцию
            window.intervalcrypt = setInterval(function () {
                if (checkbox.length == 0) {
                    endis();
                    clearInterval(window.intervalcrypt);
                }
                else if (checkbox[0].checked) {
                    decrypt(keyhash);
                }
            }, 1000);
            // если включено шифрование то делаем зашифровывание текста если нет то снимаем все обработчики
            var buttonsend = document.getElementsByClassName('im-send-btn')[1];
            var textareasend = document.getElementsByClassName('im-chat-input--text')[0];
            var temptext = "";
            if (checkedvk) {
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
                textareasend.onblur = function () {
                };
                textareasend.onfocus = function () {
                };
                buttonsend.onclick = function () {
                };
            }
        }
    );
}