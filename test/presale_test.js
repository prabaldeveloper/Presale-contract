const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { deploy } = require("@openzeppelin/hardhat-upgrades/dist/utils");

// Use solidity matchers from ethereum-waffle
chai.use(solidity);

// Use chai-as-promised for revertedWith
chai.use(require("chai-as-promised"));

const { BigNumber } = ethers;
const MIN_PURCHASE = BigNumber.from("1000000"); // 1 USDT in 6 decimals
const MAX_PURCHASE = BigNumber.from("100000000"); // 1000 USDT in 6 decimals

describe("TokenPresale", function () {
    let TokenPresale;
    let token;
    let testToken;
    let MockEthPriceFeed;
    let owner;
    let user;
    let treasury;
    let presale;
    let ethPriceFeed;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {

        [owner, user, treasury, addr1, addr2, ...addrs] = await ethers.getSigners(); // Get different signers

        // Deploy MockToken contract
        const MockToken = await ethers.getContractFactory("Token");
        token = await upgrades.deployProxy(MockToken, ["OZAKAI", "OZAKAI", ethers.utils.parseUnits("1000000", 18), owner.address], {
            initializer: "initialize",
        });
        await token.deployed();

        // Deploy TestToken contract
        const TestToken = await ethers.getContractFactory("MockToken");
        testToken = await TestToken.deploy();
        await testToken.initialize("USDT", "USDT", 6, ethers.utils.parseUnits("1000000", 18), owner.address);
        // testToken = await upgrades.deployProxy(TestToken, ["USDT", "USDT", 6, ethers.utils.parseUnits("1000000", 18), owner.address], {
        //     initializer: "initialize",
        // });
        await testToken.deployed();

        // // Deploy MockEthPriceFeed contract
        MockEthPriceFeed = await ethers.getContractFactory("MockEthPriceFeed");
        ethPriceFeed = await MockEthPriceFeed.deploy("336677485871");
        await ethPriceFeed.deployed();

    //     // Deploy TokenPresale contract
        TokenPresale = await ethers.getContractFactory("TokenPresale");
        presale = await upgrades.deployProxy(
            TokenPresale,
            [
                token.address,
                MIN_PURCHASE,
                MAX_PURCHASE,
                3600, // vestingDuration = 1 hour
                600, // cliffDuration = 10 minutes
                treasury.address,
                500, // referrerBonusPercentage = 5%
                ethPriceFeed.address
            ],
            { initializer: "initialize" }
        );
        await presale.deployed();
    });

    describe("Initialization", function () {
        it("Should initialize with correct values", async function () {
            const minPurchase = await presale.minPurchase();
            const maxPurchase = await presale.maxPurchase();
            const treasuryAddress = await presale.treasury();
            const ethPriceFeedAddress = await presale.ethDataFeed();

            expect(Number(minPurchase)).to.equal(Number(MIN_PURCHASE));
            expect(Number(maxPurchase)).to.equal(Number(MAX_PURCHASE));
            expect(treasuryAddress).to.equal(treasury.address);
            expect(ethPriceFeedAddress).to.equal(ethPriceFeed.address);
        });
    });

    describe("Presale Stages", function () {
        const TOKEN_ALLOCATION = ethers.utils.parseEther('10000'); // Example token allocation
        const USD_RATE = BigNumber.from("1000"); // Example rate

        it("Should initialize and start presale stages correctly", async function () {
            await presale.initNextPresaleStage(TOKEN_ALLOCATION, USD_RATE);
            const stage = await presale.stages(1);
            expect(Number(stage.tokensAllocated)).to.equal(Number(TOKEN_ALLOCATION));
            expect(Number(stage.rate)).to.equal(Number(USD_RATE));
        });

        it("Should not allow non-owner to initialize presale stage", async function () {
            await expect(
                presale.connect(addr1).initNextPresaleStage(TOKEN_ALLOCATION, USD_RATE)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Buying Tokens", function () {
        const TOKEN_ALLOCATION = ethers.utils.parseEther('100000'); // Example token allocation
        const USD_RATE = BigNumber.from("1000"); // Example rate => 1 token = 0.001 usd
        beforeEach(async function () {
            await presale.initNextPresaleStage(TOKEN_ALLOCATION, USD_RATE);
        });

        it("Should allow buying tokens with ERC20 tokens", async function () {
            await presale.whitelistPaymentTokens([testToken.address]);
            await testToken.transfer(addr1.address, "10000000"); // Transfer Test tokens to addr1
            await testToken.connect(addr1).approve(presale.address, "10000000"); // Approve Test tokens for spending
            await presale.connect(addr1).buyTokens(testToken.address, "10000000", ethers.constants.AddressZero);
            const userTokensAllocated = await presale.users(addr1.address);
            let contractCalculation = (Number(10000000) / Number(USD_RATE)) * ethers.utils.parseEther("1");
            expect(Number(userTokensAllocated.tokensAllocated)).to.equal(Number(contractCalculation));
        });

        it("Should revert if allowance is insufficient", async function () {
            await presale.whitelistPaymentTokens([testToken.address]);
            await testToken.transfer(addr1.address, "10000000"); // Transfer Test tokens to addr1
            await testToken.connect(addr1).approve(presale.address, "1000000"); // Approve Test tokens for spending
            await expect (presale.connect(addr1).buyTokens(testToken.address, "10000000", ethers.constants.AddressZero)).to.be.revertedWith("ERC20: insufficient allowance");
        });

        // it("Should allow buying tokens with ETH", async function () {
        //     const ethAmount = ethers.utils.parseEther("0.01"); // 1 ETH
        //     await presale.connect(addr1).buyTokensETH(ethers.constants.AddressZero, { value: ethAmount });
        //     const userTokensAllocated = await presale.users(addr1.address);
        //     let ethPriceInUSD = BigNumber.from(await presale.getLatestPrice());
        //     let usdAmount = (ethPriceInUSD.mul(ethAmount)).div("1000000000000000000000000000000");
        //     let contractCalculation = (Number(usdAmount) / Number(USD_RATE)) * ethers.utils.parseEther("1");
        //     // expect((Number(userTokensAllocated.tokensAllocated)).toFixed(2)).to.equal((Number(contractCalculation).toFixed(2)));
        // });

        // it("Should revert if purchase amount is out of range", async function () {
        //     await expect(
        //         presale.buyTokensETH(ethers.constants.AddressZero),
        //     ).to.be.revertedWith("Amount out of range");
        // });

        // it("Should revert if token is not whitelisted", async function () {
        //     await expect(
        //         presale.buyTokens(token.address, "100000000", ethers.constants.AddressZero),
        //     ).to.be.revertedWith("Token not whitelisted");
        // });

        // it("should revert if presale stage is paused", async function () {
        //     await presale.pausePresale();
        //     const ethAmount = "1000000000";
        //     await expect(presale.connect(addr1).buyTokensETH(ethers.constants.AddressZero, { value: ethAmount })).to.be.revertedWith("Pausable: paused");
        // });

        // it("Should fail if amount is below minimum purchase", async function () {
        //     await presale.whitelistPaymentTokens([testToken.address]);
        //     await testToken.transfer(addr1.address, "100000"); // Transfer Test tokens to addr1
        //     await testToken.connect(addr1).approve(presale.address, "100000"); // Approve Test tokens for spending
        //     await expect(presale.connect(addr1).buyTokens(testToken.address, "100000", ethers.constants.AddressZero)).to.be.revertedWith("Amount out of range");

        // });

        // it("should revert if tokensToBuy is greater than the max purchase", async function () {
        //     await presale.whitelistPaymentTokens([testToken.address]);
        //     await testToken.transfer(addr1.address, "1000000000"); // Transfer Test tokens to addr1
        //     await testToken.connect(addr1).approve(presale.address, "1100000000"); // Approve Test tokens for spending
        //     await expect(presale.connect(addr1).buyTokens(testToken.address, "110000000", ethers.constants.AddressZero)).to.be.revertedWith("Amount out of range");

        // })

        // it("should revert if tokensToBuy is greater than the tokensLeft", async function () {
        //     await presale.whitelistPaymentTokens([testToken.address]);
        //     await testToken.transfer(addr1.address, "1000000000"); // Transfer Test tokens to addr1
        //     await testToken.connect(addr1).approve(presale.address, "1000000000"); // Approve Test tokens for spending
        //     await presale.connect(addr1).buyTokens(testToken.address, "90000000", ethers.constants.AddressZero);
        //     await expect(presale.connect(addr1).buyTokens(testToken.address, "20000000", ethers.constants.AddressZero)).to.be.revertedWith("Not enough tokens in stage");
        //     // let stage = await presale.stages(1);
        //     // let tokensAllocated = stage.tokensAllocated;
        //     // let tokensSold = stage.tokensSold;
        //     // expect(Number(tokensAllocated)).to.equal(Number(tokensSold));

        // })

        // it("No refferal tokens should be given if user refers to his own address", async function () {
        //     await presale.whitelistPaymentTokens([testToken.address]);
        //     await testToken.transfer(addr1.address, "1000000000"); // Transfer Test tokens to addr1
        //     await testToken.connect(addr1).approve(presale.address, "1000000000"); // Approve Test tokens for spending
        //     await presale.connect(addr1).buyTokens(testToken.address, "20000000", addr1.address);
        //     let userData = await presale.users(addr1.address);
        //     let userReferralEarnings = userData.referrerEarnings;
        //     expect(Number(userReferralEarnings)).to.equal(0);
        // })

        it("Should fail if buyer doesn't have enough ETH balance", async function () {
            const newTokenAllocated = ethers.utils.parseUnits("20000000000000000000000", 18);
            const newRate = ethers.utils.parseUnits("0.05", 18);
            await presale.updatePresaleStageParameters(newTokenAllocated, newRate);
            await network.provider.send("hardhat_setBalance", [
                addr2.address,
                "0x8AC7230489E80000" // 10 ETH in hex
              ]);
            await expect(presale.connect(addr2).buyTokensETH(addr1.address, { value: ethers.utils.parseEther("10000") })) // assuming addr2 has less than 10000 ETH
                .to.be.revertedWith(" ProviderError: Sender doesn't have enough funds to send tx. The max upfront cost is: 10000029023640534617280 and the sender's balance is: 10000000000000000000.");
        });
    });

    describe("Claiming Tokens", function () {
        const TOKEN_ALLOCATION = ethers.utils.parseEther('10000'); // Example token allocation
        const USD_RATE = BigNumber.from("1000"); // Example rate
        beforeEach(async function () {
            await presale.initNextPresaleStage(TOKEN_ALLOCATION, USD_RATE);
            await presale.whitelistPaymentTokens([testToken.address]);
            await testToken.transfer(addr1.address, "10000000"); // Transfer Test tokens to addr1
            await testToken.connect(addr1).approve(presale.address, "10000000"); // Approve Test tokens for spending
            await presale.connect(addr1).buyTokens(testToken.address, "10000000", ethers.constants.AddressZero);
            await presale.finalisePresale();
        });

        it("Should allow users to claim tokens after vesting period", async function () {
            await ethers.provider.send("evm_increaseTime", [3600]); // Fast forward time to 1 hour later
            // await ethers.provider.send("evm_mine", []); // Mine a new block to reflect the time change
            await token.transfer(presale.address, TOKEN_ALLOCATION);
            await presale.releaseClaim();
            await presale.connect(addr1).claimTokens();
            const userTokensAllocated = await presale.users(addr1.address);
            expect(userTokensAllocated.tokensClaimed).to.equal(userTokensAllocated.tokensAllocated);
        });

        it("Should release tokens linearly", async function () {
            await ethers.provider.send("evm_increaseTime", [1200]); // Fast forward time to 20 minutes
            await ethers.provider.send("evm_mine", []);
            const userTokensAllocated = await presale.users(addr1.address);
            let calculateHere = (userTokensAllocated.tokensAllocated * 1200) / (await presale.vestingDuration());
            console.log(calculateHere, await presale.claimableTokens(addr1.address));
        })

        it("Should revert if tokens are claimed before vesting period", async function () {
            await presale.releaseClaim();
            await expect(presale.connect(addr1).claimTokens()).to.be.revertedWith("Cliff duration not passed");
        });

        it("Should fail if buyer has no tokens to claim", async function () {
            await presale.releaseClaim();
            await expect(presale.connect(addr2).claimTokens())
                .to.be.revertedWith("No tokens to claim");
        });
    });

    describe("Referrer Bonus", function () {
        const TOKEN_ALLOCATION = ethers.utils.parseEther('10000'); // Example token allocation
        const USD_RATE = BigNumber.from("1000"); // Example rate
        beforeEach(async function () {
            await presale.initNextPresaleStage(TOKEN_ALLOCATION, USD_RATE);
            await presale.whitelistPaymentTokens([testToken.address]);
            await testToken.transfer(addr1.address, "10000000"); // Transfer Test tokens to addr1
            await testToken.connect(addr1).approve(presale.address, "10000000"); // Approve Test tokens for spending
        });

        it("Should allocate referrer bonus correctly", async function () {
            await presale.connect(addr1).buyTokens(testToken.address, "10000000", addr2.address);
            const tokensAllocated = await presale.users(addr1.address)
            const referrerBonus = await presale.users(addr2.address);
            let referrerTokens = (tokensAllocated.tokensAllocated * 0.05);
            expect(Number(referrerBonus.referrerEarnings)).to.equal(Number(referrerTokens));
        });

        it("Should allow referrer to claim referrer bonus", async function () {
            await presale.connect(addr1).buyTokens(testToken.address, "10000000", addr2.address);
            await presale.finalisePresale(); // Finalize the presale
            await presale.releaseReferrerBonus(); // Release referrer bonuses
            const referrerBonus = await presale.users(addr2.address);
            await token.transfer(presale.address, referrerBonus.referrerEarnings);
            await presale.connect(addr2).claimReferrerBonus();
            const referrerBonuss = await presale.users(addr2.address);
            expect(referrerBonuss.referrerEarnings).to.equal(0);
        });

        it("Should revert if referrer bonus is claimed before release", async function () {
            await presale.connect(addr1).buyTokens(testToken.address, "10000000", addr2.address);
            await presale.finalisePresale();
            await expect(presale.connect(addr2).claimReferrerBonus()).to.be.revertedWith("Referrer bonus not released yet");
        });
    });

    describe("Update Functions", function () {
        it("Should update referrer bonus percentage", async function () {
            const newBonusPercentage = 1000; // 10%
            await presale.updateReferrerBonusPercentage(newBonusPercentage);
            expect(await presale.referrerBonusPercentage()).to.equal(newBonusPercentage);
        });

        it("Should update treasury address", async function () {
            await presale.updateTreasury(addr1.address);
            expect(await presale.treasury()).to.equal(addr1.address);
        });

        it("Should pause and resume presale", async function () {
            await presale.pausePresale();
            expect(await presale.paused()).to.be.true;
            await presale.resumePresale();
            expect(await presale.paused()).to.be.false;
        });

        it("Should update vesting duration", async function () {
            const newVestingDuration = 60 * 24 * 60 * 60; // 60 days
            await presale.updateVestingDuration(newVestingDuration);
            expect(await presale.vestingDuration()).to.equal(newVestingDuration);
        });

        it("Should update cliff duration", async function () {
            const newCliffDuration = 14 * 24 * 60 * 60; // 14 days
            await presale.updateCliffDuration(newCliffDuration);
            expect(await presale.cliffDuration()).to.equal(newCliffDuration);
        });

        it("Should update presale stage parameters", async function () {
            const tokenAllocation = ethers.utils.parseUnits("1000", 18);
            const rate = ethers.utils.parseUnits("0.1", 18);
            await presale.initNextPresaleStage(tokenAllocation, rate);

            const newTokenAllocated = ethers.utils.parseUnits("2000", 18);
            const newRate = ethers.utils.parseUnits("0.05", 18);
            await presale.updatePresaleStageParameters(newTokenAllocated, newRate);

            const stage = await presale.stages(1);
            expect(stage.tokensAllocated).to.equal(newTokenAllocated);
            expect(stage.rate).to.equal(newRate);
        });

        it("Should update min and max purchase", async function () {
            const newMinPurchase = ethers.utils.parseUnits("2", 6);
            const newMaxPurchase = ethers.utils.parseUnits("200", 6);
            await presale.updateMinMaxPurchase(newMinPurchase, newMaxPurchase);
            expect(await presale.minPurchase()).to.equal(newMinPurchase);
            expect(await presale.maxPurchase()).to.equal(newMaxPurchase);
        });
    });
});
