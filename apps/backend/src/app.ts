import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api', authRoutes);

// Log registered routes
app._router.stack.forEach((r: any) => {
  if (r.route && r.route.path) {
    console.log(`Route registered: ${r.route.stack[0].method.toUpperCase()} ${r.route.path}`);
  }
});

export default app;
