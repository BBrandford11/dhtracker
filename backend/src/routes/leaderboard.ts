import express from 'express';
import { pool } from '../db';

const router = express.Router();

// Get global leaderboard
router.get('/', async (req, res) => {
  try {
    const { type = 'runsThisYear', limit = 100 } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 100, 1000);

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59);

    let query: string;
    let params: any[];

    switch (type) {
      case 'runsThisYear':
        query = `
          SELECT 
            u.id as user_id,
            u.name as user_name,
            COALESCE(SUM(CASE WHEN r.date_logged >= $2 AND r.date_logged <= $3 THEN r.number_of_runs ELSE 0 END), 0) as runs_this_year,
            COALESCE(SUM(r.number_of_runs), 0) as lifetime_runs,
            COALESCE(SUM(r.number_of_runs * s.distance_meters), 0) as total_distance,
            COALESCE(SUM(r.number_of_runs), 0) as total_laps
          FROM users u
          LEFT JOIN runs r ON u.id = r.user_id
          LEFT JOIN spots s ON r.spot_id = s.id
          WHERE u.is_public_profile = true
          GROUP BY u.id, u.name
          HAVING COALESCE(SUM(CASE WHEN r.date_logged >= $2 AND r.date_logged <= $3 THEN r.number_of_runs ELSE 0 END), 0) > 0
          ORDER BY runs_this_year DESC
          LIMIT $1
        `;
        params = [limitNum, yearStart, yearEnd];
        break;

      case 'lifetimeRuns':
        query = `
          SELECT 
            u.id as user_id,
            u.name as user_name,
            COALESCE(SUM(CASE WHEN r.date_logged >= $2 AND r.date_logged <= $3 THEN r.number_of_runs ELSE 0 END), 0) as runs_this_year,
            COALESCE(SUM(r.number_of_runs), 0) as lifetime_runs,
            COALESCE(SUM(r.number_of_runs * s.distance_meters), 0) as total_distance,
            COALESCE(SUM(r.number_of_runs), 0) as total_laps
          FROM users u
          LEFT JOIN runs r ON u.id = r.user_id
          LEFT JOIN spots s ON r.spot_id = s.id
          WHERE u.is_public_profile = true
          GROUP BY u.id, u.name
          HAVING COALESCE(SUM(r.number_of_runs), 0) > 0
          ORDER BY lifetime_runs DESC
          LIMIT $1
        `;
        params = [limitNum, yearStart, yearEnd];
        break;

      case 'totalDistance':
        query = `
          SELECT 
            u.id as user_id,
            u.name as user_name,
            COALESCE(SUM(CASE WHEN r.date_logged >= $2 AND r.date_logged <= $3 THEN r.number_of_runs ELSE 0 END), 0) as runs_this_year,
            COALESCE(SUM(r.number_of_runs), 0) as lifetime_runs,
            COALESCE(SUM(r.number_of_runs * s.distance_meters), 0) as total_distance,
            COALESCE(SUM(r.number_of_runs), 0) as total_laps
          FROM users u
          LEFT JOIN runs r ON u.id = r.user_id
          LEFT JOIN spots s ON r.spot_id = s.id
          WHERE u.is_public_profile = true
          GROUP BY u.id, u.name
          HAVING COALESCE(SUM(r.number_of_runs * s.distance_meters), 0) > 0
          ORDER BY total_distance DESC
          LIMIT $1
        `;
        params = [limitNum, yearStart, yearEnd];
        break;

      case 'totalLaps':
        query = `
          SELECT 
            u.id as user_id,
            u.name as user_name,
            COALESCE(SUM(CASE WHEN r.date_logged >= $2 AND r.date_logged <= $3 THEN r.number_of_runs ELSE 0 END), 0) as runs_this_year,
            COALESCE(SUM(r.number_of_runs), 0) as lifetime_runs,
            COALESCE(SUM(r.number_of_runs * s.distance_meters), 0) as total_distance,
            COALESCE(SUM(r.number_of_runs), 0) as total_laps
          FROM users u
          LEFT JOIN runs r ON u.id = r.user_id
          LEFT JOIN spots s ON r.spot_id = s.id
          WHERE u.is_public_profile = true
          GROUP BY u.id, u.name
          HAVING COALESCE(SUM(r.number_of_runs), 0) > 0
          ORDER BY total_laps DESC
          LIMIT $1
        `;
        params = [limitNum, yearStart, yearEnd];
        break;

      default:
        return res.status(400).json({ error: 'Invalid leaderboard type' });
    }

    const result = await pool.query(query, params);

    res.json(result.rows.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      userName: row.user_name,
      runsThisYear: parseInt(row.runs_this_year),
      lifetimeRuns: parseInt(row.lifetime_runs),
      totalDistance: parseFloat(row.total_distance),
      totalLaps: parseInt(row.total_laps),
    })));
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

