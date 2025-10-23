// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title QuantumDEX
 * @dev Decentralized Exchange for QCN tokens with automated market maker
 */
contract QuantumDEX {
    address public qcnToken;
    address public owner;
    
    uint256 public feePercent = 3; // 0.3% fee
    uint256 public constant FEE_DENOMINATOR = 1000;
    
    struct Order {
        uint256 id;
        address trader;
        address tokenGive;
        uint256 amountGive;
        address tokenGet;
        uint256 amountGet;
        uint256 timestamp;
        bool filled;
        bool cancelled;
    }
    
    mapping(uint256 => Order) public orders;
    mapping(address => mapping(address => uint256)) public balances;
    uint256 public orderCount = 0;
    
    event Deposit(address indexed token, address indexed user, uint256 amount);
    event Withdraw(address indexed token, address indexed user, uint256 amount);
    event OrderCreated(uint256 indexed id, address indexed trader, address tokenGive, uint256 amountGive, address tokenGet, uint256 amountGet);
    event OrderFilled(uint256 indexed id, address indexed trader, address indexed filler);
    event OrderCancelled(uint256 indexed id, address indexed trader);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(address _qcnToken) {
        owner = msg.sender;
        qcnToken = _qcnToken;
    }
    
    receive() external payable {
        depositETH();
    }
    
    function depositETH() public payable {
        balances[address(0)][msg.sender] += msg.value;
        emit Deposit(address(0), msg.sender, msg.value);
    }
    
    function depositToken(address token, uint256 amount) public {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from user to contract
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", msg.sender, address(this), amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transfer failed");
        
        balances[token][msg.sender] += amount;
        emit Deposit(token, msg.sender, amount);
    }
    
    function withdrawETH(uint256 amount) public {
        require(balances[address(0)][msg.sender] >= amount, "Insufficient balance");
        
        balances[address(0)][msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(address(0), msg.sender, amount);
    }
    
    function withdrawToken(address token, uint256 amount) public {
        require(token != address(0), "Invalid token address");
        require(balances[token][msg.sender] >= amount, "Insufficient balance");
        
        balances[token][msg.sender] -= amount;
        
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", msg.sender, amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Token transfer failed");
        
        emit Withdraw(token, msg.sender, amount);
    }
    
    function createOrder(address tokenGive, uint256 amountGive, address tokenGet, uint256 amountGet) public {
        require(balances[tokenGive][msg.sender] >= amountGive, "Insufficient balance");
        require(amountGive > 0 && amountGet > 0, "Amounts must be greater than 0");
        
        orderCount++;
        orders[orderCount] = Order(
            orderCount,
            msg.sender,
            tokenGive,
            amountGive,
            tokenGet,
            amountGet,
            block.timestamp,
            false,
            false
        );
        
        emit OrderCreated(orderCount, msg.sender, tokenGive, amountGive, tokenGet, amountGet);
    }
    
    function fillOrder(uint256 orderId) public {
        Order storage order = orders[orderId];
        require(orderId > 0 && orderId <= orderCount, "Invalid order ID");
        require(!order.filled, "Order already filled");
        require(!order.cancelled, "Order cancelled");
        require(order.trader != msg.sender, "Cannot fill own order");
        require(balances[order.tokenGet][msg.sender] >= order.amountGet, "Insufficient balance");
        
        // Calculate fee
        uint256 fee = (order.amountGet * feePercent) / FEE_DENOMINATOR;
        uint256 amountAfterFee = order.amountGet - fee;
        
        // Execute trade
        balances[order.tokenGive][order.trader] -= order.amountGive;
        balances[order.tokenGive][msg.sender] += order.amountGive;
        
        balances[order.tokenGet][msg.sender] -= order.amountGet;
        balances[order.tokenGet][order.trader] += amountAfterFee;
        balances[order.tokenGet][owner] += fee; // Fee goes to owner
        
        order.filled = true;
        emit OrderFilled(orderId, order.trader, msg.sender);
    }
    
    function cancelOrder(uint256 orderId) public {
        Order storage order = orders[orderId];
        require(orderId > 0 && orderId <= orderCount, "Invalid order ID");
        require(order.trader == msg.sender, "Only order creator can cancel");
        require(!order.filled, "Order already filled");
        require(!order.cancelled, "Order already cancelled");
        
        order.cancelled = true;
        emit OrderCancelled(orderId, msg.sender);
    }
    
    function updateFee(uint256 newFeePercent) public onlyOwner {
        require(newFeePercent <= 50, "Fee cannot exceed 5%"); // Max 5% fee
        feePercent = newFeePercent;
    }
    
    function getBalance(address token, address user) public view returns (uint256) {
        return balances[token][user];
    }
    
    function getOrder(uint256 orderId) public view returns (Order memory) {
        return orders[orderId];
    }
}
