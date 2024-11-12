const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const minPurchase = "1000"; // 0.001 tokens in 6 decimals

    const maxPurchase = "32000000000000"; // 32000000 tokens in 6 decimals

    const vestingDuration = 15552000; // 180 days in seconds

    const cliffDuration = 2592000; // 30 days in seconds

    const treasuryAddress = "0x381A6755421b99B0BeA16770f93cF06445290d53"; // Client's treasury Address

    const ethPriceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // Chainlink ETH/USD address

    const referrerBonusPercentage = 1000; // 10% referral bonus

    const vestingPercentage = 90; // 90% vesting 

    const USDTToken = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const USDCToken = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    // // // // Deploy TokenPresale contract and initialize
    const TokenPresale = await ethers.getContractFactory("TokenPresale");
    const presale = await upgrades.deployProxy(TokenPresale, [minPurchase,
        maxPurchase,
        vestingDuration,
        cliffDuration,
        treasuryAddress,
        referrerBonusPercentage,
        ethPriceFeedAddress,
        vestingPercentage,
    ], {
        initializer: "initialize",
    });

    console.log("TokenPresale deployed to:", presale.address);

    await presale.whitelistPaymentTokens([USDTToken, USDCToken]);

    console.log("Tokens whitelisted");


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});