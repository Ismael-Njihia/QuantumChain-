// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QCNToken
 * @dev QuantumChain Network (QCN) ERC-20 Token
 * Features:
 * - ERC-20 compliant
 * - Burnable tokens
 * - Pausable transfers
 * - Owner controlled minting
 * - Post-quantum ready architecture
 */
contract QCNToken is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million tokens
    uint256 public constant PRESALE_SUPPLY = 10_000_000 * 10**18; // 10 million for presale
    uint256 public constant MAINSALE_SUPPLY = 50_000_000 * 10**18; // 50 million for main sale
    
    uint256 public presaleMinted;
    uint256 public mainsaleMinted;
    
    mapping(address => bool) public isBlacklisted;
    
    event TokensMinted(address indexed to, uint256 amount, string saleType);
    event AddressBlacklisted(address indexed account);
    event AddressWhitelisted(address indexed account);
    
    constructor(address initialOwner) ERC20("QuantumChain Network", "QCN") Ownable(initialOwner) {
        // Mint initial supply to owner for liquidity
        _mint(initialOwner, 10_000_000 * 10**18);
    }
    
    /**
     * @dev Mint tokens for presale
     */
    function mintPresale(address to, uint256 amount) external onlyOwner {
        require(presaleMinted + amount <= PRESALE_SUPPLY, "Presale supply exceeded");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        
        presaleMinted += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, "presale");
    }
    
    /**
     * @dev Mint tokens for main sale
     */
    function mintMainsale(address to, uint256 amount) external onlyOwner {
        require(mainsaleMinted + amount <= MAINSALE_SUPPLY, "Mainsale supply exceeded");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        
        mainsaleMinted += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, "mainsale");
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Blacklist an address
     */
    function blacklist(address account) external onlyOwner {
        isBlacklisted[account] = true;
        emit AddressBlacklisted(account);
    }
    
    /**
     * @dev Remove address from blacklist
     */
    function whitelist(address account) external onlyOwner {
        isBlacklisted[account] = false;
        emit AddressWhitelisted(account);
    }
    
    /**
     * @dev Override transfer to add blacklist check
     */
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        require(!isBlacklisted[from], "Sender is blacklisted");
        require(!isBlacklisted[to], "Recipient is blacklisted");
        super._update(from, to, value);
    }
}
