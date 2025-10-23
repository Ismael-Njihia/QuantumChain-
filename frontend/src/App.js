import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import './App.css';
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import DEXPage from './pages/DEXPage';
import TokenSalePage from './pages/TokenSalePage';
import { WalletProvider } from './services/WalletContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <WalletProvider>
        <Router>
          <div className="App">
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  QuantumChain
                </Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/wallet">Wallet</Button>
                <Button color="inherit" component={Link} to="/dex">DEX</Button>
                <Button color="inherit" component={Link} to="/token-sale">Token Sale</Button>
              </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/dex" element={<DEXPage />} />
                <Route path="/token-sale" element={<TokenSalePage />} />
              </Routes>
            </Container>
          </div>
        </Router>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
