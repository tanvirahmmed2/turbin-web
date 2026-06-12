const { Client } = require('pg');

async function main() {
  const client = new Client({
    user: 'postgres.hhedhfauqdrkjmbwncst',
    password: 'tanvir483469',
    host: 'aws-1-ap-northeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Adding duration column to tour_tours...');
    await client.query(`ALTER TABLE tour_tours ADD COLUMN IF NOT EXISTS duration TEXT;`);
    console.log('Successfully added duration column.');
  } catch (error) {
    console.error('Error adding duration column:', error);
  } finally {
    await client.end();
  }
}

main();
