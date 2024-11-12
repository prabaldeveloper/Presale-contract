// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockEthPriceFeed {
    int256 private _latestAnswer;
    uint256 private _updatedAt;

    constructor(int256 initialPrice) {
        _latestAnswer = initialPrice;
        _updatedAt = block.timestamp;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _latestAnswer, 0, _updatedAt, 0);
    }

    function updatePrice(int256 newPrice) external {
        _latestAnswer = newPrice;
        _updatedAt = block.timestamp;
    }
}
