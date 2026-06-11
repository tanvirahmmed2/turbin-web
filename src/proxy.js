import { NextResponse } from 'next/server';

export function proxy(request) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();
  
  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const payloadBase64Url = token.split('.')[1];
    
    let payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    const padLength = (4 - (payloadBase64.length % 4)) % 4;
    payloadBase64 += '='.repeat(padLength);
    
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const { role } = JSON.parse(jsonPayload);
    
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboard && role === 'customer') {
      url.pathname = '/panel';
      return NextResponse.redirect(url);
    }

    
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
