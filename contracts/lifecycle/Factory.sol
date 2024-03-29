pragma solidity ^0.5.11;


/**
 * @title Factory
 * @dev Base Factory contract that registers and counts instantiations.
 */
contract Factory {

    event ContractInstantiation(address sender, address instantiation);

    mapping(address => bool) public isInstantiation;
    mapping(address => address[]) public instantiations;

    /**
    * @dev Returns number of instantiations by creator.
    * @param creator Contract creator.
    * @return Returns number of instantiations by creator.
    */
    function instantiationCount(address creator) public view returns (uint) {
        return instantiations[creator].length;
    }

    /**
    * @dev Registers contract in factory registry.
    * @param instantiation Address of contract instantiation.
    */
    function register(address instantiation) internal {
        isInstantiation[instantiation] = true;
        instantiations[msg.sender].push(instantiation);
        emit ContractInstantiation(msg.sender, instantiation);
    }
}
