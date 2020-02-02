const keccak256 = require('keccak256')

/* Returns the hash of the input using keccak256, which is
the hash function used in Ethereum */
const calculateKeccak256 = (input) => {
  return keccak256(input).toString('hex')
}

const merkelTree = (input1, input2) => {
  return calculateKeccak256(calculateKeccak256(input1)+calculateKeccak256(input2))
}

//console.log(calculateKeccak256('hello'))
//console.log(merkelTree('hello','bye'))

module.exports = {calculateKeccak256}
