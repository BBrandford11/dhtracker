import express from 'express';
import { pool } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all spots (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.name, s.distance_meters, s.description, s.creator_user_id, 
              s.created_at, u.name as creator_name
       FROM spots s
       LEFT JOIN users u ON s.creator_user_id = u.id
       ORDER BY s.created_at DESC`
    );

    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      distanceMeters: parseFloat(row.distance_meters),
      description: row.description,
      creatorUserId: row.creator_user_id,
      creatorName: row.creator_name,
      createdAt: row.created_at,
    })));
  } catch (error) {
    console.error('Get spots error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single spot
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.name, s.distance_meters, s.description, s.creator_user_id, 
              s.created_at, u.name as creator_name
       FROM spots s
       LEFT JOIN users u ON s.creator_user_id = u.id
       WHERE s.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      distanceMeters: parseFloat(row.distance_meters),
      description: row.description,
      creatorUserId: row.creator_user_id,
      creatorName: row.creator_name,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('Get spot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create spot (authenticated)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, distanceMeters, description } = req.body;

    if (!name || !distanceMeters) {
      return res.status(400).json({ error: 'Name and distanceMeters are required' });
    }

    if (typeof distanceMeters !== 'number' || distanceMeters <= 0) {
      return res.status(400).json({ error: 'distanceMeters must be a positive number' });
    }

    const result = await pool.query(
      `INSERT INTO spots (name, distance_meters, description, creator_user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, distance_meters, description, creator_user_id, created_at`,
      [name, distanceMeters, description || null, req.userId]
    );

    const row = result.rows[0];
    res.status(201).json({
      id: row.id,
      name: row.name,
      distanceMeters: parseFloat(row.distance_meters),
      description: row.description,
      creatorUserId: row.creator_user_id,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('Create spot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update spot (only creator)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, distanceMeters, description } = req.body;

    // Check if user is the creator
    const checkResult = await pool.query(
      'SELECT creator_user_id FROM spots WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    if (checkResult.rows[0].creator_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this spot' });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (distanceMeters !== undefined) {
      if (typeof distanceMeters !== 'number' || distanceMeters <= 0) {
        return res.status(400).json({ error: 'distanceMeters must be a positive number' });
      }
      updates.push(`distance_meters = $${paramCount++}`);
      values.push(distanceMeters);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE spots SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, name, distance_meters, description, creator_user_id, created_at`,
      values
    );

    const row = result.rows[0];
    res.json({
      id: row.id,
      name: row.name,
      distanceMeters: parseFloat(row.distance_meters),
      description: row.description,
      creatorUserId: row.creator_user_id,
      createdAt: row.created_at,
    });
  } catch (error) {
    console.error('Update spot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete spot (only creator)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Check if user is the creator
    const checkResult = await pool.query(
      'SELECT creator_user_id FROM spots WHERE id = $1',
      [req.params.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    if (checkResult.rows[0].creator_user_id !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this spot' });
    }

    await pool.query('DELETE FROM spots WHERE id = $1', [req.params.id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete spot error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;




