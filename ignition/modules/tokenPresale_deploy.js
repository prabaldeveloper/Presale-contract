const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy MockToken contract
    const MockToken = await ethers.getContractFactory("Token");
    // const mockToken = await upgrades.deployProxy(MockToken, ["XXXX", "XX",], {
    //     initializer: "initialize",
    // });
    const mockToken = MockToken.attach("0x03ed076a988c4EA992AdB3BED0359Bf258a8cC4D");
    // // await mockToken.deployed();
    console.log("MockToken deployed to:", mockToken.address);

    //await mockToken.mint(deployer.address, ethers.utils.parseUnits("10000000000", 18));


    // Deploy USDTToken contract
    const USDTToken = await ethers.getContractFactory("TetherToken");
    // const usdtToken = await upgrades.deployProxy(USDTToken, ["USDT", "USDT", 6, ethers.utils.parseUnits("1000000", 6), deployer.address], {
    //     initializer: "initialize",
    // });
    //const usdtToken = await USDTToken.deploy("1000000000000","USDT","USDT", "6");
    const usdtToken = USDTToken.attach("0x83F1877569A173da541B5888A33d2747b517134F");
    // //await usdtToken.deployed();
    console.log("USDTToken deployed to:", usdtToken.address);

    // //await usdtToken.approve("0x48B8c72e956459502AE2EA23dC432DAEfB4f4d76", "1000000");

    // await usdtToken.transfer("0x445683fE78244C722Da7124Ee8C51f8B520471dB","5000000000");

    // //await usdtToken.transfer("0x5aA15ae257D28B0113eC2d48B950a78731bBa146","5000000000");

    const USDCToken = await ethers.getContractFactory("MockToken");
    // const usdcToken = await upgrades.deployProxy(USDCToken, ["USDC", "USDC", 6, ethers.utils.parseUnits("1000000", 6), deployer.address], {
    //     initializer: "initialize",
    // });
    const usdcToken = USDCToken.attach("0x1428805025084Dfb1a38303861D61A8Cc6C1E355");
    // await usdcToken.deployed();
    console.log("USDCToken deployed to:", usdcToken.address);

    // //await usdcToken.approve("0x8E90435f47F662229ca9f18A5369ea2C8834D385", "5000000000");

    // await usdcToken.transfer("0x445683fE78244C722Da7124Ee8C51f8B520471dB","5000000000");

    //await usdcToken.transfer("0x5aA15ae257D28B0113eC2d48B950a78731bBa146", "5000000000");

    // await usdcToken.transfer("0x20f4916EB1678327CCB77002204A45d3dF410c6B", "5000000000");

    // await usdcToken.transfer("0x83eBBEa57e2C021933Eec3Eabb99074bc58D6f69", "5000000000");

    //await usdcToken.transfer("0x27637Ae1C95C7cd790b5649fF603EDa0f7AE74F3", "5000000000");

    
    

    // Deploy MockEthPriceFeed contract
    // const MockEthPriceFeed = await ethers.getContractFactory("MockEthPriceFeed");
    // const mockEthPriceFeed = await MockEthPriceFeed.deploy("336677485871"); // Example initial price
    // await mockEthPriceFeed.deployed();
    // console.log("MockEthPriceFeed deployed to:", mockEthPriceFeed.address);

    // Replace with the address of your ERC20 token
    //const tokenAddress = mockToken.address;
    const minPurchase = "1000"; // 1 tokens in 6 decimals
    const maxPurchase = "32000000000000"; // 1000 tokens in 6 decimals
    const vestingDuration = 1200; // 1 year in seconds
    const cliffDuration = 300; // 30 days in seconds

    // // Replace with your Chainlink ETH price feed address or mock price feed address
    //const ethPriceFeedAddress = mockEthPriceFeed.address; // Mock price feed address

    //const bnbPriceFeedAddress = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"; //for bscTestnet

    const ethPriceFeedAddress = "0x694AA1769357215DE4FAC081bf1f309aDC325306";  //for sepolia

    //const ethPriceFeedAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"; // for mainnet

    //const avaxPriceFeedAddress = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD";

    const referrerBonusPercentage = 1000; // 5% referral bonus

    const vestingPercentage = 90;

    const tokenAllocated = "200000000000000000000000000";

    const USD_RATE = 1000; // Example rate  => 1 OZAK AI = 0.001 $ ie => 1 OZAK AI = 1000 USDT

    // // // // Deploy TokenPresale contract and initialize
    const TokenPresale = await ethers.getContractFactory("TokenPresale");
    // const presale = await upgrades.deployProxy(TokenPresale, [minPurchase,
    //     maxPurchase,
    //     vestingDuration,
    //     cliffDuration,
    //     deployer.address,
    //     referrerBonusPercentage,
    //     ethPriceFeedAddress,
    //     vestingPercentage,
    // ], {
    //     initializer: "initialize",
    // });
    // // await presale.deployed();
    // //const presale = await TokenPresale.deploy();
    const presale = TokenPresale.attach("0x43D85e31525977E208687d2e5dc0307281bbe102");
    console.log("TokenPresale deployed to:", presale.address);

    // await presale.initNextPresaleStage(tokenAllocated, USD_RATE);

    // //await usdtToken.approve(presale.address, "5000000000");

    // await presale.whitelistPaymentTokens(["0x0000000000000000000000000000000000000000"]);

    //await mockToken.transfer(presale.address, "1000000000000000000000000000");

    await presale.whitelistPaymentTokens([usdtToken.address, usdcToken.address]);

    // //await presale.updateVestingPercentage(90);

    // // await usdtToken.approve(presale.address, "5000000000");

    // await presale.updateTokenAddress(mockToken.address);

    // await presale.claimTokens();

    //await presale.updateCliffDuration("600");

    // await usdtToken.transfer(presale.address,"200000000");

    //await presale.updateVestingDuration("172800");
    
    //await presale.updateTreasury("0xd47772A17714FF1dD3C44787DCBc8A62Fc69e4F3");
    
    // await presale.endPresaleStage();

    // await presale.finalisePresale();

    // await presale.releaseClaim();

    //await presale.releaseReferrerBonus();

    // buy Tokens 

    //await presale.buyTokens(usdtToken.address, "100000", "0xE334716DbA4A78505744971143Dd8eA010D9C662");

    //await presale.buyTokens(usdcToken.address, "100000000", "0x0000000000000000000000000000000000000000");

    // await presale.buyTokensETH("0x3a5E735bd62CD81A5663442A88AC73fc4C852910", {
    //     value: "10000000000000000"
    // });


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// MockToken deployed to: 0x3730Cd5F6488Ac9ACb7840e0290e87FaB6311486
// USDTToken deployed to: 0x83F1877569A173da541B5888A33d2747b517134F
// USDCToken deployed to: 0x1428805025084Dfb1a38303861D61A8Cc6C1E355
// TokenPresale deployed to: 0x82E34eAca256079BAA904Bc10FF93bc8905bF658


//New updated contracts

// MockToken deployed to: 0x94957b4679Cfce83B2A0D52f3a0f962824A50379
// USDTToken deployed to: 0x83F1877569A173da541B5888A33d2747b517134F
// USDCToken deployed to: 0x1428805025084Dfb1a38303861D61A8Cc6C1E355
// TokenPresale deployed to: 0x36e3676d432Fa9aE8aB81924dDf85a5235A63E95 




//New Contracts

// MockToken deployed to: 0x9FdC692A61799CaB28d1a551aCa89D67D366AF68
// USDTToken deployed to: 0x83F1877569A173da541B5888A33d2747b517134F
// USDCToken deployed to: 0x1428805025084Dfb1a38303861D61A8Cc6C1E355
// TokenPresale deployed to: 0x4A6bC2885C36674697308DFEE80968212eDa625F



// MockToken deployed to: 0x8F12C00BF370531beBa5198cabbb5B653C5B9D08
// USDTToken deployed to: 0x83F1877569A173da541B5888A33d2747b517134F
// USDCToken deployed to: 0x1428805025084Dfb1a38303861D61A8Cc6C1E355
// TokenPresale deployed to:0x7feE0BCDE3Fa576c04e7777BF7AfaDCf155041d7