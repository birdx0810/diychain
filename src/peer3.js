let smoke = require('smokesignal');
let cryptico = require('cryptico');
let SHA256 = require("crypto-js/sha256");
const PassPhrase = "ToDaMoon";
let shareKey = cryptico.generateRSAKey(PassPhrase, 1024);
let sharePublicKey = cryptico.publicKeyString(shareKey); 

let masterKey = require('./key3');
let address = cryptico.publicKeyString(masterKey);
console.log('Your address is: ', address)

function sign(msg) {
  return cryptico.encrypt(msg, address, masterKey);
}

function calculateHash(index, previousHash, timestamp, data) {
  return SHA256(index + previousHash + timestamp + data).toString();
}

let node = smoke.createNode({
  port: 2020
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

node.broadcast.on('data', (chunk) => {
  let data = JSON.parse(chunk.toString());
  if (data.type === 'transaction') {
    if (isValid(data))
    checkIfFromHasEnoughMone
  } else {

  }
})

class Block {
  constructor(index, previousHash, timestamp, data, hash) {
    this.index = index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
  }
}

const genesis = new Block(
  0,
  "0",
  1533900032282,
  JSON.stringify([
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
  ]),
  calculateHash(0, "0", 1533900032282, JSON.stringify([
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
  ])));

node.on('connect', () => {
  let trans = JSON.stringify({
    from: 'llAx2IKfjrk=',
    to: 'pQSnPTWBdKE=',
    amount: 50
  });
  let ts = Date.now();
  let ens = cryptico.encrypt(SHA256(trans).toString(), sharePublicKey, masterKey).cipher;
  let block = new Block(
    1,
    genesis.hash,
    ts,
    JSON.stringify([trans, ens]),
    calculateHash(1, genesis.hash, ts, JSON.stringify([trans, ens]))
  );
  let msg = JSON.stringify(['block', block]);
  node.broadcast.write(msg);
})

node.start()