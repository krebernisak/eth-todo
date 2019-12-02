const { time } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeTimelock = () => {
  describe("as Timelock", function() {
    it("is locked at start", async function() {
      expect(await this.contract.isLocked()).to.be.equal(true);
    });

    it("is NOT unlocked at start", async function() {
      expect(await this.contract.isUnlocked()).to.be.equal(false);
    });

    describe("when time elapsed", () => {
      before(async function() {
        // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
        await time.advanceBlock();
      });

      beforeEach(async function() {
        const releaseTime = await this.contract.releaseTime();
        await time.increaseTo(releaseTime);
      });

      it("is not locked", async function() {
        expect(await this.contract.isLocked()).to.be.equal(false);
      });

      it("is unlocked", async function() {
        expect(await this.contract.isUnlocked()).to.be.equal(true);
      });
    });
  });
};

module.exports = {
  shouldBehaveLikeTimelock
};
