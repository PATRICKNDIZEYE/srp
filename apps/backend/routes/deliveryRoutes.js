import express from "express";
import { 
  createDelivery, 
  getDeliveryEntries, 
  getDeliveryById, 
  updateDelivery, 
  deleteDelivery, 
  changeDeliveryStatus, 
  getDeliveryByTransportId 
} from "../models/deliveryModel.js";

const router = express.Router();

// Create a new derivery entry
router.post("/", async (req, res) => {
  try {
    console.log("Request body for creating delivery:", req.body); // Log the request body
    const { transportId, productionId, amount, transportStatus } = req.body;

    if (!transportId || !productionId || !amount || !transportStatus) {
      console.log("Missing fields:", {
        transportId: !transportId,
        productionId: !productionId,
        amount: !amount,
        transportStatus: !transportStatus,
      });
      return res.status(400).json({ error: "Missing required fields" });
    }

    const derivery = await createDelivery({
      transportId,
      productionId,
      amount,
      transportStatus,
    });

    res.status(201).json(derivery);  // Status 201 for successful creation
  } catch (error) {
    res.status(400).json({ error: error.message });  // Handle any other errors
  }
});

// Get all derivery entries
router.get("/", async (req, res) => {
  try {
    const deriveryEntries = await getDeliveryEntries();
    res.status(200).json(deriveryEntries);  // Status 200 for successful GET
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve derivery entries" });  // Handle server errors
  }
});

// Get a delivery entry by ID
router.get("/:id", async (req, res) => {
  try {
    const delivery = await getDeliveryById(req.params.id);
    if (delivery) {
      res.status(200).json(delivery);  // Return the delivery if found
    } else {
      res.status(404).json({ message: "Delivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve delivery entry" });  // Handle server errors
  }
});

// Update a derivery entry by ID
router.put("/:id", async (req, res) => {
  try {
    console.log("Request body for updating delivery:", req.body); // Log the request body
    const { transportId, pocId, amount, transportStatus } = req.body;

    if (!transportId || !pocId || !amount || !transportStatus) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const derivery = await updateDelivery(req.params.id, {
      transportId,
      pocId,
      amount,
      transportStatus,
    });

    if (derivery) {
      res.status(200).json(derivery);  // Return the updated derivery
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message });  // Handle any other errors
  }
});

// Delete a derivery entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const derivery = await deleteDelivery(req.params.id);
    if (derivery) {
      res.status(200).json({ message: "Derivery entry deleted successfully" });  // Success message
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete derivery entry" });  // Handle server errors
  }
});

// Change the status of a derivery entry by ID
router.patch("/:id/status", async (req, res) => {
  try {
    console.log("Request body for changing delivery status:", req.body); // Log the request body
    const { newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: "Missing new status" });
    }

    const derivery = await changeDeliveryStatus(req.params.id, newStatus);

    if (derivery) {
      res.status(200).json(derivery);  // Return the updated derivery
    } else {
      res.status(404).json({ message: "Derivery entry not found" });  // Entry not found
    }
  } catch (error) {
    res.status(400).json({ error: error.message });  // Handle any other errors
  }
});

// Get delivery entries by transport ID
router.get("/transport/:transportId", async (req, res) => {
  try {
    const deriveryEntries = await getDeliveryByTransportId(req.params.transportId);
    if (deriveryEntries.length > 0) {
      res.status(200).json(deriveryEntries);
    } else {
      res.status(404).json({ message: "No derivery entries found for this transport ID" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve derivery entries" });
  }
});

export default router;
  