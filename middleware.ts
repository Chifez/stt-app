import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/utils/controllers/authMiddleware';
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
  const token = (await cookies()).get('session');

  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }
  try {
    await verifyToken(token?.value); // Ensure the token is valid
    return NextResponse.next(); // Continue to the requested page
  } catch (error) {
    console.log('error', error);
    return NextResponse.redirect(new URL('/auth', req.url)); // Redirect if token is invalid
  }
}

export const config = {
  matcher: ['/converter/:path*', '/history/:path*'], // Protect these routes
};
