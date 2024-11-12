# **Technical Documentation of Presale Contract**

## **Overview**

### **Purpose**

The presale contract manages the presale of AI tokens, including multiple stages with token allocation, USD rates, and token vesting.

### **Features**

Multi-stage token presale

Token vesting

Referrer bonus

### **Dependencies**

Chainlink price feed for ETH/USD conversion

AI Token contract

Accepted token for payment

OpenZeppelin contracts

## **Contract Architecture**

### **Modules**

**Presale Stages**: Manage different stages of the presale.

**Token Allocation**: Handle token distribution and vesting.

**Payment Processing**: Process payments in ETH and accepted tokens.

### **Features**

Upgradable contracts

Reentrancy guard

Pausable

Ownable

Initializable

Events for each function

### **Functions**

#### **1\. initialize**

**Visibility**: public

**Description**: Initializes the presale contract.

**Parameters**:

\_tokenAddress (address): The address of the ERC20 token being sold.

\_minPurchase (uint256): The minimum amount of Ether or tokens that can be spent.

\_maxPurchase (uint256): The maximum amount of Ether or tokens that can be spent.

\_vestingDuration (uint256): Duration of the vesting period.

\_cliffDuration (uint256): Cliff duration before vesting starts.

\_treasury (address payable): The address to receive raised funds.

\_referrerBonusPercentage (uint256): The bonus percentage for referrers.

\_ethPriceFeed (address): Chainlink price feed address of ETH.

**Returns**: none

**Modifiers**: initializer

#### **2\. initNextPresaleStage**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Each stage can be initialized here with token allocation and usd rate of the token.
  3. Token allocation and usd rate should be > 0
  4. Except the first stage, before each stage initialization the previous stage should be ended. i.e previous stage status should not be active
  5. Current stage ID will be incremented and next stage will be started.

**Parameters**:

tokenAllocation (uint256): The total number of tokens allocated for this stage.

rate (uint256): The rate at which tokens are sold per USD.

**Returns**: none

**Modifiers**: onlyOwner, onlyDuringPresale

**Events**:

StageStarted

currentStageId: The current stage of the presale.

tokenAllocation: The tokens allocated for the presale.

rate: The rate at which tokens are sold per USD.

#### **3\. updateReferrerBonusPercentage**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Referrer bonus percentage can be updated anytime irrespective of stage status and presale status.

**Parameters**:

newBonusPercentage (uint256): The new bonus percentage.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

ReferrerBonusUpdated

newBonusPercentage: The new bonus percentage.

#### **4\. updateTreasury**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Treasury address can be updated anytime with payable EOA address

**Parameters**:

newTreasury (address payable): The new treasury address.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

TreasuryUpdated

newTreasury: The new treasury address.

#### **5\. pausePresale**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Presale stage can be paused anytime
  3. This wont allow users to buy tokens

**Parameters**: None

**Returns**: none

**Modifiers**: onlyOwner

**Events**: PresalePaused

#### **6\. resumePresale**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Paused presale can be resumed anytime
  3. Will resume the users to buy tokens

**Parameters**: None

**Returns**: none

**Modifiers**: onlyOwner

**Events**: PresaleResumed

#### **7\. updateVestingDuration**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Vesting Duration can be updated anytime (even after presale ends).
  3. Vesting duration should be greater than Cliff duration.

**Parameters**:

newVestingDuration (uint256): The new vesting duration.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

VestingParametersUpdated

newVestingDuration: The new vesting duration.

cliffDuration: The new cliff duration.

#### **8\. updateCliffDuration**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Cliff Duration can be updated anytime (even after presale ends).
  3. Cliff duration can be zero as well

**Parameters**:

newCliffDuration (uint256): The new cliff duration.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

VestingParametersUpdated

vestingDuration: The new vesting duration.

newCliffDuration: The new cliff duration.

#### **9\. updatePresaleStageParameters**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Stage token allocation and rate can be updated for the current stage after _‘initNextPresaleStage’_

**Parameters**:

newTokenAllocated (uint256): The new token allocation amount.

newRate(uint256): The new rate of the token.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

StageParameterUpdated

newTokenAllocated: The new token allocation for the stage.

#### **10\. whitelistPaymentTokens**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Whitelist USDT, USDC and ETH(zero) address.
  3. Buy function will allow only these three tokens to use as payment

**Parameters**:

tokens\[\] (address array): The array of token addresses to whitelist.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

TokenWhitelisted

tokens: The new payment token addresses to be whitelisted.

#### **11\. delistPaymentTokens**

**Visibility**: external

**Description**: Admin-only access. Delist the whitelisted tokens.

**Parameters**:

tokens\[\] (address array): The array of token addresses to delist.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

TokenDelisted

tokens: The new payment token addresses to be delisted.

#### **12\. getLatestPrice**

**Visibility**: public view

**Description**: Converts ETH to USD using Chainlink price feed.

**Parameters**: None

**Returns**:

uint256: Retrieves the latest price from Chainlink price feed.

**Modifiers**: onlyOwner

#### **13\. buyTokens**

**Visibility**: external

**Description**:

- 1. Non reentrant,
  2. Presale status should be active,
  3. Presale should not be paused,
  4. Uses only whitelisted tokens,
  5. Amount should be within minimum purchase and should not exceed maximum purchase per call,
  6. Token Allocation should not exceed current stage’s token allocation,
  7. Transfer should happen to treasury address
  8. Calculate Referrer Bonus based on token allocated and bonus percentage.
  9. Total allocation and referrer Bonus will be stored separately.
  10. Stage data, User data and Referrer Data is updated.

**Parameters**:

erc20Token (address): The address of the ERC20 token used for purchase.

amount (uint256): The amount of ERC20 tokens to spend.

referrer (address): The referrer address for bonus calculation.

**Returns**: none

**Modifiers**: nonReentrant, onlyDuringPresale, whenNotPaused, OnlyWhitelistedOrEther

**Events**:

TokensPurchased

purchaser: The address of the buyer.

referrer: The address of the referrer.

token: The address of the payment token.

usdAmount: The amount in USD.

tokenAmount: The number of tokens bought.

referrerBonusAmount: The number of bonus tokens for the referrer.

#### **14\. buyTokensETH**

**Visibility**: external

**Description**:

- 1. Non reentrant,
  2. Presale status should be active,
  3. Presale should not be paused,
  4. Amount should be within minimum purchase and should not exceed maximum purchase per call,
  5. Token Allocation should not exceed current stage’s token allocation,
  6. Uses chainlink to convert the eth to usd value
  7. Transfer should happen to treasury address
  8. Calculate Referrer Bonus based on token allocated and bonus percentage.
  9. Total allocation and referrer Bonus will be stored separately.
  10. Stage data, User data and Referrer Data is updated.

**Parameters**:

referrer (address): The referrer address for bonus calculation.

**Returns**: none

**Modifiers**: nonReentrant, onlyDuringPresale, whenNotPaused, OnlyWhitelistedOrEther

**Events**:

TokensPurchased

purchaser: The address of the buyer.

referrer: The address of the referrer.

token: The address of the payment token.

usdAmount: The amount in USD.

tokenAmount: The number of tokens bought.

referrerBonusAmount: The number of bonus tokens for the referrer.

#### **15\. endPresaleStage**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Admin checks the stage allocation filling manually and ends the presale(or he can increase the token allocation in ‘_updateStageParameters’)_.
  3. Ending the stage sets the status of current stage status to false. (Admin has to use ‘_initNextPresaleStage’_ for starting the next stage).

**Parameters**: None

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

StageFinalized

stageId: The current stage ID.

#### **16\. finalisePresale**

**Visibility**: external

**Description**: Admin-only access. Sets the presale status to false and starts vesting.

**Parameters**: None

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

PresaleFinalized

timestamp: The current time.

#### **17\. releaseClaim**

**Visibility**: external

**Description**:

- 1. Presale status should be inactive
  2. Users can claim only after releaseClaim status is updated to true
  3. Contract balance will be checked as per allocation.
  4. If contract balance is less than allocated, function will revert

**Parameters**: None

**Returns**: none

**Modifiers**: whenNotPaused, onlyOwner

**Events**:

ClaimReleased

#### **18.claimTokens**

**Visibility**: external

**Description**:

- 1. Presale status should be inactive
  2. Users can claim only after releaseClaim is called and after cliff duration starting from vesting start time.
  3. Linear release of tokens will be started after cliff duration.

**Parameters**: None

**Returns**: none

**Modifiers**: nonReentrant, whenNotPaused

**Events**:

TokensClaimed

beneficiary: The address of the token holder.

amount: The number of tokens claimed.

#### **19\. releaseReferrerBonus**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. ReferrerBonus release status will be set to true.
  3. Contract balance will be checked as per allocation bonus amount.
  4. If contract balance is less than allocated, function will revert

**Parameters**: None

**Returns**: none

**Modifiers**: whenNotPaused, onlyOwner

**Events**:

ReferrerBonusReleased

#### **20.claimReferrerBonus**

**Visibility**: external

**Description**:

- 1. Presale status should be inactive
  2. ReferrerBonus release status should be true.
  3. Users can claim their bonus anytime.

**Parameters**: None

**Returns**: none

**Modifiers**: nonReentrant, whenNotPaused

**Events**:

ReferrerBonusClaimed

beneficiary: The address of the token holder.

amount: The number of bonus tokens claimed.

#### **21.withdrawAccidentalFunds**

**Visibility**: external

**Description**:

- 1. Allows the owner to withdraw any accidentally sent ERC20 tokens or Ether from the contract.
  2. Also the owner can claim unAllocated tokens from the contract.

**Parameters**:

tokenAddress (address): The address of the ERC20 token to withdraw.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

AccidentalTokenWithdrawn

tokenAddress: The address of the token.

amount: The number of tokens withdrawn.

#### **9\. updateMinMaxPurchase**

**Visibility**: external

**Description**:

- 1. Admin can only access
  2. Minimum and Maximum amount to be purchased can be updated.
  3. Minimum Purchase should be greater than zero and maximum purchase should be greater than Minimum.

**Parameters**:

minPurchase (uint256): The new token allocation amount.

maxPurchase(uint256): The new rate of the token.

**Returns**: none

**Modifiers**: onlyOwner

**Events**:

MinMaxPurchaseUpdated

minPurchase: Minimum purchase of the token.

maxPurchase: Maximum purchase of the token.

## **Notes**

The contract follows best practices for security and efficiency.

All the contracts will be upgradable.

Reentrancy guard and pausability ensure robust and secure operations.

Proper event logging for transparency and traceability.