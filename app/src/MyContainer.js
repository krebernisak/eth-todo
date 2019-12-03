import MyComponent from "./MyComponent";
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    RefundableTask: state.contracts.RefundableTask,
    RefundableTaskFactory: state.contracts.RefundableTaskFactory,
    drizzleStatus: state.drizzleStatus
  };
};

const MyContainer = drizzleConnect(MyComponent, mapStateToProps);

export default MyContainer;
