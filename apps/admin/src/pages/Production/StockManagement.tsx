import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Define a type for the stock-in products
type StockInProduct = {
    id: number;
    productionId: number;
    product: string;
    amount: number;
    createdAt: string;
    production: {
        id: number;
        status: string;
        approveStatus: string;
        phoneNumber: string;
        password: string;
        longitude: number;
        latitude: number;
        username: string;
    };
};

// Define a type for the stock-out products
type StockOutProduct = {
    id: number;
    productionId: number;
    product: string;
    amount: number;
    stockInId: number; // Add stockInId property
    createdAt: string;
};

type DailyData = {
    id: number;
    status: string;
    approveStatus: string;
    firstName: string;
    lastName: string;
    // other fields...
};

const StockManagement = () => {
    const [activeTab, setActiveTab] = useState('stockin');
    const [product, setProduct] = useState('');
    const [amount, setAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(0);
    const [stockInProducts, setStockInProducts] = useState<StockInProduct[]>([]);
    const [stockOutProducts, setStockOutProducts] = useState<StockOutProduct[]>([]);
    const [selectedStockInId, setSelectedStockInId] = useState('');
    const [dailyId, setDailyId] = useState('');
    const [status, setStatus] = useState('pending');
    const [dailyData, setDailyData] = useState<DailyData[]>([]);
    const [editingStockIn, setEditingStockIn] = useState<StockInProduct | null>(null);
    const [editingStockOut, setEditingStockOut] = useState<StockOutProduct | null>(null);

    // Retrieve productionId from localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '[]');
    const productionId = userData.length > 0 ? userData[0].id : null;

    // Define fetchStockInProducts outside of useEffect
    const fetchStockInProducts = async () => {
        try {
            if (!productionId) {
                console.error('Production ID not found');
                return;
            }
            const response = await axiosInstance.get(`/stocks/stockin/production/${productionId}`);
            setStockInProducts(response.data);
        } catch (error) {
            console.error('Error fetching stockin products:', error);
        }
    };

    const fetchStockOutProducts = async () => {
        try {
            if (!productionId) {
                console.error('Production ID not found');
                return;
            }
            const response = await axiosInstance.get(`/stocks/stockout/production/${productionId}`);
            setStockOutProducts(response.data);
        } catch (error) {
            console.error('Error fetching stockout products:', error);
        }
    };

    const fetchDailyData = async () => {
        try {
            const response = await axiosInstance.get('/diary');
            const approvedData = response.data.filter((entry: DailyData) => entry.approveStatus === 'approved');
            setDailyData(approvedData);
        } catch (error) {
            console.error('Error fetching daily data:', error);
        }
    };

    useEffect(() => {
        fetchStockInProducts();
        fetchStockOutProducts();
        fetchDailyData();
    }, [productionId]);

    const handleStockInSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!productionId) {
            toast.error('Production ID not found');
            return;
        }

        const data = {
            productionId,
            product,
            amount,
        };

        try {
            const response = await axiosInstance.post('/stocks/stockin', data);
            console.log('Response:', response.data);
            toast.success('Stock added successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add stock');
        }
    };

    const handleStockOutSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!productionId) {
            toast.error('Production ID not found');
            return;
        }

        const data = {
            productionId,
            product,
            amount,
            dailyId: Number(dailyId),
            status: 'pending',
            stockInId: Number(selectedStockInId),
        };

        try {
            const response = await axiosInstance.post('/stocks/stockout', data);
            console.log('Response:', response.data);
            toast.success('Stock out recorded successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to record stock out');
        }
    };

    // Update product and max amount when stockInId changes
    useEffect(() => {
        const selectedStockIn = stockInProducts.find(product => product.id === Number(selectedStockInId));
        if (selectedStockIn) {
            setProduct(selectedStockIn.product);
            const stockOutTotal = stockOutProducts
                .filter(stockOut => stockOut.stockInId === selectedStockIn.id)
                .reduce((total, stockOut) => total + stockOut.amount, 0);
            setMaxAmount(selectedStockIn.amount - stockOutTotal);
        } else {
            setProduct('');
            setMaxAmount(0);
        }
    }, [selectedStockInId, stockInProducts, stockOutProducts]);

    // Function to calculate stock balance
    const calculateStockBalance = () => {
        const balanceMap = new Map<number, { product: string, balance: number }>();

        // Initialize balance map with stock-in products
        stockInProducts.forEach(stockIn => {
            balanceMap.set(stockIn.id, { product: stockIn.product, balance: stockIn.amount });
        });

        // Adjust balance based on stock-out products
        stockOutProducts.forEach(stockOut => {
            if (balanceMap.has(stockOut.stockInId)) { // No need to check for stockOut.stockInId existence
                const stockIn = balanceMap.get(stockOut.stockInId);
                if (stockIn) {
                    stockIn.balance -= stockOut.amount; // Subtract stock-out amount from stock-in balance
                }
            }
        });

        return Array.from(balanceMap.values());
    };

    const handleEditStockIn = (stockIn: StockInProduct) => {
        setEditingStockIn(stockIn);
        setProduct(stockIn.product);
        setAmount(stockIn.amount);
    };

    const handleEditStockOut = (stockOut: StockOutProduct) => {
        setEditingStockOut(stockOut);
        setProduct(stockOut.product);
        setAmount(stockOut.amount);
        setSelectedStockInId(stockOut.stockInId ? stockOut.stockInId.toString() : '');
    };

    const handleStockInUpdate = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!editingStockIn || !productionId) {
            toast.error('No stock-in entry selected for editing or Production ID not found');
            return;
        }

        const data = {
            product,
            amount,
        };

        try {
            const response = await axiosInstance.put(`/stocks/stockin/${editingStockIn.id}`, data);
            console.log('Response:', response.data);
            toast.success('Stock-in updated successfully');
            setEditingStockIn(null);
            fetchStockInProducts(); // Refresh the list
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update stock-in');
        }
    };

    const handleStockOutUpdate = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!editingStockOut || !productionId) {
            toast.error('No stock-out entry selected for editing or Production ID not found');
            return;
        }

        const data = {
            product,
            amount,
            stockInId: Number(selectedStockInId),
        };

        try {
            const response = await axiosInstance.put(`/stocks/stockout/${editingStockOut.id}`, data);
            console.log('Response:', response.data);
            toast.success('Stock-out updated successfully');
            setEditingStockOut(null);
            fetchStockOutProducts(); // Refresh the list
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update stock-out');
        }
    };

    return (
        <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold text-gray-700">Stock Management</h3>
                <div className="flex space-x-4">
                    <button onClick={() => setActiveTab('stockin')} className={`px-4 py-2 rounded ${activeTab === 'stockin' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Stock In</button>
                    <button onClick={() => setActiveTab('stockout')} className={`px-4 py-2 rounded ${activeTab === 'stockout' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Stock Out</button>
                    <button onClick={() => setActiveTab('stockbalance')} className={`px-4 py-2 rounded ${activeTab === 'stockbalance' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Stock Balance</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {calculateStockBalance().map((stock, index) => (
                    <div key={index} className="bg-blue-100 p-4 rounded shadow">
                        <h5 className="text-lg font-semibold text-gray-700">{stock.product}</h5>
                        <p className="text-sm text-gray-600">Balance: {stock.balance}</p>
                    </div>
                ))}
            </div>

            {activeTab === 'stockin' && (
                <div className="bg-white p-6 rounded shadow">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Stock In Products</h4>
                    
                    <form onSubmit={editingStockIn ? handleStockInUpdate : handleStockInSubmit} className="mb-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product:</label>
                            <select
                                value={product}
                                onChange={(e) => setProduct(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a product</option>
                                <option value="Ikivuguto">Ikivuguto</option>
                                <option value="Amavuta">Amavuta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount:</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                            {editingStockIn ? 'Update Stock In' : 'Add Stock'}
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stockInProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(product.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button onClick={() => handleEditStockIn(product)} className="text-blue-500 hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'stockout' && (
                <div className="bg-white p-6 rounded shadow">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Stock Out Products</h4>
                    
                    <form onSubmit={editingStockOut ? handleStockOutUpdate : handleStockOutSubmit} className="mb-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Daily ID:</label>
                            <select
                                value={dailyId}
                                onChange={(e) => setDailyId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a daily entry</option>
                                {dailyData.map((entry) => (
                                    <option key={entry.id} value={entry.id}>
                                        {entry.firstName} {entry.lastName} (ID: {entry.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock In ID:</label>
                            <select
                                value={selectedStockInId}
                                onChange={(e) => setSelectedStockInId(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a product</option>
                                {stockInProducts.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.product}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product:</label>
                            <input
                                type="text"
                                value={product}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount (Max: {maxAmount}):</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Math.min(Number(e.target.value), maxAmount))}
                                max={maxAmount}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
                            {editingStockOut ? 'Update Stock Out' : 'Record Stock Out'}
                        </button>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stockOutProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button onClick={() => handleEditStockOut(product)} className="text-blue-500 hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'stockbalance' && (
                <div className="bg-white p-6 rounded shadow">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Stock Balance</h4>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {calculateStockBalance().map((stock, index) => (
                            <div key={index} className="bg-blue-100 p-4 rounded shadow">
                                <h5 className="text-lg font-semibold text-gray-700">{stock.product}</h5>
                                <p className="text-sm text-gray-600">Balance: {stock.balance}</p>
                            </div>
                        ))}
                    </div> */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {calculateStockBalance().map((stock, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.product}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockManagement;
