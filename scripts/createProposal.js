const { AdminClient } = require('defender-admin-client')
require('dotenv').config()

const {
  GOERLI_BADGES_ADDRESS,
  GOERLI_RAFT_ADDRESS,
  GOERLI_SPECDATAHOLDER_ADDRESS,
  DEFENDER_TEAM_API_KEY,
  DEFENDER_TEAM_API_SECRET_KEY,
} = process.env

async function createProposal() {
  const client = new AdminClient({
    apiKey: DEFENDER_TEAM_API_KEY,
    apiSecret: DEFENDER_TEAM_API_SECRET_KEY,
  })
  const newImplementation = process.argv[2]
  const contract = {
    network: 'goerli',
    address: null,
  }
  const contractName = process.argv[3]
  switch (contractName) {
    case 'badges':
      contract.address = GOERLI_BADGES_ADDRESS
      break
    case 'raft':
      contract.address = GOERLI_RAFT_ADDRESS
      break
    case 'specDataHolder':
      contract.address = GOERLI_SPECDATAHOLDER_ADDRESS
      break
  }
  await client.proposeUpgrade({ newImplementation }, contract)
}
createProposal()
