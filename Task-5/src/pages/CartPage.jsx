import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, Ticket, Check } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    couponCode,
    couponError,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTaxAmount,
    getGrandTotal
  } = useContext(CartContext);

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      const success = applyCoupon(promoInput.trim());
      if (success) setPromoInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container empty-cart-state fade-in">
        <ShoppingCart size={48} className="empty-icon" />
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any luxury essentials to your workspace yet.</p>
        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container fade-in">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <Link to="/shop" className="continue-shopping">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">
        {/* Cart items list */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.product.id} className="cart-item glass-panel fade-in">
              <div className="item-image-wrapper">
                <img src={item.product.image} alt={item.product.name} />
              </div>

              <div className="item-details">
                <span className="item-category">{item.product.category}</span>
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="item-name">{item.product.name}</h3>
                </Link>
                <div className="item-price-unit">${item.product.price.toFixed(2)} each</div>
              </div>

              <div className="item-quantity-control">
                <div className="qty-picker">
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >-</button>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    readOnly 
                    aria-label="Quantity"
                  />
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    aria-label="Increase quantity"
                  >+</button>
                </div>
                {item.quantity >= item.product.stock && (
                  <span className="stock-limit-text">Max stock reached</span>
                )}
              </div>

              <div className="item-total-price">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>

              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="remove-item-btn"
                aria-label={`Remove ${item.product.name} from cart`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary sidebar */}
        <aside className="order-summary-sidebar">
          <div className="summary-card glass-panel">
            <h3>Order Summary</h3>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>

              {couponCode && (
                <div className="summary-row promo-row fade-in">
                  <span className="promo-label">
                    Discount ({couponCode})
                    <button onClick={removeCoupon} className="remove-promo-btn" title="Remove promo code">Remove</button>
                  </span>
                  <span>-${getDiscountAmount().toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {getShippingCost() === 0 ? (
                    <span className="shipping-free">Free</span>
                  ) : (
                    `$${getShippingCost().toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span>${getTaxAmount().toFixed(2)}</span>
              </div>

              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span>${getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Promo code input */}
            <div className="promo-input-section">
              <label>Promo Code</label>
              {couponCode ? (
                <div className="active-coupon-badge">
                  <Check size={14} /> Code <strong>{couponCode}</strong> applied successfully!
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="promo-form">
                  <div className="promo-field">
                    <Ticket size={16} className="promo-icon" />
                    <input 
                      type="text" 
                      placeholder="e.g. WELCOME10" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary promo-btn">Apply</button>
                </form>
              )}
              {couponError && <p className="promo-error">{couponError}</p>}
              {!couponCode && (
                <p className="promo-tip">Try using codes <strong>WELCOME10</strong> or <strong>LUXE20</strong>.</p>
              )}
            </div>

            <Link to="/checkout" className="btn btn-primary checkout-cta-btn">
              Proceed to Checkout
            </Link>
          </div>
        </aside>
      </div>

      <style>{`
        .cart-page {
          padding-top: 30px;
          padding-bottom: 60px;
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }

        .cart-header h1 {
          font-size: 2.25rem;
          color: var(--color-text);
        }

        .continue-shopping {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--color-primary);
          font-weight: 600;
          font-family: var(--font-heading);
        }

        .continue-shopping:hover {
          color: var(--color-primary-hover);
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 30px;
          align-items: start;
        }

        /* Cart list item styling */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 2fr 1.2fr 1fr auto;
          gap: 20px;
          align-items: center;
          padding: 20px;
        }

        .item-image-wrapper {
          aspect-ratio: 1 / 1;
          width: 100%;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          background-color: var(--color-bg-alt);
        }

        .item-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .item-category {
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--color-text-muted);
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .item-name {
          font-size: 1.05rem;
          color: var(--color-text);
          font-weight: 600;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .item-name:hover {
          color: var(--color-primary);
        }

        .item-price-unit {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .item-quantity-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .qty-picker {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          background-color: var(--color-bg-alt);
          overflow: hidden;
        }

        .qty-picker button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .qty-picker button:hover {
          background-color: var(--color-border);
        }

        .qty-picker button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qty-picker input {
          width: 38px;
          text-align: center;
          font-weight: 600;
          background: transparent;
        }

        .stock-limit-text {
          font-size: 0.7rem;
          color: var(--color-accent);
        }

        .item-total-price {
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-text);
          font-size: 1.1rem;
          text-align: right;
        }

        .remove-item-btn {
          color: var(--color-text-muted);
          width: 38px;
          height: 38px;
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid transparent;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .remove-item-btn:hover {
          background-color: var(--color-bg-alt);
          color: var(--color-danger);
          border-color: var(--color-border);
        }

        /* Sidebar summary card styling */
        .summary-card {
          padding: 24px;
        }

        .summary-card h3 {
          font-size: 1.25rem;
          color: var(--color-text);
          margin-bottom: 20px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
        }

        .summary-rows {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }

        .promo-label {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          color: var(--color-success);
          font-weight: 500;
        }

        .remove-promo-btn {
          font-size: 0.75rem;
          color: var(--color-danger);
          text-decoration: underline;
          margin-top: 2px;
        }

        .promo-row {
          color: var(--color-success);
          font-weight: 500;
        }

        .shipping-free {
          color: var(--color-success);
          font-weight: 600;
        }

        .total-row {
          border-top: 1px solid var(--color-border);
          padding-top: 16px;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-text);
          font-family: var(--font-heading);
        }

        .promo-input-section {
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
          margin-bottom: 24px;
        }

        .promo-input-section label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 8px;
          display: block;
        }

        .active-coupon-badge {
          font-size: 0.82rem;
          color: var(--color-success);
          background-color: rgba(34, 197, 94, 0.1);
          padding: 8px 12px;
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--color-success);
        }

        .promo-form {
          display: flex;
          gap: 8px;
        }

        .promo-field {
          position: relative;
          flex-grow: 1;
        }

        .promo-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .promo-field input {
          width: 100%;
          border: 1px solid var(--color-border);
          background-color: var(--color-bg);
          color: var(--color-text);
          padding: 8px 10px 8px 34px;
          border-radius: var(--border-radius-md);
          font-size: 0.85rem;
        }

        .promo-field input:focus {
          border-color: var(--color-primary);
        }

        .promo-btn {
          padding: 0 16px;
          font-size: 0.85rem;
          border-radius: var(--border-radius-md);
        }

        .promo-error {
          font-size: 0.78rem;
          color: var(--color-danger);
          margin-top: 6px;
        }

        .promo-tip {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 8px;
        }

        .checkout-cta-btn {
          width: 100%;
          padding: 12px;
          font-size: 1.02rem;
        }

        .empty-cart-state {
          padding: 100px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-icon {
          color: var(--color-text-muted);
        }

        .empty-cart-state h2 {
          font-size: 1.75rem;
          color: var(--color-text);
        }

        .empty-cart-state p {
          color: var(--color-text-muted);
          max-width: 420px;
          margin-bottom: 8px;
        }

        @media (max-width: 992px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .cart-item {
            grid-template-columns: 80px 1fr;
            grid-template-rows: auto auto auto;
            gap: 12px;
          }

          .item-image-wrapper {
            grid-row: span 3;
          }

          .item-quantity-control {
            grid-column: 2;
            flex-direction: row;
            justify-content: flex-start;
          }

          .item-total-price {
            grid-column: 2;
            text-align: left;
            font-size: 1rem;
          }

          .remove-item-btn {
            position: absolute;
            top: 12px;
            right: 12px;
          }
        }
      `}</style>
    </div>
  );
}
