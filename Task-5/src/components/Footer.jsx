import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand-logo">
            <Sparkles className="logo-icon" size={20} />
            <span>LuxeCraft</span>
          </div>
          <p className="brand-desc">
            Handcrafted minimalist essentials designed to enhance your workspace acoustics, organization, and everyday productivity.
          </p>
        </div>

        <div className="footer-links-group">
          <h3>Shop</h3>
          <ul>
            <li><a href="/shop">All Products</a></li>
            <li><a href="/shop?category=Tech">Tech Accessories</a></li>
            <li><a href="/shop?category=Workspace">Workspace</a></li>
            <li><a href="/shop?category=Furniture">Furniture</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h3>Company</h3>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#sustainability">Sustainability</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Newsletter</h3>
          <p>Join the circle. Get early updates on new collections and exclusive discounts.</p>
          
          {subscribed ? (
            <div className="success-subscribe fade-in">
              <CheckCircle2 size={16} />
              <span>Subscribed! Check your inbox soon.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter subscription"
              />
              <button type="submit" aria-label="Subscribe to newsletter">
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} LuxeCraft Inc. All rights reserved. Crafted for Thrinex Internship.</p>
      </div>

      <style>{`
        .footer {
          background-color: var(--color-bg-alt);
          border-top: 1px solid var(--color-border);
          padding: 60px 0 30px;
          margin-top: 60px;
          transition: background-color var(--transition-normal);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 16px;
        }

        .footer-brand .logo-icon {
          color: var(--color-primary);
        }

        .brand-desc {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          max-width: 300px;
        }

        .footer-links-group h3, .footer-newsletter h3 {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-links-group ul {
          list-style: none;
        }

        .footer-links-group ul li {
          margin-bottom: 10px;
        }

        .footer-links-group ul li a {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          transition: color var(--transition-fast);
        }

        .footer-links-group ul li a:hover {
          color: var(--color-primary);
        }

        .footer-newsletter p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-bottom: 16px;
          max-width: 340px;
        }

        .newsletter-form {
          display: flex;
          background-color: var(--color-card-solid);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: 4px;
          max-width: 340px;
          transition: border-color var(--transition-fast);
        }

        .newsletter-form:focus-within {
          border-color: var(--color-primary);
        }

        .newsletter-form input {
          flex-grow: 1;
          padding: 8px 12px;
          font-size: 0.88rem;
          color: var(--color-text);
        }

        .newsletter-form button {
          width: 36px;
          height: 36px;
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--transition-fast);
        }

        .newsletter-form button:hover {
          background-color: var(--color-primary-hover);
        }

        .success-subscribe {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-success);
          font-size: 0.9rem;
          font-weight: 500;
          background-color: var(--color-bg);
          padding: 10px 16px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--color-success);
          max-width: 340px;
        }

        .footer-bottom {
          border-top: 1px solid var(--color-border);
          padding-top: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .brand-desc {
            max-width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}
