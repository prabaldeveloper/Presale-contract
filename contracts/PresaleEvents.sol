// SPDX-License-Identifier: UNLICESNSED
pragma solidity ^0.8.0;

abstract contract PresaleEvents {
    event TokensPurchased(address indexed purchaser, address indexed referrer, address indexed token, uint256 usdAmount, uint256 tokenAmount, uint256 referralBonusAmount, uint256 batchId);
    event PresaleFinalized(uint256 timestamp);
    event StageFinalized(uint256 indexed stageId);
    event StageStarted(uint256 indexed stageId, uint256 tokensAllocated, uint256 rate);
    event TokenAddressupdated(address newTokenAddress);
    event TreasuryUpdated(address newTreasury);
    event ReferrerBonusUpdated(uint256 newBonus);
    event VestingParametersUpdated(uint256 newVestingDuration, uint256 newCliffDuration);
    event StageParameterUpdated(uint256 newAllocation, uint256 newRate);
    event MinMaxPurchaseUpdated(uint256 minPurchase, uint256 maxPurchase);
    event TokenWhitelisted(address indexed token);
    event TokenDelisted(address indexed token);
    event PresalePaused();
    event PresaleResumed();
    event ClaimReleased();
    event ReferrerBonusReleased();
    event TokensClaimed(address indexed user, uint256 vestedTokens);
    event ReferrerBonusClaimed(address indexed user, uint256 bonusAmount);
    event VestingPercentageUpdated(uint256 vestingPercentage);
    event AccidentalTokenWithdrawn(address indexed owner, address indexed tokenAddress, uint256 amount);
}