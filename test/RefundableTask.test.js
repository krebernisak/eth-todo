const { time, expectRevert } = require("@openzeppelin/test-helpers");
const {
  shouldBehaveLikeFinalizable
} = require("./lifecycle/Finalizable.behaviour");

const RefundableTask = artifacts.require("RefundableTask");

contract("RefundableTask", function(accounts) {
  let [_, owner] = accounts;
  beforeEach(async function() {
    let endTime = (await time.latest()).add(time.duration.minutes(10));
    this.contract = await RefundableTask.new(
      "uri://",
      endTime,
      accounts[1],
      accounts[2],
      { from: owner }
    );
  });

  describe("as Finalizable", function() {
    it("is not finalized at start", async function() {
      expect(await this.contract.isFinalized()).to.be.equal(false);
    });

    it("can not finalized in start state", async function() {
      await expectRevert(
        this.contract.finalize({ from: owner }),
        "RefundableTask: final state can only be Accepted or Canceled."
      );
    });
  });
});
