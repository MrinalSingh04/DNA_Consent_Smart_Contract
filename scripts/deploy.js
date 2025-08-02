const hre = require("hardhat");

async function main() {
  const DNAConsent = await hre.ethers.getContractFactory("DNAConsent");
  const contract = await DNAConsent.deploy();
  await contract.waitForDeployment();
  console.log(`DNAConsent deployed to: ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
