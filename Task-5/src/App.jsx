import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import { CatalogProvider } from './context/CatalogContext';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CatalogProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="*" element={
                <div style={{ padding: '100px 0', textAlign: 'center' }}>
                  <h2>Page Not Found</h2>
                  <p style={{ margin: '16px 0', color: 'var(--color-text-muted)' }}>
                    The page you are looking for does not exist.
                  </p>
                  <a href="/" className="btn btn-primary">Back Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </CatalogProvider>
  );
}
