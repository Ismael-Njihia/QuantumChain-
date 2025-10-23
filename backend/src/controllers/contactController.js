const nodemailer = require('nodemailer');
const config = require('../config/config');

class ContactController {
  static async sendMessage(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Sanitize inputs to prevent XSS
      const sanitize = (str) => String(str).replace(/[&<>"']/g, (char) => {
        const escape = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;'
        };
        return escape[char];
      });

      const sanitizedName = sanitize(name);
      const sanitizedEmail = sanitize(email);
      const sanitizedSubject = sanitize(subject);
      const sanitizedMessage = sanitize(message);

      // Create transporter
      const transporter = nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        secure: false,
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASSWORD
        }
      });

      // Email content with sanitized data
      const mailOptions = {
        from: config.EMAIL_FROM,
        to: config.EMAIL_USER, // Send to admin
        replyTo: sanitizedEmail,
        subject: `Contact Form: ${sanitizedSubject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Subject:</strong> ${sanitizedSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitizedMessage}</p>
        `
      };

      // Send email (in development, just log)
      if (config.NODE_ENV === 'production' && config.EMAIL_USER) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log('Contact form submission:', { name: sanitizedName, email: sanitizedEmail, subject: sanitizedSubject, message: sanitizedMessage });
      }

      res.json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  static async subscribeNewsletter(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // In production, add to newsletter service (e.g., Mailchimp)
      console.log('Newsletter subscription:', email);

      res.json({ message: 'Subscribed successfully' });
    } catch (error) {
      console.error('Subscribe newsletter error:', error);
      res.status(500).json({ error: 'Subscription failed' });
    }
  }
}

module.exports = ContactController;
