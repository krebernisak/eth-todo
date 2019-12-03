import Web3 from "web3";
import RefundableTaskFactory from "./contracts/RefundableTaskFactory.json";
import RefundableTask from "./contracts/RefundableTask.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:9545")
  },
  contracts: [RefundableTaskFactory, RefundableTask],
  events: {
    RefundableTaskFactory: ["ContractInstantiation"],
    RefundableTask: ["StateChanged", "TaskFinished"]
  },
  polls: {
    accounts: 1500
  }
};

export default options;
