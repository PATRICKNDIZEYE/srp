import React, { useState } from 'react';
import { FiBox, FiTruck } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ProductDistributionModalProps {
  onClose: () => void;
  onSubmit: (data: {
    transporterId: string;
    products: Array<{
      type: string;
      quantity: string;
    }>;
    destination: string;
    notes: string;
  }) => void;
  inventory: {
    rawMilk: number;
    fermentedMilk: number;
    cream: number;
    cheese: number;
    yogurt: number;
    butter: number;
  };
}

const ProductDistributionModal: React.FC<ProductDistributionModalProps> = ({
  onClose,
  onSubmit,
  inventory
}) => {
  const [transporterId, setTransporterId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    type: string;
    quantity: string;
  }>>([{ type: '', quantity: '' }]);
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { type: '', quantity: '' }]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: 'type' | 'quantity', value: string) => {
    const newProducts = [...selectedProducts];
    newProducts[index][field] = value;
    setSelectedProducts(newProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate quantities against inventory
    const isValid = selectedProducts.every(product => {
      const quantity = Number(product.quantity);
      const available = inventory[product.type as keyof typeof inventory];
      return quantity <= available;
    });

    if (!isValid) {
      toast.error('Insufficient inventory for selected quantities');
      return;
    }

    onSubmit({
      transporterId,
      products: selectedProducts,
      destination,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Distribute Products</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transporter
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={transporterId}
              onChange={(e) => setTransporterId(e.target.value)}
              required
            >
              <option value="">Select transporter</option>
              <option value="T1">John Driver</option>
              <option value="T2">Alice Trucker</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Products</label>
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex space-x-2">
                <select
                  className="flex-1 px-3 py-2 border rounded-lg"
                  value={product.type}
                  onChange={(e) => handleProductChange(index, 'type', e.target.value)}
                  required
                >
                  <option value="">Select product</option>
                  {Object.entries(inventory).map(([key, value]) => (
                    <option key={key} value={key}>
                      {key.replace(/([A-Z])/g, ' $1').trim()} ({value}L/kg available)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="w-32 px-3 py-2 border rounded-lg"
                  placeholder="Quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  min="0.1"
                  step="0.1"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="px-2 py-2 text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddProduct}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              + Add another product
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
            />
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <FiBox />
              <span>Distribute</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductDistributionModal; 