const { Client } = require('pg');
const slugify = require('slugify');

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
    console.log('Backfilling tour slugs...');
    
    // Get all tours without a proper slug
    const res = await client.query(`SELECT tour_id, title FROM tour_tours WHERE slug IS NULL OR slug = ''`);
    
    for (const row of res.rows) {
      if (row.title) {
        const slug = slugify(row.title, { lower: true, strict: true });
        await client.query(`UPDATE tour_tours SET slug = $1 WHERE tour_id = $2`, [slug, row.tour_id]);
        console.log(`Updated tour ${row.tour_id} with slug: ${slug}`);
      }
    }
    
    console.log('Successfully backfilled slugs.');
  } catch (error) {
    console.error('Error backfilling slugs:', error);
  } finally {
    await client.end();
  }
}

main();
