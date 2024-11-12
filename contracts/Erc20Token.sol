// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Token is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    
    /// @dev Initializer function to replace constructor for upgradeable contracts.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    function initialize(string memory name, string memory symbol) public initializer {
        __Ownable_init();
        __ERC20_init(name, symbol);
    }

    /// @dev Mint function to create new tokens and assign them to the specified account.
    /// @param account The address that will receive the minted tokens.
    /// @param amount The number of tokens to mint.
    /// @return bool Returns true if the mint operation is successful.
    function mint(address account, uint256 amount) public onlyOwner returns (bool) {
        _mint(account, amount);
        return true;
    }
}
