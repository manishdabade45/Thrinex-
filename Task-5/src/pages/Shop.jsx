import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { CatalogContext } from '../context/CatalogContext';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const { products } = useContext(CatalogContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000); // Max cap
  const [sortBy, setSortBy] = useState('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync category state from URL query params (e.g. from Home page clicks)
  useEffect(() => {
    const categoryQuery = searchParams.get('category');
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  // Categories list
  const categories = ['All', 'Tech', 'Workspace', 'Furniture', 'Lifestyle'];

  // Handle URL change on category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(1000);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and sort items
  const filteredProducts = products
    .filter(prod => {
      const matchSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchPrice = prod.price <= priceRange;
      
      return matchSearch && matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // Default featured (sort index by creation)
    });

  return (
    <div className="shop-page container fade-in">
      <div className="shop-header">
        <h1>Catalog Collection</h1>
        <p>Explore our premium design essentials and workspace organizers.</p>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters - Desktop */}
        <aside className={`shop-sidebar glass-panel ${showFiltersMobile ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="mobile-close-btn" onClick={() => setShowFiltersMobile(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Search bar */}
          <div className="filter-group">
            <label>Search</label>
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <label>Categories</label>
            <div className="category-list">
              {categories.map((cat) => (
                <button 
                  key={cat} 
                  onClick={() => handleCategoryClick(cat)}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <div className="price-label-row">
              <label>Max Price</label>
              <span>${priceRange}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10"
              value={priceRange} 
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="price-slider"
            />
            <div className="price-extremes">
              <span>$10</span>
              <span>$1000</span>
            </div>
          </div>

          <button onClick={handleResetFilters} className="btn btn-secondary reset-btn">
            Clear Filters
          </button>
        </aside>

        {/* Catalog Main Content */}
        <main className="shop-content">
          {/* Controls Bar */}
          <div className="controls-bar glass-panel">
            <span className="results-count">
              Showing {filteredProducts.length} of {products.length} products
            </span>

            <div className="controls-right">
              {/* Sort Selector */}
              <div className="sort-wrapper">
                <ArrowUpDown size={14} className="sort-icon" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button 
                className="btn btn-secondary mobile-filter-toggle"
                onClick={() => setShowFiltersMobile(true)}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="empty-results glass-panel">
              <h3>No items match your filters</h3>
              <p>Try resetting the filters or broadening your search parameters.</p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .shop-page {
          padding-top: 30px;
          padding-bottom: 60px;
        }

        .shop-header {
          margin-bottom: 40px;
        }

        .shop-header h1 {
          font-size: 2.25rem;
          color: var(--color-text);
          margin-bottom: 8px;
        }

        .shop-header p {
          color: var(--color-text-muted);
        }

        .shop-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Sidebar styling */
        .shop-sidebar {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: sticky;
          top: 100px;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h3 {
          font-size: 1.15rem;
          color: var(--color-text);
        }

        .mobile-close-btn {
          display: none;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-group label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          color: var(--color-text);
        }

        .search-wrapper {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-wrapper input {
          width: 100%;
          border: 1px solid var(--color-border);
          background-color: var(--color-bg);
          color: var(--color-text);
          padding: 10px 12px 10px 38px;
          border-radius: var(--border-radius-md);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
        }

        .search-wrapper input:focus {
          border-color: var(--color-primary);
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .category-btn {
          text-align: left;
          padding: 8px 12px;
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          color: var(--color-text-muted);
          transition: color var(--transition-fast), background-color var(--transition-fast);
        }

        .category-btn:hover {
          color: var(--color-text);
          background-color: var(--color-bg-alt);
        }

        .category-btn.active {
          color: var(--color-primary);
          background-color: var(--color-primary-light);
          font-weight: 600;
        }

        .price-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-label-row span {
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-primary);
        }

        .price-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: var(--border-radius-full);
          background: var(--color-border);
          outline: none;
        }

        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: var(--border-radius-full);
          background: var(--color-primary);
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .price-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .price-extremes {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: -4px;
        }

        .reset-btn {
          font-size: 0.9rem;
          width: 100%;
        }

        /* Content Area Controls */
        .shop-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          border-radius: var(--border-radius-md);
        }

        .results-count {
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .controls-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .sort-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: 8px 12px;
          background-color: var(--color-card-solid);
        }

        .sort-icon {
          color: var(--color-text-muted);
          margin-right: 6px;
        }

        .sort-wrapper select {
          background: transparent;
          border: none;
          font-size: 0.88rem;
          color: var(--color-text);
          padding-right: 16px;
          cursor: pointer;
        }

        .mobile-filter-toggle {
          display: none;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .empty-results {
          padding: 60px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .empty-results h3 {
          font-size: 1.5rem;
          color: var(--color-text);
        }

        .empty-results p {
          color: var(--color-text-muted);
          max-width: 400px;
        }

        @media (max-width: 992px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .shop-layout {
            grid-template-columns: 1fr;
          }

          .shop-sidebar {
            position: fixed;
            top: 0;
            right: -280px;
            bottom: 0;
            width: 280px;
            z-index: 2000;
            height: 100vh;
            border-radius: 0;
            background-color: var(--color-card-solid);
            transition: right var(--transition-normal);
            box-shadow: var(--shadow-xl);
          }

          .shop-sidebar.active {
            right: 0;
          }

          .mobile-close-btn {
            display: flex;
            width: 30px;
            height: 30px;
            align-items: center;
            justify-content: center;
            border-radius: var(--border-radius-full);
            background-color: var(--color-bg-alt);
            color: var(--color-text);
          }

          .mobile-filter-toggle {
            display: inline-flex;
          }
        }

        @media (max-width: 576px) {
          .products-grid {
            grid-template-columns: 1fr;
          }
          .controls-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .controls-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
