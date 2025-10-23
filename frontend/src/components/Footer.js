import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>QuantumChain</h3>
            <p>Revolutionary blockchain platform with post-quantum cryptography and hybrid PoS consensus.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/whitepaper">Whitepaper</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/dex">DEX</Link></li>
              <li><Link to="/staking">Staking</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} QuantumChain. All rights reserved.</p>
          <p>Building the future of decentralized finance with quantum-resistant security.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
