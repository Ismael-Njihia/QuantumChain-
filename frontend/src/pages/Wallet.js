import React, { useState } from 'react';
import { tokenAPI } from '../services/api';
import web3Service from '../services/web3Service';
import './Wallet.css';

function Wallet() {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await tokenAPI.purchase({
        amount: purchaseAmount,
        paymentMethod: 'eth'
      });
      setMessage(`Successfully purchased ${purchaseAmount} QCN tokens!`);
      setPurchaseAmount('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await tokenAPI.transfer({
        toAddress: transferAddress,
        amount: transferAmount
      });
      setMessage(`Successfully transferred ${transferAmount} QCN tokens!`);
      setTransferAddress('');
      setTransferAmount('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet">
      <div className="container">
        <h1>Wallet</h1>

        <div className="wallet-grid">
          <div className="card">
            <h2>Purchase Tokens</h2>
            <form onSubmit={handlePurchase}>
              <label>Amount (QCN)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                min="100"
                required
              />
              <p className="info">Minimum: 100 QCN | Price: 0.02 ETH per token</p>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Purchase Tokens'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Transfer Tokens</h2>
            <form onSubmit={handleTransfer}>
              <label>Recipient Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                required
              />
              <label>Amount (QCN)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                min="1"
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Transfer Tokens'}
              </button>
            </form>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;
