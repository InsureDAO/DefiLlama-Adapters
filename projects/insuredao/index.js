const sdk = require("@defillama/sdk");
const abi = require("./abi.json");
const { sumTokens, sumTokensAndLPs, unwrapCrv, unwrapUniswapLPs, genericUnwrapCvx, } = require('../helper/unwrapLPs');

const chain = "ethereum";

// addresses pools

const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const insure = "0xd83AE04c9eD29d6D3E6Bf720C71bc7BeB424393E";

const Vault = "0x131fb74c6fede6d6710ff224e07ce0ed8123f144";
const optimismVault = "0x54F23d2fdC1E17D349B1Eb14d869fa4deD6A6D2b";
const arbitrumVault = "0x968C9718f420d5D4275C610C5c217598a6ade9f9";
const astarVault = "0x190dA1B9fA124BD872e9166bA3c7Dd656A11E8F8";

const VotingEscrow = "0x3dc07E60ecB3d064d20c386217ceeF8e3905916b";
const vlINSURE = "0xA12ab76a82D118e33682AcB242180B4cc0d19E29";

const uni = "0x1b459aec393d604ae6468ae3f7d7422efa2af1ca";
const uniStaking = "0xf57882cf186db61691873d33e3511a40c3c7e4da";

// =================== GET ETH usdc BALANCES =================== //
async function tvl(_, block) {
  let balances = {};

  const vusdcBalances = (
    await sdk.api.abi.call({
      target: Vault,
      abi: abi["valueAll"],
      chain: chain,
      block: block,
    })
  ).output;
  sdk.util.sumSingleBalance(balances, usdc, vusdcBalances);

  return balances;
}

// =================== GET Optimism usdc BALANCES =================== //
async function optimismtvl(timestamp, _, { optimism: block }) {
  let balances = {};

  const vusdcBalances = (
    await sdk.api.abi.call({
      target: optimismVault,
      abi: abi["valueAll"],
      chain: "optimism",
      block: block,
    })
  ).output;
  sdk.util.sumSingleBalance(balances, usdc, vusdcBalances);

  return balances;
}

// =================== GET Arbitrum usdc BALANCES =================== //
async function arbitrumtvl(_, { arbitrum: block}) {
  let balances = {}

  const vusdcBalances = (
    await sdk.api.abi.call({
      target: arbitrumVault,
      abi: abi["valueAll"],
      chain: "arbitrum",
      block: block,
    })
  ).output;
  sdk.util.sumSingleBalance(balances, usdc, vusdcBalances);

  return balances
}

// =================== GET astar usdc BALANCES =================== //
async function astartvl(timestamp, _, { astar: block }) {
  let balances = {};

  const vusdcBalances = (
    await sdk.api.abi.call({
      target: astarVault,
      abi: abi["valueAll"],
      chain: "astar",
      block: block,
    })
  ).output;
  sdk.util.sumSingleBalance(balances, usdc, vusdcBalances);

  return balances;
}

// =================== GET INSURE BALANCES =================== //
async function staking(_, block) {
  let balances = {};


  const veinsureBalances = (
    await sdk.api.abi.call({
      target: VotingEscrow,
      abi: abi["supply"],
      chain: chain,
      block: block,
    })
  ).output;

  const vlinsureBalances = (
    await sdk.api.abi.call({
      target: insure,
      params: vlINSURE,
      abi: abi["balanceOf"],
      chain: chain,
      block: block,
    })
  ).output;
  
  sdk.util.sumSingleBalance(balances, insure ,veinsureBalances);
  sdk.util.sumSingleBalance(balances, insure ,vlinsureBalances);
  
  return balances;
}


async function pool2(_, block) {
  const balances = {}
  await sumTokensAndLPs(balances, [
    [uni, uniStaking, true]
  ], block)
  return balances
}

module.exports = {
  ethereum: {
    tvl: tvl,
    staking: staking,
    pool2: pool2,
  },
  optimism: {
    tvl: optimismtvl,
  },
  arbitrum: {
    tvl: arbitrumtvl,
  },
  astar: {
    tvl: astartvl,
  }
};
