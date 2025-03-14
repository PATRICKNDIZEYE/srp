import express from "express";
import milkTransportationRoutes from './routes/milkTransportationRoutes.js';

const app = express();

// existing code...
app.use('/api/milk-transportation', milkTransportationRoutes);
// existing code... 