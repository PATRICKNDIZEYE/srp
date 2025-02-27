import React, { useState, useEffect } from 'react';

interface SaleModalProps {
  sale: any;
  onClose: () => void;
  onSave: (saleData: any) => void;
}

const SaleModal: React.FC<SaleModalProps> = ({ sale, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: sale?.id || null,
    date: sale?.date || new Date().toISOString().split('T')[0],
    productType: sale?.productType || 'inshyushyu',
    quantity: sale?.quantity || '',
    pricePerUnit: sale?.pricePerUnit || '',
    totalAmount: sale?.totalAmount || '',
    status: sale?.status || 'pending',
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-lg font-semibold">{sale ? 'Edit Sale' : 'Add Sale'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <select name="productType" value={formData.productType} onChange={handleChange} required>
            <option value="inshyushyu">Inshyushyu</option>
            <option value="ikivuguto">Ikivuguto</option>
            <option value="amavuta">Amavuta</option>
          </select>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required />
          <input type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} placeholder="Price Per Unit" required />
          <input type="text" name="totalAmount" value={formData.totalAmount} readOnly placeholder="Total Amount" />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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