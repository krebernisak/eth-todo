import Web3 from "web3";
import RefundableTaskFactory from "./contracts/RefundableTaskFactory.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:8545")
  },
  contracts: [RefundableTaskFactory],
  events: {
    RefundableTaskFactory: ["ContractInstantiation"]
  },
  polls: {
    accounts: 1500
  }
};

export default options;
