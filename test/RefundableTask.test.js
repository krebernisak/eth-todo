const { time, expectRevert } = require("@openzeppelin/test-helpers");
const { shouldBehaveLikeTimelock } = require("./lifecycle/Timelock.behaviour");
const { expect } = require("chai");

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

  describe("in Dispute", function() {
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
  });

  shouldBehaveLikeTimelock();
});
