import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, contactAPI } from '../services/api';
import './Home.css';

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await authAPI.register({ email, password, username });
      localStorage.setItem('token', response.data.token);
      setMessage('Registration successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.subscribe(subscribeEmail);
      alert('Successfully subscribed to newsletter!');
      setSubscribeEmail('');
    } catch (error) {
      alert('Subscription failed');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to QuantumChain</h1>
          <p className="hero-subtitle">
            The Next Generation Blockchain Platform with Post-Quantum Cryptography
          </p>
          <div className="hero-buttons">
            <button onClick={() => setShowRegister(true)} className="btn-primary btn-large">
              Get Started
            </button>
            <button onClick={() => setShowLogin(true)} className="btn-secondary btn-large">
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Post-Quantum Cryptography</h3>
              <p>Advanced quantum-resistant encryption to secure your assets against future threats.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Hybrid PoS Consensus</h3>
              <p>Efficient and secure consensus mechanism combining the best of both worlds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💱</div>
              <h3>Decentralized Exchange</h3>
              <p>Trade tokens seamlessly with our integrated DEX platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Secure Wallet</h3>
              <p>Advanced wallet with multi-signature support and quantum-resistant security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Token Staking</h3>
              <p>Earn rewards by staking your QCN tokens and participate in network security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>High Performance</h3>
              <p>Fast transaction processing with low fees and high scalability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="roadmap" id="roadmap">
        <div className="container">
          <h2>Roadmap</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-badge completed">Q1 2024</div>
              <div className="timeline-content">
                <h3>Project Launch</h3>
                <p>Whitepaper release, website launch, and community building.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-badge completed">Q2 2024</div>
              <div className="timeline-content">
                <h3>Pre-Sale & Token Generation</h3>
                <p>QCN token pre-sale, smart contract deployment, and security audits.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-badge active">Q3 2024</div>
              <div className="timeline-content">
                <h3>Main Sale & Platform Beta</h3>
                <p>Public token sale, beta platform launch, and DEX integration.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-badge">Q4 2024</div>
              <div className="timeline-content">
                <h3>Full Platform Launch</h3>
                <p>Mainnet launch, staking implementation, and ecosystem expansion.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-badge">2025</div>
              <div className="timeline-content">
                <h3>Global Expansion</h3>
                <p>Exchange listings, partnerships, and advanced features rollout.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team" id="team">
        <div className="container">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">👨‍💻</div>
              <h3>Dr. Alex Quantum</h3>
              <p className="role">CEO & Co-Founder</p>
              <p>PhD in Quantum Computing, 15+ years in blockchain technology.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👩‍💼</div>
              <h3>Sarah Chen</h3>
              <p className="role">CTO & Co-Founder</p>
              <p>Former lead engineer at major crypto exchanges, security expert.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👨‍🔬</div>
              <h3>Dr. Michael Smith</h3>
              <p className="role">Chief Cryptographer</p>
              <p>Post-quantum cryptography researcher, published author.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👩‍💻</div>
              <h3>Emily Rodriguez</h3>
              <p className="role">Lead Developer</p>
              <p>Full-stack blockchain developer, smart contract specialist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Token Sale Section */}
      <section className="token-sale" id="token-sale">
        <div className="container">
          <h2>QCN Token Sale</h2>
          <div className="sale-info">
            <div className="sale-card">
              <h3>Pre-Sale</h3>
              <div className="price">0.01 ETH</div>
              <p>per QCN token</p>
              <p className="status">Completed</p>
            </div>
            <div className="sale-card active">
              <h3>Main Sale</h3>
              <div className="price">0.02 ETH</div>
              <p>per QCN token</p>
              <p className="status">Active Now</p>
              <button className="btn-primary" onClick={() => setShowRegister(true)}>
                Buy Tokens
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest updates and announcements.</p>
          <form onSubmit={handleSubscribe} className="subscribe-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
              </button>
              {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
            </form>
            <p className="switch-form">
              Don't have an account? <button onClick={() => { setShowLogin(false); setShowRegister(true); }}>Register</button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowRegister(false)}>×</button>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
              </button>
              {message && <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>}
            </form>
            <p className="switch-form">
              Already have an account? <button onClick={() => { setShowRegister(false); setShowLogin(true); }}>Login</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
