const { time } = require("@openzeppelin/test-helpers");
const { shouldBehaveLikeFactory } = require("./lifecycle/Factory.behaviour");
const {
  shouldBehaveLikeFactoryEnumerable
} = require("./lifecycle/FactoryEnumerable.behaviour");

const RefundableTaskFactory = artifacts.require("RefundableTaskFactory");

contract("RefundableTaskFactory", function(accounts) {
  beforeEach(async function() {
    let [_, owner] = accounts;
    this.contract = await RefundableTaskFactory.new({ from: owner });
    let endTime = (await time.latest()).add(time.duration.minutes(10));
    this.createFn = acc =>
      this.contract.create("uri://", endTime, accounts[1], accounts[2], {
        from: acc
      });
  });

  shouldBehaveLikeFactory(accounts);
  shouldBehaveLikeFactoryEnumerable(accounts);
});
