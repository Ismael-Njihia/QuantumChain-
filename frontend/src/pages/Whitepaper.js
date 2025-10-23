import React from 'react';
import './Whitepaper.css';

function Whitepaper() {
  const handleDownload = () => {
    // In production, this would download the actual whitepaper PDF
    alert('Whitepaper download will be available soon!');
  };

  return (
    <div className="whitepaper">
      <div className="container">
        <h1>QuantumChain Whitepaper</h1>
        
        <div className="card download-section">
          <h2>Download Official Whitepaper</h2>
          <p>Get the complete technical documentation and vision for QuantumChain</p>
          <button onClick={handleDownload} className="btn-primary btn-large">
            📄 Download Whitepaper (PDF)
          </button>
        </div>

        <div className="card">
          <h2>Executive Summary</h2>
          <p>
            QuantumChain represents a paradigm shift in blockchain technology, combining 
            post-quantum cryptography with a hybrid Proof of Stake consensus mechanism to 
            create a secure, scalable, and future-proof decentralized platform.
          </p>
        </div>

        <div className="card">
          <h2>Technology Overview</h2>
          
          <h3>Post-Quantum Cryptography</h3>
          <p>
            QuantumChain implements advanced post-quantum cryptographic algorithms including 
            CRYSTALS-Kyber for key encapsulation and SPHINCS+ for digital signatures. These 
            NIST-approved algorithms ensure that the network remains secure even in the face 
            of quantum computing advances.
          </p>

          <h3>Hybrid PoS Consensus</h3>
          <p>
            Our innovative hybrid Proof of Stake mechanism combines traditional PoS with 
            quantum-resistant validator selection, ensuring both energy efficiency and 
            long-term security. Validators stake QCN tokens to participate in block 
            production and earn rewards.
          </p>

          <h3>Decentralized Exchange</h3>
          <p>
            The integrated DEX allows for seamless token trading with automated market 
            making (AMM) and liquidity pools. Trade fees are minimal at 0.3%, with 
            liquidity providers earning proportional rewards.
          </p>
        </div>

        <div className="card">
          <h2>Token Economics</h2>
          
          <h3>QCN Token Details</h3>
          <ul>
            <li>Total Supply: 1,000,000,000 QCN</li>
            <li>Pre-Sale: 100,000,000 QCN (10%)</li>
            <li>Main Sale: 300,000,000 QCN (30%)</li>
            <li>Team & Advisors: 150,000,000 QCN (15%) - 2 year vesting</li>
            <li>Development Fund: 200,000,000 QCN (20%)</li>
            <li>Ecosystem & Partnerships: 150,000,000 QCN (15%)</li>
            <li>Staking Rewards: 100,000,000 QCN (10%)</li>
          </ul>

          <h3>Token Utility</h3>
          <ul>
            <li>Transaction fees on the network</li>
            <li>Staking for network validation</li>
            <li>Governance voting rights</li>
            <li>DEX trading and liquidity provision</li>
            <li>Access to premium platform features</li>
          </ul>
        </div>

        <div className="card">
          <h2>Security & Audits</h2>
          <p>
            QuantumChain smart contracts have been audited by leading blockchain security 
            firms. We implement industry best practices including multi-signature wallets, 
            time-locks, and regular security reviews. Our post-quantum cryptographic 
            implementations follow NIST guidelines and undergo continuous evaluation.
          </p>
        </div>

        <div className="card">
          <h2>Roadmap</h2>
          <div className="roadmap-list">
            <div className="roadmap-item">
              <strong>Q1 2024:</strong> Project launch, whitepaper release, community building
            </div>
            <div className="roadmap-item">
              <strong>Q2 2024:</strong> Token pre-sale, smart contract deployment, security audits
            </div>
            <div className="roadmap-item">
              <strong>Q3 2024:</strong> Main token sale, platform beta launch, DEX integration
            </div>
            <div className="roadmap-item">
              <strong>Q4 2024:</strong> Mainnet launch, staking implementation, ecosystem expansion
            </div>
            <div className="roadmap-item">
              <strong>2025:</strong> Exchange listings, global partnerships, advanced features
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Legal Disclaimer</h2>
          <p className="disclaimer">
            This whitepaper is for informational purposes only and does not constitute 
            investment advice. QCN tokens are utility tokens and should not be considered 
            as securities. Always conduct your own research and consult with financial 
            advisors before making investment decisions. QuantumChain is not responsible 
            for any losses incurred from token purchases or trading activities.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Whitepaper;
