const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    console.log('Adding separate_room_available and separate_room_charge...');
    await client.query(`ALTER TABLE tour_tours ADD COLUMN IF NOT EXISTS separate_room_available BOOLEAN DEFAULT false;`);
    await client.query(`ALTER TABLE tour_tours ADD COLUMN IF NOT EXISTS separate_room_charge NUMERIC(10,2) DEFAULT 0.00;`);
    
    console.log('Migration successful.');

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
