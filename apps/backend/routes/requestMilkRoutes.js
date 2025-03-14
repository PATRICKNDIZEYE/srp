import express from "express";
import { createRequest, getRequestById, updateRequest, deleteRequest, listRequests, changeRequestStatus, getRequestsByDiaryIdFrom } from "../models/requestMilkModel.js";

const router = express.Router();

// Create a new request
router.post("/", async (req, res) => {
  try {
    const request = await createRequest(req.body);
    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await listRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a request by ID
router.get("/:id", async (req, res) => {
  try {
    const request = await getRequestById(req.params.id);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a request by ID
router.put("/:id", async (req, res) => {
  try {
    const request = await updateRequest(req.params.id, req.body);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a request by ID
router.delete("/:id", async (req, res) => {
  try {
    const request = await deleteRequest(req.params.id);
    if (request) {
      res.status(200).json({ message: "Request deleted successfully" });
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Change request status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const request = await changeRequestStatus(req.params.id, status);
    if (request) {
      res.status(200).json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error changing request status:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get requests by diaryIdFrom
router.get("/from/:diaryIdFrom", async (req, res) => {
  try {
    const requests = await getRequestsByDiaryIdFrom(req.params.diaryIdFrom);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests by diaryIdFrom:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router; 