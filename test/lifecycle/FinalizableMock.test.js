const { expectRevert } = require("@openzeppelin/test-helpers");
const { shouldBehaveLikeFinalizable } = require("./Finalizable.behaviour");

const Finalizable = artifacts.require("FinalizableMock");

contract("FinalizableMock", accounts => {
  const [_, owner] = accounts;

  beforeEach(async function() {
    this.contract = await Finalizable.new({ from: owner });
  });

  it("can execute onlyNotFinalized", async function() {
    await this.contract.notFinalized();
  });

  it("fails to execute onlyFinalized", async function() {
    await expectRevert(
      this.contract.finalized(),
      "Finalizable: Contract not finalized."
    );
  });

  describe("when finalized", () => {
    beforeEach(async function() {
      this.contract.finalize({ from: owner });
    });

    it("fails to execute onlyNotFinalized", async function() {
      await expectRevert(
        this.contract.notFinalized(),
        "Finalizable: Contract already finalized."
      );
    });

    it("can execute onlyFinalized", async function() {
      await this.contract.finalized();
    });
  });

  shouldBehaveLikeFinalizable(accounts);
});
