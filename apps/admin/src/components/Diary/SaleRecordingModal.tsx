import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiDollarSign } from 'react-icons/fi';

interface SaleRecordingModalProps {
  onClose: () => void;
  onSubmit: (data: {
    productType: string;
    quantity: string;
    pricePerLiter: number;
    totalAmount: number;
    customerInfo: string;
    paymentMethod: string;
  }) => void;
  inventory: {
    fresh: number;
    fermented: number;
    cream: number;
  };
}

const SaleRecordingModal: React.FC<SaleRecordingModalProps> = ({ onClose, onSubmit, inventory }) => {
  const [productType, setProductType] = useState('fresh');
  const [quantity, setQuantity] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [customerInfo, setCustomerInfo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const getMaxQuantity = () => {
    switch (productType) {
      case 'fresh': return inventory.fresh;
      case 'fermented': return inventory.fermented;
      case 'cream': return inventory.cream;
      default: return 0;
    }
  };

  const calculateTotal = () => {
    return Number(quantity) * Number(pricePerLiter);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !pricePerLiter) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (Number(quantity) > getMaxQuantity()) {
      toast.error('Insufficient stock');
      return;
    }

    onSubmit({
      productType,
      quantity: `${quantity}L`,
      pricePerLiter: Number(pricePerLiter),
      totalAmount: calculateTotal(),
      customerInfo,
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Record Sale</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              required
            >
              <option value="fresh">Fresh Milk (Inshyushyu) - {inventory.fresh}L available</option>
              <option value="fermented">Fermented Milk (Ikivuguto) - {inventory.fermented}L available</option>
              <option value="cream">Cream (Amavuta) - {inventory.cream}L available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (L)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.1"
              max={getMaxQuantity()}
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Liter (RWF)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded-lg"
              value={pricePerLiter}
              onChange={(e) => setPricePerLiter(e.target.value)}
              min="0"
              required
            />
          </div>

          {quantity && pricePerLiter && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Total Amount: {calculateTotal().toLocaleString()} RWF
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Information
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={customerInfo}
              onChange={(e) => setCustomerInfo(e.target.value)}
              placeholder="Customer name or business"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="cash">Cash</option>
              <option value="mobile">Mobile Money</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FiDollarSign />
              <span>Record Sale</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleRecordingModal; 