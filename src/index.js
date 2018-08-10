let smoke = require('smokesignal');
let cryptico = require('cryptico');
let SHA256 = require("crypto-js/sha256");

const PassPhrase = "ToDaMoon";
const shareKey = cryptico.generateRSAKey(PassPhrase, 1024);
const sharePublicKey = cryptico.publicKeyString(shareKey); 

// ========== ========== ========== ========== ========== ========== ========== ========== ========== ==========

let masterKey = require('./key1');
let address = cryptico.publicKeyString(masterKey);
console.log('Your address is: ', address)


let node = smoke.createNode({
  port: 2018
  , address: smoke.localIp('192.168.102.1/255.255.255.0')
  , seeds: [{ port: 2018, address: '192.168.102.143' }]
});

let numOfNodes = 1;

node.peers.on('add', () => {
  numOfNodes = numOfNodes + 1;
  console.log("Nodes Connected: ", numOfNodes);
})

node.peers.on('remove', () => {
  numOfNodes = numOfNodes - 1;
  console.log("Nodes Connected: ", numOfNodes);
})



// ========== ========== ========== ========== ========== ========== ========== ========== ========== ==========
function sign(msg) {
  return cryptico.encrypt(msg, address, masterKey);
}

function checkSignature(from, sign) {
  return cryptico.decrypt(sign, shareKey).publicKeyString == from;
} 

let bettingTable = {};

function BettingOnBlock(hash) {
  if(bettingTable[hash]) {
    bettingTable[hash][address] = 1000;
  } else {
    bettingTable[hash] = {};
    bettingTable[hash][address] = 1000;
  };
  let bmsg = {
    block: hash,
    amount: 1000
  };
  let ens = cryptico.encrypt(SHA256(bmsg).toString(), sharePublicKey, masterKey).cipher;
  let msg = JSON.stringify(['betting', [bmsg, ens]])
  node.broadcast.write(msg)
  console.log(bettingTable);
}

node.broadcast.on('data', (chunk) => {
  let data = JSON.parse(chunk.toString());
  if (data[0] === 'block') {
    let block = data[1];
    let payload = JSON.parse(block.data);
    let transaction = JSON.parse(payload[0]);
    let sign = payload[1];
    if (checkSignature(transaction["from"], sign)) {
      // Do Some Check in the historical block
      // It is the right deal because 'llAx2IKfjrk=' have enough money
      BettingOnBlock(block.hash);
    }
  } else if (data[0] == "betting") {
    let playerAddress = cryptico.decrypt(data[1][1], shareKey).publicKeyString;
    let betData = data[1][0];
    let hash = betData.block;
    let amount = betData.amount;
    if(bettingTable[hash]) {
      bettingTable[hash][playerAddress] = amount;
    } else {
      bettingTable[hash] = {};
      bettingTable[hash][playerAddress] = amount;
    };
    console.log(bettingTable);
  } else if (data[0] == "sync") {

  }
  // res = cryptico.decrypt(data[1], shareKey);
})


//  ========== ========== ========== ========== ========== ========== ========== ========== ========== ==========

function calculateHash(index, previousHash, timestamp, data) {
  return SHA256(index + previousHash + timestamp + data).toString();
}
const chain = [];
class Block {
  constructor(index, previousHash, timestamp, data, hash) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
  }
}
const ledger = [
  {
    from: null,
    to: "9/fgl7gzqK8=",
    amount: 1000
  },
  {
    from: null,
    to: "pQSnPTWBdKE=",
    amount: 1000
  },
  {
    from: null,
    to: "llAx2IKfjrk=",
    amount: 1000
  }
];

const genesis = new Block(
  0,
  "0",
  1533900032282,
  JSON.stringify(ledger),
  calculateHash(0, "0", 1533900032282, JSON.stringify(ledger)));

chain.push(genesis);

node.start()
