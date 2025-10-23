import React, { useState } from 'react';
import { tokenAPI } from '../services/api';
import './Staking.css';

function Staking() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStake = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await tokenAPI.stake(stakeAmount);
      setMessage(`Successfully staked ${stakeAmount} QCN tokens!`);
      setStakeAmount('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Staking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await tokenAPI.unstake(unstakeAmount);
      setMessage(`Successfully unstaked ${unstakeAmount} QCN tokens!`);
      setUnstakeAmount('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unstaking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staking">
      <div className="container">
        <h1>Token Staking</h1>
        <p className="subtitle">Stake your QCN tokens and earn rewards</p>

        <div className="staking-info card">
          <h2>Staking Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Annual Reward Rate</div>
              <div className="info-value">5%</div>
            </div>
            <div className="info-item">
              <div className="info-label">Minimum Stake</div>
              <div className="info-value">1000 QCN</div>
            </div>
            <div className="info-item">
              <div className="info-label">Lock Period</div>
              <div className="info-value">None</div>
            </div>
            <div className="info-item">
              <div className="info-label">Total Staked</div>
              <div className="info-value">10M QCN</div>
            </div>
          </div>
        </div>

        <div className="staking-grid">
          <div className="card">
            <h2>Stake Tokens</h2>
            <form onSubmit={handleStake}>
              <label>Amount (QCN)</label>
              <input
                type="number"
                placeholder="Enter amount to stake"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                min="1000"
                required
              />
              <p className="info">Minimum staking amount: 1000 QCN</p>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Stake Tokens'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Unstake Tokens</h2>
            <form onSubmit={handleUnstake}>
              <label>Amount (QCN)</label>
              <input
                type="number"
                placeholder="Enter amount to unstake"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                min="1"
                required
              />
              <p className="info">Unstake your tokens anytime without penalties</p>
              <button type="submit" className="btn-secondary" disabled={loading}>
                {loading ? 'Processing...' : 'Unstake Tokens'}
              </button>
            </form>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="card rewards-section">
          <h2>How Staking Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Stake Your Tokens</h3>
              <p>Lock your QCN tokens in the staking contract to start earning rewards.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Earn Rewards</h3>
              <p>Receive 5% annual rewards on your staked tokens automatically.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Claim Anytime</h3>
              <p>Unstake your tokens at any time without penalties or lock periods.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
