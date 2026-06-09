import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// ─── Constants ────────────────────────────────────────────────────────────────

const SAAS_DOMAIN = process.env.SAAS_DOMAIN || 'localhost';
const COOKIE_NAME = 'tourera_session';
const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

// ─── Helper: extract subdomain ────────────────────────────────────────────────

function getTenantDomain(hostname) {
  const host = hostname.split(':')[0];

  // localhost (dev) → no subdomain
  if (host === 'localhost') return null;

  // e.g. "yoursaas.com" → no subdomain
  if (host === SAAS_DOMAIN || host === `www.${SAAS_DOMAIN}`) return null;

  // If it's a subdomain (e.g. tenant.localhost) or a custom domain, return the full host
  return host;
}

// ─── Proxy function ───────────────────────────────────────────────────────────

export function middleware(request) {
  const hostname = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;
  const tenantDomain = getTenantDomain(hostname) || 'demo'; // Fallback for local testing if no subdomain

  // ── 1. API routes: always pass through (no rewriting) ─────────────────────
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // ── 2. Tenant subdomain: rewrite to /t/[slug]/... ─────────────────────────
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? verifyToken(token) : null;

  // Dashboard path: require auth and inject context headers
  if (pathname.startsWith('/dashboard')) {
    if (!session || !session.tenant_id) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role === 'customer') {
      // Customers are not allowed on the tenant's admin dashboard
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Inject tenant/user context into request headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-slug', tenantDomain);
    requestHeaders.set('x-tenant-id', String(session.tenant_id));
    requestHeaders.set('x-user-id', String(session.user_id));
    requestHeaders.set('x-user-role', session.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    if (session) {
      if (session.role === 'customer') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Let auth pages pass through
    return NextResponse.next();
  }

  // Block direct access to /t/[slug] paths on the main domain
  if (pathname.startsWith('/t/')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Public tenant pages: rewrite subdomain.domain.com/foo → /t/slug/foo
  const rewrittenPath = `/t/${tenantDomain}${pathname === '/' ? '' : pathname}`;
  const rewriteUrl = new URL(rewrittenPath + search, request.url);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant-slug', tenantDomain);

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css)$).*)',
  ],
};
