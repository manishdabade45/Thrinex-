import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const outOfStock = product.stock <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!outOfStock) {
      addToCart(product, 1);
      // Optional: Add a simple toast animation trigger or state here
    }
  };

  return (
    <div className="product-card glass-panel fade-in">
      <Link to={`/product/${product.id}`} className="card-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name} 
          className="card-image"
          loading="lazy"
        />
        {outOfStock && <div className="sold-out-badge">Sold Out</div>}
        <div className="card-actions-overlay">
          <Link to={`/product/${product.id}`} className="circle-action-btn" title="View Details">
            <Eye size={18} />
          </Link>
          <button 
            onClick={handleQuickAdd} 
            disabled={outOfStock} 
            className="circle-action-btn" 
            title={outOfStock ? "Sold Out" : "Add to Cart"}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </Link>

      <div className="card-info">
        <div className="info-header">
          <span className="card-category">{product.category}</span>
          <div className="card-rating">
            <Star size={12} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="card-title">{product.name}</h3>
        </Link>
        
        <div className="info-footer">
          <span className="card-price">${product.price.toFixed(2)}</span>
          <span className="card-stock-status">
            {outOfStock ? (
              <span className="stock-out">Out of stock</span>
            ) : product.stock <= 3 ? (
              <span className="stock-low">{product.stock} left</span>
            ) : (
              <span className="stock-in">In stock</span>
            )}
          </span>
        </div>
      </div>

      <style>{`
        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          background-color: var(--color-card);
          border: 1px solid var(--color-border);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-border-hover);
        }

        .card-image-wrapper {
          position: relative;
          aspect-ratio: 1 / 1;
          width: 100%;
          overflow: hidden;
          background-color: var(--color-bg-alt);
          display: block;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .product-card:hover .card-image {
          transform: scale(1.08);
        }

        .sold-out-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background-color: var(--color-danger);
          color: white;
          padding: 4px 8px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: var(--border-radius-sm);
          z-index: 2;
        }

        .card-actions-overlay {
          position: absolute;
          inset: 0;
          background-color: rgba(9, 10, 15, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transition: opacity var(--transition-normal);
          z-index: 1;
          backdrop-filter: blur(2px);
        }

        .card-image-wrapper:hover .card-actions-overlay {
          opacity: 1;
        }

        .circle-action-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--border-radius-full);
          background-color: var(--color-card-solid);
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform var(--transition-fast), background-color var(--transition-fast), color var(--transition-fast);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
        }

        .circle-action-btn:hover {
          transform: scale(1.1);
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
          border-color: var(--color-primary);
        }

        .circle-action-btn:disabled {
          background-color: var(--color-bg-alt);
          color: var(--color-text-muted);
          border-color: var(--color-border);
          cursor: not-allowed;
          transform: none;
        }

        .card-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .info-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .card-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #eab308; /* Star Amber */
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--color-text);
          line-height: 1.4;
          height: 2.8rem; /* Cap heights to 2 lines */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color var(--transition-fast);
        }

        .card-title:hover {
          color: var(--color-primary);
        }

        .info-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--color-border);
        }

        .card-price {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text);
          font-family: var(--font-heading);
        }

        .card-stock-status {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stock-in {
          color: var(--color-success);
        }

        .stock-low {
          color: var(--color-accent);
          background-color: rgba(194, 65, 12, 0.1);
          padding: 2px 6px;
          border-radius: var(--border-radius-sm);
        }

        .stock-out {
          color: var(--color-danger);
        }
      `}</style>
    </div>
  );
}
