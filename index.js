const {generatePrivkey, derivePubkey, deriveAddress, signTx} = require('./accounts')

const generateEthIdentity = async () => {
  const rand = await generatePrivkey()
  const pubKey = await derivePubkey(rand.privKey)
  console.log("Mnemonic: " + rand.mnemonic)
  console.log("PrivKey: " + rand.privKey.toString('hex'))
  console.log("PubKey: " + pubKey.toString('hex'))
  console.log("Address: " + deriveAddress(pubKey))
  return {
    mnemonic: rand.mnemonic,
    privKey: rand.privKey.toString('hex'),
    pubKey: pubKey.toString('hex'),
    address: deriveAddress(pubKey)
  }
}

const generateDummyTsxData = () => {
  return {
    nonce: '0x00',
    gasPrice: '0x09184e72a000', 
    gasLimit: '0x2710',
    to: '0x31c1c0fec59ceb9cbe6ec474c31c1dc5b66555b6', 
    value: '0x10', 
    data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
    chainId: 3
}
}

generateEthIdentity().then(ethID => {
  console.log(ethID)
  const signedTsx = signTx(ethID.privKey, generateDummyTsxData())
  console.log(signedTsx)
})
