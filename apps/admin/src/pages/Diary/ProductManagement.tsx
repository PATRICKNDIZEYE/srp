import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Product {
  id: number;
  productionId: number;
  product: string;
  amount: number;
  dailyId: number;
  status: string;
  stockInId: number;
  production: {
    id: number;
    status: string;
    approveStatus: string;
    phoneNumber: string;
    username: string;
  };
  stockIn: {
    id: number;
    productionId: number;
    product: string;
    amount: number;
  };
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const response = await axiosInstance.get(`/stocks/stockout/daily/${userData.id}`);
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const changeStatus = async (id: number, newStatus: string) => {
    try {
      await axiosInstance.put(`/stocks/stockout/${id}/status`, { status: newStatus });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === id ? { ...product, status: newStatus } : product
        )
      );
    } catch (err) {
      console.error('Failed to change status', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Product Management</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} style={styles.tr}>
              <td style={styles.td}>{product.product}</td>
              <td style={styles.td}>{product.amount}</td>
              <td style={styles.td}>{product.status}</td>
              <td style={styles.td}>
                {product.status !== 'Rejected' && product.status !== 'Approved' && (
                  <>
                    <FiCheckCircle
                      onClick={() => changeStatus(product.id, 'Approved')}
                      style={styles.icon}
                    />
                    <FiXCircle
                      onClick={() => changeStatus(product.id, 'Rejected')}
                      style={styles.icon}
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    textAlign: 'left',
  },
  icon: {
    cursor: 'pointer',
    marginRight: '10px',
    color: '#007BFF',
  },
};

export default ProductManagement;