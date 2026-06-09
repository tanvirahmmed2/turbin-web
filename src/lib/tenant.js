import { query } from '@/lib/db';

// Simple in-memory LRU-ish cache to avoid repeated DB lookups per request
const tenantCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Resolve a tenant from a given hostname.
 *
 * Lookup order:
 * 1. Check `domains` table for custom domains.
 * 2. Check `tenants.slug` for subdomains (e.g. "slug.yourdomain.com").
 *
 * Returns the full tenant row or null if not found.
 *
 * @param {string} hostname - e.g. "besttours.yoursaas.com" or "besttours.localhost"
 * @returns {Promise<object|null>}
 */
export async function resolveTenant(hostname) {
  if (!hostname) return null;

  // Strip port if present (e.g. "localhost:3000" → "localhost")
  const host = hostname.split(':')[0];

  // Return from cache if fresh
  const cached = tenantCache.get(host);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.tenant;
  }

  let tenant = null;

  try {
    // 1. Exact match on custom domains
    const domainResult = await query(
      `SELECT t.* FROM ts_tenants t
       JOIN ts_domains d ON d.tenant_id = t.tenant_id
       WHERE d.domain = $1 AND d.verified = TRUE AND t.status = 'active'
       LIMIT 1`,
      [host]
    );
    if (domainResult.rows.length > 0) {
      tenant = domainResult.rows[0];
    }

    // 2. Subdomain match — extract first part of host
    if (!tenant) {
      const slug = host.split('.')[0];
      if (slug && slug !== 'www') {
        const slugResult = await query(
          `SELECT * FROM ts_tenants WHERE slug = $1 AND status = 'active' LIMIT 1`,
          [slug]
        );
        if (slugResult.rows.length > 0) {
          tenant = slugResult.rows[0];
        }
      }
    }
  } catch (err) {
    console.error('[tenant.js] Failed to resolve tenant for host:', host, err);
    return null;
  }

  // Store in cache (even null result, to avoid hammering DB on unknown hosts)
  tenantCache.set(host, { tenant, ts: Date.now() });

  return tenant;
}

/**
 * Invalidate the tenant cache for a given hostname.
 * Call this after updating tenant/domain records.
 * @param {string} hostname
 */
export function invalidateTenantCache(hostname) {
  const host = hostname.split(':')[0];
  tenantCache.delete(host);
}

/**
 * Get tenant by ID directly.
 * @param {number} tenantId
 * @returns {Promise<object|null>}
 */
export async function getTenantById(tenantId) {
  const result = await query(
    `SELECT * FROM ts_tenants WHERE tenant_id = $1 LIMIT 1`,
    [tenantId]
  );
  return result.rows[0] || null;
}
