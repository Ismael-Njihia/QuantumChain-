import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useWallet } from '../services/WalletContext';

function TokenSalePage() {
  const { isConnected, account } = useWallet();
  const [salePhase, setSalePhase] = useState('pre-sale');
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const saleData = {
    'pre-sale': {
      name: 'Pre-Sale',
      price: 0.0008,
      bonus: 25,
      hardCap: 1000000,
      sold: 650000,
      minPurchase: 100,
    },
    'main-sale': {
      name: 'Main Sale',
      price: 0.001,
      bonus: 10,
      hardCap: 5000000,
      sold: 2500000,
      minPurchase: 50,
    },
  };

  const currentSale = saleData[salePhase];
  const progress = (currentSale.sold / currentSale.hardCap) * 100;

  const handlePurchase = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) < currentSale.minPurchase) {
      setMessage({
        type: 'error',
        text: `Minimum purchase is ${currentSale.minPurchase} QCN`,
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Processing purchase...' });

      // Simulate purchase
      setTimeout(() => {
        setMessage({
          type: 'success',
          text: `Successfully purchased ${purchaseAmount} QCN tokens!`,
        });
        setPurchaseAmount('');
        setLoading(false);
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Purchase failed' });
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!purchaseAmount) return '0';
    const amount = parseFloat(purchaseAmount);
    const basePrice = amount * currentSale.price;
    const bonusTokens = (amount * currentSale.bonus) / 100;
    return {
      price: basePrice.toFixed(4),
      bonus: bonusTokens.toFixed(0),
      total: (amount + bonusTokens).toFixed(0),
    };
  };

  const totals = calculateTotal();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          QCN Token Sale
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join the QuantumChain revolution - Purchase QCN tokens during our sale phases
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item>
            <Chip
              label="Pre-Sale"
              color={salePhase === 'pre-sale' ? 'primary' : 'default'}
              onClick={() => setSalePhase('pre-sale')}
              clickable
            />
          </Grid>
          <Grid item>
            <Chip
              label="Main Sale"
              color={salePhase === 'main-sale' ? 'primary' : 'default'}
              onClick={() => setSalePhase('main-sale')}
              clickable
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {currentSale.name} Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Price per QCN
                  </Typography>
                  <Typography variant="h6">{currentSale.price} ETH</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Bonus
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {currentSale.bonus}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Min Purchase
                  </Typography>
                  <Typography variant="h6">{currentSale.minPurchase} QCN</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Hard Cap
                  </Typography>
                  <Typography variant="h6">
                    {currentSale.hardCap.toLocaleString()} QCN
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sale Progress: {progress.toFixed(1)}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {currentSale.sold.toLocaleString()} / {currentSale.hardCap.toLocaleString()} QCN sold
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Purchase Tokens
            </Typography>

            {!isConnected ? (
              <Alert severity="warning">
                Please connect your wallet to purchase tokens
              </Alert>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  label="Amount (QCN)"
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  sx={{ mb: 2 }}
                  helperText={`Minimum: ${currentSale.minPurchase} QCN`}
                />

                {purchaseAmount && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="body2" color="text.secondary">
                      Purchase Summary
                    </Typography>
                    <Typography variant="body1">
                      Base amount: {purchaseAmount} QCN
                    </Typography>
                    <Typography variant="body1" color="success.main">
                      Bonus ({currentSale.bonus}%): {totals.bonus} QCN
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Total: {totals.total} QCN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cost: {totals.price} ETH
                    </Typography>
                  </Paper>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePurchase}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Purchase Tokens'}
                </Button>

                {message.text && (
                  <Alert severity={message.type} sx={{ mt: 2 }}>
                    {message.text}
                  </Alert>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Token Sale Roadmap
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Pre-Sale Phase
            </Typography>
            <Typography variant="body2" paragraph>
              • 25% bonus on all purchases
            </Typography>
            <Typography variant="body2" paragraph>
              • Limited to 1M QCN tokens
            </Typography>
            <Typography variant="body2">
              • Early bird pricing at 0.0008 ETH
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Main Sale Phase
            </Typography>
            <Typography variant="body2" paragraph>
              • 10% bonus on all purchases
            </Typography>
            <Typography variant="body2" paragraph>
              • Up to 5M QCN tokens available
            </Typography>
            <Typography variant="body2">
              • Standard pricing at 0.001 ETH
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Post-Launch Strategy
            </Typography>
            <Typography variant="body2" paragraph>
              • DEX listing and liquidity provision
            </Typography>
            <Typography variant="body2" paragraph>
              • Market making and price stabilization
            </Typography>
            <Typography variant="body2">
              • Community rewards and staking
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default TokenSalePage;
