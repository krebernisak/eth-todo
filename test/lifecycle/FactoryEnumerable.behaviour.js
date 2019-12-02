const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeFactoryEnumerable = ([_, owner, ...other]) => {
  describe("as a FactoryEnumerable", function() {
    it("starts with 0 creators", async function() {
      expect(await this.contract.creatorsCount()).to.be.bignumber.equal("0");
    });

    it("counts creators", async function() {
      await this.createFn(owner);
      expect(await this.contract.creatorsCount()).to.be.bignumber.equal("1");
      let index = new BN("0");
      expect(await this.contract.creators(index)).to.equal(owner);
    });

    it("counts same creator only once", async function() {
      await this.createFn(owner);
      await this.createFn(owner);
      await this.createFn(owner);
      expect(await this.contract.creatorsCount()).to.be.bignumber.equal("1");
      let index = new BN("0");
      expect(await this.contract.creators(index)).to.equal(owner);
    });

    it("counts different creators", async function() {
      await this.createFn(owner);
      await this.createFn(other[0]);
      await this.createFn(other[1]);
      expect(await this.contract.creatorsCount()).to.be.bignumber.equal("3");
      let index = new BN("2");
      expect(await this.contract.creators(index)).to.equal(other[1]);
    });
  });
};

module.exports = {
  shouldBehaveLikeFactoryEnumerable
};
