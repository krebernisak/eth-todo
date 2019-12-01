pragma solidity ^0.5.11;


/**
 * @title TaskFactory
 * @dev Allows creation of task contract.
 */
contract TaskFactory {

    /**
     * @dev Allows verified creation of token timelock wallet.
     * @param uri String URI where task info is located.
     * @param endTime The timestamp when lock release is enabled.
     * @param beneficiary address of the beneficiary to whom task is addressed.
     * @param arbitrator address of the arbitrator who will intervene in case od dispute.
     * @return Returns task address.
     */
    function create(
        string memory uri,
        uint256 endTime,
        address payable beneficiary,
        address arbitrator
    )
    public
    returns (address);
}
