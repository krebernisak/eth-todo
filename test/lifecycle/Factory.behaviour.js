const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeFactory = ([_, alice, bob, charlie]) => {
  describe("as Factory", function() {
    it("starts with 0 instantiations", async function() {
      const count = await this.contract.instantiationCount(alice);
      expect(count).to.be.bignumber.equal("0");
    });

    it("counts instantiations", async function() {
      await this.createFn(alice);
      const count = await this.contract.instantiationCount(alice);
      expect(count).to.be.bignumber.equal("1");
    });

    it("counts multiple instantiations", async function() {
      await this.createFn(alice);
      await this.createFn(alice);
      await this.createFn(alice);
      const count = await this.contract.instantiationCount(alice);
      expect(count).to.be.bignumber.equal("3");
    });

    it("counts instantiations from different addresses", async function() {
      await this.createFn(alice);
      await this.createFn(bob);
      await this.createFn(charlie);
      await this.createFn(charlie);
      const countAlice = await this.contract.instantiationCount(alice);
      const countBob = await this.contract.instantiationCount(bob);
      const countCharlie = await this.contract.instantiationCount(charlie);
      expect(countAlice).to.be.bignumber.equal("1");
      expect(countBob).to.be.bignumber.equal("1");
      expect(countCharlie).to.be.bignumber.equal("2");
    });

    const testCreate = async function(receipt, acc, index) {
      let { sender, instantiation } = receipt.logs.filter(
        l => l.event == "ContractInstantiation"
      )[0].args;
      expect(sender).to.be.equal(acc);
      let instantiationsFn = this.contract.instantiations(acc, index);
      expect(await instantiationsFn).to.be.equal(instantiation);
      let isInstantiationFn = this.contract.isInstantiation(instantiation);
      expect(await isInstantiationFn).to.be.equal(true);
    };

    it("tracks instantiation", async function() {
      testCreate.call(this, await this.createFn(alice), alice, new BN("0"));
    });

    it("tracks multiple instantiation", async function() {
      testCreate.call(this, await this.createFn(alice), alice, new BN("0"));
      testCreate.call(this, await this.createFn(alice), alice, new BN("1"));
      testCreate.call(this, await this.createFn(alice), alice, new BN("2"));
    });

    it("tracks multiple instantiation from different accounts", async function() {
      testCreate.call(this, await this.createFn(alice), alice, new BN("0"));
      testCreate.call(this, await this.createFn(alice), alice, new BN("1"));
      testCreate.call(this, await this.createFn(bob), bob, new BN("0"));
      testCreate.call(this, await this.createFn(charlie), charlie, new BN("0"));
      testCreate.call(this, await this.createFn(charlie), charlie, new BN("1"));
      testCreate.call(this, await this.createFn(charlie), charlie, new BN("2"));
    });
  });
};

module.exports = {
  shouldBehaveLikeFactory
};
