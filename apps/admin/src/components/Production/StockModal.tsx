import React, { useState } from 'react';
import { Stock } from '../../types';

interface StockModalProps {
  stock: Stock | null;
  onClose: () => void;
  onSave: (stock: Stock) => void;
}

const StockModal: React.FC<StockModalProps> = ({ stock, onClose, onSave }) => {
  const [formData, setFormData] = useState<Stock>(stock || { product: '', quantity: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{stock ? 'Edit Stock' : 'Add Stock'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            placeholder="Product"
            required
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default StockModal; 