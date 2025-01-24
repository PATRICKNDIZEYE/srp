import express from "express";
import { createNGO, getNGOs, getNGOById, updateNGO, updateNGOStatus, deleteNGO } from "../models/ngoModel.js";
import { authenticateNgo } from "../middleware/authMiddleware.js";
import { prisma } from "../postgres/postgres.js";

const router = express.Router();

// Get all NGOs
router.get("/", async (req, res) => {
  try {
    const ngos = await getNGOs();
    res.json(ngos);  // Return the list of NGOs as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new NGO
// router.post("/", async (req, res) => {
//   try {
//     console.log('Request body:', req.body); // Debugging request payload
//     const ngoData = req.body;
//     const ngo = await createNGO(ngoData);
//     res.status(201).json(ngo); // Respond with the created NGO
//   } catch (error) {
//     console.error('Error in NGO creation:', error.message);
//     res.status(400).json({ error: error.message });
//   }
// });


// Get an NGO by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ngo = await getNGOById(id);
    if (ngo) {
      res.json(ngo);  // Respond with the NGO details
    } else {
      res.status(404).json({ message: "NGO not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an NGO by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const ngo = await updateNGO(id, updatedData);
    if (ngo) {
      res.json(ngo);  // Respond with the updated NGO
    } else {
      res.status(404).json({ message: "NGO not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an NGO's status by ID
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // Get the new status from the request body
  try {
    const updatedNGO = await updateNGOStatus(id, status);
    if (updatedNGO) {
      res.json(updatedNGO);  // Respond with the updated NGO
    } else {
      res.status(404).json({ message: "NGO not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an NGO by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ngo = await deleteNGO(id);
    if (ngo) {
      res.status(200).json({ message: "NGO deleted successfully" });
    } else {
      res.status(404).json({ message: "NGO not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the profile endpoint
router.get('/profile', authenticateNgo, async (req, res) => {
  try {
    const ngoId = req.ngo?.id;

    if (!ngoId) {
      return res.status(401).json({ message: 'NGO ID not found in request' });
    }

    const ngo = await prisma.NGO.findUnique({
      where: {
        id: ngoId
      },
      select: {
        id: true,
        nameOfTheNGO: true,
        physicalAddress: true,
        operationalAddress: true,
        domainsOfIntervention: true,
        descriptionOfInterventions: true,
        district: true,
        sectors: true,
        cells: true,
        targetGroups: true,
        nameOfLegalRepresentatives: true,
        nameOfContactPersons: true,
        telForContactPersons: true,
        contactPersonsEmail: true,
        status: true,
        supportingDocuments: true
      }
    });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' });
    }

    res.json(ngo);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Add endpoint for updating NGO profile
router.put('/profile', authenticateNgo, async (req, res) => {
  try {
    const updatedNgo = await prisma.NGO.update({
      where: { id: req.ngo.id },
      data: {
        physicalAddress: req.body.physicalAddress,
        operationalAddress: req.body.operationalAddress,
        telForContactPersons: req.body.telForContactPersons,
        nameOfContactPersons: req.body.nameOfContactPersons,
        // Add other updatable fields
      }
    });
    res.json(updatedNgo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add this temporary debug endpoint
router.get('/check-email/:email', async (req, res) => {
  try {
    const ngo = await prisma.NGO.findFirst({
      where: {
        contactPersonsEmail: req.params.email
      },
      select: {
        id: true,
        nameOfTheNGO: true,
        contactPersonsEmail: true,
        status: true
      }
    });

    res.json({
      exists: !!ngo,
      ngo: ngo ? {
        id: ngo.id,
        email: ngo.contactPersonsEmail,
        status: ngo.status
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Work Plans endpoints
router.get('/workplans', authenticateNgo, async (req, res) => {
  try {
    const workPlans = await prisma.WorkPlan.findMany({
      where: {
        ngoId: parseInt(req.ngo.id)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(workPlans);
  } catch (error) {
    console.error('Error fetching work plans:', error);
    res.status(500).json({ message: 'Failed to fetch work plans', error: error.message });
  }
});

// Reports endpoints
router.get('/reports', authenticateNgo, async (req, res) => {
  try {
    const reports = await prisma.Report.findMany({
      where: {
        ngoId: parseInt(req.ngo.id)
      },
      orderBy: {
        submissionDate: 'desc'
      }
    });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
});

// Impact locations endpoints
router.get('/impact-locations', authenticateNgo, async (req, res) => {
  try {
    const locations = [];
    res.json(locations);
  } catch (error) {
    console.error('Error fetching impact locations:', error);
    res.status(500).json({ message: 'Failed to fetch impact locations', error: error.message });
  }
});

export default router;

