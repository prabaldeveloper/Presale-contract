/**
 * @title Presale Contract
 */

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {PresaleEvents} from "./PresaleEvents.sol";

interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @title TokenPresale
 * @dev This contract manages a multi-stage presale of an ERC20 token, allowing users to purchase tokens with Ether or whitelisted ERC20 tokens. It includes vesting and referrer bonus mechanisms.
 */
contract TokenPresale is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    PresaleEvents
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IERC20Upgradeable public token; // The ERC20 token being sold in the presale

    address payable public treasury; // Address to receive raised funds

    AggregatorV3Interface public ethDataFeed; // Aggregator V3 Interface for eth price

    uint256 public referrerBonusPercentage; // Bonus percentage for referrers

    uint256 public minPurchase; // Minimum contribution amount

    uint256 public maxPurchase; // Maximum contribution amount

    bool public presaleEnded; // Whether the sale has finished or not

    bool public referrerBonusReleased; // Referrer Bonus release status

    bool public claimReleased; // Status to allow users to claim tokens

    mapping(address => bool) public whitelistedTokens; // Whitelisted ERC20 tokens accepted for payment

    address[] private tokenList; // Manages list of whitelisted tokens

    // Vesting Data
    uint256 public vestingStartTime; // Timestamp when vesting starts

    uint256 public vestingDuration; // Duration of the vesting period

    uint256 public cliffDuration; // Cliff duration before vesting starts

    uint256 public totalReferrerBonusAllocated; // Total referrer Bonus Allocated for the users in USDT

    uint256 public vestingPercentage; // Percentage of tokens being vested

    // User Data
    struct User {
        uint256 usdInvested; // Usd Invested by user
        uint256 tokensAllocated; // Total tokens allocated to user
        uint256 referrerEarnings; // Total Refferal earnings
        uint256 referrerEarningsClaimed; // Total Refferal earnings claimed by the user
        uint256 tokensClaimed; // Total tokens Claimed by the user
        uint256 noOfReferrals; // Total number of referrals
    }

    mapping(address => User) public users;

    mapping(address => mapping(address => uint256)) public contributions; // User contributions in Ether or tokens

    // Presale Stage Data
    struct Stage {
        uint256 tokensAllocated;
        uint256 tokensSold;
        uint256 rate;
        uint256 startTime;
        uint256 endTime;
        uint256 amountRaised;
        bool isActive;
        uint256 referrerBonusAmount;
    }

    uint256 public currentStageId; // Returns the ongoing stage ID

    mapping(uint256 => Stage) public stages;

    // Modifiers
    modifier onlyDuringPresale() {
        require(presaleEnded != true, "Presale not active");
        _;
    }

    modifier onlyWhenStageActive() {
        require(
            stages[currentStageId].isActive == true,
            "Current Stage not active"
        );
        _;
    }

    modifier onlyWhitelistedOrEther(address tokenAddress) {
        require(
            tokenAddress == address(0) || whitelistedTokens[tokenAddress],
            "Token not whitelisted"
        );
        _;
    }

    /**
     * @dev Initializer to set up the presale contract. Replaces constructor for upgradeable contracts.
     * @param _minPurchase The minimum contribution amount.
     * @param _maxPurchase The maximum contribution amount.
     * @param _vestingDuration Duration of the vesting period.
     * @param _cliffDuration Cliff duration before vesting starts.
     * @param _treasury The address to receive raised funds.
     * @param _referrerBonusPercentage The bonus percentage for referrers.
     * @param _ethPriceFeed Chainlink price feed address of ETH
     * @param _vestingPercentage The percentage of tokens being set for vesting
     */
    function initialize(
        uint256 _minPurchase,
        uint256 _maxPurchase,
        uint256 _vestingDuration,
        uint256 _cliffDuration,
        address payable _treasury,
        uint256 _referrerBonusPercentage,
        address _ethPriceFeed,
        uint256 _vestingPercentage
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        __Pausable_init();

        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        vestingDuration = _vestingDuration;
        cliffDuration = _cliffDuration;
        treasury = _treasury;
        referrerBonusPercentage = _referrerBonusPercentage;
        ethDataFeed = AggregatorV3Interface(_ethPriceFeed);
        vestingPercentage = _vestingPercentage;
    }

    /**
     * @dev Initializes the next presale stage with the provided parameters.
     * @param tokenAllocation The total number of tokens allocated for this stage.
     * @param rate The rate at which tokens are sold per USD.
     */
    function initNextPresaleStage(
        uint256 tokenAllocation,
        uint256 rate
    ) external onlyOwner onlyDuringPresale {
        require(tokenAllocation > 0, "Token allocation must be greater than 0");
        require(rate > 0, "Rate must be greater than 0");

        // First stage activation bypass this condition
        if (currentStageId > 0) {
            require(
                stages[currentStageId].isActive == false,
                "Current stage is still active"
            );
        }
        currentStageId++;

        // check token balance in contract

        stages[currentStageId] = Stage({
            tokensAllocated: tokenAllocation,
            tokensSold: 0,
            rate: rate,
            startTime: block.timestamp,
            endTime: 0,
            amountRaised: 0,
            isActive: true,
            referrerBonusAmount: 0
        });
        emit StageStarted(currentStageId, tokenAllocation, rate);
    }

    /**
     * @dev Updates token contract address being sold in presale. It's a one time call.
     * @param newTokenAddress The new token address.
     */
    function updateTokenAddress(address newTokenAddress) external onlyOwner {
        require(newTokenAddress != address(0), "Invalid token address");
        token = IERC20Upgradeable(newTokenAddress);
        emit TokenAddressupdated(newTokenAddress);
    }

    /**
     * @dev Updates the bonus percentage for referrers.
     * @param newBonusPercentage The new bonus percentage.
     */
    function updateReferrerBonusPercentage(
        uint256 newBonusPercentage
    ) external onlyOwner {
        require(newBonusPercentage <= 10000, "Invalid percentage");
        referrerBonusPercentage = newBonusPercentage;
        emit ReferrerBonusUpdated(newBonusPercentage);
    }

    /**
     * @dev Updates the treasury address.
     * @param newTreasury The new treasury address.
     */
    function updateTreasury(address payable newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    /**
     * @dev Pauses the presale.
     */
    function pausePresale() external onlyOwner {
        _pause();
        emit PresalePaused();
    }

    /**
     * @dev Resumes the presale.
     */
    function resumePresale() external onlyOwner {
        _unpause();
        emit PresaleResumed();
    }

    /**
     * @dev Updates the vesting Duration.
     * @param newVestingDuration The new vesting duration.
     */
    function updateVestingDuration(
        uint256 newVestingDuration
    ) external onlyOwner {
        require(
            newVestingDuration > cliffDuration,
            "Vesting duration must be greater than cliff duration"
        );
        vestingDuration = newVestingDuration;
        emit VestingParametersUpdated(newVestingDuration, cliffDuration);
    }

    /**
     * @dev Updates the cliff duration.
     * @param newCliffDuration The new cliff duration.
     */
    function updateCliffDuration(uint256 newCliffDuration) external onlyOwner {
        cliffDuration = newCliffDuration;
        emit VestingParametersUpdated(vestingDuration, newCliffDuration);
    }

    /**
     * @dev Updates the token allocated for the stage.
     * @param newTokenAllocated The new token allocated.
     * @param newRate The new rate for the stage.
     */
    function updatePresaleStageParameters(
        uint256 newTokenAllocated,
        uint256 newRate
    ) external onlyOwner {
        stages[currentStageId].tokensAllocated = newTokenAllocated;
        stages[currentStageId].rate = newRate;
        emit StageParameterUpdated(newTokenAllocated, newRate);
    }

    /**
     * @dev Updates the minimum and maximum purchase limits.
     * @param newMinPurchase The new minimum purchase amount.
     * @param newMaxPurchase The new maximum purchase amount.
     */
    function updateMinMaxPurchase(
        uint256 newMinPurchase,
        uint256 newMaxPurchase
    ) external onlyOwner {
        require(newMinPurchase > 0, "Minimum purchase must be greater than 0");
        require(
            newMaxPurchase > newMinPurchase,
            "Maximum purchase must be greater than minimum purchase"
        );

        minPurchase = newMinPurchase;
        maxPurchase = newMaxPurchase;

        emit MinMaxPurchaseUpdated(newMinPurchase, newMaxPurchase);
    }

    /**
     * @dev Updates the vesting percentage for token distribution.
     * @param newVestingPercentage The percentage of tokens being set for vesting
     */
    function updateVestingPercentage(
        uint256 newVestingPercentage
    ) external onlyOwner {
        vestingPercentage = newVestingPercentage;

        emit VestingPercentageUpdated(newVestingPercentage);
    }

    /**
     * @dev Whitelists a list of ERC20 tokens for payment in the presale.
     * @param tokens An array of token addresses to whitelist.
     */
    function whitelistPaymentTokens(
        address[] calldata tokens
    ) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            whitelistedTokens[tokens[i]] = true;
            tokenList.push(tokens[i]);
            emit TokenWhitelisted(tokens[i]);
        }
    }

    /**
     * @dev Removes ERC20 tokens from the whitelist.
     * @param tokens An array of token addresses to delist.
     */
    function delistPaymentTokens(address[] calldata tokens) external onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            whitelistedTokens[tokens[i]] = false;
            emit TokenDelisted(tokens[i]);
        }
    }

    /**
     * @dev Retrieves the latest price from the Chainlink price feed.
     */
    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = ethDataFeed.latestRoundData();
        return uint256(price * (10 ** 10)); // Coversion to 18 decimals
    }

    /**
     * @dev Allows users to purchase tokens during the presale by sending Ether or whitelisted ERC20 tokens.
     * @param tokenAddress The address of the ERC20 token used for payment, or the zero address for Ether payment.
     * @param usdAmount The amount of Ether or ERC20 tokens being spent.
     * @param referrer The address of the referrer.
     */
    function buyTokens(
        address tokenAddress,
        uint256 usdAmount,
        address referrer
    )
        external
        payable
        nonReentrant
        onlyDuringPresale
        onlyWhenStageActive
        whenNotPaused
        onlyWhitelistedOrEther(tokenAddress)
    {
        require(
            usdAmount >= minPurchase && usdAmount <= maxPurchase,
            "Amount out of range"
        );

        Stage storage stage = stages[currentStageId];

        uint tokenAmount = (usdAmount * 1 ether) / stage.rate; // Here make sure min purchase is above 1 usdt token
        require(
            (stage.tokensAllocated - stage.tokensSold) >= tokenAmount,
            "Not enough tokens in stage"
        );

        // Stage Data
        stage.tokensSold += tokenAmount;
        stage.amountRaised += usdAmount;

        // User Data
        User storage userData = users[msg.sender];
        userData.tokensAllocated += tokenAmount;
        userData.usdInvested += usdAmount;

        contributions[msg.sender][tokenAddress] += usdAmount;

        uint256 referrerTokens;
        // Referrer Data
        if (referrer != address(0) && referrer != msg.sender) {
            User storage userreferrerData = users[referrer];
            referrerTokens = (tokenAmount * referrerBonusPercentage) / 10000;
            //Add Tokens to refferal Address
            userreferrerData.referrerEarnings += referrerTokens;
            userreferrerData.noOfReferrals++;
            stage.referrerBonusAmount += referrerTokens;
            totalReferrerBonusAllocated += referrerTokens;
        }

        // Transfer before state changes
        IERC20Upgradeable(tokenAddress).safeTransferFrom(
            msg.sender,
            treasury,
            usdAmount
        );

        emit TokensPurchased(
            msg.sender,
            referrer,
            tokenAddress,
            usdAmount,
            tokenAmount,
            referrerTokens,
            currentStageId
        );
    }

    /**
     * @dev Fallback function to receive Ether.
     */
    receive() external payable {
        revert(
            "Use buyTokensWithETH or buyTokensWithTokens to purchase tokens"
        );
    }

    /**
     * @dev Allows users to purchase tokens during the presale by sending Ether or whitelisted ERC20 tokens.
     * @param referrer The address of the referrer.
     */
    function buyTokensETH(
        address referrer
    )
        external
        payable
        nonReentrant
        onlyDuringPresale
        onlyWhenStageActive
        whenNotPaused
        onlyWhitelistedOrEther(address(0))
    {
        uint256 ethUsdRate = getLatestPrice();
        // 18 decimals * 18 decimals * 6 decimals / 36 decimals
        uint256 usdAmount = (msg.value * ethUsdRate) / 10 ** 30;
        require(
            usdAmount >= minPurchase && usdAmount <= maxPurchase,
            "Amount out of range"
        );

        Stage storage stage = stages[currentStageId];
        uint256 tokenAmount = (usdAmount * 1 ether) / stage.rate; // Here make sure min purchase is above 1 usdt token
        require(
            (stage.tokensAllocated - stage.tokensSold) >= tokenAmount,
            "Not enough tokens in stage"
        );

        //ETH Transfer
        (bool successTreasury, ) = (treasury).call{value: msg.value}("");
        require(successTreasury, "Treasury Transfer failed");

        // Stage Data
        stage.tokensSold += tokenAmount;
        stage.amountRaised += usdAmount;

        // User Data
        User storage userData = users[msg.sender];
        userData.tokensAllocated += tokenAmount;
        userData.usdInvested += usdAmount;

        contributions[msg.sender][address(0)] += msg.value;

        uint256 referrerTokens;
        // Referrer Data
        if (referrer != address(0) && referrer != msg.sender) {
            User storage userreferrerData = users[referrer];
            referrerTokens = (tokenAmount * referrerBonusPercentage) / 10000;
            //Add Tokens to refferal Address
            userreferrerData.referrerEarnings += referrerTokens;
            userreferrerData.noOfReferrals++;
            stage.referrerBonusAmount += referrerTokens;
            totalReferrerBonusAllocated += referrerTokens;
        }

        emit TokensPurchased(
            msg.sender,
            referrer,
            address(0),
            msg.value,
            tokenAmount,
            referrerTokens,
            currentStageId
        );
    }

    /**
     * @notice End the current presale stage
     * @dev Sets the current stage status to inactive
     */
    function endPresaleStage() public onlyOwner {
        require(
            stages[currentStageId].isActive,
            "Stage already ended or not started"
        );
        stages[currentStageId].isActive = false;
        emit StageFinalized(currentStageId);
    }

    /**
     * @notice Finalize the presale
     * @dev Sets the presale status to inactive and sets the vesting start time
     */
    function finalisePresale() external onlyOwner {
        require(!presaleEnded, "Presale already finalized");
        if (stages[currentStageId].isActive == true) {
            endPresaleStage();
        }
        presaleEnded = true;
        vestingStartTime = block.timestamp;
        emit PresaleFinalized(block.timestamp);
    }

    /**
     * @notice Releases the claim tokens.
     * @dev Sets the claim release status to true
     */
    function releaseClaim() external onlyOwner {
        claimReleased = true;
        emit ClaimReleased();
    }

    /**
     * @notice Claim allocated tokens
     * @dev Users can claim tokens only after the presale is finalized and the cliff duration has passed
     */
    function claimTokens() external nonReentrant {
        // Ensure presale is inactive
        require(presaleEnded, "Presale is still active");

        // Ensure Claim allowed
        require(claimReleased, "Claim not released yet");

        uint256 vestedTokensToClaim = claimableTokens(msg.sender);

        require(vestedTokensToClaim > 0, "No tokens to claim at this time");

        // Update claimed tokens
        users[msg.sender].tokensClaimed += vestedTokensToClaim;
        require(
            token.balanceOf(address(this)) >= vestedTokensToClaim,
            "Insufficient tokens in contract"
        );
        token.safeTransfer(msg.sender, vestedTokensToClaim);

        emit TokensClaimed(msg.sender, vestedTokensToClaim);
    }

    function claimableTokens(address user) public view returns (uint256) {
        // Should have purchased token during presale
        User storage userData = users[user];
        require(userData.tokensAllocated > 0, "No tokens to claim");

        // Calculate cliff end time
        uint256 cliffEndTime = vestingStartTime + cliffDuration;
        uint initialReleaseTokens = (userData.tokensAllocated *
            (100 - vestingPercentage)) / 100;

        //Instead of require if can be used
        if ((block.timestamp >= cliffEndTime) && vestingStartTime != 0) {
            //require((block.timestamp >= cliffEndTime) && vestingStartTime != 0, "Cliff duration not passed");

            uint256 vestingEndTime = vestingStartTime + vestingDuration; // Calculate vesting end time

            uint256 elapsedTime = block.timestamp - vestingStartTime; // Calculate elapsed time since cliff end

            uint256 vestedTokens;

            // If vesting ended, claim all remaining tokens
            if (block.timestamp >= vestingEndTime) {
                vestedTokens =
                    userData.tokensAllocated -
                    userData.tokensClaimed;
            } else {
                vestedTokens =
                    ((userData.tokensAllocated - initialReleaseTokens) *
                        elapsedTime) /
                    vestingDuration; // Calculate vested tokens linearly
                vestedTokens += initialReleaseTokens;
                vestedTokens -= userData.tokensClaimed; // Subtract already claimed tokens
            }

            return vestedTokens;
        } else if ((block.timestamp < cliffEndTime) && vestingStartTime != 0) {
            // Cliff has not passed but check if initial release can be claimed
            if (userData.tokensClaimed == 0) {
                // The user can claim the initial release tokens if not claimed already
                return initialReleaseTokens;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    /**
     * @notice Release referrer bonus
     * @dev Sets the referrer bonus release status to true
     */
    function releaseReferrerBonus() external onlyOwner {
        referrerBonusReleased = true;
        emit ReferrerBonusReleased();
    }

    /**
     * @notice Claim referrer bonus
     * @dev Users can claim referrer bonus only after the presale is finalized and the referrer bonus is released
     */
    function claimReferrerBonus() external nonReentrant {
        // Ensure presale is inactive
        require(presaleEnded, "Presale is still active");
        // Ensure referrer bonus is released
        require(referrerBonusReleased, "Referrer bonus not released yet");

        User storage userData = users[msg.sender];
        require(
            userData.referrerEarnings > 0 &&
                userData.referrerEarningsClaimed == 0,
            "No referrer bonus to claim"
        );

        uint256 bonus = userData.referrerEarnings;
        userData.referrerEarningsClaimed = bonus;
        token.safeTransfer(msg.sender, bonus);

        emit ReferrerBonusClaimed(msg.sender, bonus);
    }

    /**
     * @dev Allows the owner to withdraw any accidentally sent ERC20 tokens or Ether from the contract.
     * @param tokenAddress The address of the ERC20 token to withdraw. Set to address(0) to withdraw Ether.
     * Use the same function for withdraw unallocated tokens
     */
    function withdrawAccidentalFunds(address tokenAddress) external onlyOwner {
        if (tokenAddress == address(0)) {
            uint256 balance = address(this).balance;
            treasury.transfer(balance);
            emit AccidentalTokenWithdrawn(treasury, address(0), balance);
        } else {
            IERC20Upgradeable tokenContract = IERC20Upgradeable(tokenAddress);
            uint256 balance = tokenContract.balanceOf(address(this));
            tokenContract.safeTransfer(treasury, balance);
            emit AccidentalTokenWithdrawn(treasury, tokenAddress, balance);
        }
    }

    /**
     * @notice Get list of Whitelisted Tokens
     */
    function getWhitelistedTokens() public view returns (address[] memory) {
        uint whistlistTokenCount = 0;
        for (uint256 i = 0; i < tokenList.length; i++) {
            if (whitelistedTokens[tokenList[i]] == true) {
                whistlistTokenCount += 1;
            }
        }
        address[] memory whitelistedList = new address[](whistlistTokenCount);
        uint whitelistIndex = 0;
        for (uint256 k = 0; k < tokenList.length; k++) {
            if (whitelistedTokens[tokenList[k]] == true) {
                whitelistedList[whitelistIndex] = tokenList[k];
                whitelistIndex += 1;
            }
        }
        return whitelistedList;
    }
}
