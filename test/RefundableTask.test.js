const { time, expectRevert } = require("@openzeppelin/test-helpers");
const { shouldBehaveLikeTimelock } = require("./lifecycle/Timelock.behaviour");

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

  shouldBehaveLikeTimelock();
});
