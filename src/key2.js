let cryptico = require('cryptico');
let key = {"coeff":"b725f160","d":"6e031a27ba0b0b83","dmp1":"9bbb13bf","dmq1":"78902e7f","e":"3","n":"a504a73d358174a1","p":"e9989d9f","q":"b4d845bf"};
let rsa = new cryptico.RSAKey();
rsa.setPrivateEx(key.n, key.e, key.d, key.p, key.q, key.dmp1, key.dmq1, key.coeff);
module.exports = rsa