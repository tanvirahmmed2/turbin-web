import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { dbQuery } from '@/lib/db';

export async function POST() {
  try {
    const schemaPath = path.join(process.cwd(), 'schema.psql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    // Make CREATE TABLE statements safe case-insensitively
    const safeSql = sql.replace(/CREATE TABLE /gi, 'CREATE TABLE IF NOT EXISTS ');

    // We already altered tour_users, now run the safe schema creation for missing tables
    await dbQuery(safeSql);

    return NextResponse.json({ success: true, message: 'All tables created successfully' });
  } catch (error) {
    console.error('Migration Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
