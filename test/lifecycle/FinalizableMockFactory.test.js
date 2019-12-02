const { shouldBehaveLikeFactory } = require("./Factory.behaviour");
const {
  shouldBehaveLikeFactoryEnumerable
} = require("./FactoryEnumerable.behaviour");

const FinalizableMockFactory = artifacts.require("FinalizableMockFactory");

contract("FinalizableMockFactory", function(accounts) {
  beforeEach(async function() {
    const [_, alice] = accounts;
    this.contract = await FinalizableMockFactory.new({ from: alice });
    this.createFn = acc => this.contract.create({ from: acc });
  });

  shouldBehaveLikeFactory(accounts);
  shouldBehaveLikeFactoryEnumerable(accounts);
});
