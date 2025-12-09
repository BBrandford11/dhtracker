import express from 'express';
import { pool } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user's runs
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.spot_id, r.user_id, r.number_of_runs, r.notes, r.date_logged, r.created_at,
              s.name as spot_name, s.distance_meters
       FROM runs r
       JOIN spots s ON r.spot_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.date_logged DESC`,
      [req.userId]
    );

    res.json(result.rows.map(row => ({
      id: row.id,
      spotId: row.spot_id,
      userId: row.user_id,
      numberOfRuns: row.number_of_runs,
      notes: row.notes,
      dateLogged: row.date_logged,
      createdAt: row.created_at,
      spotName: row.spot_name,
      spotDistance: parseFloat(row.distance_meters),
    })));
  } catch (error) {
    console.error('Get runs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create run
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { spotId, numberOfRuns, notes, dateLogged } = req.body;

    if (!spotId || !numberOfRuns) {
      return res.status(400).json({ error: 'spotId and numberOfRuns are required' });
    }

    if (typeof numberOfRuns !== 'number' || numberOfRuns <= 0) {
      return res.status(400).json({ error: 'numberOfRuns must be a positive number' });
    }

    // Verify spot exists
    const spotCheck = await pool.query('SELECT id FROM spots WHERE id = $1', [spotId]);
    if (spotCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    const result = await pool.query(
      `INSERT INTO runs (spot_id, user_id, number_of_runs, notes, date_logged)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, spot_id, user_id, number_of_runs, notes, date_logged, created_at`,
      [spotId, req.userId, numberOfRuns, notes || null, dateLogged || new Date()]
    );

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      spotId: row.spot_id,
      userId: row.user_id,
      numberOfRuns: row.number_of_runs,
      notes: row.notes,
      dateLogged: row.date_logged,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('Create run error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user stats
router.get('/me/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    // Runs this year
    const runsThisYearResult = await pool.query(
      `SELECT COALESCE(SUM(number_of_runs), 0) as total
       FROM runs
       WHERE user_id = $1 AND date_logged >= $2 AND date_logged <= $3`,
      [req.userId, yearStart, yearEnd]
    );

    // Lifetime runs
    const lifetimeRunsResult = await pool.query(
      `SELECT COALESCE(SUM(number_of_runs), 0) as total
       FROM runs
       WHERE user_id = $1`,
      [req.userId]
    );

    // Total distance and laps
    const distanceResult = await pool.query(
      `SELECT 
         COALESCE(SUM(r.number_of_runs), 0) as total_laps,
         COALESCE(SUM(r.number_of_runs * s.distance_meters), 0) as total_distance
       FROM runs r
       JOIN spots s ON r.spot_id = s.id
       WHERE r.user_id = $1`,
      [req.userId]
    );

    res.json({
      userId: req.userId,
      runsThisYear: parseInt(runsThisYearResult.rows[0].total),
      lifetimeRuns: parseInt(lifetimeRunsResult.rows[0].total),
      totalLaps: parseInt(distanceResult.rows[0].total_laps),
      totalDistance: parseFloat(distanceResult.rows[0].total_distance),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;




