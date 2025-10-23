# QuantumChain API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Health Check

#### GET /api/health

Check API server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Authentication Endpoints

### Register User

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "username"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "quantumPublicKey": "public_key_hex"
  }
}
```

### Login

#### POST /api/auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "walletAddress": "0x...",
    "tokenBalance": 1000,
    "stakedAmount": 500
  }
}
```

### Get Profile

#### GET /api/auth/profile

Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "walletAddress": "0x...",
    "tokenBalance": 1000,
    "stakedAmount": 500,
    "kycVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Wallet

#### PUT /api/auth/wallet

Link wallet address to user account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "message": "Wallet address updated",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

---

## Token Endpoints

### Purchase Tokens

#### POST /api/tokens/purchase

Purchase QCN tokens.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 1000,
  "paymentMethod": "eth"
}
```

**Response:**
```json
{
  "message": "Token purchase successful",
  "transaction": {
    "id": "transaction_id",
    "amount": 1000,
    "cost": 20,
    "status": "completed"
  },
  "newBalance": 2000
}
```

### Get Balance

#### GET /api/tokens/balance

Get user's token balance.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balance": 1000,
  "stakedAmount": 500,
  "walletAddress": "0x..."
}
```

### Transfer Tokens

#### POST /api/tokens/transfer

Transfer tokens to another address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "amount": 100
}
```

**Response:**
```json
{
  "message": "Transfer successful",
  "transaction": {
    "id": "transaction_id",
    "amount": 100,
    "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "status": "completed"
  },
  "newBalance": 900
}
```

### Get Transactions

#### GET /api/tokens/transactions

Get user's transaction history.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response:**
```json
{
  "transactions": [
    {
      "_id": "transaction_id",
      "type": "purchase",
      "amount": 1000,
      "tokenSymbol": "QCN",
      "status": "completed",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Stake Tokens

#### POST /api/tokens/stake

Stake tokens for rewards.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 1000
}
```

**Response:**
```json
{
  "message": "Tokens staked successfully",
  "stakedAmount": 1500,
  "availableBalance": 500
}
```

### Unstake Tokens

#### POST /api/tokens/unstake

Unstake tokens.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 500
}
```

**Response:**
```json
{
  "message": "Tokens unstaked successfully",
  "stakedAmount": 1000,
  "availableBalance": 1000
}
```

---

## Contact Endpoints

### Send Message

#### POST /api/contact/send

Send contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "I have a question..."
}
```

**Response:**
```json
{
  "message": "Message sent successfully"
}
```

### Subscribe Newsletter

#### POST /api/contact/subscribe

Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Subscribed successfully"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing the issue"
}
```

### 401 Unauthorized
```json
{
  "error": "No authentication token provided"
}
```

### 404 Not Found
```json
{
  "error": "Endpoint not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API requests are limited to:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

## Best Practices

1. Always use HTTPS in production
2. Store JWT tokens securely (not in localStorage for sensitive apps)
3. Implement proper error handling
4. Use exponential backoff for retries
5. Validate all inputs on the client side before sending requests

## Support

For API support, contact: api-support@quantumchain.io
