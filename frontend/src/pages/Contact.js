import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await contactAPI.send(formData);
      setStatus('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="container">
        <h1>Contact Us</h1>
        <p className="subtitle">Have questions? We'd love to hear from you.</p>

        <div className="contact-grid">
          <div className="card contact-form">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <label>Message</label>
              <textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              />

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {status && (
                <p className={status.includes('successfully') ? 'success' : 'error'}>
                  {status}
                </p>
              )}
            </form>
          </div>

          <div className="contact-info">
            <div className="card">
              <h2>Get in Touch</h2>
              <div className="info-item">
                <div className="icon">📧</div>
                <div>
                  <h3>Email</h3>
                  <p>info@quantumchain.io</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon">💬</div>
                <div>
                  <h3>Live Chat</h3>
                  <p>Available 24/7 on Telegram</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon">🌐</div>
                <div>
                  <h3>Social Media</h3>
                  <p>Follow us for updates</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Office Hours</h2>
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM (UTC)</p>
              <p><strong>Saturday - Sunday:</strong> Closed</p>
              <p className="note">Emergency support available 24/7</p>
            </div>

            <div className="card social-card">
              <h2>Follow Us</h2>
              <div className="social-links">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  Twitter
                </a>
                <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-link">
                  Telegram
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  Discord
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
