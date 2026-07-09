import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, ShoppingBag, Truck, Undo2, ChevronRight, User } from 'lucide-react';
import { CatalogContext } from '../context/CatalogContext';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addReview } = useContext(CatalogContext);
  const { addToCart } = useContext(CartContext);

  const product = products.find(p => p.id === id);

  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="container not-found-page fade-in">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewName.trim() && reviewComment.trim()) {
      addReview(product.id, {
        user: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim()
      });
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    }
  };

  // Get related products (same category, different ID)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const outOfStock = product.stock <= 0;

  return (
    <div className="product-detail-page container fade-in">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={12} />
        <Link to="/shop">Shop</Link> <ChevronRight size={12} />
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link> <ChevronRight size={12} />
        <span className="current">{product.name}</span>
      </div>

      <div className="detail-layout">
        {/* Gallery */}
        <div className="detail-gallery">
          <div className="main-image-wrapper glass-panel">
            <img src={activeImage} alt={product.name} />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="thumbnails-grid">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`thumbnail-btn glass-panel ${activeImage === img ? 'active' : ''}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="detail-info">
          <span className="info-category badge badge-primary">{product.category}</span>
          <h1 className="info-title">{product.name}</h1>
          
          <div className="info-rating-row">
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  fill={star <= Math.round(product.rating) ? 'currentColor' : 'none'} 
                  className={star <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating} ({product.reviewsCount} reviews)
            </span>
          </div>

          <div className="info-price">${product.price.toFixed(2)}</div>
          <p className="info-desc">{product.description}</p>

          {/* Add to Cart Actions */}
          <div className="action-box glass-panel">
            {outOfStock ? (
              <div className="out-of-stock-alert">Currently out of stock. Check back later.</div>
            ) : (
              <>
                <div className="quantity-selector-row">
                  <label htmlFor="qty">Quantity</label>
                  <div className="qty-picker">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                    >-</button>
                    <input 
                      type="number" 
                      id="qty" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      readOnly
                    />
                    <button 
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                    >+</button>
                  </div>
                  <span className="stock-hint">{product.stock} items available</span>
                </div>

                <button onClick={handleAddToCart} className="btn btn-primary add-to-cart-btn">
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              </>
            )}
          </div>

          {/* Logistics benefits */}
          <div className="logistics-grid">
            <div className="logistics-item">
              <Truck size={20} className="icon" />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders above $150.00</p>
              </div>
            </div>
            <div className="logistics-item">
              <Undo2 size={20} className="icon" />
              <div>
                <h4>Returns</h4>
                <p>30-day trial refund guarantee</p>
              </div>
            </div>
            <div className="logistics-item">
              <ShieldCheck size={20} className="icon" />
              <div>
                <h4>Warranty</h4>
                <p>Secure global coverage policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section className="specs-section">
          <h2>Technical Specifications</h2>
          <div className="specs-table glass-panel">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="specs-row">
                <div className="specs-key">{key}</div>
                <div className="specs-value">{value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Block */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
        </div>

        <div className="reviews-layout">
          {/* Reviews list */}
          <div className="reviews-list">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="review-card glass-panel fade-in">
                  <div className="review-meta">
                    <div className="reviewer-avatar">
                      <User size={16} />
                    </div>
                    <div className="reviewer-info">
                      <h4>{rev.user}</h4>
                      <div className="review-stars">
                        {[1,2,3,4,5].map(s => (
                          <Star 
                            key={s} 
                            size={12} 
                            fill={s <= rev.rating ? 'currentColor' : 'none'} 
                            className={s <= rev.rating ? 'star-filled' : 'star-empty'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <p className="review-text">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div className="no-reviews glass-panel">
                <p>No reviews yet for this product. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>

          {/* Review form */}
          <div className="review-form-container glass-panel">
            <h3>Write a Review</h3>
            {reviewSuccess ? (
              <div className="success-banner fade-in">
                Thank you! Your review has been added and catalog ratings updated.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label htmlFor="revName">Name</label>
                  <input 
                    type="text" 
                    id="revName" 
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="revRating">Rating</label>
                  <select 
                    id="revRating" 
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  >
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Average</option>
                    <option value="2">2 Stars - Disappointed</option>
                    <option value="1">1 Star - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="revComment">Comment</label>
                  <textarea 
                    id="revComment" 
                    rows="4" 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2>Related Essentials</h2>
          <div className="related-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        .product-detail-page {
          padding-top: 20px;
          padding-bottom: 60px;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 30px;
        }

        .breadcrumbs a:hover {
          color: var(--color-primary);
        }

        .breadcrumbs .current {
          color: var(--color-text);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 250px;
        }

        .detail-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 50px;
          margin-bottom: 60px;
        }

        /* Gallery */
        .detail-gallery {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .main-image-wrapper {
          aspect-ratio: 1.1 / 1;
          width: 100%;
          overflow: hidden;
          background-color: var(--color-bg-alt);
        }

        .main-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnails-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .thumbnail-btn {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          padding: 0;
          background: transparent;
        }

        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-btn.active {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }

        /* Detail Info styling */
        .detail-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .info-category {
          margin-bottom: 12px;
        }

        .info-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--color-text);
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .info-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .stars-row {
          display: flex;
          color: #eab308;
        }

        .rating-text {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .info-price {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-text);
          margin-bottom: 24px;
        }

        .info-desc {
          font-size: 1.02rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin-bottom: 30px;
        }

        .action-box {
          width: 100%;
          padding: 24px;
          margin-bottom: 30px;
        }

        .out-of-stock-alert {
          color: var(--color-danger);
          font-weight: 600;
          text-align: center;
        }

        .quantity-selector-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .quantity-selector-row label {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .qty-picker {
          display: flex;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          background-color: var(--color-bg-alt);
          overflow: hidden;
        }

        .qty-picker button {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: background-color var(--transition-fast);
        }

        .qty-picker button:hover {
          background-color: var(--color-border);
        }

        .qty-picker button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .qty-picker input {
          width: 50px;
          text-align: center;
          font-weight: 600;
          background: transparent;
        }

        .stock-hint {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .add-to-cart-btn {
          width: 100%;
          font-size: 1.05rem;
          padding: 12px;
        }

        /* Logistics benefits */
        .logistics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          width: 100%;
          border-top: 1px solid var(--color-border);
          padding-top: 24px;
        }

        .logistics-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .logistics-item .icon {
          color: var(--color-primary);
        }

        .logistics-item h4 {
          font-size: 0.92rem;
          color: var(--color-text);
        }

        .logistics-item p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        /* Technical specs table */
        .specs-section, .reviews-section, .related-section {
          margin-top: 60px;
        }

        .specs-section h2, .reviews-section h2, .related-section h2 {
          font-size: 1.5rem;
          color: var(--color-text);
          margin-bottom: 24px;
          letter-spacing: -0.3px;
        }

        .specs-table {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .specs-row {
          display: grid;
          grid-template-columns: 240px 1fr;
          padding: 16px 24px;
          border-bottom: 1px solid var(--color-border);
        }

        .specs-row:last-child {
          border-bottom: none;
        }

        .specs-key {
          font-weight: 600;
          color: var(--color-text);
          font-size: 0.92rem;
        }

        .specs-value {
          color: var(--color-text-muted);
          font-size: 0.92rem;
        }

        /* Reviews layout */
        .reviews-layout {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 30px;
          align-items: start;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-card {
          padding: 20px;
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .reviewer-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--border-radius-full);
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reviewer-info h4 {
          font-size: 0.95rem;
          color: var(--color-text);
        }

        .review-stars {
          color: #eab308;
          display: flex;
          gap: 2px;
        }

        .review-date {
          margin-left: auto;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .review-text {
          font-size: 0.92rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .no-reviews {
          padding: 30px;
          text-align: center;
          color: var(--color-text-muted);
        }

        .review-form-container {
          padding: 24px;
        }

        .review-form-container h3 {
          font-size: 1.2rem;
          margin-bottom: 16px;
          color: var(--color-text);
        }

        .review-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-form label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 6px;
          display: block;
        }

        .review-form input, .review-form select, .review-form textarea {
          width: 100%;
          border: 1px solid var(--color-border);
          background-color: var(--color-bg);
          color: var(--color-text);
          padding: 10px;
          border-radius: var(--border-radius-md);
          font-size: 0.9rem;
        }

        .review-form input:focus, .review-form select:focus, .review-form textarea:focus {
          border-color: var(--color-primary);
        }

        .success-banner {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--color-success);
          border: 1px solid var(--color-success);
          padding: 16px;
          border-radius: var(--border-radius-md);
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Related products grid */
        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .not-found-page {
          padding: 100px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        @media (max-width: 992px) {
          .detail-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .reviews-layout {
            grid-template-columns: 1fr;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .specs-row {
            grid-template-columns: 1fr;
            gap: 6px;
          }
        }

        @media (max-width: 576px) {
          .info-title {
            font-size: 1.75rem;
          }
          .related-grid {
            grid-template-columns: 1fr;
          }
          .thumbnails-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
