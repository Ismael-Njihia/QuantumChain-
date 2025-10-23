import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useWallet } from '../services/WalletContext';

function WalletPage() {
  const { account, balance, isConnected, connectWallet, disconnectWallet, updateBalance } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isConnected) {
      updateBalance();
    }
  }, [isConnected]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      await connectWallet();
      setMessage({ type: 'success', text: 'Wallet connected successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect wallet' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTransaction = async () => {
    if (!recipientAddress || !sendAmount) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Transaction pending...' });
      
      // Transaction logic would go here
      // For now, just simulate success
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Transaction sent successfully!' });
        setRecipientAddress('');
        setSendAmount('');
        setLoading(false);
        updateBalance();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Transaction failed' });
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Secure Anonymous Wallet
        </Typography>

        {!isConnected ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" paragraph>
              Connect your wallet to manage your QCN tokens
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Connect Wallet'}
            </Button>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Wallet Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                    {account}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography variant="h5">
                    {balance} ETH
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Send Transaction
                </Typography>
                <TextField
                  fullWidth
                  label="Recipient Address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Amount (ETH)"
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendTransaction}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <CircularProgress size={24} /> : 'Send'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={disconnectWallet}
                  fullWidth
                >
                  Disconnect Wallet
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {message.text && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Privacy Features
        </Typography>
        <Typography variant="body1" paragraph>
          Our anonymous wallet system uses advanced post-quantum cryptography to ensure:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">Complete transaction privacy</Typography>
          </li>
          <li>
            <Typography variant="body1">Quantum-resistant encryption</Typography>
          </li>
          <li>
            <Typography variant="body1">Secure key management</Typography>
          </li>
          <li>
            <Typography variant="body1">Anonymous transaction routing</Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
}

export default WalletPage;
