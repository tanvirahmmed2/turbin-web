/**
 * Shared utility: verifies the session cookie from a server-side Request,
 * returns the decoded payload or null.
 */
import { verifyToken } from '@/lib/auth';

export function getSessionFromRequest(request) {
  const cookie = request.cookies.get('tourera_session')?.value;
  if (!cookie) return null;
  return verifyToken(cookie);
}

/**
 * Standard 401 response for unauthenticated requests.
 */
export function unauthorizedResponse(msg = 'Unauthorized') {
  return Response.json({ error: msg }, { status: 401 });
}

/**
 * Standard 403 response for forbidden requests.
 */
export function forbiddenResponse(msg = 'Forbidden') {
  return Response.json({ error: msg }, { status: 403 });
}

/**
 * Standard 500 response with optional logging.
 */
export function errorResponse(err, label = 'API') {
  console.error(`[${label}]`, err);
  return Response.json({ error: 'Internal server error' }, { status: 500 });
}
