const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const shouldBehaveLikeFinalizable = owner => {
  describe("as Finalizable", function() {
    it("can be finalized", async function() {
      await this.contract.finalize({ from: owner });
      expect(await this.contract.isFinalized()).to.be.equal(true);
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
  });
};

module.exports = {
  shouldBehaveLikeFinalizable
};
