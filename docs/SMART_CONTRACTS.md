# QuantumChain Smart Contract Architecture

## Overview

This document describes the smart contract architecture for the QuantumChain platform, including the ERC-20 QCN token and the decentralized exchange (DEX).

## Contract Structure

### 1. QCNToken.sol

#### Purpose
The QCN token is the native utility token of the QuantumChain platform, implemented as an ERC-20 compliant token with additional features for security and control.

#### Key Features
- **ERC-20 Standard**: Full compliance with ERC-20 token standard
- **Burnable**: Tokens can be burned to reduce supply
- **Pausable**: Transfers can be paused by owner in emergency situations
- **Minting Control**: Separate minting functions for pre-sale and main sale
- **Blacklist**: Ability to blacklist malicious addresses

#### Constants
```solidity
MAX_SUPPLY = 100,000,000 QCN
PRESALE_SUPPLY = 10,000,000 QCN
MAINSALE_SUPPLY = 50,000,000 QCN
```

#### Main Functions

##### mintPresale(address to, uint256 amount)
- Mints tokens for pre-sale phase
- Only callable by owner
- Checks pre-sale supply limit
- Emits TokensMinted event

##### mintMainsale(address to, uint256 amount)
- Mints tokens for main sale phase
- Only callable by owner
- Checks main sale supply limit
- Emits TokensMinted event

##### pause() / unpause()
- Emergency controls to pause/unpause all transfers
- Only callable by owner

##### blacklist(address account) / whitelist(address account)
- Add or remove addresses from blacklist
- Blacklisted addresses cannot send or receive tokens
- Only callable by owner

#### Security Features
- OpenZeppelin base contracts
- Reentrancy protection
- Overflow protection (Solidity 0.8+)
- Access control with Ownable
- Event logging for transparency

### 2. QuantumDEX.sol

#### Purpose
A decentralized exchange for trading QCN tokens against ETH, featuring an order book system with limit orders.

#### Key Features
- **Order Book Trading**: Buy and sell limit orders
- **Fee Mechanism**: 0.25% trading fee
- **Order Management**: Create, execute, and cancel orders
- **Reentrancy Protection**: Secure against reentrancy attacks
- **Owner Controls**: Fee adjustment and withdrawal

#### Data Structures

##### Order Struct
```solidity
struct Order {
    uint256 orderId;
    address trader;
    OrderType orderType;  // BUY or SELL
    uint256 amount;
    uint256 price;        // Price in wei per token
    uint256 filledAmount;
    OrderStatus status;   // OPEN, FILLED, CANCELLED, PARTIAL
    uint256 timestamp;
}
```

#### Main Functions

##### createBuyOrder(uint256 amount, uint256 price) payable
- Creates a buy order for QCN tokens
- Requires ETH payment equal to amount * price
- Stores order in contract
- Emits OrderCreated event

##### createSellOrder(uint256 amount, uint256 price)
- Creates a sell order for QCN tokens
- Transfers tokens from user to contract
- Stores order in contract
- Emits OrderCreated event

##### executeBuyOrder(uint256 orderId, uint256 amount)
- Executes a buy order (selling to buyer)
- Transfers tokens from executor to buyer
- Transfers ETH (minus fee) to executor
- Updates order status
- Emits OrderFilled event

##### executeSellOrder(uint256 orderId, uint256 amount) payable
- Executes a sell order (buying from seller)
- Requires ETH payment
- Transfers tokens to executor
- Transfers ETH (minus fee) to seller
- Updates order status
- Emits OrderFilled event

##### cancelOrder(uint256 orderId)
- Cancels an open or partial order
- Returns locked tokens/ETH to trader
- Updates order status
- Emits OrderCancelled event

##### setTradingFee(uint256 newFee)
- Updates the trading fee (owner only)
- Maximum fee: 1%
- Emits TradingFeeUpdated event

##### withdrawFees()
- Withdraws collected fees to owner
- Only callable by owner

#### Security Features
- ReentrancyGuard from OpenZeppelin
- Proper ETH handling with refunds
- Order validation checks
- Access control for sensitive functions
- Event logging for all operations

## Gas Optimization

### Strategies Implemented
1. **Storage Optimization**: Minimize storage writes
2. **Data Packing**: Efficient struct packing
3. **Loop Avoidance**: Minimize on-chain iterations
4. **Event Usage**: Use events instead of storage when appropriate

### Estimated Gas Costs
- Token Transfer: ~50,000 gas
- Create Order: ~150,000 gas
- Execute Order: ~200,000 gas
- Cancel Order: ~100,000 gas

## Upgrade Strategy

### Current Version
Contracts are not upgradeable to ensure immutability and trust.

### Future Upgrades
If upgrades are needed:
1. Deploy new contract versions
2. Migrate liquidity
3. Update frontend to use new addresses
4. Maintain backwards compatibility

## Testing Strategy

### Unit Tests
- Test all public functions
- Test edge cases and error conditions
- Test access control
- Test mathematical operations

### Integration Tests
- Test contract interactions
- Test token transfers with DEX
- Test order matching scenarios

### Security Tests
- Reentrancy attack tests
- Overflow/underflow tests
- Access control breach attempts
- Front-running scenarios

## Deployment Checklist

### Pre-Deployment
- [ ] Complete code review
- [ ] Run full test suite
- [ ] Security audit
- [ ] Gas optimization review
- [ ] Documentation complete

### Deployment
- [ ] Deploy to testnet
- [ ] Verify contracts on Etherscan
- [ ] Test all functions on testnet
- [ ] Deploy to mainnet
- [ ] Verify contracts on mainnet
- [ ] Transfer ownership if needed

### Post-Deployment
- [ ] Monitor contract activity
- [ ] Set up event monitoring
- [ ] Document contract addresses
- [ ] Update frontend configuration
- [ ] Announce to community

## Contract Addresses

### Testnet (Sepolia)
- QCN Token: [To be deployed]
- QuantumDEX: [To be deployed]

### Mainnet
- QCN Token: [To be deployed]
- QuantumDEX: [To be deployed]

## Interaction Examples

### Using ethers.js

#### Get Token Balance
```javascript
const balance = await qcnToken.balanceOf(address);
console.log('Balance:', ethers.formatEther(balance));
```

#### Purchase Tokens (Pre-sale)
```javascript
const tx = await qcnToken.mintPresale(userAddress, amount);
await tx.wait();
```

#### Create Buy Order
```javascript
const amount = ethers.parseEther('1000'); // 1000 QCN
const price = ethers.parseEther('0.001'); // 0.001 ETH per QCN
const totalCost = (amount * price) / ethers.parseEther('1');

const tx = await dex.createBuyOrder(amount, price, { value: totalCost });
await tx.wait();
```

#### Execute Sell Order
```javascript
const orderId = 1;
const amount = ethers.parseEther('500'); // 500 QCN
const price = orders[orderId].price;
const cost = (amount * price) / ethers.parseEther('1');

const tx = await dex.executeSellOrder(orderId, amount, { value: cost });
await tx.wait();
```

## Event Monitoring

### Key Events to Monitor
- **TokensMinted**: Track token minting
- **OrderCreated**: New orders on DEX
- **OrderFilled**: Successful trades
- **OrderCancelled**: Cancelled orders
- **TradingFeeUpdated**: Fee changes

### Example Event Listener
```javascript
qcnToken.on('Transfer', (from, to, amount) => {
  console.log(`Transfer: ${from} -> ${to}, Amount: ${ethers.formatEther(amount)}`);
});

dex.on('OrderFilled', (orderId, trader, executor, amount, price) => {
  console.log(`Order ${orderId} filled: ${ethers.formatEther(amount)} QCN`);
});
```

## Best Practices

### For Developers
1. Always use latest OpenZeppelin contracts
2. Follow Solidity style guide
3. Write comprehensive tests
4. Document all public functions
5. Use events for important state changes

### For Users
1. Approve tokens before trading on DEX
2. Check order book before placing orders
3. Verify transaction details before signing
4. Monitor gas prices
5. Keep enough ETH for gas fees

## Future Enhancements

### Planned Features
1. **Staking Mechanism**: Lock tokens for rewards
2. **Governance**: Token holder voting
3. **Liquidity Pools**: AMM-style trading
4. **Yield Farming**: Additional reward mechanisms
5. **Cross-chain Bridge**: Multi-chain support

### Research Areas
1. Layer 2 integration
2. Zero-knowledge proofs for privacy
3. Advanced order types (stop-loss, etc.)
4. Flash loan prevention
5. MEV protection

## References

- [ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Solidity Documentation](https://docs.soliditylang.org)
- [Hardhat Documentation](https://hardhat.org/docs)
