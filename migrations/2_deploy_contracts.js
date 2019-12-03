const RefundableTaskFactory = artifacts.require("RefundableTaskFactory");
const RefundableTask = artifacts.require("RefundableTask"); // example task to test UI

module.exports = function(deployer, _, accounts) {
  deployer.deploy(RefundableTaskFactory);
  deployer.deploy(
    RefundableTask,
    "uri://test",
    1585376773186,
    accounts[1],
    accounts[2]
  );
};
