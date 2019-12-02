import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm
} from "@drizzle/react-components";

import logo from "./assets/logo.png";

export default ({ accounts }) => (
  <div className="App">
    <div>
      <img src={logo} alt="todo-logo" height={300} />
      <h1>TODO on Ethereum</h1>
      <p>How to Get Things Done using a simple TODO dapp on Ethereum.</p>
    </div>

    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex={0} units="ether" precision={3} />
    </div>

    <div className="section">
      <h2>TaskFactory</h2>
      <p>This shows data from TaskFactory contract</p>
      <p>
        <strong>Number of creators: </strong>
        <ContractData contract="RefundableTaskFactory" method="creatorsCount" />
      </p>
      <p>
        <strong>Tasks created: </strong>
        <ContractData
          contract="RefundableTaskFactory"
          method="beneficiaryInstantiations"
          methodArgs={[accounts[0]]}
        />
      </p>
      <p>
        <strong>Tasks given: </strong>
        <ContractData
          contract="RefundableTaskFactory"
          method="instantiations"
          methodArgs={[accounts[0]]}
        />
      </p>
      <h3>Create Task</h3>
      <ContractForm
        contract="RefundableTaskFactory"
        method="create"
        labels={["URI", "End Time", "Beneficiary", "Arbitrator"]}
      />
    </div>
  </div>
);
