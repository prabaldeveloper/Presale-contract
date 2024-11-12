// scripts/deploy.js

async function main() {
    const { ethers, upgrades } = require("hardhat");
  
    // Retrieve the contract factory
    const MockToken = await ethers.getContractFactory("Token");
  
    // Deploy an upgradeable contract
    const mockToken = await upgrades.deployProxy(MockToken, ["TestToken", "TT", ethers.utils.parseUnits("10000000000", 18)], {
      initializer: "initialize",
    });
  
    await mockToken.deployed();
  
    console.log("TestToken deployed to:", mockToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  