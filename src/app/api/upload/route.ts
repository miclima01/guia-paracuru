import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { uploadImage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // Check admin auth
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 });
    }

    const url = await uploadImage(file);

    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}
