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
      <h3>Create Task</h3>
      <ContractForm
        contract="RefundableTaskFactory"
        method="create"
        labels={["URI", "End Time", "Beneficiary", "Arbitrator"]}
      />
    </div>
    <div className="section">
      <h2>Example RefundableTask</h2>
      <p>This shows data from RefundableTask contract</p>
      <p>
        <strong>URI: </strong>
        <ContractData contract="RefundableTask" method="uri" />
      </p>
      <p>
        <strong>Solution URI: </strong>
        <ContractData contract="RefundableTask" method="solutionUri" />
      </p>
      <p>
        <strong>Task deadline: </strong>
        <ContractData contract="RefundableTask" method="releaseTime" />
      </p>
      <p>
        <strong>Beneficiary: </strong>
        <ContractData contract="RefundableTask" method="beneficiary" />
      </p>
      <p>
        <strong>Arbitrator: </strong>
        <ContractData contract="RefundableTask" method="arbitrator" />
      </p>
      <p>
        <strong>state: </strong>
        <ContractData contract="RefundableTask" method="state" />
      </p>
      <p>
        <strong>isFinished: </strong>
        <ContractData contract="RefundableTask" method="isFinished" />
      </p>
      <p>
        <strong>isResolved: </strong>
        <ContractData contract="RefundableTask" method="isResolved" />
      </p>
      <p>
        <strong>taskBalance: </strong>
        <ContractData contract="RefundableTask" method="taskBalance" />
      </p>
      <h3>Task -> Active</h3>
      <p>
        <span>> FundTask</span>
        <ContractForm
          contract="RefundableTask"
          method="fundTask"
          sendArgs={{ value: "1" }}
          labels={["Refundee"]}
        />
      </p>
      <p>
        <span>> Timeout</span>
        <ContractForm contract="RefundableTask" method="timeout" />
      </p>
      <p>
        <span>> Cancel (onlyBeneficiary)</span>
        <ContractForm
          contract="RefundableTask"
          method="cancel"
          sendArgs={{ from: accounts[1] }}
        />
      </p>
      <p>
        <span>> Finish (onlyBeneficiary)</span>
        <ContractForm
          contract="RefundableTask"
          method="finish"
          labels={["Solution URI"]}
          sendArgs={{ from: accounts[1] }}
        />
      </p>
      <p>
        <span>> Accept (onlyOwner)</span>
        <ContractForm
          contract="RefundableTask"
          method="accept"
          sendArgs={{ from: accounts[0] }}
        />
      </p>
      <p>
        <span>> RaiseDispute (onlyBeneficiary)</span>
        <ContractForm
          contract="RefundableTask"
          method="raiseDispute"
          sendArgs={{ from: accounts[1] }}
        />
      </p>
      <h3>Task -> Dispute</h3>
      <p>
        <span>> FundDisputeResolution</span>
        <ContractForm
          contract="RefundableTask"
          method="fundDisputeResolution"
        />
      </p>
      <p>
        <span>> ResolveDispute (onlyArbitrer)</span>
        <ContractForm
          contract="RefundableTask"
          method="resolveDispute"
          labels={["State"]}
          sendArgs={{ from: accounts[2] }}
        />
      </p>
      <p>
        <span>> ReclaimEther (onlyOwner)</span>
        <ContractForm
          contract="RefundableTask"
          method="reclaimEther"
          sendArgs={{ from: accounts[0] }}
        />
      </p>
      <h3>Task -> Failure</h3>
      <p>
        <span>> ClaimRefund</span>
        <ContractForm
          contract="RefundableTask"
          method="claimRefund"
          labels={["Refundee"]}
          sendArgs={{ from: accounts[0] }}
        />
      </p>
    </div>
  </div>
);
