function decryptText(value, keyhash) {
    value = value.replace(/\n/g, '');
    var encryptedBytes = aesjs.utils.hex.toBytes(value);
    var aesCtr = new aesjs.ModeOfOperation.ctr(keyhash, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

function cryptText(value, keyhash) {
    var textBytes = aesjs.utils.utf8.toBytes(value);
    var aesCtr = new aesjs.ModeOfOperation.ctr(keyhash, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
}

function getHashFromString(keyhash) {
    if (keyhash == undefined) {
        keyhash = "1234567890123456789012345678901234567890123456789012345678901234";
    }
    keyhash = keyhash.match(/\w{1,2}/g);
    keyhash.forEach(function (item, i, arr) {
        arr[i] = parseInt(item, 16);
    });
    return keyhash;

}