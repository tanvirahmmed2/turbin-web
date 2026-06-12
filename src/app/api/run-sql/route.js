import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    await dbQuery('ALTER TABLE tour_tours DROP COLUMN IF EXISTS seat;');
    return NextResponse.json({ success: true, message: 'Successfully altered tour_tours table.' });
  } catch (error) {
    console.error('Error altering table:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
