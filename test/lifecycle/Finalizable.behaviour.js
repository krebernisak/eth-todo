const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeFinalizable = ([_, owner]) => {
  describe("as Finalizable", function() {
    it("is not finalized at start", async function() {
      expect(await this.contract.isFinalized()).to.be.equal(false);
    });

    it("can be finalized", async function() {
      await this.contract.finalize({ from: owner });
      expect(await this.contract.isFinalized()).to.be.equal(true);
    });

    describe("when finalized", () => {
      beforeEach(async function() {
        const tx = await this.contract.finalize({ from: owner });
        this.logs = tx.logs;
      });

      it("logs finalized", async function() {
        expectEvent.inLogs(this.logs, "Finalized");
      });

      it("cannot be finalized twice", async function() {
        await expectRevert(
          this.contract.finalize({ from: owner }),
          "Finalizable: Contract already finalized."
        );
      });
    });
  });
};

module.exports = {
  shouldBehaveLikeFinalizable
};
