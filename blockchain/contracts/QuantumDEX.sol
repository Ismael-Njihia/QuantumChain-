// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuantumDEX
 * @dev Decentralized Exchange for QCN tokens
 * Features:
 * - Order book trading
 * - Market and limit orders
 * - Hybrid PoS consensus integration
 * - Fee mechanism
 */
contract QuantumDEX is ReentrancyGuard, Ownable {
    IERC20 public qcnToken;
    
    uint256 public tradingFee = 25; // 0.25% fee (basis points)
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    uint256 public orderIdCounter;
    
    enum OrderType { BUY, SELL }
    enum OrderStatus { OPEN, FILLED, CANCELLED, PARTIAL }
    
    struct Order {
        uint256 orderId;
        address trader;
        OrderType orderType;
        uint256 amount;
        uint256 price; // Price in wei per token
        uint256 filledAmount;
        OrderStatus status;
        uint256 timestamp;
    }
    
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    
    uint256[] public buyOrderIds;
    uint256[] public sellOrderIds;
    
    event OrderCreated(
        uint256 indexed orderId,
        address indexed trader,
        OrderType orderType,
        uint256 amount,
        uint256 price
    );
    
    event OrderFilled(
        uint256 indexed orderId,
        address indexed trader,
        address indexed executor,
        uint256 amount,
        uint256 price
    );
    
    event OrderCancelled(uint256 indexed orderId, address indexed trader);
    event TradingFeeUpdated(uint256 newFee);
    
    constructor(address _qcnToken, address initialOwner) Ownable(initialOwner) {
        qcnToken = IERC20(_qcnToken);
    }
    
    /**
     * @dev Create a buy order
     */
    function createBuyOrder(uint256 amount, uint256 price) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        
        uint256 totalCost = (amount * price) / 1e18;
        require(msg.value >= totalCost, "Insufficient ETH sent");
        
        orderIdCounter++;
        
        Order memory newOrder = Order({
            orderId: orderIdCounter,
            trader: msg.sender,
            orderType: OrderType.BUY,
            amount: amount,
            price: price,
            filledAmount: 0,
            status: OrderStatus.OPEN,
            timestamp: block.timestamp
        });
        
        orders[orderIdCounter] = newOrder;
        userOrders[msg.sender].push(orderIdCounter);
        buyOrderIds.push(orderIdCounter);
        
        emit OrderCreated(orderIdCounter, msg.sender, OrderType.BUY, amount, price);
    }
    
    /**
     * @dev Create a sell order
     */
    function createSellOrder(uint256 amount, uint256 price) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(qcnToken.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        // Transfer tokens to contract
        require(
            qcnToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        orderIdCounter++;
        
        Order memory newOrder = Order({
            orderId: orderIdCounter,
            trader: msg.sender,
            orderType: OrderType.SELL,
            amount: amount,
            price: price,
            filledAmount: 0,
            status: OrderStatus.OPEN,
            timestamp: block.timestamp
        });
        
        orders[orderIdCounter] = newOrder;
        userOrders[msg.sender].push(orderIdCounter);
        sellOrderIds.push(orderIdCounter);
        
        emit OrderCreated(orderIdCounter, msg.sender, OrderType.SELL, amount, price);
    }
    
    /**
     * @dev Execute a buy order (sell to a buy order)
     */
    function executeBuyOrder(uint256 orderId, uint256 amount) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.OPEN, "Order is not open");
        require(order.orderType == OrderType.BUY, "Not a buy order");
        require(amount > 0 && amount <= order.amount - order.filledAmount, "Invalid amount");
        require(qcnToken.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        // Transfer tokens from executor to buyer
        require(
            qcnToken.transferFrom(msg.sender, order.trader, amount),
            "Token transfer failed"
        );
        
        // Calculate and transfer ETH to seller
        uint256 ethAmount = (amount * order.price) / 1e18;
        uint256 fee = (ethAmount * tradingFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = ethAmount - fee;
        
        payable(msg.sender).transfer(sellerAmount);
        
        // Update order
        order.filledAmount += amount;
        if (order.filledAmount == order.amount) {
            order.status = OrderStatus.FILLED;
        } else {
            order.status = OrderStatus.PARTIAL;
        }
        
        emit OrderFilled(orderId, order.trader, msg.sender, amount, order.price);
    }
    
    /**
     * @dev Execute a sell order (buy from a sell order)
     */
    function executeSellOrder(uint256 orderId, uint256 amount) external payable nonReentrant {
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.OPEN, "Order is not open");
        require(order.orderType == OrderType.SELL, "Not a sell order");
        require(amount > 0 && amount <= order.amount - order.filledAmount, "Invalid amount");
        
        uint256 ethAmount = (amount * order.price) / 1e18;
        require(msg.value >= ethAmount, "Insufficient ETH sent");
        
        // Transfer tokens to buyer
        require(qcnToken.transfer(msg.sender, amount), "Token transfer failed");
        
        // Calculate and transfer ETH to seller
        uint256 fee = (ethAmount * tradingFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = ethAmount - fee;
        
        payable(order.trader).transfer(sellerAmount);
        
        // Refund excess ETH
        if (msg.value > ethAmount) {
            payable(msg.sender).transfer(msg.value - ethAmount);
        }
        
        // Update order
        order.filledAmount += amount;
        if (order.filledAmount == order.amount) {
            order.status = OrderStatus.FILLED;
        } else {
            order.status = OrderStatus.PARTIAL;
        }
        
        emit OrderFilled(orderId, order.trader, msg.sender, amount, order.price);
    }
    
    /**
     * @dev Cancel an order
     */
    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(order.trader == msg.sender, "Not your order");
        require(order.status == OrderStatus.OPEN || order.status == OrderStatus.PARTIAL, "Order cannot be cancelled");
        
        uint256 remainingAmount = order.amount - order.filledAmount;
        
        if (order.orderType == OrderType.BUY) {
            // Refund ETH for unfilled amount
            uint256 ethToRefund = (remainingAmount * order.price) / 1e18;
            payable(msg.sender).transfer(ethToRefund);
        } else {
            // Return tokens for unfilled amount
            require(qcnToken.transfer(msg.sender, remainingAmount), "Token transfer failed");
        }
        
        order.status = OrderStatus.CANCELLED;
        
        emit OrderCancelled(orderId, msg.sender);
    }
    
    /**
     * @dev Update trading fee (only owner)
     */
    function setTradingFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Fee too high"); // Max 1%
        tradingFee = newFee;
        emit TradingFeeUpdated(newFee);
    }
    
    /**
     * @dev Withdraw collected fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    /**
     * @dev Get user's orders
     */
    function getUserOrders(address user) external view returns (uint256[] memory) {
        return userOrders[user];
    }
    
    /**
     * @dev Get order details
     */
    function getOrder(uint256 orderId) external view returns (Order memory) {
        return orders[orderId];
    }
}
