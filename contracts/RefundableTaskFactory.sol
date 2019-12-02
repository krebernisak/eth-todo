pragma solidity ^0.5.11;

import "./lifecycle/FactoryEnumerable.sol";
import "./TaskFactory.sol";
import "./RefundableTask.sol";


/**
 * @title RefundableTaskFactory
 * @dev Allows creation of RefundableTask contracts.
 */
contract RefundableTaskFactory is TaskFactory, FactoryEnumerable {

    mapping(address => address[]) public beneficiaryInstantiations;

    /**
     * @dev Allows verified creation of RefundableTask contract.
     * @param uri String URI where task info is located.
     * @param endTime The timestamp when lock release is enabled.
     * @param beneficiary address of the beneficiary to whom task is addressed.
     * @param arbitrator address of the arbitrator who will intervene in case od dispute.
     * @return Returns task contract address.
     */
    function create(
        string memory uri,
        uint256 endTime,
        address payable beneficiary,
        address arbitrator
    )
        public
        returns (address task)
    {
        require(beneficiary != address(this), "Beneficiary address should not be this contract.");
        require(arbitrator != address(this), "Arbitrator address should not be this contract.");
        task = address(new RefundableTask(uri, endTime, beneficiary, arbitrator));
        beneficiaryInstantiations[beneficiary].push(task);
        register(task);
    }
}
