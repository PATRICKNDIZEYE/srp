import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 2025;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API endpoint: http://localhost:${port}/api`);
}); 