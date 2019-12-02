const { shouldBehaveLikeFactory } = require("./Factory.behaviour");
const {
  shouldBehaveLikeFactoryEnumerable
} = require("./FactoryEnumerable.behaviour");

const FinalizableMockFactory = artifacts.require("FinalizableMockFactory");

contract("TokenTimelockFactory", function(accounts) {
  beforeEach(async function() {
    let [_, owner] = accounts;
    this.contract = await FinalizableMockFactory.new({ from: owner });
    this.createFn = acc => this.contract.create({ from: acc });
  });

  shouldBehaveLikeFactory(accounts);
  shouldBehaveLikeFactoryEnumerable(accounts);
});
