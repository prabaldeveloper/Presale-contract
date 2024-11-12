async function main() {
    const tokenPresale = await ethers.getContractFactory("TokenPresale")
    //let TokenPresale = await upgrades.forceImport("0xCf8322f6Ba1F29e7be32e64aBB3e01D397Eb9f4b", tokenPresale);
    let TokenPresale = await upgrades.upgradeProxy("0xC73a02c63277fC12F28Ae6D78bD7E1B6b425911B", tokenPresale)
    console.log("Your upgraded proxy is done!", TokenPresale.address);
    console.log(await TokenPresale.owner());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)    
        process.exit(1)
    })