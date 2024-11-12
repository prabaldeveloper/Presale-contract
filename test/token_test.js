const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("MockToken", function () {
  let MockToken, mockToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MockToken = await ethers.getContractFactory("MockToken");
    mockToken = await upgrades.deployProxy(MockToken, ["Mock Token", "MTK", ethers.utils.parseUnits("1000", 18), addr1.address], { initializer: 'initialize' });
    await mockToken.deployed();
  });

  it("should initialize the token with the correct name and symbol", async function () {
    expect(await mockToken.name()).to.equal("Mock Token");
    expect(await mockToken.symbol()).to.equal("MTK");
  });

  it("should mint the initial supply to the specified address", async function () {
    const balance = await mockToken.balanceOf(addr1.address);
    expect(balance).to.equal(ethers.utils.parseUnits("1000", 18));
  });

  it("should transfer tokens correctly", async function () {
    await mockToken.connect(addr1).transfer(addr2.address, ethers.utils.parseUnits("100", 18));
    expect(await mockToken.balanceOf(addr2.address)).to.equal(ethers.utils.parseUnits("100", 18));
    expect(await mockToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseUnits("900", 18));
  });

  it("should allow only owner to call ownable functions", async function () {
    await expect(mockToken.connect(addr1).transferOwnership(addr2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    await mockToken.transferOwnership(addr1.address);
    expect(await mockToken.owner()).to.equal(addr1.address);
  });
});
