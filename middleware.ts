import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/utils/controllers/authMiddleware';
// Utility function to verify JWT

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }
  try {
    verifyToken(token.value); // Ensure the token is valid
    return NextResponse.next(); // Continue to the requested page
  } catch (error) {
    return NextResponse.redirect(new URL('/auth', req.url)); // Redirect if token is invalid
  }
}

export const config = {
  matcher: ['/converter/:path*', '/history/:path*'], // Protect these routes
};
