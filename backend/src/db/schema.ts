import { pool } from './index';

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        auth_provider VARCHAR(50) NOT NULL,
        auth_provider_id VARCHAR(255) NOT NULL,
        is_public_profile BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(auth_provider, auth_provider_id)
      )
    `);

    // Create spots table
    await client.query(`
      CREATE TABLE IF NOT EXISTS spots (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        distance_meters DECIMAL(10, 2) NOT NULL,
        description TEXT,
        creator_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create runs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS runs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        number_of_runs INTEGER NOT NULL,
        notes TEXT,
        date_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_runs_spot_id ON runs(spot_id)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_runs_date_logged ON runs(date_logged)
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}




