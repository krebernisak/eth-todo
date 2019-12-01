pragma solidity ^0.5.11;

import "./Factory.sol";


/**
 * @title FactoryEnumerable
 * @dev Base Factory contract with optional enumerable extension.
 */
contract FactoryEnumerable is Factory {

    address[] public creators;

    /**
    * @dev Returns number of creators that used this factory.
    * @return Returns number of creators that used this factory.
    */
    function getCreatorsCount() public view returns (uint) {
        return creators.length;
    }

    /**
    * @dev Registers contract in factory registry.
    * @param instantiation Address of contract instantiation.
    */
    function register(address instantiation) internal {
        super.register(instantiation);
        creators.push(msg.sender);
    }

}
