import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CRUDModal({ isOpen, onClose, onSubmit, editingProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tech',
    price: '',
    stock: '',
    image: '',
    description: '',
    specMaterial: '',
    specDimensions: '',
    specWarranty: '',
    specConnectivity: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Tech',
        price: editingProduct.price || '',
        stock: editingProduct.stock || '',
        image: editingProduct.image || '',
        description: editingProduct.description || '',
        specMaterial: editingProduct.specs?.["Material"] || editingProduct.specs?.["Leather Type"] || '',
        specDimensions: editingProduct.specs?.["Dimensions"] || editingProduct.specs?.["Layout"] || '',
        specWarranty: editingProduct.specs?.["Warranty"] || '',
        specConnectivity: editingProduct.specs?.["Connectivity"] || editingProduct.specs?.["Switches"] || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Tech',
        price: '',
        stock: '',
        image: '',
        description: '',
        specMaterial: '',
        specDimensions: '',
        specWarranty: '',
        specConnectivity: ''
      });
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Enter a valid positive price';
    if (formData.stock === '' || parseInt(formData.stock) < 0) newErrors.stock = 'Enter a valid stock number';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Build specs object dynamically
    const specs = {};
    if (formData.specMaterial.trim()) specs["Material"] = formData.specMaterial.trim();
    if (formData.specDimensions.trim()) specs["Dimensions"] = formData.specDimensions.trim();
    if (formData.specWarranty.trim()) specs["Warranty"] = formData.specWarranty.trim();
    if (formData.specConnectivity.trim()) specs["Connectivity"] = formData.specConnectivity.trim();

    const productPayload = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image: formData.image.trim(),
      description: formData.description.trim(),
      specs
    };

    onSubmit(productPayload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group span-2">
              <label htmlFor="name">Product Name *</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="Tech">Tech</option>
                <option value="Workspace">Workspace</option>
                <option value="Furniture">Furniture</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input 
                type="number" 
                id="price"
                name="price" 
                step="0.01" 
                value={formData.price} 
                onChange={handleChange}
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input 
                type="number" 
                id="stock"
                name="stock" 
                value={formData.stock} 
                onChange={handleChange}
                className={errors.stock ? 'input-error' : ''}
              />
              {errors.stock && <span className="error-text">{errors.stock}</span>}
            </div>

            <div className="form-group span-2">
              <label htmlFor="image">Image URL *</label>
              <input 
                type="text" 
                id="image"
                name="image" 
                value={formData.image} 
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className={errors.image ? 'input-error' : ''}
              />
              {errors.image && <span className="error-text">{errors.image}</span>}
            </div>

            <div className="form-group span-2">
              <label htmlFor="description">Product Description *</label>
              <textarea 
                id="description"
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows="3"
                className={errors.description ? 'input-error' : ''}
              ></textarea>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {/* Specifications Details */}
            <div className="form-specs-section span-2">
              <h3>Specifications (Optional Details)</h3>
              <div className="specs-grid">
                <div className="form-group">
                  <label htmlFor="specMaterial">Material / Shell</label>
                  <input 
                    type="text" 
                    id="specMaterial"
                    name="specMaterial" 
                    value={formData.specMaterial} 
                    onChange={handleChange} 
                    placeholder="e.g. Anodized aluminum"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="specDimensions">Dimensions / Layout</label>
                  <input 
                    type="text" 
                    id="specDimensions"
                    name="specDimensions" 
                    value={formData.specDimensions} 
                    onChange={handleChange}
                    placeholder="e.g. 900 x 400 mm"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="specWarranty">Warranty Period</label>
                  <input 
                    type="text" 
                    id="specWarranty"
                    name="specWarranty" 
                    value={formData.specWarranty} 
                    onChange={handleChange}
                    placeholder="e.g. 2 Years"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="specConnectivity">Connectivity / Switches</label>
                  <input 
                    type="text" 
                    id="specConnectivity"
                    name="specConnectivity" 
                    value={formData.specConnectivity} 
                    onChange={handleChange}
                    placeholder="e.g. USB-C, Bluetooth"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(9, 10, 15, 0.65);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 650px;
          background-color: var(--color-card-solid);
          border-radius: var(--border-radius-lg);
          padding: 30px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--color-border);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 16px;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: var(--color-text);
        }

        .close-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-full);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }

        .close-btn:hover {
          background-color: var(--color-bg-alt);
          color: var(--color-text);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
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
        }

        .form-group label {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-text);
        }

        .form-group input, .form-group select, .form-group textarea {
          border: 1px solid var(--color-border);
          background-color: var(--color-bg);
          color: var(--color-text);
          padding: 10px 14px;
          border-radius: var(--border-radius-md);
          font-size: 0.95rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          width: 100%;
        }

        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-light);
        }

        .form-group input.input-error, .form-group textarea.input-error {
          border-color: var(--color-danger);
        }

        .error-text {
          font-size: 0.8rem;
          color: var(--color-danger);
          margin-top: -4px;
        }

        .form-specs-section {
          margin-top: 10px;
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }

        .form-specs-section h3 {
          font-size: 1.1rem;
          color: var(--color-text);
          margin-bottom: 16px;
        }

        .specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          border-top: 1px solid var(--color-border);
          padding-top: 20px;
        }

        @media (max-width: 576px) {
          .form-grid, .specs-grid {
            grid-template-columns: 1fr;
          }
          .span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
