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
    
    console.log('Dropping old tables...');
    await client.query('DROP TABLE IF EXISTS tour_tour_features;');
    await client.query('DROP TABLE IF EXISTS tour_activities;');
    await client.query('DROP TABLE IF EXISTS tour_features;');

    console.log('Creating global tour_features table...');
    await client.query(`
      CREATE TABLE tour_features (
        feature_id SERIAL PRIMARY KEY,
        tenant_id INT REFERENCES ts_tenants(tenant_id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);

    console.log('Creating tour_tour_features junction table...');
    await client.query(`
      CREATE TABLE tour_tour_features (
        id SERIAL PRIMARY KEY,
        tour_id INT REFERENCES tour_tours(tour_id) ON DELETE CASCADE,
        feature_id INT REFERENCES tour_features(feature_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
    
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
