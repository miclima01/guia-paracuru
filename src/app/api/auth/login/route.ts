import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, createAdminSession } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Senha obrigatória' }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    await createAdminSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 });
  }
}
