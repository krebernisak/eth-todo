pragma solidity ^0.5.11;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Finalizable contract
 * @dev Lifecycle extension where an owner can do extra work after finishing.
 */
contract Finalizable is Ownable {
    using SafeMath for uint256;

    /// @dev Throws if called before the contract is finalized.
    modifier onlyFinalized() {
        require(isFinalized, "Finalizable: Contract not finalized.");
        _;
    }

    /// @dev Throws if called after the contract is finalized.
    modifier onlyNotFinalized() {
        require(!isFinalized, "Finalizable: Contract already finalized.");
        _;
    }

    bool public isFinalized = false;

    event Finalized();

    /**
    * @dev Called by owner to do some extra finalization
    * work. Calls the contract's finalization function.
    */
    function finalize() public onlyOwner onlyNotFinalized {
        _finalization();
        emit Finalized();

        isFinalized = true;
    }

    /**
    * @dev Can be overridden to add finalization logic. The overriding function
    * should call super.finalization() to ensure the chain of finalization is
    * executed entirely.
    */
    function _finalization() internal { // solhint-disable-line no-empty-blocks 
        // override
    }

}
