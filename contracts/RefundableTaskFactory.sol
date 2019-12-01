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
     * @param arbitrer address of the arbitrer who will intervene in case od dispute.
     * @return Returns task contract address.
     */
    function create(
        string memory uri,
        uint256 endTime,
        address payable beneficiary,
        address arbitrer
    )
        public
        returns (address)
    {
        require(beneficiary != address(this), "Beneficiary address should not be this contract.");
        require(arbitrer != address(this), "Arbitrer address should not be this contract.");
        address task = address(new RefundableTask(uri, endTime, beneficiary, arbitrer));
        beneficiaryInstantiations[beneficiary].push(task);
        register(task);
    }
}
