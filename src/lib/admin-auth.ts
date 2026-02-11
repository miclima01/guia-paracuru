import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_KEY = 'admin_token';
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'change_me_in_production';

// Simple token generation (in production, use JWT)
function generateToken(secret: string): string {
  return Buffer.from(`${secret}:${Date.now()}`).toString('base64');
}

// Validate admin password
export function validateAdminPassword(password: string): boolean {
  return password === SECRET_KEY;
}

// Create admin session
export async function createAdminSession(): Promise<string> {
  const token = generateToken(SECRET_KEY);

  // Set cookie
  (await cookies()).set(ADMIN_TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_KEY);
  return !!token?.value;
}

// Require admin (middleware helper)
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(ADMIN_TOKEN_KEY);

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

// Logout admin
export async function logoutAdmin(): Promise<void> {
  (await cookies()).delete(ADMIN_TOKEN_KEY);
}
