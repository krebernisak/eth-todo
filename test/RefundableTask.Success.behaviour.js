const { balance } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

const {
  shouldBehaveLikeTaskIsResolved
} = require("./RefundableTask.Resolved.behaviour");

const shouldBehaveLikeTaskIsSuccess = accounts => {
  describe("when Success", function() {
    shouldBehaveLikeTaskIsResolved(accounts);

    it("holds no more funds", async function() {
      expect(await this.contract.taskBalance()).to.be.bignumber.equal("0");
    });

    it("transferred funds to beneficiary", async function() {
      const [_, __, bob] = accounts;
      const newBobBalance = this.initialBobBalance.add(this.initialTaskBalance);
      expect(await balance.current(bob)).to.be.bignumber.equal(newBobBalance);
    });

    it("is in state Success", async function() {
      expect(await this.contract.state()).to.be.bignumber.equal("2"); // enum Failure
    });
  });
};

module.exports = {
  shouldBehaveLikeTaskIsSuccess
};
