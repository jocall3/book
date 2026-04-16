// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GiggleCoinSmartContract
 * @dev The sovereign liquidity engine for the Aquarius Singularity.
 * Tokenizes productive chaos via the Humor Vault and Productivity Dashboard metrics.
 */
contract GiggleCoinSmartContract is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;
    
    struct ProductivityMetrics {
        uint256 chaosEntropy;
        uint256 humorIndex;
        uint256 outputVelocity;
        uint256 lastUpdated;
    }

    mapping(address => ProductivityMetrics) public userMetrics;
    
    event LiquidityGenerated(address indexed user, uint256 amount, uint256 entropy);
    event ChaosRebalanced(uint256 newGlobalEntropy);

    constructor() ERC20("GiggleCoin", "GIGL") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @notice Converts verified productivity and humor metrics into sovereign liquidity.
     * @param _entropy The raw chaos metric from the Productivity Dashboard.
     * @param _humor The verified humor index from the Humor Vault.
     * @param _velocity The output velocity of the sovereign node.
     */
    function mintSovereignLiquidity(
        uint256 _entropy, 
        uint256 _humor, 
        uint256 _velocity
    ) external nonReentrant {
        require(_entropy > 0 && _humor > 0, "Insufficient productive chaos");
        
        uint256 mintAmount = (_entropy * _humor * _velocity) / 1e18;
        
        userMetrics[msg.sender] = ProductivityMetrics({
            chaosEntropy: _entropy,
            humorIndex: _humor,
            outputVelocity: _velocity,
            lastUpdated: block.timestamp
        });

        _mint(msg.sender, mintAmount);
        emit LiquidityGenerated(msg.sender, mintAmount, _entropy);
    }

    /**
     * @notice Deterministic rebalancing of the liquidity pool based on system-wide entropy.
     * @dev Only callable by the Aquarius Singularity Oracle.
     */
    function rebalanceSystemLiquidity(uint256 _globalEntropy) external onlyOwner {
        require(_globalEntropy > 0, "Entropy must be positive");
        emit ChaosRebalanced(_globalEntropy);
    }

    /**
     * @notice Returns the current sovereign standing of a node.
     */
    function getSovereignStanding(address _node) external view returns (ProductivityMetrics memory) {
        return userMetrics[_node];
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}