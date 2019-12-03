const { expectRevert, ether, send } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeTaskIsResolved = ([_, alice, bob]) => {
  describe("when Failure", function() {
    it("is finalized", async function() {
      expect(await this.contract.isFinalized()).to.be.equal(true);
    });

    it("is resolved", async function() {
      expect(await this.contract.isResolved()).to.be.equal(true);
    });

    it("can not be finalized", async function() {
      const owner = await this.contract.owner();
      await expectRevert(
        this.contract.finalize({ from: owner }),
        "Finalizable: Contract already finalized"
      );
    });

    it("can not timeout", async function() {
      await expectRevert(
        this.contract.timeout({ from: alice }),
        "RefundableTask: can not timeout if task already resolved"
      );
    });

    it("can not cancel", async function() {
      await expectRevert(
        this.contract.cancel({ from: alice }),
        "RefundableTask: caller is not the beneficiary"
      );
      await expectRevert(
        this.contract.cancel({ from: bob }),
        "RefundableTask: can only cancel task while active"
      );
    });

    it("can not raise dispute", async function() {
      await expectRevert(
        this.contract.raiseDispute({ from: alice }),
        "RefundableTask: caller is not the beneficiary"
      );
      await expectRevert(
        this.contract.raiseDispute({ from: bob }),
        "RefundableTask: can only raise dispute while active"
      );
    });

    const amount = ether("1");

    it("can not send ether", async function() {
      await expectRevert(
        send.ether(alice, this.contract.address, amount),
        "RefundableTask: can only accept funds while task in progress"
      );
      await expectRevert(
        send.ether(bob, this.contract.address, amount),
        "RefundableTask: can only accept funds while task in progress"
      );
    });

    it("can not send ether to fund task", async function() {
      await expectRevert(
        this.contract.fundTask(alice, { from: alice }),
        "RefundableTask: can only fund task while active"
      );
      await expectRevert(
        this.contract.fundTask(bob, { from: bob }),
        "RefundableTask: can only fund task while active"
      );
    });

    it("can not send ether to fund dispute resolution", async function() {
      await expectRevert(
        this.contract.fundDisputeResolution({ from: alice }),
        "RefundableTask: can only fund dispute resolution while in dispute"
      );
      await expectRevert(
        this.contract.fundDisputeResolution({ from: bob }),
        "RefundableTask: can only fund dispute resolution while in dispute"
      );
    });
  });
};

module.exports = {
  shouldBehaveLikeTaskIsResolved
};
