const { expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const {
  shouldBehaveLikeTaskIsResolved
} = require("./RefundableTask.Resolved.behaviour");

const shouldBehaveLikeTaskIsFailure = accounts => {
  describe("when Failure", function() {
    shouldBehaveLikeTaskIsResolved(accounts);

    it("is in state Failure", async function() {
      expect(await this.contract.state()).to.be.bignumber.equal("3"); // enum Failure
    });
  });
};

module.exports = {
  shouldBehaveLikeTaskIsFailure
};
