import React, { useState, useEffect } from 'react';
import { tokenAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        tokenAPI.getBalance(),
        tokenAPI.getTransactions(1, 5)
      ]);

      setBalance(balanceRes.data.balance);
      setStakedAmount(balanceRes.data.stakedAmount);
      setTransactions(transactionsRes.data.transactions);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Available Balance</h3>
            <div className="stat-value">{balance.toFixed(2)} QCN</div>
          </div>

          <div className="stat-card">
            <h3>Staked Amount</h3>
            <div className="stat-value">{stakedAmount.toFixed(2)} QCN</div>
          </div>

          <div className="stat-card">
            <h3>Total Value</h3>
            <div className="stat-value">{(balance + stakedAmount).toFixed(2)} QCN</div>
          </div>
        </div>

        <div className="card">
          <h2>Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <div className="transactions-list">
              {transactions.map((tx) => (
                <div key={tx._id} className="transaction-item">
                  <div className="tx-type">{tx.type}</div>
                  <div className="tx-amount">{tx.amount} QCN</div>
                  <div className="tx-status">{tx.status}</div>
                  <div className="tx-date">{new Date(tx.timestamp).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
