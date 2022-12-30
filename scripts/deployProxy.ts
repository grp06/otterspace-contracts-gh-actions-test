const { ethers, upgrades } = require('hardhat')
require('dotenv').config()

async function main(isOptimism: boolean) {
  const {
    BADGES_NAME: badgesName,
    BADGES_SYMBOL: badgesSymbol,
    BADGES_VERSION: badgesVersion,
    RAFT_NAME: raftName,
    RAFT_SYMBOL: raftSymbol,
    GOERLI_GNOSIS_SAFE: owner,
    OPTIMISM_GNOSIS_SAFE: optimismOwner,
  } = process.env

  let contractOwner;
  if (isOptimism) {
    contractOwner = optimismOwner;
  } else {
    contractOwner = owner;
  }  

  // console.log(`deploying raft contract with args - owner: ${contractOwner}, raftName: ${raftName}, raftSymbol: ${raftSymbol}`)
  // const raftAddress = await deployRaftContract(contractOwner, raftName, raftSymbol)
  // console.log('raft contract deployed to ', raftAddress)

  const sdhAddress = await deploySpecDataHolderContract('0x78F8E56c3B6F66CE2cc0692a37EC86C5233b94e9', contractOwner)
  console.log('specDataHolder deployed to address = ', sdhAddress)

  // const badgesAddress = await deployBadgesContract(badgesName, badgesSymbol, badgesVersion, contractOwner, sdhAddress)
  // console.log('badges contract deployed to address = ', badgesAddress)
  
  // when SpecDataHolder is originally deployed, it doesn't have the address of the Badges contract
  // so after everything is deployed, we need to set the address so that Badges and SpecDataHolder 
  // can talk to each other
  // await sdhAddress.setBadgesContractAddress(badgesAddress);
  
  console.log('For verification, run `npx hardhat verify --network ${networkName} ${contractAddress}`')
}

async function deployBadgesContract(
  badgesName: string | undefined,
  badgesSymbol: string | undefined,
  badgesVersion: string | undefined,
  owner: string | undefined,
  specDataHolderContractAddress: any
) {
  if (!badgesName || !badgesSymbol || !badgesVersion || !owner) {
    console.error('deployBadgesContract: missing config values')
  }

  const badges = await ethers.getContractFactory('Badges')
  const badgesContract = await upgrades.deployProxy(
    badges,
    [badgesName, badgesSymbol, badgesVersion, owner, specDataHolderContractAddress],
    {
      kind: 'uups',
    }
  )
  await badgesContract.deployed()

  return badgesContract.address
}

async function deploySpecDataHolderContract(raftContractAddress: any, owner: string | undefined) {
  if (!owner) {
    console.error('deploySpecDataHolderContract: missing config values')
  }

  const specDataHolder = await ethers.getContractFactory('SpecDataHolder')
  const specDataHolderContract = await upgrades.deployProxy(specDataHolder, [raftContractAddress, owner], {
    kind: 'uups',
  })
  await specDataHolderContract.deployed()

  return specDataHolderContract.address
}

async function deployRaftContract(
  owner: string | undefined,
  raftName: string | undefined,
  raftSymbol: string | undefined
) {
  if (!raftName || !raftSymbol || !owner) {
    console.error('deployRaftContract: missing config values')
    return
  }

  const raft = await ethers.getContractFactory('Raft')
  const raftContract = await upgrades.deployProxy(raft, [owner, raftName, raftSymbol], {
    kind: 'uups',
  })
  await raftContract.deployed()

  return raftContract.address
}

main(false)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
