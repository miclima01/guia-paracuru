import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_TOKEN_KEY = 'admin_token';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@guiaparacuru.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET_KEY || 'change_me_in_production';

// Simple token generation (in production, use JWT)
function generateToken(secret: string): string {
  return Buffer.from(`${secret}:${Date.now()}`).toString('base64');
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate admin credentials
export function validateAdminCredentials(email: string, password: string): { valid: boolean; error?: string } {
  if (!email || !password) {
    return { valid: false, error: 'E-mail e senha são obrigatórios' };
  }

  if (!isValidEmail(email)) {
    return { valid: false, error: 'Formato de e-mail inválido' };
  }

  if (email !== ADMIN_EMAIL) {
    return { valid: false, error: 'E-mail incorreto' };
  }

  if (password !== ADMIN_PASSWORD) {
    return { valid: false, error: 'Senha incorreta' };
  }

  return { valid: true };
}

// Create admin session
export async function createAdminSession(): Promise<string> {
  const token = generateToken(ADMIN_PASSWORD);

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
