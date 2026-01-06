// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20Mint {
    function mint(address to, uint256 amount) external;
}

contract TokenFaucet {
    IERC20Mint public token;
    address public admin;

    uint256 public constant FAUCET_AMOUNT = 100 * 1e18;
    uint256 public constant COOLDOWN_TIME = 1 days;
    uint256 public constant MAX_CLAIM_AMOUNT = 1000 * 1e18;

    bool private paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    constructor(address tokenAddress) {
        token = IERC20Mint(tokenAddress);
        admin = msg.sender;
    }

    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Cooldown or limit reached");

        uint256 remaining = remainingAllowance(msg.sender);
        require(remaining >= FAUCET_AMOUNT, "Lifetime claim limit reached");

        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        token.mint(msg.sender, FAUCET_AMOUNT);
        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        return true;
    }

    function remainingAllowance(address user) public view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return 0;
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    function setPaused(bool _paused) external {
        require(msg.sender == admin, "Only admin");
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
    function setToken(address _token) external {
    require(msg.sender == admin, "Only admin");
    token = IERC20Mint(_token);
}

}
