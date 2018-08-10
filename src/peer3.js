let smoke = require('smokesignal');
let cryptico = require('cryptico');
let SHA256 = require("crypto-js/sha256");
const PassPhrase = "ToDaMoon";

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
  console.log(chunk.toString());
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


node.start()