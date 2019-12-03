const {
  ether,
  balance,
  send,
  expectRevert
} = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeTaskIsActive = ([_, alice, bob]) => {
  describe("when Active", function() {
    it("is in state Active", async function() {
      expect(await this.contract.state()).to.be.bignumber.equal("0"); // enum Active
    });

    it("is not finalized", async function() {
      expect(await this.contract.isFinalized()).to.be.equal(false);
    });

    it("is not resolved", async function() {
      expect(await this.contract.isResolved()).to.be.equal(false);
    });

    it("can not be finalized", async function() {
      const owner = await this.contract.owner();
      await expectRevert(
        this.contract.finalize({ from: owner }),
        "RefundableTask: final state can only be Success or Failure"
      );
    });

    const amount = ether("1");

    it("can send ether", async function() {
      await send.ether(alice, this.contract.address, amount);
      await send.ether(bob, this.contract.address, amount);
      expect(
        await balance.current(this.contract.address)
      ).to.be.bignumber.equal(ether("0"));
      expect(await this.contract.taskBalance()).to.be.bignumber.equal(
        ether("2")
      );
    });

    it("can send ether to fund task", async function() {
      await this.contract.fundTask(alice, { value: amount, from: alice });
      await this.contract.fundTask(bob, { value: amount, from: bob });
      expect(
        await balance.current(this.contract.address)
      ).to.be.bignumber.equal(ether("0"));
      expect(await this.contract.taskBalance()).to.be.bignumber.equal(
        ether("2")
      );
    });

    it("can not send ether to fund dispute resolution", async function() {
      await expectRevert(
        this.contract.fundDisputeResolution({ value: amount, from: alice }),
        "RefundableTask: can only fund dispute resolution while in dispute"
      );
      await expectRevert(
        this.contract.fundDisputeResolution({ value: amount, from: bob }),
        "RefundableTask: can only fund dispute resolution while in dispute"
      );
    });
  });
};

module.exports = {
  shouldBehaveLikeTaskIsActive
};
