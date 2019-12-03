const { expect } = require("chai");
const {
  ether,
  balance,
  time,
  expectRevert,
  BN
} = require("@openzeppelin/test-helpers");
const { shouldBehaveLikeTimelock } = require("./lifecycle/Timelock.behaviour");
const {
  shouldBehaveLikeTaskIsActive
} = require("./RefundableTask.Active.behaviour");
const {
  shouldBehaveLikeTaskIsFailure
} = require("./RefundableTask.Failure.behaviour");
const {
  shouldBehaveLikeTaskIsSuccess
} = require("./RefundableTask.Success.behaviour");

const RefundableTask = artifacts.require("RefundableTask");

contract("RefundableTask", function(accounts) {
  const [_, alice, bob, charlie] = accounts;

  beforeEach(async function() {
    let endTime = (await time.latest()).add(time.duration.minutes(10));
    this.contract = await RefundableTask.new("uri://", endTime, bob, charlie, {
      from: alice
    });
  });

  describe("as Finalizable", function() {
    it("is not finalized at start", async function() {
      expect(await this.contract.isFinalized()).to.be.equal(false);
    });

    it("can not be finalized in start state", async function() {
      await expectRevert(
        this.contract.finalize({ from: alice }),
        "RefundableTask: final state can only be Success or Failure"
      );
    });
  });

  shouldBehaveLikeTaskIsActive(accounts);

  describe("when accepted", function() {
    beforeEach(async function() {
      await this.contract.finish("uri://", { from: bob });
      await this.contract.accept({ from: alice });
    });

    shouldBehaveLikeTaskIsSuccess(accounts);
  });

  describe("when canceled", function() {
    beforeEach(async function() {
      await this.contract.cancel({ from: bob });
    });

    shouldBehaveLikeTaskIsFailure(accounts);
  });

  describe("when in Dispute", function() {
    beforeEach(async function() {
      await this.contract.finish("uri://", { from: bob });
      await this.contract.raiseDispute({ from: bob });
    });

    it("is not finalized", async function() {
      expect(await this.contract.isFinalized()).to.be.equal(false);
    });

    it("is in state Dispute", async function() {
      expect(await this.contract.state()).to.be.bignumber.equal("1"); // enum Dispute
    });

    it("is finished", async function() {
      expect(await this.contract.isFinished()).to.be.equal(true);
    });

    it("can not be finalized", async function() {
      await expectRevert(
        this.contract.finalize({ from: alice }),
        "RefundableTask: final state can only be Success or Failure"
      );
    });

    it("can send ether to fund dispute resolution", async function() {
      const amount = ether("1");
      await this.contract.fundDisputeResolution({ value: amount, from: alice });
      await this.contract.fundDisputeResolution({ value: amount, from: bob });
      expect(
        await balance.current(this.contract.address)
      ).to.be.bignumber.equal(ether("2"));
    });

    describe("resolved as Failure", function() {
      beforeEach(async function() {
        const failure = new BN("3");
        await this.contract.resolveDispute(failure, { from: charlie });
      });

      shouldBehaveLikeTaskIsFailure(accounts);
    });

    describe("resolved as Success", function() {
      beforeEach(async function() {
        const success = new BN("2");
        await this.contract.resolveDispute(success, { from: charlie });
      });

      shouldBehaveLikeTaskIsSuccess(accounts);
    });
  });

  shouldBehaveLikeTimelock(accounts);
});
