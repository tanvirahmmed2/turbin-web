import { dbQuery } from '../src/lib/db.js';

async function main() {
  try {
    await dbQuery('ALTER TABLE tour_schedules ADD COLUMN reserved_seats INT DEFAULT 0');
    console.log('Added reserved_seats');
  } catch (e) {
    console.log(e.message);
  }
  try {
    await dbQuery('ALTER TABLE tour_schedules ADD COLUMN booked_seats INT DEFAULT 0');
    console.log('Added booked_seats');
  } catch (e) {
    console.log(e.message);
  }

  // Also update existing confirmed bookings to reflect in booked_seats
  try {
    await dbQuery(`
      WITH booked AS (
        SELECT schedule_id, SUM(seats) as total_booked
        FROM tour_bookings
        WHERE status = 'confirmed'
        GROUP BY schedule_id
      )
      UPDATE tour_schedules ts
      SET booked_seats = b.total_booked
      FROM booked b
      WHERE ts.schedule_id = b.schedule_id
    `);
    console.log('Updated booked_seats based on existing bookings');
  } catch (e) {
    console.log(e.message);
  }

  process.exit(0);
}

main();
