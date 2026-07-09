import React, { useContext, useState } from 'react';
import { Plus, Edit3, Trash2, ShieldAlert, Package, Layers, DollarSign, AlertCircle } from 'lucide-react';
import { CatalogContext } from '../context/CatalogContext';
import CRUDModal from '../components/CRUDModal';

export default function Dashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(CatalogContext);
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dashboard calculations
  const totalProducts = products.length;
  const categoriesCount = new Set(products.map(p => p.category)).size;
  const outOfStockItems = products.filter(p => p.stock <= 0).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleModalSubmit = (payload) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setModalOpen(false);
  };

  return (
    <div className="dashboard-page container fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage product catalog inventory, metrics, and create listings.</p>
        </div>
        <button onClick={handleAddClick} className="btn btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Analytics Cards */}
      <section className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span>Inventory Valuation</span>
            <DollarSign className="icon" />
          </div>
          <h3>${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p>Total asset value of stock</p>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span>Active Listings</span>
            <Package className="icon" />
          </div>
          <h3>{totalProducts}</h3>
          <p>Products in catalog database</p>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span>Active Categories</span>
            <Layers className="icon" />
          </div>
          <h3>{categoriesCount}</h3>
          <p>Product categories segment</p>
        </div>

        <div className={`metric-card glass-panel ${outOfStockItems > 0 ? 'alert' : ''}`}>
          <div className="metric-header">
            <span>Out of Stock Warning</span>
            {outOfStockItems > 0 ? <ShieldAlert className="icon alert-icon" /> : <AlertCircle className="icon" />}
          </div>
          <h3>{outOfStockItems}</h3>
          <p>{outOfStockItems > 0 ? 'Requires stock reorder' : 'All items in stock'}</p>
        </div>
      </section>

      {/* Inventory table list */}
      <section className="inventory-section glass-panel">
        <div className="inventory-header">
          <h3>Catalog Inventory Table</h3>
        </div>

        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod.id} className={prod.stock <= 0 ? 'stock-empty-row' : ''}>
                    <td className="prod-name-col">
                      <div className="name-details">
                        <img src={prod.image} alt="" className="table-thumb" />
                        <span>{prod.name}</span>
                      </div>
                    </td>
                    <td><span className="table-category-tag">{prod.category}</span></td>
                    <td className="font-heading font-bold">${prod.price.toFixed(2)}</td>
                    <td>
                      {prod.stock <= 0 ? (
                        <span className="stock-badge empty">Out of Stock</span>
                      ) : prod.stock <= 3 ? (
                        <span className="stock-badge low">{prod.stock} Left</span>
                      ) : (
                        <span className="stock-badge in">{prod.stock}</span>
                      )}
                    </td>
                    <td>{prod.rating} / 5.0</td>
                    <td>
                      <div className="table-actions">
                        <button 
                          onClick={() => handleEditClick(prod)} 
                          className="action-icon-btn edit" 
                          title="Edit product details"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(prod.id, prod.name)} 
                          className="action-icon-btn delete" 
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data-cell">
                    Catalog database is empty. Click 'Add Product' to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal dialog block */}
      <CRUDModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleModalSubmit}
        editingProduct={selectedProduct}
      />

      <style>{`
        .dashboard-page {
          padding-top: 30px;
          padding-bottom: 60px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .dashboard-header h1 {
          font-size: 2.25rem;
          color: var(--color-text);
        }

        .dashboard-header p {
          color: var(--color-text-muted);
        }

        /* Metrics grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .metric-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          color: var(--color-text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-header .icon {
          color: var(--color-primary);
          width: 18px;
          height: 18px;
        }

        .metric-card h3 {
          font-size: 1.85rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--color-text);
        }

        .metric-card p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .metric-card.alert {
          border-color: rgba(239, 68, 68, 0.4);
        }

        .metric-card.alert h3, .metric-card.alert .alert-icon {
          color: var(--color-danger);
        }

        /* Inventory Table styling */
        .inventory-section {
          padding: 24px 0 0 0;
          overflow: hidden;
        }

        .inventory-header {
          padding: 0 24px 20px 24px;
          border-bottom: 1px solid var(--color-border);
        }

        .inventory-header h3 {
          font-size: 1.2rem;
          color: var(--color-text);
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .inventory-table th, .inventory-table td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--color-border);
          font-size: 0.92rem;
        }

        .inventory-table th {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-text);
          background-color: var(--color-bg-alt);
        }

        .inventory-table tbody tr {
          transition: background-color var(--transition-fast);
        }

        .inventory-table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }

        html[data-theme="light"] .inventory-table tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.01);
        }

        .stock-empty-row {
          background-color: rgba(239, 68, 68, 0.03) !important;
        }

        .prod-name-col {
          max-width: 320px;
        }

        .name-details {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          color: var(--color-text);
        }

        .table-thumb {
          width: 40px;
          height: 40px;
          border-radius: var(--border-radius-sm);
          object-fit: cover;
          background-color: var(--color-bg-alt);
        }

        .table-category-tag {
          font-size: 0.8rem;
          font-weight: 500;
          background-color: var(--color-bg-alt);
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          color: var(--color-text-muted);
        }

        .stock-badge {
          display: inline-flex;
          padding: 4px 8px;
          border-radius: var(--border-radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .stock-badge.in {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--color-success);
        }

        .stock-badge.low {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--color-accent);
        }

        .stock-badge.empty {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--color-danger);
        }

        .font-bold {
          font-weight: 700;
        }

        .table-actions {
          display: flex;
          gap: 12px;
        }

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--border-radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border);
          transition: background-color var(--transition-fast), color var(--transition-fast);
          color: var(--color-text-muted);
        }

        .action-icon-btn.edit:hover {
          background-color: var(--color-bg-alt);
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        .action-icon-btn.delete:hover {
          background-color: var(--color-bg-alt);
          color: var(--color-danger);
          border-color: var(--color-danger);
        }

        .no-data-cell {
          text-align: center;
          color: var(--color-text-muted);
          padding: 40px !important;
        }

        @media (max-width: 992px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .dashboard-header button {
            width: 100%;
          }
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
