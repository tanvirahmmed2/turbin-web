import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();
  
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    // Decode JWT payload (the second part of the token)
    const payloadBase64Url = token.split('.')[1];
    
    // Convert base64url to base64
    let payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Pad string with '=' to make its length a multiple of 4
    const padLength = (4 - (payloadBase64.length % 4)) % 4;
    payloadBase64 += '='.repeat(padLength);
    
    // Decode base64 using atob (Edge compatible) and decodeURIComponent for UTF-8 safety
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const { role } = JSON.parse(jsonPayload);
    
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    // Customer trying to access dashboard -> redirect to their panel
    if (isDashboard && role === 'customer') {
      url.pathname = '/panel';
      return NextResponse.redirect(url);
    }

    // Management trying to access /panel -> allowed (per request: "all users can access /panel")
    
  } catch (error) {
    console.error('Middleware decoding error:', error);
    // If token is invalid or malformed, bounce to login
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Apply this middleware to these routes and their sub-routes
  matcher: ['/dashboard/:path*', '/panel/:path*'],
};
