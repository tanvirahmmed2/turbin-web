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

export const getTenantStatus = async () => {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  try {
    const result = await dbQuery(`
      SELECT 
        t.tenant_id, 
        t.status as tenant_status, 
        s.status as subscription_status
      FROM ts_domains d
      JOIN ts_tenants t ON d.tenant_id = t.tenant_id
      LEFT JOIN ts_subscriptions s ON t.tenant_id = s.tenant_id
      WHERE d.domain = $1
      ORDER BY s.created_at DESC
      LIMIT 1
    `, [host]);

    if (result.rows.length > 0) {
      return {
        tenant_id: result.rows[0].tenant_id,
        tenant_status: result.rows[0].tenant_status,
        // If there's no subscription record, it's 'none' (which implies not active)
        subscription_status: result.rows[0].subscription_status || 'none',
      };
    }
  } catch (error) {
    // If DB fails, fallback
  }

  return {
    tenant_id: 1,
    tenant_status: 'active',
    subscription_status: 'active',
  };
};
