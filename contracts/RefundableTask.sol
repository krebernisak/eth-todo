pragma solidity ^0.5.11;

import "openzeppelin-solidity/contracts/payment/escrow/RefundEscrow.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./lifecycle/Finalizable.sol";
import "./lifecycle/Timelock.sol";


/**
 * @title RefundableTask
 * @dev Allows creation of refundable task contract.
 */
contract RefundableTask is Finalizable, Timelock {
    using SafeMath for uint256;

    // Task state
    enum State { Active, Dispute, Success, Failure }
    event StateChanged(State oldState, State newState);
    event TaskFinished(string solutionUri);

    // Task uri
    string private _uri;

    // Task solution uri
    string private _solutionUri;

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
        require(bytes(uri).length != 0, "RefundableTask: task URI should not be empty");
        require(beneficiary != address(0), "RefundableTask: Beneficiary address should not be 0x0");
        require(arbitrator != address(0), "RefundableTask: Arbitrator address should not be 0x0");

        _uri = uri;
        _state = State.Active;
        _arbitrator = arbitrator;
        _escrow = new RefundEscrow(beneficiary);
    }

    /// @return Checks if provided state Success or Failure.
    function isFinalState(State nextState) private pure returns (bool) {
        return nextState == State.Success || nextState == State.Failure;
    }

    /// @dev Throws if called with any state other than Success or Failure.
    modifier onlyFinalState(State nextState) {
        require(isFinalState(nextState), "RefundableTask: final state can only be Success or Failure");
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

    /// @return The URI that holds information for this task's solution.
    function solutionUri() public view returns (string memory) {
        return _solutionUri;
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

    /// @return Whether task is finished.
    function isFinished() public view returns (bool) {
        return bytes(_solutionUri).length > 0;
    }

    /// @return Whether task is resolved.
    function isResolved() public view returns (bool) {
        return isFinalState(_state);
    }

    /// @dev Fallback function used for ask fund forwarding.
    function () external payable {
        require(!isResolved(), "RefundableTask: can only accept funds while task in progress");
        if (_state == State.Active) {
            fundTask(msg.sender);
        } else {
            fundDisputeResolution();
        }
    }

    /**
     * @dev Task fund forwarding, sending funds to escrow.
     * @param refundee The address funds will be sent to if a refund occurs.
     */
    function fundTask(address refundee) public payable {
        require(_state == State.Active, "RefundableTask: can only fund task while active");
        require(refundee != address(0), "RefundableTask: refundee address should not be 0x0");

        _escrow.deposit.value(msg.value)(refundee);
    }

    /// @dev Dispute resolution fund forwarding.
    function fundDisputeResolution() public payable {
        require(_state == State.Dispute, "RefundableTask: can only fund dispute resolution while in dispute");
    }

    /**
     * @dev Investors can claim refunds here if task is unsuccessful.
     * @param refundee Whose refund will be claimed.
     */
    function claimRefund(address payable refundee) public {
        require(isFinalized(), "RefundableTask: task contract should be finalized");
        require(_state == State.Failure, "RefundableTask: refunds available only if task was a failure");

        _escrow.withdraw(refundee);
    }

    /**
     * @dev Finish this task providing a solution.
     * @param solutionUri_ Solution URI for this task.
     */
    function finish(string memory solutionUri_) public onlyBeneficiary {
        require(_state == State.Active, "RefundableTask: can only finish task while active");
        require(bytes(solutionUri_).length != 0, "RefundableTask: solution URI should not be empty");

        _solutionUri = solutionUri_;
        emit TaskFinished(_solutionUri);
    }

    /// @dev Accept this task on owner request.
    function accept() public onlyOwner {
        require(_state == State.Active, "RefundableTask: can only cancel task while active");

        finalize(State.Success);
    }

    /// @dev Fail this task because of timeout.
    function timeout() public {
        require(!isResolved(), "RefundableTask: can not timeout if task already resolved");
        require(!isLocked(), "RefundableTask: can not timeout if task is still locked");

        finalize(State.Failure);
    }

    /// @dev Fail this task on beneficiary request.
    function cancel() public onlyBeneficiary {
        require(_state == State.Active, "RefundableTask: can only cancel task while active");

        finalize(State.Failure);
    }

    /// @dev Raise dispute for this task on beneficiary request.
    function raiseDispute() public payable onlyBeneficiary {
        require(_state == State.Active, "RefundableTask: can only raise dispute while active");
        require(isFinished(), "RefundableTask: can only raise dispute if task finished");

        emit StateChanged(_state, State.Dispute);
        _state = State.Dispute;
    }

    /**
     * @dev Resolve dispute for this task.
     * @param newState The new state that will solve the dispute.
     */
    function resolveDispute(State newState) public onlyArbitrer {
        require(_state == State.Dispute, "RefundableTask: can only resolve dispute while in dispute");

        finalize(newState);
    }

    /// @dev Transfer all Ether held by the contract to the owner.
    function reclaimEther() external onlyOwner onlyFinalState(_state) {
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

    /// @dev Finalization task, called when finalize() is called.
    function _finalization() internal onlyFinalState(_state) {
        if (_state == State.Success) {
            _escrow.close();
            _escrow.beneficiaryWithdraw();
        } else {
            _escrow.enableRefunds();
        }

        super._finalization();
    }
}
