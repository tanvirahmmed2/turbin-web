import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const COOKIE_NAME = 'tourera_session';
const SALT_ROUNDS = 12;

// ─── Password helpers ────────────────────────────────────────────────────────

/**
 * Hash a plain-text password.
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// ─── JWT helpers ─────────────────────────────────────────────────────────────

/**
 * Sign a JWT token containing user payload.
 * @param {object} payload - user_id, tenant_id, role, etc.
 * @param {string|number} [expiresIn='7d']
 * @returns {string}
 */
export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object|null} decoded payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ─── Session (cookie) helpers ─────────────────────────────────────────────────

/**
 * Get the current authenticated session from HTTP-only cookie (server-side).
 * Returns the decoded JWT payload, or null if not authenticated.
 * @returns {Promise<object|null>}
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Build a Set-Cookie header value to store a session JWT.
 * @param {string} token
 * @returns {string}
 */
export function buildSessionCookie(token) {
  const isProd = process.env.NODE_ENV === 'production';
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  return [
    `${COOKIE_NAME}=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    `SameSite=Lax`,
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

/**
 * Build a Set-Cookie header to clear the session.
 * @returns {string}
 */
export function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
