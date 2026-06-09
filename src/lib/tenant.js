import { headers } from 'next/headers';
import { dbQuery } from './db';


export const getTenantId = async () => {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  try {
    // Find the tenant by domain
    const result = await dbQuery('SELECT tenant_id FROM ts_domains WHERE domain = $1', [host]);
    
    if (result.rows.length > 0) {
      return result.rows[0].tenant_id;
    }
  } catch (error) {
    // If the database connection fails, suppress the error log and fallback to default tenant
  }

  // Fallback if tenant not found or DB fails
  return 1;
};
