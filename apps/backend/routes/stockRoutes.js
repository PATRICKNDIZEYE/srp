import express from "express";
import { createStock, getStocks, getStockById, updateStock, deleteStock } from "../models/stockModel.js";

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
    const stock = await getStockById(req.params.id);
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

export default router;
