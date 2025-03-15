import express from "express";
import { createStock, getStocks, getStockById, updateStock, deleteStock } from "../models/stockModel.js";
import {
  createStockIn,
  getStockIns,
  getStockInById,
  updateStockIn,
  deleteStockIn,
} from '../models/stockInModel.js';
import {
  createStockOut,
  getStockOuts,
  getStockOutById,
  updateStockOut,
  deleteStockOut,
  updateStockOutStatus,
} from '../models/stockOutModel.js';

const router = express.Router();

// Create a new stock entry
router.post("/", async (req, res) => {
  try {
    const { quantity, productId, farmerId, pocId, productType } = req.body;

    // Create stock entry
    const stock = await createStock({
      quantity,
      productId,
      farmerId,
      pocId,
      productType,
    });

    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all stock entries
router.get("/", async (req, res) => {
  try {
    const stocks = await getStocks();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a stock entry by ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ensure the ID is an integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const stock = await getStockById(id);
    if (stock) {
      res.status(200).json(stock);
    } else {
      res.status(404).json({ message: "Stock entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a stock entry by ID
router.put("/:id", async (req, res) => {
  try {
    const { quantity, productId, farmerId, pocId, productType } = req.body;

    // Update stock entry
    const stock = await updateStock(req.params.id, {
      quantity,
      productId,
      farmerId,
      pocId,
      productType,
    });

    if (stock) {
      res.status(200).json(stock);
    } else {
      res.status(404).json({ message: "Stock entry not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a stock entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const stock = await deleteStock(req.params.id);
    if (stock) {
      res.status(200).json({ message: "Stock entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Stock entry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// StockIn routes
router.post('/stockin', async (req, res) => {
  try {
    const { productionId, product, amount } = req.body;
    if (!productionId || !product || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newStockIn = await createStockIn({ productionId, product, amount });
    res.status(201).json(newStockIn);
  } catch (error) {
    console.error('Error in stockin route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/stockin', async (req, res) => {
  try {
    const stockIns = await getStockIns();
    res.json(stockIns);
  } catch (error) {
    console.error('Error fetching stockins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stockin/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ensure the ID is an integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const stockIn = await getStockInById(id);
    if (stockIn) {
      res.json(stockIn);
    } else {
      res.status(404).json({ error: 'StockIn not found' });
    }
  } catch (error) {
    console.error('Error fetching stockIn by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/stockin/:id', async (req, res) => {
  try {
    const stockIn = await updateStockIn(req.params.id, req.body);
    res.json(stockIn);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/stockin/:id', async (req, res) => {
  try {
    await deleteStockIn(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// StockOut routes
router.post('/stockout', async (req, res) => {
  try {
    const { productionId, product, amount, dailyId, status, stockInId } = req.body;
    if (!productionId || !product || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newStockOut = await createStockOut({ productionId, product, amount, dailyId, status, stockInId });
    res.status(201).json(newStockOut);
  } catch (error) {
    console.error('Error in stockout route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/stockout', async (req, res) => {
  try {
    const stockOuts = await getStockOuts();
    res.json(stockOuts);
  } catch (error) {
    console.error('Error fetching stockouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stockout/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // Ensure the ID is an integer
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const stockOut = await getStockOutById(id);
    if (stockOut) {
      res.json(stockOut);
    } else {
      res.status(404).json({ error: 'StockOut not found' });
    }
  } catch (error) {
    res.status(404).json({ error: 'StockOut not found' });
  }
});

router.put('/stockout/:id', async (req, res) => {
  try {
    const stockOut = await updateStockOut(req.params.id, req.body);
    res.json(stockOut);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/stockout/:id', async (req, res) => {
  try {
    await deleteStockOut(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Change stock out status
router.put('/stockout/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updatedStockOut = await updateStockOutStatus(id, status);
    res.json(updatedStockOut);
  } catch (error) {
    console.error('Error updating stock out status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stockIn by productionId
router.get('/stockin/production/:productionId', async (req, res) => {
  try {
    const productionId = parseInt(req.params.productionId, 10); // Ensure the ID is an integer
    if (isNaN(productionId)) {
      return res.status(400).json({ error: "Invalid productionId format" });
    }

    // Assuming getStockIns can filter by productionId
    const stockIns = await getStockIns({ productionId });
    if (stockIns.length > 0) {
      res.json(stockIns);
    } else {
      res.status(404).json({ error: 'No StockIn entries found for the given productionId' });
    }
  } catch (error) {
    console.error('Error fetching stockIn by productionId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stockOut by productionId
router.get('/stockout/production/:productionId', async (req, res) => {
  try {
    const productionId = parseInt(req.params.productionId, 10); // Ensure the ID is an integer
    if (isNaN(productionId)) {
      return res.status(400).json({ error: "Invalid productionId format" });
    }

    // Assuming getStockOuts can filter by productionId
    const stockOuts = await getStockOuts({ productionId });
    if (stockOuts.length > 0) {
      res.json(stockOuts);
    } else {
      res.status(404).json({ error: 'No StockOut entries found for the given productionId' });
    }
  } catch (error) {
    console.error('Error fetching stockOut by productionId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get balance stock by productionId
router.get('/balance/production/:productionId', async (req, res) => {
  try {
    const productionId = parseInt(req.params.productionId, 10); // Ensure the ID is an integer
    if (isNaN(productionId)) {
      return res.status(400).json({ error: "Invalid productionId format" });
    }

    // Fetch stockIns and stockOuts for the given productionId
    const stockIns = await getStockIns({ productionId });
    const stockOuts = await getStockOuts({ productionId });

    // Calculate total stockIn and stockOut
    const totalStockIn = stockIns.reduce((total, stockIn) => total + stockIn.amount, 0);
    const totalStockOut = stockOuts.reduce((total, stockOut) => total + stockOut.amount, 0);

    // Calculate balance
    const balance = totalStockIn - totalStockOut;

    res.json({ productionId, balance });
  } catch (error) {
    console.error('Error calculating balance stock by productionId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stockIn by dailyId
router.get('/stockin/daily/:dailyId', async (req, res) => {
  try {
    const dailyId = parseInt(req.params.dailyId, 10); // Ensure the ID is an integer
    if (isNaN(dailyId)) {
      return res.status(400).json({ error: "Invalid dailyId format" });
    }

    // Assuming getStockIns can filter by dailyId
    const stockIns = await getStockIns({ dailyId });
    if (stockIns.length > 0) {
      res.json(stockIns);
    } else {
      res.status(404).json({ error: 'No StockIn entries found for the given dailyId' });
    }
  } catch (error) {
    console.error('Error fetching stockIn by dailyId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stockOut by dailyId
router.get('/stockout/daily/:dailyId', async (req, res) => {
  try {
    const dailyId = parseInt(req.params.dailyId, 10); // Ensure the ID is an integer
    if (isNaN(dailyId)) {
      return res.status(400).json({ error: "Invalid dailyId format" });
    }

    // Assuming getStockOuts can filter by dailyId
    const stockOuts = await getStockOuts({ dailyId });
    if (stockOuts.length > 0) {
      res.json(stockOuts);
    } else {
      res.status(404).json({ error: 'No StockOut entries found for the given dailyId' });
    }
  } catch (error) {
    console.error('Error fetching stockOut by dailyId:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
