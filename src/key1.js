let cryptico = require('cryptico');
let key = { "coeff": "edbcd4a0", "d": "a54feb0e802931fb", "dmp1": "aa7e8db3", "dmq1": "a57ab0c7", "e": "3", "n": "f7f7e097b833a8af", "p": "ffbdd48d", "q": "f838092b" };
let rsa = new cryptico.RSAKey();
rsa.setPrivateEx(key.n, key.e, key.d, key.p, key.q, key.dmp1, key.dmq1, key.coeff);
module.exports = rsa