const { expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const {
  shouldBehaveLikeTaskIsResolved
} = require("./RefundableTask.Resolved.behaviour");

const shouldBehaveLikeTaskIsSuccess = accounts => {
  describe("when Success", function() {
    shouldBehaveLikeTaskIsResolved(accounts);

    it("is in state Success", async function() {
      expect(await this.contract.state()).to.be.bignumber.equal("2"); // enum Failure
    });
  });
};

module.exports = {
  shouldBehaveLikeTaskIsSuccess
};
