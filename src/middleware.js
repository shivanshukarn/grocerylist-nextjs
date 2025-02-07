import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = await getToken({ req });

  // Protect dashboard routes
  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirect authenticated users from auth pages
  if (path.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}