pragma solidity ^0.5.11;

import "../lifecycle/FactoryEnumerable.sol";
import "../mock/FinalizableMock.sol";


/// @dev mock class using FactoryEnumerable
contract FinalizableMockFactory is FactoryEnumerable {

    /// @dev mock factory create fn
    function create() public returns (address mock) {
        mock = address(new FinalizableMock());
        register(mock);
    }

}
