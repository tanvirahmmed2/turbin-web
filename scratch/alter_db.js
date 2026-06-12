require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await pool.query('ALTER TABLE tour_bookings ADD COLUMN IF NOT EXISTS phone TEXT;');
    await pool.query('ALTER TABLE tour_bookings ADD COLUMN IF NOT EXISTS transaction_id TEXT;');
    await pool.query('ALTER TABLE tour_bookings ADD COLUMN IF NOT EXISTS separate_room BOOLEAN DEFAULT false;');
    console.log('Successfully altered tour_bookings table.');
    process.exit(0);
  } catch (error) {
    console.error('Error altering table:', error);
    process.exit(1);
  }
}

main();
