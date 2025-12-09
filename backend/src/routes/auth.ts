import express from 'express';
import { pool } from '../db';
import { generateToken } from '../middleware/auth';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// OAuth callback handler (simplified - in production, use proper OAuth flow)
router.post('/login', async (req, res) => {
  try {
    const { provider, providerId, email, name } = req.body;

    if (!provider || !providerId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (provider !== 'google' && provider !== 'facebook') {
      return res.status(400).json({ error: 'Invalid auth provider' });
    }

    // Find or create user
    let result = await pool.query(
      'SELECT id FROM users WHERE auth_provider = $1 AND auth_provider_id = $2',
      [provider, providerId]
    );

    let userId: string;

    if (result.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        `INSERT INTO users (name, email, auth_provider, auth_provider_id, is_public_profile)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [name, email, provider, providerId, true]
      );
      userId = insertResult.rows[0].id;
    } else {
      userId = result.rows[0].id;
    }

    // Generate JWT token
    const token = generateToken(userId);

    res.json({ token, userId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, auth_provider, is_public_profile, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      authProvider: user.auth_provider,
      isPublicProfile: user.is_public_profile,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile (public/private toggle)
router.patch('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { isPublicProfile } = req.body;

    if (typeof isPublicProfile !== 'boolean') {
      return res.status(400).json({ error: 'isPublicProfile must be a boolean' });
    }

    await pool.query(
      'UPDATE users SET is_public_profile = $1 WHERE id = $2',
      [isPublicProfile, req.userId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;




