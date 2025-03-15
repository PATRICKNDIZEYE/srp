import React, { useState, useEffect } from 'react';

interface SaleModalProps {
  sale: any;
  onClose: () => void;
  onSave: (saleData: any) => void;
  approvedProducts: { product: string; amount: number }[];
  stockAfterSales: number;
}

const SaleModal: React.FC<SaleModalProps> = ({ sale, onClose, onSave, approvedProducts = [], stockAfterSales }) => {
  const [formData, setFormData] = useState({
    id: sale?.id || null,
    date: sale?.date || new Date().toISOString().split('T')[0],
    productType: sale?.productType || 'inshyushyu',
    quantity: sale?.quantity || '',
    pricePerUnit: sale?.pricePerUnit || '',
    totalAmount: sale?.totalAmount || '',
    status: sale?.status || 'pending',
    depance: sale?.depance || 0,
    description: sale?.description || '',
  });

  useEffect(() => {
    // Automatically calculate totalAmount whenever quantity or pricePerUnit changes
    const calculateTotalAmount = () => {
      const quantity = parseFloat(formData.quantity) || 0;
      const pricePerUnit = parseFloat(formData.pricePerUnit) || 0;
      setFormData((prev) => ({
        ...prev,
        totalAmount: (quantity * pricePerUnit).toFixed(2),
      }));
    };

    calculateTotalAmount();
  }, [formData.quantity, formData.pricePerUnit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getMaxAmount = () => {
    if (formData.productType === 'inshyushyu') {
      return stockAfterSales;
    }
    const product = approvedProducts.find(p => p.product === formData.productType);
    return product ? product.amount : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold">{sale ? 'Edit Sale' : 'Add Sale'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <select name="productType" value={formData.productType} onChange={handleChange} required>
            <option value="inshyushyu">Inshyushyu</option>
            {approvedProducts.map((product) => (
              <option key={product.product} value={product.product}>
                {product.product}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            required
            max={getMaxAmount()}
          />
          <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} placeholder="Price Per Unit" required />
          <input type="text" name="totalAmount" value={formData.totalAmount} readOnly placeholder="Total Amount" />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input type="number" name="depance" value={formData.depance} onChange={handleChange} placeholder="Depance" required />
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleModal; 