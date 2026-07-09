import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, HeartHandshake, Leaf } from 'lucide-react';
import { CatalogContext } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { products } = useContext(CatalogContext);
  
  // Show first 3 products as featured
  const featuredProducts = products.slice(0, 3);

  const categories = [
    { name: 'Tech', desc: 'Acoustic typing & audio gear', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80' },
    { name: 'Workspace', desc: 'Merino pads & smart lamps', image: 'https://images.unsplash.com/photo-1632292224971-0d45778bd364?auto=format&fit=crop&w=400&q=80' },
    { name: 'Furniture', desc: 'Ergonomic task seating', image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Lifestyle', desc: 'Horween leather & drinkware', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div className="home-container fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <span className="hero-subtitle">Bespoke Design, Minimalist Living</span>
          <h1 className="hero-title">Elevate Your Everyday Workspace</h1>
          <p className="hero-description">
            A premium collection of high-performance tools, accessories, and furniture hand-tailored to enhance focus, acoustic harmony, and functional aesthetics.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explore Collection <ArrowRight size={18} />
            </Link>
            <Link to="/shop?category=Tech" className="btn btn-secondary btn-lg">
              View Acoustics
            </Link>
          </div>
        </div>
        <div className="hero-background-gradient"></div>
      </section>

      {/* Brand Values */}
      <section className="values-section container">
        <div className="value-card glass-panel">
          <Compass className="value-icon" />
          <h3>Original Design</h3>
          <p>Every piece is detailed in-house, balancing modern geometries with organic textures.</p>
        </div>
        <div className="value-card glass-panel">
          <Leaf className="value-icon" />
          <h3>Ethical Sourcing</h3>
          <p>Constructed with certified Horween leather, natural cork, and Merino wool.</p>
        </div>
        <div className="value-card glass-panel">
          <HeartHandshake className="value-icon" />
          <h3>Crafted to Last</h3>
          <p>Reinforced double-stitching and sand-casted brass fixtures withstand years of use.</p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="categories-section container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <Link to="/shop" className="text-link">View all catalog <ArrowRight size={14} /></Link>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.name}`} key={cat.name} className="category-card glass-panel">
              <div className="category-img-wrapper">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <div className="category-overlay">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container">
        <div className="section-header">
          <h2>Featured Essentials</h2>
          <Link to="/shop" className="text-link">Full shop <ArrowRight size={14} /></Link>
        </div>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="featured-product-wrapper">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 90px;
          padding-bottom: 60px;
        }

        /* Hero styling */
        .hero-section {
          position: relative;
          min-height: 80vh;
          display: flex;
          align-items: center;
          background-image: linear-gradient(rgba(9, 10, 15, 0.4), rgba(9, 10, 15, 0.4)), url('https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=1920&q=80');
          background-size: cover;
          background-position: center;
          margin-top: -80px; /* pull hero under the transparent navbar */
          padding-top: 100px;
          overflow: hidden;
        }

        html[data-theme="light"] .hero-section {
          background-image: linear-gradient(rgba(253, 251, 247, 0.25), rgba(253, 251, 247, 0.4)), url('https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&w=1920&q=80');
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .hero-subtitle {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--color-primary);
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -1.5px;
        }

        html[data-theme="light"] .hero-title {
          color: #171717;
        }

        .hero-description {
          font-size: 1.15rem;
          color: #e2e8f0;
          line-height: 1.6;
        }

        html[data-theme="light"] .hero-description {
          color: #4a4a4a;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 12px;
        }

        .btn-lg {
          padding: 14px 28px;
          font-size: 1.05rem;
          border-radius: var(--border-radius-md);
        }

        .hero-background-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--color-bg) 0%, rgba(9, 10, 15, 0) 100%);
          z-index: 1;
        }

        /* Brand Values */
        .values-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .value-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .value-icon {
          color: var(--color-primary);
          width: 32px;
          height: 32px;
        }

        .value-card h3 {
          font-size: 1.2rem;
          color: var(--color-text);
        }

        .value-card p {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* Category styling */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 2rem;
          color: var(--color-text);
          letter-spacing: -0.5px;
        }

        .text-link {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-primary);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .text-link:hover {
          color: var(--color-primary-hover);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .category-card {
          position: relative;
          height: 280px;
          overflow: hidden;
          border-radius: var(--border-radius-lg);
          display: block;
        }

        .category-img-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .category-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .category-card:hover .category-img-wrapper img {
          transform: scale(1.08);
        }

        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(9, 10, 15, 0.85) 0%, rgba(9, 10, 15, 0.1) 80%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          transition: background var(--transition-normal);
        }

        .category-overlay h3 {
          color: #ffffff;
          font-size: 1.35rem;
          margin-bottom: 4px;
        }

        .category-overlay p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
        }

        /* Featured Grid */
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        @media (max-width: 992px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .values-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 576px) {
          .categories-grid, .featured-grid {
            grid-template-columns: 1fr;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions a {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
