import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db';
import authRoutes from './routes/auth';
import spotsRoutes from './routes/spots';
import runsRoutes from './routes/runs';
import leaderboardRoutes from './routes/leaderboard';
import { initializeDatabase } from './db/schema';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spots', spotsRoutes);
app.use('/api/runs', runsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Initialize database and start server
async function start() {
  try {
    await initializeDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();




