const { shouldBehaveLikeFinalizable } = require("./Finalizable.behaviour");

const Finalizable = artifacts.require("FinalizableMock");

contract("Finalizable", ([_, owner, ...other]) => {
  beforeEach(async function() {
    this.contract = await Finalizable.new({ from: owner });
  });

  shouldBehaveLikeFinalizable(owner, other);
});
