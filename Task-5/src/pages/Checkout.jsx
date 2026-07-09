import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
  const {
    cartItems,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getTaxAmount,
    getGrandTotal,
    couponCode
  } = useContext(CartContext);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success

  // Form Fields
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: '', address: '', city: '', zipCode: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: ''
  });

  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Handle Input Changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    // Format card number with spaces
    let cleanVal = value;
    if (name === 'cardNumber') {
      cleanVal = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    setPaymentData(prev => ({ ...prev, [name]: cleanVal }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Form validation
  const validateShipping = () => {
    const newErrors = {};
    if (!shippingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!shippingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!shippingData.email.trim() || !/\S+@\S+\.\S+/.test(shippingData.email)) newErrors.email = 'Enter a valid email address';
    if (!shippingData.address.trim()) newErrors.address = 'Shipping address is required';
    if (!shippingData.city.trim()) newErrors.city = 'City is required';
    if (!shippingData.zipCode.trim() || !/^\d{5,6}$/.test(shippingData.zipCode)) newErrors.zipCode = 'Enter a valid Zip/Postal code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    if (!paymentData.cardName.trim()) newErrors.cardName = 'Name on card is required';
    if (!paymentData.cardNumber.trim() || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Enter a valid 16-digit card number';
    }
    if (!paymentData.cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(paymentData.cardExpiry)) {
      newErrors.cardExpiry = 'Format MM/YY required';
    }
    if (!paymentData.cardCvv.trim() || !/^\d{3}$/.test(paymentData.cardCvv)) {
      newErrors.cardCvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (validateShipping()) setStep(2);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      // Simulate API order creation
      const generatedId = 'LC-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      
      // Calculate estimated delivery: Current date + 3 days
      const date = new Date();
      date.setDate(date.getDate() + 3);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setDeliveryDate(date.toLocaleDateString('en-US', options));
      
      // Finalize Order
      setStep(3);
    }
  };

  // Render Order Completed Invoice
  if (step === 3) {
    return (
      <div className="checkout-page container success-screen fade-in">
        <div className="success-card glass-panel flex-center">
          <CheckCircle2 className="success-icon" size={64} />
          <h2>Order Placed Successfully!</h2>
          <p className="order-intro-text">
            Thank you for shopping with LuxeCraft. Your receipt has been sent to <strong>{shippingData.email}</strong>.
          </p>

          <div className="receipt-invoice">
            <div className="receipt-header">
              <div>
                <h4>Invoice Recipient</h4>
                <p>{shippingData.firstName} {shippingData.lastName}</p>
                <p>{shippingData.address}, {shippingData.city}</p>
              </div>
              <div className="receipt-meta">
                <h4>Order Details</h4>
                <p>Order ID: <strong>{orderId}</strong></p>
                <p>Delivery: <strong>{deliveryDate}</strong></p>
              </div>
            </div>

            <div className="receipt-items">
              <h4>Items Purchased</h4>
              {cartItems.map((item) => (
                <div key={item.product.id} className="receipt-item-row">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="receipt-totals">
              <div className="total-row-minor">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              {couponCode && (
                <div className="total-row-minor promo-text">
                  <span>Discount ({couponCode})</span>
                  <span>-${getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="total-row-minor">
                <span>Shipping</span>
                <span>{getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}</span>
              </div>
              <div className="total-row-minor">
                <span>Tax (8%)</span>
                <span>${getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="total-row-major">
                <span>Total Paid</span>
                <span>${getGrandTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Link to="/shop" onClick={() => clearCart()} className="btn btn-primary done-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty before success screen
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page container empty-cart-state fade-in">
        <ShoppingBag size={48} className="empty-icon" />
        <h2>Checkout Unavailable</h2>
        <p>You cannot checkout with an empty basket.</p>
        <Link to="/shop" className="btn btn-primary">Browse Catalog</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page container fade-in">
      <div className="checkout-header">
        <h1>Secure Checkout</h1>
        <div className="steps-indicator">
          <span className={`step-dot ${step >= 1 ? 'active' : ''}`}>1. Shipping</span>
          <span className="step-line"></span>
          <span className={`step-dot ${step >= 2 ? 'active' : ''}`}>2. Payment</span>
        </div>
      </div>

      <div className="checkout-layout">
        {/* Forms side */}
        <main className="checkout-forms">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="form-card glass-panel">
              <h3>Shipping Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName" 
                    value={shippingData.firstName} 
                    onChange={handleShippingChange} 
                    className={errors.firstName ? 'input-error' : ''}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName" 
                    value={shippingData.lastName} 
                    onChange={handleShippingChange}
                    className={errors.lastName ? 'input-error' : ''}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
                <div className="form-group span-2">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    value={shippingData.email} 
                    onChange={handleShippingChange}
                    placeholder="john@example.com"
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="form-group span-2">
                  <label htmlFor="address">Address</label>
                  <input 
                    type="text" 
                    id="address"
                    name="address" 
                    value={shippingData.address} 
                    onChange={handleShippingChange}
                    placeholder="123 Luxury Way"
                    className={errors.address ? 'input-error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city"
                    name="city" 
                    value={shippingData.city} 
                    onChange={handleShippingChange}
                    className={errors.city ? 'input-error' : ''}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip/Postal Code</label>
                  <input 
                    type="text" 
                    id="zipCode"
                    name="zipCode" 
                    value={shippingData.zipCode} 
                    onChange={handleShippingChange}
                    placeholder="10001"
                    className={errors.zipCode ? 'input-error' : ''}
                  />
                  {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                </div>
              </div>

              <div className="form-actions">
                <Link to="/cart" className="btn btn-secondary">
                  <ArrowLeft size={16} /> Back to Cart
                </Link>
                <button type="submit" className="btn btn-primary">
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handlePlaceOrder} className="form-card glass-panel">
              <div className="card-header-icon-row">
                <h3>Payment Methods</h3>
                <div className="card-icons flex-center">
                  <CreditCard size={18} />
                  <span>Secure SSL Crypt</span>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="cardName">Name on Card</label>
                  <input 
                    type="text" 
                    id="cardName"
                    name="cardName" 
                    value={paymentData.cardName} 
                    onChange={handlePaymentChange}
                    placeholder="John Doe"
                    className={errors.cardName ? 'input-error' : ''}
                  />
                  {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                </div>
                <div className="form-group span-2">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input 
                    type="text" 
                    id="cardNumber"
                    name="cardNumber" 
                    maxLength="19"
                    value={paymentData.cardNumber} 
                    onChange={handlePaymentChange}
                    placeholder="4000 1234 5678 9010"
                    className={errors.cardNumber ? 'input-error' : ''}
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="cardExpiry">Expiration Date</label>
                  <input 
                    type="text" 
                    id="cardExpiry"
                    name="cardExpiry" 
                    maxLength="5"
                    value={paymentData.cardExpiry} 
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    className={errors.cardExpiry ? 'input-error' : ''}
                  />
                  {errors.cardExpiry && <span className="error-text">{errors.cardExpiry}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="cardCvv">CVV Code</label>
                  <input 
                    type="password" 
                    id="cardCvv"
                    name="cardCvv" 
                    maxLength="3"
                    value={paymentData.cardCvv} 
                    onChange={handlePaymentChange}
                    placeholder="123"
                    className={errors.cardCvv ? 'input-error' : ''}
                  />
                  {errors.cardCvv && <span className="error-text">{errors.cardCvv}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Shipping Details
                </button>
                <button type="submit" className="btn btn-accent">
                  Place Order ${getGrandTotal().toFixed(2)}
                </button>
              </div>
            </form>
          )}
        </main>

        {/* Mini cart recap */}
        <aside className="checkout-summary">
          <div className="summary-card glass-panel">
            <h3>Cart Review</h3>
            <div className="recap-items">
              {cartItems.map((item) => (
                <div key={item.product.id} className="recap-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="recap-details">
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity} &bull; ${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="recap-totals">
              <div className="recap-row">
                <span>Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              {couponCode && (
                <div className="recap-row success-text">
                  <span>Discount ({couponCode})</span>
                  <span>-${getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="recap-row">
                <span>Shipping</span>
                <span>{getShippingCost() === 0 ? 'Free' : `$${getShippingCost().toFixed(2)}`}</span>
              </div>
              <div className="recap-row">
                <span>Tax</span>
                <span>${getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="recap-row total-row">
                <span>Total Payment</span>
                <span>${getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="security-badge flex-center">
              <ShieldCheck size={16} />
              <span>100% Encrypted Payment Protection</span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .checkout-page {
          padding-top: 30px;
          padding-bottom: 60px;
        }

        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 24px;
        }

        .checkout-header h1 {
          font-size: 2.25rem;
          color: var(--color-text);
        }

        .steps-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.92rem;
          color: var(--color-text-muted);
        }

        .step-dot.active {
          color: var(--color-primary);
          font-weight: 600;
        }

        .step-line {
          width: 40px;
          height: 1px;
          background-color: var(--color-border);
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 30px;
          align-items: start;
        }

        /* Forms styling */
        .form-card {
          padding: 30px;
        }

        .form-card h3 {
          font-size: 1.3rem;
          color: var(--color-text);
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
        }

        .card-header-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 12px;
        }

        .card-header-icon-row h3 {
          border: none;
          margin: 0;
          padding: 0;
        }

        .card-icons {
          font-size: 0.8rem;
          color: var(--color-success);
          gap: 6px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .span-2 {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .form-group label {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-text);
        }

        .form-group input {
          border: 1px solid var(--color-border);
          background-color: var(--color-bg);
          color: var(--color-text);
          padding: 10px 14px;
          border-radius: var(--border-radius-md);
          font-size: 0.95rem;
          transition: border-color var(--transition-fast);
          width: 100%;
        }

        .form-group input:focus {
          border-color: var(--color-primary);
        }

        .form-group input.input-error {
          border-color: var(--color-danger);
        }

        .error-text {
          font-size: 0.8rem;
          color: var(--color-danger);
          margin-top: -4px;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }

        /* Summary Panel Recaps */
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

        .recap-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 20px;
        }

        .recap-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .recap-item img {
          width: 44px;
          height: 44px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: var(--color-bg-alt);
        }

        .recap-details h4 {
          font-size: 0.88rem;
          color: var(--color-text);
          font-weight: 600;
          line-height: 1.3;
          text-align: left;
        }

        .recap-details p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-align: left;
        }

        .recap-totals {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .recap-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }

        .recap-row.success-text {
          color: var(--color-success);
          font-weight: 500;
        }

        .recap-row.total-row {
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text);
          font-family: var(--font-heading);
        }

        .security-badge {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          gap: 6px;
          background-color: var(--color-bg-alt);
          padding: 8px;
          border-radius: var(--border-radius-md);
        }

        /* Success invoice Screen */
        .success-screen {
          display: flex;
          justify-content: center;
        }

        .success-card {
          width: 100%;
          max-width: 600px;
          padding: 40px;
          flex-direction: column;
        }

        .success-icon {
          color: var(--color-success);
          margin-bottom: 20px;
        }

        .success-card h2 {
          font-size: 1.75rem;
          color: var(--color-text);
          margin-bottom: 8px;
        }

        .order-intro-text {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          margin-bottom: 30px;
          text-align: center;
        }

        .receipt-invoice {
          width: 100%;
          border: 1px dashed var(--color-border);
          border-radius: var(--border-radius-md);
          background-color: var(--color-bg-alt);
          padding: 24px;
          margin-bottom: 30px;
        }

        .receipt-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
          margin-bottom: 16px;
          text-align: left;
        }

        .receipt-header h4, .receipt-items h4 {
          font-size: 0.88rem;
          color: var(--color-text);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .receipt-header p {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .receipt-meta {
          text-align: right;
        }

        .receipt-items {
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
          margin-bottom: 16px;
          text-align: left;
        }

        .receipt-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }

        .receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .total-row-minor {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .total-row-minor.promo-text {
          color: var(--color-success);
        }

        .total-row-major {
          display: flex;
          justify-content: space-between;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text);
          border-top: 1px solid var(--color-border);
          padding-top: 10px;
          margin-top: 4px;
        }

        .done-btn {
          width: 100%;
          padding: 12px;
        }

        @media (max-width: 992px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .checkout-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .span-2 {
            grid-column: span 1;
          }
          .receipt-header {
            flex-direction: column;
            gap: 16px;
          }
          .receipt-meta {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
