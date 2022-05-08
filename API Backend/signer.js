const ethers = require('ethers');
var privateKey = new Buffer.from('private', 'hex') //replace with private key

var rawTx = {
    data: "0x64cb560c",
    to: "0x5aFb61114Fd5Cc1cDdcBA49026336D15d1539A62",
    chainId: 3,
    gasPrice: "0x6fb5d31f",
    gasLimit: 50000,
    nonce: 57
}

const walletX = new ethers.Wallet(privateKey);

walletX.signTransaction(rawTx).then(x=>console.log(x))