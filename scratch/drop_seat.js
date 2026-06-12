const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  try {
    await pool.query('ALTER TABLE tour_tours DROP COLUMN IF EXISTS seat;');
    console.log('Successfully dropped seat column from tour_tours');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

run();
