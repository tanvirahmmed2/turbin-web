
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Check if column exists to avoid errors on reruns
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tour_tours' and column_name='location';
    `);

    if (res.rows.length > 0) {
      console.log('Adding starting_location and finish_location...');
      await client.query(`ALTER TABLE tour_tours ADD COLUMN IF NOT EXISTS starting_location TEXT;`);
      await client.query(`ALTER TABLE tour_tours ADD COLUMN IF NOT EXISTS finish_location TEXT;`);
      
      console.log('Migrating existing location data...');
      await client.query(`UPDATE tour_tours SET starting_location = location, finish_location = location WHERE location IS NOT NULL;`);
      
      console.log('Dropping old location column...');
      await client.query(`ALTER TABLE tour_tours DROP COLUMN location;`);
      
      console.log('Migration successful.');
    } else {
      console.log('Migration already applied or location column missing.');
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', e);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
