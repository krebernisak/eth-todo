pragma solidity ^0.5.11;


/**
 * @title Timelock
 * @dev Timelock contract to only allow unlocked access only if the lock period
 * has expired.
 */
contract Timelock {

    // Timestamp when lock release is enabled
    uint256 private _releaseTime;

    /**
     * @dev Constructor, creates Timelock.
     * @param releaseTime Timestamp when lock release is enabled
     */
    constructor(uint256 releaseTime) public {
        // solhint-disable-next-line not-rely-on-time
        require(releaseTime > block.timestamp, "Release time should be in the future.");
        _releaseTime = releaseTime;
    }

    /// @return The timestamp when lock release is enabled.
    function releaseTime() public view returns (uint256) {
        return _releaseTime;
    }

    /**
     * @dev Returns whether this contract lock is unlocked.
     * @return Returns true if unlocked false otherwise.
     */
    function unlocked() public view returns (bool) {
        // solhint-disable-next-line not-rely-on-time
        return block.timestamp >= _releaseTime;
    }
}
