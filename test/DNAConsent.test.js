const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DNAConsent", function () {
  let contract, user, researcher;

  beforeEach(async () => {
    const DNAConsent = await ethers.getContractFactory("DNAConsent");
    contract = await DNAConsent.deploy();
    await contract.waitForDeployment(); // <-- FIXED HERE

    [owner, user, researcher] = await ethers.getSigners();
  });

  it("should allow researcher to request access", async () => {
    await expect(contract.connect(researcher).requestAccess(user.address))
      .to.emit(contract, "AccessRequested")
      .withArgs(researcher.address, user.address);
  });

  it("should allow user to approve a researcher", async () => {
    await expect(contract.connect(user).approveResearcher(researcher.address))
      .to.emit(contract, "AccessGranted")
      .withArgs(user.address, researcher.address);

    expect(await contract.hasAccess(user.address, researcher.address)).to.be.true;
  });

  it("should allow user to revoke access", async () => {
    await contract.connect(user).approveResearcher(researcher.address);
    await expect(contract.connect(user).revokeResearcher(researcher.address))
      .to.emit(contract, "AccessRevoked")
      .withArgs(user.address, researcher.address);

    expect(await contract.hasAccess(user.address, researcher.address)).to.be.false;
  });

  it("should return approved researchers", async () => {
    await contract.connect(user).approveResearcher(researcher.address);
    const approved = await contract.getApprovedResearchers(user.address);
    expect(approved).to.include(researcher.address);
  });
});
