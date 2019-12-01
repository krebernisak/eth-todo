const RefundableTaskFactory = artifacts.require("RefundableTaskFactory");

module.exports = function(deployer) {
  deployer.deploy(RefundableTaskFactory);
};
