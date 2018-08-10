let cryptico = require('cryptico');
let masterRSAkey = cryptico.generateRSAKey("ToDaMoon1", 64);
console.log(cryptico.publicKeyString(masterRSAkey));
console.log(JSON.stringify(masterRSAkey.toJSON()));
