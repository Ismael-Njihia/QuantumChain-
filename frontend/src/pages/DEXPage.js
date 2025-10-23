import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useWallet } from '../services/WalletContext';

function DEXPage() {
  const { isConnected, account } = useWallet();
  const [orderType, setOrderType] = useState('buy');
  const [tokenPair, setTokenPair] = useState('QCN/ETH');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isConnected) {
      loadOrders();
    }
  }, [isConnected]);

  const loadOrders = () => {
    // Simulate loading orders
    const mockOrders = [
      { id: 1, type: 'buy', pair: 'QCN/ETH', amount: '1000', price: '0.001', status: 'open' },
      { id: 2, type: 'sell', pair: 'QCN/ETH', amount: '500', price: '0.0015', status: 'open' },
      { id: 3, type: 'buy', pair: 'QCN/ETH', amount: '2000', price: '0.0009', status: 'filled' },
    ];
    setOrders(mockOrders);
  };

  const handleCreateOrder = async () => {
    if (!amount || !price) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Creating order...' });

      // Simulate order creation
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Order created successfully!' });
        setAmount('');
        setPrice('');
        loadOrders();
        setLoading(false);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create order' });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Decentralized Exchange (DEX)
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Trade QCN tokens securely on our hybrid PoS-powered DEX
        </Typography>

        {!isConnected ? (
          <Alert severity="warning">
            Please connect your wallet to start trading
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Create Order
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Order Type</InputLabel>
                <Select
                  value={orderType}
                  label="Order Type"
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <MenuItem value="buy">Buy</MenuItem>
                  <MenuItem value="sell">Sell</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Token Pair</InputLabel>
                <Select
                  value={tokenPair}
                  label="Token Pair"
                  onChange={(e) => setTokenPair(e.target.value)}
                >
                  <MenuItem value="QCN/ETH">QCN/ETH</MenuItem>
                  <MenuItem value="QCN/USDT">QCN/USDT</MenuItem>
                  <MenuItem value="QCN/BTC">QCN/BTC</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount (QCN)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Price (ETH)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateOrder}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : `Place ${orderType.toUpperCase()} Order`}
              </Button>

              {message.text && (
                <Alert severity={message.type} sx={{ mt: 2 }}>
                  {message.text}
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Market Statistics
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      24h Volume
                    </Typography>
                    <Typography variant="h6">125,000 QCN</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Current Price
                    </Typography>
                    <Typography variant="h6">0.0012 ETH</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      24h Change
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      +12.5%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Market Cap
                    </Typography>
                    <Typography variant="h6">$2.5M</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>

      {isConnected && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Order Book
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Pair</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Typography
                        color={order.type === 'buy' ? 'success.main' : 'error.main'}
                      >
                        {order.type.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.pair}</TableCell>
                    <TableCell>{order.amount} QCN</TableCell>
                    <TableCell>{order.price} ETH</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {order.status === 'open' && (
                        <Button size="small" variant="outlined">
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}

export default DEXPage;
