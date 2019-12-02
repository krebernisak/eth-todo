pragma solidity ^0.5.11;

import "openzeppelin-solidity/contracts/payment/escrow/RefundEscrow.sol";
import "./lifecycle/Finalizable.sol";
import "./Timelock.sol";


/**
 * @title RefundableTask
 * @dev Allows creation of refundable task contract.
 */
contract RefundableTask is Finalizable, Timelock {

    // Task state
    enum State { Active, Dispute, Accepted, Canceled }
    event StateChanged(State oldState, State newState);

    // Task uri
    string private _uri;

    // Task state
    State private _state;

    // Arbitrator that is going to close or enableRefunds for this task
    address private _arbitrator;

    // Refund escrow used to hold funds while task is running
    RefundEscrow private _escrow;

     /**
     * @dev Constructor, creates RefundableTask contract.
     * @param uri String URI where task info is located.
     * @param endTime The timestamp when lock release is enabled.
     * @param beneficiary address of the beneficiary to whom task is addressed.
     * @param arbitrator address of the arbitrator who will intervene in case od dispute.
     */
    constructor (string memory uri, uint256 endTime, address payable beneficiary, address arbitrator) public Timelock(endTime) {
        require(bytes(uri).length != 0, "RefundableTask: task URI should not be empty.");
        require(beneficiary != address(0), "RefundableTask: Beneficiary address should not be 0x0.");
        require(arbitrator != address(0), "RefundableTask: Arbitrator address should not be 0x0.");
        _uri = uri;
        _state = State.Active;
        _arbitrator = arbitrator;
        _escrow = new RefundEscrow(beneficiary);
    }

    /// @dev Throws if called with any state other than Accepted or Canceled.
    modifier onlyFinalState(State nextState) {
        bool isFinalState = nextState == State.Accepted || nextState == State.Canceled;
        require(isFinalState, "RefundableTask: final state can only be Accepted or Canceled.");
        _;
    }

    /// @dev Throws if called by any account other than the beneficiary.
    modifier onlyBeneficiary() {
        require(msg.sender == _escrow.beneficiary(), "RefundableTask: caller is not the beneficiary");
        _;
    }

    /// @dev Throws if called by any account other than the arbitrator.
    modifier onlyArbitrer() {
        require(msg.sender == _arbitrator, "RefundableTask: caller is not the arbitrator");
        _;
    }

    /// @return The URI that holds information for this task.
    function uri() public view returns (string memory) {
        return _uri;
    }

    /// @return The current state of the escrow.
    function state() public view returns (State) {
        return _state;
    }

    /// @return The beneficiary of the task.
    function beneficiary() public view returns (address) {
        return _escrow.beneficiary();
    }

    /// @return The arbitrator of the task.
    function arbitrator() public view returns (address) {
        return _arbitrator;
    }

    /**
     * @dev Checks whether task goal was reached.
     * @return Whether task goal was reached
     */
    function goalReached() public view returns (bool) {
        return _state == State.Accepted;
    }

    /// @dev Finalization task, called when finalize() is called.
    function _finalization() internal onlyFinalState(_state) {
        if (goalReached()) {
            _escrow.close();
            _escrow.beneficiaryWithdraw();
        } else {
            _escrow.enableRefunds();
        }

        super._finalization();
    }

    /// @dev Accept this task on owner request.
    function accept() public onlyOwner {
        require(_state == State.Active, "RefundableTask: can only cancel task while active");
        finalize(State.Accepted);
    }

    /// @dev Cancel this task because of timeout.
    function cancelTimeout() public {
        require(_state != State.Accepted, "RefundableTask: can not timeout if task already accepted");
        require(_state != State.Canceled, "RefundableTask: can not timeout if task already canceled");
        require(isUnlocked(), "RefundableTask: can not timeout if task is still locked");
        finalize(State.Canceled);
    }

    /// @dev Cancel this task on beneficiary request.
    function cancel() public onlyBeneficiary {
        require(_state == State.Active, "RefundableTask: can only cancel task while active");
        finalize(State.Canceled);
    }

    /// @dev Raise dispute for this task on beneficiary request.
    function raiseDispute() public payable onlyBeneficiary {
        require(_state == State.Active, "RefundableTask: can only raise dispute while active");
        emit StateChanged(_state, State.Dispute);
        _state = State.Dispute;
    }

    /**
     * @dev Solve dispute for this task.
     * @param newState The new state that will solve the dispute.
     */
    function solveDispute(State newState) public onlyArbitrer {
        require(_state == State.Dispute, "RefundableTask: can only solve dispute while dispute");
        finalize(newState);
    }

    /// @dev Transfer all Ether held by the contract to the owner.
    function reclaimEther() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        _owner.transfer(address(this).balance);
    }

    /**
     * @dev Move contract to a final state.
     * @param newState The final state.
     */
    function finalize(State newState) private {
        emit StateChanged(_state, newState);
        _state = newState;
        _transferOwnership(msg.sender);
        finalize();
    }

}
