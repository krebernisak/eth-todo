const { time } = require("@openzeppelin/test-helpers");
const { shouldBehaveLikeFactory } = require("./lifecycle/Factory.behaviour");
const {
  shouldBehaveLikeFactoryEnumerable
} = require("./lifecycle/FactoryEnumerable.behaviour");

const RefundableTaskFactory = artifacts.require("RefundableTaskFactory");

contract("RefundableTaskFactory", function(accounts) {
  beforeEach(async function() {
    const [_, alice, bob, charlie] = accounts;
    this.contract = await RefundableTaskFactory.new({ from: alice });
    let endTime = (await time.latest()).add(time.duration.minutes(10));
    this.createFn = acc =>
      this.contract.create("uri://", endTime, bob, charlie, {
        from: acc
      });
  });

  shouldBehaveLikeFactory(accounts);
  shouldBehaveLikeFactoryEnumerable(accounts);
});
