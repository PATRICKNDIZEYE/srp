import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import Breadcrumb from '../../components/Breadcrumb';
import DateRangeFilter from '../../components/Filters/DateRangeFilter';

interface Sale {
  id: string;
  date: string;
  product: string;
  quantity: string;
  pricePerUnit: number;
  totalAmount: number;
  customer: string;
  paymentMethod: string;
}

const ProductionSales = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const [sales] = useState<Sale[]>([
    {
      id: '1',
      date: '2024-02-20',
      product: 'Ikivuguto',
      quantity: '100L',
      pricePerUnit: 1000,
      totalAmount: 100000,
      customer: 'Local Store A',
      paymentMethod: 'Bank Transfer'
    }
  ]);

  const products = [
    'All Products',
    'Fresh Milk',
    'Ikivuguto',
    'Amavuta',
    'Cheese',
    'Yogurt',
    'Butter'
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb pageName="Sales Report" />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 items-center">
            <select
              className="px-4 py-2 border rounded-lg"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map((product) => (
                <option key={product} value={product.toLowerCase()}>
                  {product}
                </option>
              ))}
            </select>
            <DateRangeFilter
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
            />
          </div>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center space-x-2">
            <FiDownload />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price/Unit (RWF)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (RWF)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{sale.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{sale.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{sale.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {sale.pricePerUnit.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {sale.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{sale.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    sale.paymentMethod === 'Cash'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {sale.paymentMethod}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionSales; 