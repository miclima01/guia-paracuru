import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';

export async function GET() {
  const authenticated = await isAdmin();

  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
