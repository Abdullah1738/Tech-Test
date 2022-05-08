// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

interface ERC20 {
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
    function transfer(address to, uint tokens) external returns (bool success);
    function balanceOf(address account) external view returns (uint256);
}

contract StakingContract is Ownable{
    //vars
    address StakingToken;
    uint256 currentID = 0;
    bool public StakingEnabled = false;

    struct Stake { 
        //address of staker
        address owner;
        //amount staked without decimals (*10^18)
        uint256 amount;
        //stake block timestamp
        uint256 EventTime;
        //stake (0) or unstake (1)
        uint8 eventType;
    }   
    //event id (autoincrement) => staking info
    mapping(uint256=>Stake) public StakingHistory;
    //address => amount staked
    mapping(address=>uint256) public StakingBalances;

    //fallbacks
    receive() external payable {}
    fallback() external payable {}

    //events
    event NewStake(address staker, uint256 id, Stake stake, uint256 blockTime);
    event Unstake(address staker, uint256 id, Stake stake, uint256 blockTime);


    //set the erc20 token address for the contract
    function SetStakingToken(address _token) public onlyOwner {
        StakingToken = _token;
    }
    
    function ToggleStaking() public onlyOwner {
        StakingEnabled = !StakingEnabled;
    }
    
    // enter amount * (10^18) to allow for decimals
    function StakeToken(uint256 amount) public {
        require(StakingEnabled, "Staking Is Not Enabled");
        require(StakingBalances[msg.sender] + amount <= 1000000*10**18, "ERROR: MAXIMUM STAKE"); //less than 1 million
        require(StakingBalances[msg.sender] + amount >= 10*10**18, "ERROR: MINIMUM STAKE"); // more than 10
        require (ERC20(StakingToken).balanceOf(msg.sender) >= amount, "ERROR: INSUFFICIENT BALANCE");

        ERC20(StakingToken).transferFrom(msg.sender, address(this), amount);
        StakingBalances[msg.sender] += amount;
        Stake memory newStake = Stake(msg.sender,amount, block.timestamp, 0);
        StakingHistory[currentID+1] = newStake;
        emit NewStake(msg.sender, currentID+1, newStake, block.timestamp);
        currentID+=1;
    }

    // enter amount * (10^18) to allow for decimals
    function UnstakeToken(uint256 amount) public {
        require(StakingBalances[msg.sender] >= amount, "ERROR: INSUFFICIENT BALANCE"); //unstaking more than staked

        ERC20(StakingToken).transfer(msg.sender, amount);
        StakingBalances[msg.sender] -= amount;
        Stake memory newUnstake = Stake(msg.sender,amount, block.timestamp, 1);
        StakingHistory[currentID+1] = newUnstake;
        emit Unstake(msg.sender, currentID+1, newUnstake, block.timestamp);
        currentID+=1;
    }

    function GetStakingHistory() public view returns(Stake[] memory) {
        Stake[] memory stakes = new Stake[](currentID);
        for (uint i = 0; i < currentID; i++) {
            stakes[i] = StakingHistory[i+1];
        }
        return stakes;
    }
}