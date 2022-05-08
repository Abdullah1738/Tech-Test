// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DUMMY is ERC20{
    constructor() ERC20("DUMMY TOKEN", "DUMMY") {
        _mint(msg.sender, 50000*10**18);
    } 
}