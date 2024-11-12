let account;
let provider;
let signer;

const tokenPresaleContractAddress = "0x48aE040bF4b21f3DB0c0A44569De92f9042415a4";
const tokenPresaleAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "AccidentalTokenWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ClaimReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "minPurchase",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "maxPurchase",
        "type": "uint256"
      }
    ],
    "name": "MinMaxPurchaseUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PresaleFinalized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "PresalePaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "PresaleResumed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bonusAmount",
        "type": "uint256"
      }
    ],
    "name": "ReferrerBonusClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ReferrerBonusReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newBonus",
        "type": "uint256"
      }
    ],
    "name": "ReferrerBonusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stageId",
        "type": "uint256"
      }
    ],
    "name": "StageFinalized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAllocation",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newRate",
        "type": "uint256"
      }
    ],
    "name": "StageParameterUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "stageId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokensAllocated",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rate",
        "type": "uint256"
      }
    ],
    "name": "StageStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "TokenDelisted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "TokenWhitelisted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "vestedTokens",
        "type": "uint256"
      }
    ],
    "name": "TokensClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "purchaser",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "usdAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "referralBonusAmount",
        "type": "uint256"
      }
    ],
    "name": "TokensPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newTreasury",
        "type": "address"
      }
    ],
    "name": "TreasuryUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newVestingDuration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newCliffDuration",
        "type": "uint256"
      }
    ],
    "name": "VestingParametersUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "usdAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      }
    ],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "referrer",
        "type": "address"
      }
    ],
    "name": "buyTokensETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReferrerBonus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReleased",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "claimableTokens",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cliffDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "contributions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentStageId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "name": "delistPaymentTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "endPresaleStage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ethDataFeed",
    "outputs": [
      {
        "internalType": "contract AggregatorV3Interface",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "finalisePresale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLatestPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWhitelistedTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenAllocation",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rate",
        "type": "uint256"
      }
    ],
    "name": "initNextPresaleStage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_minPurchase",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxPurchase",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_vestingDuration",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_cliffDuration",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "_treasury",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_referrerBonusPercentage",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_ethPriceFeed",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxPurchase",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minPurchase",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pausePresale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "presaleEnded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "referrerBonusPercentage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "referrerBonusReleased",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "releaseClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "releaseReferrerBonus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "resumePresale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "stages",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokensAllocated",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokensSold",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountRaised",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "referrerBonusAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20Upgradeable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalReferrerBonusAllocated",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newCliffDuration",
        "type": "uint256"
      }
    ],
    "name": "updateCliffDuration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newMinPurchase",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newMaxPurchase",
        "type": "uint256"
      }
    ],
    "name": "updateMinMaxPurchase",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newTokenAllocated",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newRate",
        "type": "uint256"
      }
    ],
    "name": "updatePresaleStageParameters",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newBonusPercentage",
        "type": "uint256"
      }
    ],
    "name": "updateReferrerBonusPercentage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "newTreasury",
        "type": "address"
      }
    ],
    "name": "updateTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newVestingDuration",
        "type": "uint256"
      }
    ],
    "name": "updateVestingDuration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "users",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "usdInvested",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokensAllocated",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "referrerEarnings",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokensClaimed",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "noOfReferrals",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vestingDuration",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vestingStartTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "tokens",
        "type": "address[]"
      }
    ],
    "name": "whitelistPaymentTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "whitelistedTokens",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "withdrawAccidentalFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

const tokenContractAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "decimal",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "treasury",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

   // Initialize ethers and connect wallet automatically
   window.addEventListener('load', async () => {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        account = await signer.getAddress();
        console.log("Connected account:", account);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  });


/************************************ WRITE FUNCTIONS **************************************************/

/**
 * @dev Allows users to purchase tokens during the presale by sending whitelisted ERC20 tokens.
 * @param tokenAddress The address of the ERC20 token used for payment.
 * @param usdAmount The amount of ERC20 tokens being spent.
 * @param referrer The address of the referrer.
 * @return  Transaction Hash of the signed transaction.
 */

const buyTokens = async (tokenAddress,usdAmount, referrer) => {
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.buyTokens(tokenAddress, usdAmount,referrer, { from: account, value: 0 });
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      value: 0,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.buyTokens(tokenAddress, usdAmount,referrer, overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }

};

// Function to Buy Tokens with ETH

/**
 * @dev Allows users to purchase tokens during the presale by sending ETH.
 * @param ethAmount The amount of ETH being sent.
 * @param referrer The address of the referrer.
 */

const buyTokensETH = async (ethAmount, referrer) => {
  // Convert ethAmount to Wei
  const ethAmountInWei = ethers.utils.parseEther(ethAmount);
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.buyTokensETH(referrer, { from: account, value: ethAmountInWei });
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      value: ethAmountInWei,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.buyTokensETH(referrer, overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }

};

// Function to Claim Tokens
/**
 * @dev Allows users to claim their purchased tokens after the presale.
 */

const claimTokens = async () => {
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.claimTokens({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      value: 0,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.claimTokens(overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Function to Claim Referrer Bonus

/**
 * @dev Allows users to claim their referrer bonus after the presale.
 */

const claimReferrerBonus = async () => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.claimReferrerBonus({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.claimReferrerBonus(overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

//End Presale Stage
/**
 * @dev Ends the current presale stage.
 */

const endPresaleStage = async () => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.endPresaleStage({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.endPresaleStage(overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }

};

// Finalise Presale
/**
 * @dev Finalises the presale.
 */

const finalisePresale = async () => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.finalisePresale({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.finalisePresale(overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Release Claim
/**
 * @dev Releases the claim tokens.
 */

const releaseClaim = async () => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.releaseClaim({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.releaseClaim(overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Release Referrer Bonus
/**
* @dev Release referrer bonus
*/

const releaseReferrerBonus = async () => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.releaseReferrerBonus({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.releaseReferrerBonus(overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Whitelist Payment Tokens

/**
* @dev Whitelists a set of ERC20 payment tokens.
* @param tokenAddresses The array of token addresses to whitelist.
*/

const whitelistPaymentTokens = async (tokenAddresses) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.whitelistPaymentTokens(tokenAddresses, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.whitelistPaymentTokens(tokenAddresses, overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};


// Delist Payment Tokens

/**
* @dev Delists a set of ERC20 payment tokens.
* @param tokenAddresses The array of token addresses to delist.
*/

const delistPaymentTokens = async (tokenAddresses) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.delistPaymentTokens(tokenAddresses, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.delistPaymentTokens(tokenAddresses, overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Update Min/Max Purchase
/**
* @dev Updates the minimum and maximum purchase amounts.
* @param minPurchase The minimum purchase amount.
* @param maxPurchase The maximum purchase amount.
*/

const updateMinMaxPurchase = async (minPurchase , maxPurchase) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.updateMinMaxPurchase(minPurchase, maxPurchase, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.updateMinMaxPurchase(minPurchase, maxPurchase, overrides);
     // Wait until the tx has been confirmed (default is 1 confirmation)
     const receipt = await transaction.wait()
     // Receipt should now contain the logs
     console.log(receipt);
     return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Update Presale Stage Parameters
/**
* @dev Updates the parameters for the current presale stage.
* @param newTokenAllocated The new token allocated.
* @param newRate The new rate for the stage.
*/

const updatePresaleStageParameters = async (newTokenAllocated, newRate) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.updatePresaleStageParameters(newTokenAllocated, newRate, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.updatePresaleStageParameters(newTokenAllocated, newRate, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Update Cliff Duration

/**
 * @dev Updates the cliff duration for the presale.
 * @param newCliffDuration The new cliff duration.
 */

const updateCliffDuration = async (newCliffDuration) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.updateCliffDuration(newCliffDuration, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.updateCliffDuration(newCliffDuration, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Update Vesting Duration
/**
 * @dev Updates the vesting duration for the presale.
 * @param newVestingDuration The new vesting duration.
 */

const updateVestingDuration = async (newVestingDuration) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.updateVestingDuration(newVestingDuration, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.updateVestingDuration(newVestingDuration, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Initialize Next Presale Stage
/**
 * @dev Initializes the next presale stage.
 * @param tokenAllocation The total number of tokens allocated for this stage.
 * @param rate The rate at which tokens are sold per USD.
 */

const initNextPresaleStage = async (tokenAllocation, rate) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.initNextPresaleStage(tokenAllocation, rate, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.initNextPresaleStage(tokenAllocation, rate, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
}

// Update Referrer Bonus Percentage
/**
 * @dev Updates the referrer bonus percentage.
 * @param newPercentage The new referrer bonus percentage.
 */

const updateReferrerBonusPercentage = async (newPercentage) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.updateReferrerBonusPercentage(newPercentage, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.updateReferrerBonusPercentage(newPercentage, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Update Treasury
/**
 * @dev Updates the treasury address.
 * @param newTreasury The new treasury address.
 */

const updateTreasury = async (newTreasury) => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.updateTreasury(newTreasury, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.updateTreasury(newTreasury, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};

// Pause Presale
/**
 * @dev Pauses the presale.
 */

const pausePresale = async () => {
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.pausePresale({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.pausePresale(overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};


// Resume Presale
/**
 * @dev Resumes the presale.
 */

const resumePresale = async () => {
  
  try {
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenPresaleContractInstance.estimateGas.resumePresale({ from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenPresaleContractInstance.resumePresale(overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};


const approve = async (tokenContractAddress,
  spenderAddress,
  amount = "10000000000000000000") => {
  
  try {
    // Contract instance
    const tokenContractInstance = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
    // Estimate gas limit
    let estimatedGasLimit = await tokenContractInstance.estimateGas.approve(spenderAddress, amount, { from: account});
    
    // Raw transaction inputs
    let overrides = {
      from: account,
      gasLimit: estimatedGasLimit,
    }

    // Contract function call
    const transaction = await tokenContractInstance.approve(spenderAddress, amount, overrides);
    // Wait until the tx has been confirmed (default is 1 confirmation)
    const receipt = await transaction.wait()
    // Receipt should now contain the logs
    console.log(receipt);
    return receipt
  } catch (err) {
     console.log(`Error ${err}`);
  }
};


/************************************ READ FUNCTIONS **************************************************/

// Function to Check Claimable Tokens

/**
 * @dev Checks the number of tokens that can be claimed by the user.
 * @param userAddress Address of the user
 * @return {string} The number of claimable tokens.
 */

const claimableTokens = async(userAddress) => {
  try {
    
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let result = await tokenPresaleContractInstance.claimableTokens(userAddress);
    return result;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

// Function to Check Token Whitelist Status
/**
 * @dev Checks if a token is whitelisted.
 * @param token The address of the token to check.
 * @return {boolean} True if the token is whitelisted, otherwise false.
 */

const isTokenWhitelisted = async(token) => {
  try {
        
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let result = await tokenPresaleContractInstance.whitelistedTokens(token);
    return result;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Check whether spender address approved
 *@param tokenContractAddress address of the token
 *@param userAddress address of the user
 *@param spenderAddress Address of spender to which token is approved
 *@return last approved transaction amount
 */

const getApprovedAmount = async (tokenContractAddress, userAddress,spenderAddress) => {
  try {
    
    // Contract instance
    const tokenContractInstance = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);

    let result = await tokenContractInstance.allowance(userAddress, spenderAddress);
    return result;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get min and max purchase in USDT (has 6 decimal)
 *@return min and max purchase in USDT (has 6 decimal)
 */

const getMinMaxPurchase = async () => {
  try {
       
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let minPurchase = await tokenPresaleContractInstance.minPurchase();
    
    let maxPurchase = await tokenPresaleContractInstance.maxPurchase();
    return  { minPurchase, maxPurchase };
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get all the presale current stage details.
 *@return Returns rate in USD. stages is a mapping which returns all the details related to the current stage like tokensAllocated, tokensSold, rate etc.
 */

const getStageDetails = async () => {
  try {

    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let currentStageId = await tokenPresaleContractInstance.currentStageId();
    
    let stageDetails = await tokenPresaleContractInstance.stages(currentStageId);
    return  { currentStageId, stageDetails };
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get all the details of a user.
 *@param userAddress address of the user
 *@return Returns details related to as user. Users is a mapping which returns usdInvested, tokensAllocated, referrerEarnings, tokensClaimed.
 */

const getUserDetails = async (userAddress) => {
  try { 
    
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let userDetails = await tokenPresaleContractInstance.users(userAddress);
    return userDetails;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get status of the presale.
 *@return Returns whether presale is ended or not. True if it is ended
 */

const isPresaleEnded = async () => {
  try {

    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let status = await tokenPresaleContractInstance.presaleEnded();
    return status;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get status of the referrer bonus.
 *@return Returns whether Referrer Bonus Released is true or fasle. If it is true then user can claim referrer bonus.
 */

const isReferrerBonusReleased = async () => {
  try {
    
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let status = await tokenPresaleContractInstance.referrerBonusReleased();
    return status;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get status of the tokens sold.
 *@return Returns whether claim Released is true or fasle. If it is true then user can claim the tokens sold.
 */

const isClaimReleased = async () => {
  try {
    
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let status = await tokenPresaleContractInstance.claimReleased();
    return status;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get the latest price of ETH/BNB in USD.
 *@return Returns latest price of ETH/BNB in USD in 18 decimals.
 */

const getLatestPriceOfETH = async () => {
  try {
  
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let ethPrice = await tokenPresaleContractInstance.getLatestPrice();
    ethPrice = ethPrice.toString();
    return ethPrice;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

/**
 *@dev Function to get the vesting details.
 *@return Returns vestingStartTime, vestingDuration and cliffDuration.
 */

const getVestingDetails = async () => {
  try {

    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let vestingStartTime = await tokenPresaleContractInstance.vestingStartTime();

    let vestingDuration = await tokenPresaleContractInstance.vestingDuration();
    
    let cliffDuration = await tokenPresaleContractInstance.cliffDuration();

    return {vestingStartTime, vestingDuration, cliffDuration};
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

const getWhitelistedTokens = async () => {
  try {
 
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let whitelistedTokens = await tokenPresaleContractInstance.getWhitelistedTokens();
    return whitelistedTokens;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};

const getTokenDetails = async (tokenContractAddress) => {
  try {

    // Contract instance
    const tokenContractInstance = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);

    let name = await tokenContractInstance.name();
    let symbol = await tokenContractInstance.symbol();
    let decimals = await tokenContractInstance.decimals();
    return {name, symbol, decimals};
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};


const isClaimDurationPassed = async () => {
  try {
    
    // Contract instance
    const tokenPresaleContractInstance = new ethers.Contract(tokenPresaleContractAddress, tokenPresaleAbi, provider);

    let vestingStartTime = await tokenPresaleContractInstance.vestingStartTime();
    
    let cliffDuration = await tokenPresaleContractInstance.cliffDuration();

    let cliffEndTIme = vestingStartTime + cliffDuration;

    
    return status;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
};