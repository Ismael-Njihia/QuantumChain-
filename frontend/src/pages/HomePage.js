import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to QuantumChain
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Post-Quantum Blockchain Platform with ERC-20 QCN Token
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
          Experience the future of blockchain with quantum-resistant cryptography,
          hybrid PoS consensus, and a responsive decentralized exchange.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/token-sale')}
          sx={{ mr: 2 }}
        >
          Buy QCN Tokens
        </Button>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/wallet')}
        >
          Connect Wallet
        </Button>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Post-Quantum Security
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Protected with advanced post-quantum cryptography to ensure your
              assets are safe from future quantum computer threats.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SpeedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Hybrid PoS Consensus
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fast and efficient transactions powered by our innovative hybrid
              Proof-of-Stake consensus mechanism.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Secure Anonymous Wallets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your QCN tokens with our secure, anonymous wallet system
              with built-in privacy features.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          QCN Token Details
        </Typography>
        <Typography variant="body1" paragraph>
          The QuantumChain Network (QCN) token is an ERC-20 compliant token that
          powers the QuantumChain ecosystem. Use QCN tokens for:
        </Typography>
        <ul>
          <li>
            <Typography variant="body1">Trading on the decentralized exchange</Typography>
          </li>
          <li>
            <Typography variant="body1">Staking for network consensus rewards</Typography>
          </li>
          <li>
            <Typography variant="body1">Governance and voting rights</Typography>
          </li>
          <li>
            <Typography variant="body1">IPFS document storage fees</Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
}

export default HomePage;
