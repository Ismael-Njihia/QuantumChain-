// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HybridPoSConsensus
 * @dev Hybrid Proof of Stake consensus mechanism for QuantumChain
 */
contract HybridPoSConsensus {
    address public owner;
    uint256 public minStake = 1000 * 10**18; // Minimum 1000 QCN tokens
    uint256 public totalStaked;
    uint256 public rewardRate = 5; // 5% annual reward
    
    struct Validator {
        uint256 stakedAmount;
        uint256 stakedAt;
        uint256 rewardsEarned;
        bool active;
    }
    
    mapping(address => Validator) public validators;
    address[] public validatorList;
    
    event Staked(address indexed validator, uint256 amount);
    event Unstaked(address indexed validator, uint256 amount);
    event RewardClaimed(address indexed validator, uint256 amount);
    event ValidatorActivated(address indexed validator);
    event ValidatorDeactivated(address indexed validator);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function stake(uint256 amount) public {
        require(amount >= minStake, "Stake amount below minimum");
        
        Validator storage validator = validators[msg.sender];
        
        if (validator.stakedAmount == 0) {
            validatorList.push(msg.sender);
        }
        
        // Calculate and add pending rewards before updating stake
        if (validator.stakedAmount > 0) {
            uint256 pendingRewards = calculateRewards(msg.sender);
            validator.rewardsEarned += pendingRewards;
        }
        
        validator.stakedAmount += amount;
        validator.stakedAt = block.timestamp;
        validator.active = true;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
        emit ValidatorActivated(msg.sender);
    }
    
    function unstake(uint256 amount) public {
        Validator storage validator = validators[msg.sender];
        require(validator.stakedAmount >= amount, "Insufficient staked amount");
        
        // Calculate and add pending rewards
        uint256 pendingRewards = calculateRewards(msg.sender);
        validator.rewardsEarned += pendingRewards;
        
        validator.stakedAmount -= amount;
        validator.stakedAt = block.timestamp;
        totalStaked -= amount;
        
        if (validator.stakedAmount < minStake) {
            validator.active = false;
            emit ValidatorDeactivated(msg.sender);
        }
        
        emit Unstaked(msg.sender, amount);
    }
    
    function claimRewards() public {
        Validator storage validator = validators[msg.sender];
        require(validator.stakedAmount > 0, "No stake found");
        
        uint256 pendingRewards = calculateRewards(msg.sender);
        uint256 totalRewards = validator.rewardsEarned + pendingRewards;
        require(totalRewards > 0, "No rewards to claim");
        
        validator.rewardsEarned = 0;
        validator.stakedAt = block.timestamp;
        
        emit RewardClaimed(msg.sender, totalRewards);
    }
    
    function calculateRewards(address validatorAddress) public view returns (uint256) {
        Validator storage validator = validators[validatorAddress];
        if (validator.stakedAmount == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - validator.stakedAt;
        uint256 annualReward = (validator.stakedAmount * rewardRate) / 100;
        uint256 reward = (annualReward * timeStaked) / 365 days;
        
        return reward;
    }
    
    function getValidatorInfo(address validatorAddress) public view returns (
        uint256 stakedAmount,
        uint256 stakedAt,
        uint256 rewardsEarned,
        uint256 pendingRewards,
        bool active
    ) {
        Validator storage validator = validators[validatorAddress];
        return (
            validator.stakedAmount,
            validator.stakedAt,
            validator.rewardsEarned,
            calculateRewards(validatorAddress),
            validator.active
        );
    }
    
    function getValidatorCount() public view returns (uint256) {
        return validatorList.length;
    }
    
    function updateMinStake(uint256 newMinStake) public onlyOwner {
        minStake = newMinStake;
    }
    
    function updateRewardRate(uint256 newRewardRate) public onlyOwner {
        require(newRewardRate <= 100, "Reward rate cannot exceed 100%");
        rewardRate = newRewardRate;
    }
}
