import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailySaleManagement: React.FC = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('/api/daily-sales');
        setSales(response.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await axios.patch('/api/daily-sales/status', { id, status });
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale.id === id ? { ...sale, status } : sale
        )
      );
    } catch (error) {
      console.error('Error updating sale status:', error);
    }
  };

  return (
    <div>
      <h1>Daily Sale Management</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product Type</th>
            <th>Quantity</th>
            <th>Price Per Unit</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.date}</td>
              <td>{sale.productType}</td>
              <td>{sale.quantity}</td>
              <td>{sale.pricePerUnit}</td>
              <td>{sale.totalAmount}</td>
              <td>{sale.status}</td>
              <td>
                <button onClick={() => handleStatusChange(sale.id, 'approved')}>Approve</button>
                <button onClick={() => handleStatusChange(sale.id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailySaleManagement; 