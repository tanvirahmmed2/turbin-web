import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './secret';

export const signToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getSession = (req) => {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
};

export const getServerSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
};

export const requireRole = async (allowedRoles) => {
  const session = await getServerSession();
  if (!session) redirect('/login');
  
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    if (session.role === 'customer') redirect('/panel');
    else redirect('/dashboard');
  }
  return session;
};
