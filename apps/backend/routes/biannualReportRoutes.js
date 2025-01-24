import express from "express";
import multer from "multer";
import path from "path";
import {
  createBiannualReport,
  getBiannualReportsByAnnualTargetId,
  getBiannualReportById,
  updateBiannualReport,
  updateBiannualReportStatus,
  deleteBiannualReport,
} from "../models/biannualReportModel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, "uploads/images/");
    } else if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, "uploads/documents/"); 
    } else {
      cb(new Error("Only image or document files are allowed"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif/;
    const documentTypes = /pdf|doc|docx/;
    
    const isImage = imageTypes.test(path.extname(file.originalname).toLowerCase()) && imageTypes.test(file.mimetype);
    const isDocument = documentTypes.test(path.extname(file.originalname).toLowerCase()) && documentTypes.test(file.mimetype);

    if (isImage || isDocument) {
      return cb(null, true); 
      return cb(new Error("Only image or document files are allowed"));
    }
  },
});

const uploadSingleImage = upload.single("image"); 
const uploadSingleDocument = upload.single("attachment");

router.get("/:annualTargetId", async (req, res) => {
  const { annualTargetId } = req.params;
  try {
    const reports = await getBiannualReportsByAnnualTargetId(annualTargetId);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new BiannualReport
router.post("/", uploadSingleImage, uploadSingleDocument, async (req, res) => {
  try {
    const reportData = req.body;

    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        reportData.image = req.file.filename; 
      } else {
        reportData.attachments = [req.file.filename]; 
      }
    }

    // Validate the status field
    if (reportData.status && !["Pending", "Approved", "Completed", "Deleted"].includes(reportData.status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const biannualReport = await createBiannualReport(reportData);
    res.status(201).json(biannualReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a BiannualReport by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const report = await getBiannualReportById(id);
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: "Biannual Report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a BiannualReport by ID
router.put("/:id", uploadSingleImage, uploadSingleDocument, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (req.file) {
    if (req.file.mimetype.startsWith('image/')) {
      updatedData.image = req.file.filename; 
    } else {
      updatedData.attachments = [req.file.filename]; 
    }
  }

  if (updatedData.status && !["Pending", "Approved", "Completed", "Deleted"].includes(updatedData.status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const report = await updateBiannualReport(id, updatedData);
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: "Biannual Report not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update the status of a BiannualReport
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate the status field
  if (!status || !["Pending", "Approved", "Completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updatedReport = await updateBiannualReportStatus(id, status);
    if (updatedReport) {
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: "Biannual Report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a BiannualReport by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const report = await deleteBiannualReport(id);
    if (report) {
      res.status(200).json({ message: "Biannual Report deleted successfully" });
    } else {
      res.status(404).json({ message: "Biannual Report not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
