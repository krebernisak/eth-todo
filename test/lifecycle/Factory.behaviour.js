const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeFactory = ([_, owner, ...other]) => {
  describe("as Factory", function() {
    it("starts with 0 instantiations", async function() {
      expect(
        await this.contract.instantiationCount(owner)
      ).to.be.bignumber.equal("0");
    });

    it("counts instantiations", async function() {
      await this.createFn(owner);
      expect(
        await this.contract.instantiationCount(owner)
      ).to.be.bignumber.equal("1");
    });

    it("counts multiple instantiations", async function() {
      await this.createFn(owner);
      await this.createFn(owner);
      await this.createFn(owner);
      expect(
        await this.contract.instantiationCount(owner)
      ).to.be.bignumber.equal("3");
    });

    it("counts instantiations from different addresses", async function() {
      await this.createFn(owner);
      await this.createFn(other[0]);
      await this.createFn(other[1]);
      await this.createFn(other[1]);
      expect(
        await this.contract.instantiationCount(owner)
      ).to.be.bignumber.equal("1");
      expect(
        await this.contract.instantiationCount(other[0])
      ).to.be.bignumber.equal("1");
      expect(
        await this.contract.instantiationCount(other[1])
      ).to.be.bignumber.equal("2");
    });
  });
};

module.exports = {
  shouldBehaveLikeFactory
};
