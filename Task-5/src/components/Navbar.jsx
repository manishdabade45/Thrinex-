import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
  const { getCartCount } = useContext(CartContext);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('luxecraft_theme') || 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('luxecraft_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <>
      <header className="navbar-container">
        <div className="container navbar-content glass-panel">
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <Sparkles className="logo-icon" size={24} />
            <span>LuxeCraft</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
            <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>Shop</Link>
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
              <LayoutDashboard size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Admin
            </Link>
          </nav>

          <div className="navbar-actions">
            {/* Theme switch */}
            <button 
              onClick={toggleTheme} 
              className="action-btn theme-toggle" 
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Shopping Cart Trigger */}
            <Link to="/cart" className="action-btn cart-btn" aria-label="View shopping cart">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="cart-badge pulse">{getCartCount()}</span>
              )}
            </Link>

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="action-btn mobile-menu-toggle"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-overlay fade-in" onClick={() => setMobileMenuOpen(false)}>
            <nav className="mobile-nav glass-panel" onClick={(e) => e.stopPropagation()}>
              <Link to="/" className={`mobile-nav-link ${isActive('/')}`} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className={`mobile-nav-link ${isActive('/shop')}`} onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/admin" className={`mobile-nav-link ${isActive('/admin')}`} onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
              <Link to="/cart" className={`mobile-nav-link ${isActive('/cart')}`} onClick={() => setMobileMenuOpen(false)}>
                Cart ({getCartCount()} items)
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Styled component styling block embedded directly for isolated component control */}
      <style>{`
        .navbar-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          display: flex;
          align-items: center;
          z-index: 1000;
          padding: 12px 24px;
        }

        .navbar-content {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          border-radius: var(--border-radius-full);
          width: 100%;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--color-text);
        }

        .logo-icon {
          color: var(--color-primary);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--color-text-muted);
          position: relative;
          padding: 4px 0;
        }

        .nav-link:hover {
          color: var(--color-text);
        }

        .nav-link.active-link {
          color: var(--color-primary);
        }

        .nav-link.active-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--color-primary);
          border-radius: var(--border-radius-full);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .action-btn {
          width: 38px;
          height: 38px;
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          transition: background-color var(--transition-fast), color var(--transition-fast);
          position: relative;
          border: 1px solid var(--color-border);
        }

        .action-btn:hover {
          background-color: var(--color-bg-alt);
          color: var(--color-text);
          border-color: var(--color-border-hover);
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
          font-size: 0.7rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-toggle {
          display: none;
        }

        /* Mobile Menu Overlay */
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex;
          justify-content: flex-end;
          padding: 88px 24px 24px;
        }

        .mobile-nav {
          width: 260px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 16px;
          border-radius: var(--border-radius-lg);
        }

        .mobile-nav-link {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 1.1rem;
          padding: 10px 14px;
          border-radius: var(--border-radius-md);
          color: var(--color-text-muted);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .mobile-nav-link:hover, .mobile-nav-link.active-link {
          background-color: var(--color-bg-alt);
          color: var(--color-primary);
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-menu-toggle {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
