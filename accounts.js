const BIP39 = require("bip39") //To generate random seeds
const readlineSync = require('readline-sync') //To read from stdin
const hdkey = require('ethereumjs-wallet/hdkey') //To generate priv key
const Wallet = require('ethereumjs-wallet') //To derive pub key
const hash = require('./hash') //To hash the pub key, so we obtain the address
const EthereumTx = require('ethereumjs-tx') //For signing transactions in ethereum

/* It generates 12 random words to be used as a seed */
const generateMnemonicWords = () => {
    return BIP39.generateMnemonic()
}

/* This function prompts 12 words and returns them if they are a valid mnemonic.
Disclaimer: not all the words are valid */
const readInputMnemonic = () => {
    let mnemonics = ''
    let line = ''
    do{
        line = readlineSync.question('Write 12 words using space as separator and press enter. i.e: "dog cat window..."\n')
        mnemonics = line.split(' ')
    } while(!mnemonics || mnemonics.length!==12 || !BIP39.validateMnemonic(line))
    return mnemonics
}

const generateSeed = (mnemonic) => {
    return BIP39.mnemonicToSeed(mnemonic)
}

const generatePrivkey = async (mnemonic) => {
    if(!mnemonic){
        mnemonic = generateMnemonicWords()
    }
    const seed = await generateSeed(mnemonic)
    return {
        mnemonic: mnemonic,
        privKey: hdkey.fromMasterSeed(seed).derivePath(`m/44'/60'/0'/0/0`).getWallet().getPrivateKey()
    }
}

const derivePubkey = (privKey) => {
    const wallet = Wallet.fromPrivateKey(privKey)    
    return wallet.getPublicKey()
}

const deriveAddress = (pubKey) => {
    const hashstr = hash.calculateKeccak256(pubKey)
    const address = "0x" + hashstr.substring(hashstr.length - 40, hashstr.length)  
    return address
}

const signTx = (privKey, txData) => {
    const tx = new EthereumTx.Transaction(txData)
    tx.sign(Buffer.from(privKey,'hex'))
    return tx
}

module.exports = { readInputMnemonic, generateMnemonicWords, generateSeed, 
    generatePrivkey, derivePubkey, deriveAddress, signTx }