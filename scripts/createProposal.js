const { AdminClient } = require('defender-admin-client')

const apiKey = process.env.DEFENDER_TEAM_API_KEY
const apiSecret = process.env.DEFENDER_TEAM_API_SECRET_KEY
async function createProposal() {
  const client = new AdminClient({
    apiKey,
    apiSecret,
  })
  const newImplementation = process.argv[2]
  const contract = {
    network: 'goerli',
    address: newImplementation,
  }
  const res = await client.proposeUpgrade({ newImplementation }, contract)
}
createProposal()
