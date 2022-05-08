const express = require("express");
const app = express();
const ethers = require("ethers");

//host:port
const port = 3100;

//Contract Data
const rinkebyAddress = "0x5afb61114fd5cc1cddcba49026336d15d1539a62";
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "EventTime",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "eventType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct StakingContract.Stake",
        name: "stake",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "blockTime",
        type: "uint256",
      },
    ],
    name: "NewStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "EventTime",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "eventType",
            type: "uint8",
          },
        ],
        indexed: false,
        internalType: "struct StakingContract.Stake",
        name: "stake",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "blockTime",
        type: "uint256",
      },
    ],
    name: "Unstake",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "GetStakingHistory",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "EventTime",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "eventType",
            type: "uint8",
          },
        ],
        internalType: "struct StakingContract.Stake[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "SetStakingToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "StakeToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "StakingBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "StakingEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "StakingHistory",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "EventTime",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "eventType",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ToggleStaking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "UnstakeToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

//connect to ropsten websocket
var provider = new ethers.providers.InfuraProvider(
  "ropsten", "60a516d622f64ec9910b60d9fe295a06"
);
//connect to contract
let contract = new ethers.Contract(rinkebyAddress, CONTRACT_ABI, provider);

//Create Classes
class Stake {
  constructor(staker, amount, timestamp, eventtype = undefined) {
    this.staker = staker;
    this.timestamp = timestamp;
    this.amount = amount;
    this.eventtype = eventtype
  }
}

class Wallet {
  constructor(wallet, amount, stakeTimestamp, unstakeTimestamp) {
    this.wallet = wallet;
    this.stakedamount = amount;
    this.stakingtimestamp = stakeTimestamp;
    this.unstakingtimestamp = unstakeTimestamp;
  }
}

//utils
String.prototype.replaceAll = function(search, replace) {
  if (replace === undefined) {
      return this.toString();
  }
  return this.split(search).join(replace);
  }

// host:3000/GetStakingEvents => JSON encoded list of all stakes and their info
app.get("/GetStakingEvents", async (req, res) => {
  var _response = [];
  await contract.queryFilter("NewStake").then((x) => {
    x.forEach(function (element) {
      var stake = new Stake(
        element.args[2][0],
        element.args[2][1] / Math.pow(10, 18),
        ethers.BigNumber.from(element.args[2][2]).toNumber()
      );
      _response.push(stake);
    });
  });
  res.send(JSON.stringify(_response));
});

// host:3000/GetUnstakingEvents => JSON encoded list of all stakes and their info
app.get("/GetUnstakingEvents", async (req, res) => {
  var _response = [];
  await contract.queryFilter("Unstake").then((x) => {
    x.forEach(function (element) {
      var stake = new Stake(
        element.args[2][0],
        element.args[2][1] / Math.pow(10, 18),
        ethers.BigNumber.from(element.args[2][2]).toNumber()
      );
      _response.push(stake);
    });
  });
  res.send(JSON.stringify(_response));
});


// host:3000/GetAllWallets => JSON encoded list of all wallets and their info
app.get("/GetAllWallets", async (req, res) => {
  var FinalResponse = [];
  var _response = [];
  await contract.queryFilter("NewStake").then((x) => {
    x.forEach(function (element) {
      var stake = new Stake(
        element.args[2][0],
        element.args[2][1] / Math.pow(10, 18),
        ethers.BigNumber.from(element.args[2][2]).toNumber(),
        element.args[2][3]
      );
      _response.push(stake);
    });
  });
  await contract.queryFilter("Unstake").then((x) => {
    x.forEach(function (element) {
      var stake = new Stake(
        element.args[2][0],
        element.args[2][1] / Math.pow(10, 18),
        ethers.BigNumber.from(element.args[2][2]).toNumber(),
        element.args[2][3]
      );
      _response.push(stake);
    });
  });


  result = _response.reduce(function (r, a) {
    r[a.staker] = r[a.staker] || [];
    r[a.staker].push(a);
    return r;
  }, Object.create(null));

  const groupedStakes = Object.values(JSON.parse(JSON.stringify(result)));

  groupedStakes.forEach(function(el) {
    var totalStaked = 0;
    var totalUnstaked = 0;
    var stakingTimestamps = []
    var unstakingTimestamps = [];
    el.forEach(function(ele) {
      if (ele.eventtype == 0) {
        totalStaked += ele.amount;
        stakingTimestamps.push(ele.timestamp)
      } else {
        totalUnstaked += ele.amount;
        unstakingTimestamps.push(ele.timestamp)
      }
    })

    var wallet = new Wallet(el[0].staker, totalStaked-totalUnstaked, stakingTimestamps, unstakingTimestamps)

    FinalResponse.push(wallet)
  })

  res.send(JSON.stringify(FinalResponse).replaceAll("stakedamount", "staked-amount").replaceAll("stakingtimestamp", "staking-timestamp").replaceAll("unstakingtimestamp", "unstaking-timestamp"));
});

//host:3100/admin/ToggleStakingCreateTransaction?address=0xc0016f4AE265f7311B4B6991a7aafc4052A8d3E7 => create transaction to be signed, replace address with your address, only valid for the owner
app.post("/admin/ToggleStakingCreateTransaction", async (req, res) => {
  const address = req.query.address;
  const owner = await contract.owner();
  if (owner != address) return res.send(`{"Error": "Invalid Address"}`)
  const unsignedTX = await contract.populateTransaction.ToggleStaking();
  unsignedTX.chainId = 3 //ropsten
  var gasPrice = await provider.getGasPrice();
  unsignedTX.gasPrice = gasPrice._hex;
  unsignedTX.gasLimit = 50000
  unsignedTX.nonce = await provider.getTransactionCount(address)
  res.send(unsignedTX);
});

//host:3100/admin/ToggleStakingCreateTransaction?tx=0xf86739846fb5d31f82c350945afb61114fd5cc1cddcba49026336d15d1539a62808464cb560c29a098ea8debe956587715cba5d6a1dcfa837ceb426b22795ec1d433059bf2919a6fa007365a8e683e70137f92561efa845730187892aed402645fd59f7985374f58dc => submit signed tx from previous transaction, replace tx with hex encoded tx, can use signer.js file in directory to sign.
app.post("/admin/ToggleStakingSubmitSignedTransaction", async (req, res) => {
  const tx = req.query.tx;
  const txSumbitted = await provider.sendTransaction(tx)
  res.send(`{ "hash": "${txSumbitted.hash}" }`);
});

//run API
app.listen(port, () => console.log("Running"));
