import React, { useState } from 'react';
import './DEX.css';

function DEX() {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('QCN');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSwap = (e) => {
    e.preventDefault();
    setMessage('Swap functionality will be available soon on mainnet!');
  };

  const calculateToAmount = (amount) => {
    // Simple conversion rate (1 ETH = 50 QCN)
    if (fromToken === 'ETH' && toToken === 'QCN') {
      return (parseFloat(amount) * 50).toFixed(2);
    } else if (fromToken === 'QCN' && toToken === 'ETH') {
      return (parseFloat(amount) / 50).toFixed(4);
    }
    return amount;
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    if (value) {
      setToAmount(calculateToAmount(value));
    } else {
      setToAmount('');
    }
  };

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="dex">
      <div className="container">
        <h1>Decentralized Exchange</h1>
        <p className="subtitle">Trade tokens with low fees and high security</p>

        <div className="dex-container">
          <div className="card swap-card">
            <h2>Swap Tokens</h2>
            <form onSubmit={handleSwap}>
              <div className="token-input">
                <label>From</label>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    step="0.0001"
                    required
                  />
                  <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
                    <option value="ETH">ETH</option>
                    <option value="QCN">QCN</option>
                  </select>
                </div>
              </div>

              <button type="button" className="switch-btn" onClick={switchTokens}>
                ⇅
              </button>

              <div className="token-input">
                <label>To</label>
                <div className="input-group">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={toAmount}
                    readOnly
                  />
                  <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
                    <option value="QCN">QCN</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary swap-btn">
                Swap Tokens
              </button>

              {message && <p className="message">{message}</p>}
            </form>
          </div>

          <div className="dex-info">
            <div className="card">
              <h3>Trading Stats</h3>
              <div className="stat-row">
                <span>24h Volume</span>
                <span className="value">$2,450,000</span>
              </div>
              <div className="stat-row">
                <span>Total Liquidity</span>
                <span className="value">$15,000,000</span>
              </div>
              <div className="stat-row">
                <span>Trading Fee</span>
                <span className="value">0.3%</span>
              </div>
            </div>

            <div className="card">
              <h3>Recent Trades</h3>
              <div className="trade-list">
                <div className="trade-item">
                  <span>ETH → QCN</span>
                  <span className="amount">1.5 ETH</span>
                </div>
                <div className="trade-item">
                  <span>QCN → ETH</span>
                  <span className="amount">100 QCN</span>
                </div>
                <div className="trade-item">
                  <span>ETH → QCN</span>
                  <span className="amount">0.8 ETH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DEX;
