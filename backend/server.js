import express from 'express';
import cors from 'cors';
import TodoRoutes from './routes/TodoRoutes.js';
import { connectDB } from './config/DB.js';

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use('/', TodoRoutes);

// connect db and start server
connectDB();

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
