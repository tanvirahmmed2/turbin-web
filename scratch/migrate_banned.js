const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.hhedhfauqdrkjmbwncst',
  password: 'tanvir483469',
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  try {
    const client = await pool.connect();
    console.log('Connected to DB. Running migration...');
    
    // Add is_banned column
    await client.query('ALTER TABLE tour_users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;');
    console.log('Successfully added is_banned column to tour_users.');
    
    client.release();
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

migrate();
