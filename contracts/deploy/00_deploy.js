const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

async function main() {

    const StreamYou = await ethers.getContractFactory("StreamYou");
    console.log("Deploying StreamYou...");
    const streamYou = await StreamYou.deploy();

    await streamYou.deployed();
    console.log("streamYou deployed to:", streamYou.address);
}

main();