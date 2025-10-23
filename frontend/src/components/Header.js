import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import web3Service from '../services/web3Service';
import './Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (web3Service.isConnected()) {
      setWalletAddress(web3Service.getAccount());
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const address = await web3Service.connectWallet();
      setWalletAddress(address);
    } catch (error) {
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    web3Service.disconnectWallet();
    setIsLoggedIn(false);
    setWalletAddress('');
    navigate('/');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <h1>QuantumChain</h1>
          </Link>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li><Link to="/">Home</Link></li>
            {isLoggedIn && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/dex">DEX</Link></li>
                <li><Link to="/wallet">Wallet</Link></li>
                <li><Link to="/staking">Staking</Link></li>
              </>
            )}
            <li><Link to="/whitepaper">Whitepaper</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>

          <div className="header-actions">
            {!walletAddress ? (
              <button onClick={handleConnectWallet} className="btn-connect">
                Connect Wallet
              </button>
            ) : (
              <span className="wallet-address">{formatAddress(walletAddress)}</span>
            )}
            
            {isLoggedIn && (
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
