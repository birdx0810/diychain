let cryptico = require('cryptico');
let key = { "coeff": "55882232", "d": "6435768f4c6810c3", "dmp1": "9f59c8f7", "dmq1": "6b533017", "e": "3", "n": "965031d8829f8eb9", "p": "ef06ad73", "q": "a0fcc823" };
let rsa = new cryptico.RSAKey();
rsa.setPrivateEx(key.n, key.e, key.d, key.p, key.q, key.dmp1, key.dmq1, key.coeff);
module.exports = rsa