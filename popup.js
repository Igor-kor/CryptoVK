document.addEventListener('DOMContentLoaded', function () {

    var pass = document.getElementsByClassName('key')[0];
    pass.addEventListener('blur', function () {
        pass.type = 'password';
    });
    pass.addEventListener('focus', function () {
        pass.type = 'text';
    });

    chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
        var location = tabs[0].url;
        //если это не страница с сообщениями то скроем блок
        if (location.search(/https:\/\/vk\.com\/im\?[a-zA-Z0-9\=\_\&]+sel/) == -1) {
            document.getElementsByClassName('passblock')[0].style.display = 'none';
        } else {
            var params = location
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
            document.getElementsByClassName('key')[0].value = localStorage[params['sel'] + "key"];
            document.getElementsByClassName('hashbtn')[0].onclick = function () {
                var hash = sha256.create();
                hash.update(document.getElementsByClassName('key')[0].value);
                localStorage[params['sel'] + "key"] = document.getElementsByClassName('key')[0].value;
                localStorage[params['sel'] + "keysha256"] = hash.hex();
            };
        }

    });
});

