import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DEX from './pages/DEX';
import Wallet from './pages/Wallet';
import Staking from './pages/Staking';
import Whitepaper from './pages/Whitepaper';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dex" element={<DEX />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/staking" element={<Staking />} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
