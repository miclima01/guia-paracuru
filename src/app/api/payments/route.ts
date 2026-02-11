import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { createPixPayment, getPaymentStatus } from '@/lib/mercadopago';

// POST - Create a new Pix payment
export async function POST(request: NextRequest) {
  try {
    const { device_id } = await request.json();

    if (!device_id) {
      return NextResponse.json({ error: 'device_id obrigatório' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Check if device already has active premium
    const { data: existing } = await admin
      .from('premium_access')
      .select('*')
      .eq('device_id', device_id)
      .gt('expires_at', new Date().toISOString())
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json({
        error: 'Você já possui acesso premium ativo',
        expires_at: existing.expires_at,
      }, { status: 400 });
    }

    // Get price from settings
    const { data: priceSetting } = await admin
      .from('app_settings')
      .select('value')
      .eq('key', 'premium_price')
      .single();

    const amount = parseFloat(priceSetting?.value || '1.99');

    // Get duration from settings
    const { data: durationSetting } = await admin
      .from('app_settings')
      .select('value')
      .eq('key', 'premium_duration_days')
      .single();

    const durationDays = parseInt(durationSetting?.value || '30');

    // Create payment record
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min to pay
    const { data: payment, error: insertError } = await admin
      .from('payments')
      .insert({
        device_id,
        amount,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (insertError || !payment) {
      return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 });
    }

    // Create Pix payment via Mercado Pago
    const pixPayment = await createPixPayment({
      amount,
      description: `Guia Paracuru - Acesso Premium (${durationDays} dias)`,
      external_reference: payment.id,
    });

    // Update payment with Mercado Pago data
    await admin
      .from('payments')
      .update({
        mercadopago_id: pixPayment.id.toString(),
        qr_code: pixPayment.point_of_interaction.transaction_data.qr_code,
        qr_code_base64: pixPayment.point_of_interaction.transaction_data.qr_code_base64,
      })
      .eq('id', payment.id);

    return NextResponse.json({
      payment_id: payment.id,
      qr_code: pixPayment.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: pixPayment.point_of_interaction.transaction_data.qr_code_base64,
      amount,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar pagamento' }, { status: 500 });
  }
}

// GET - Check payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('id');

  if (!paymentId) {
    return NextResponse.json({ error: 'ID do pagamento obrigatório' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Get our payment record
  const { data: payment } = await admin
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (!payment) {
    return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
  }

  // If already approved, return immediately
  if (payment.status === 'approved') {
    return NextResponse.json({
      status: 'approved',
      paid_at: payment.paid_at,
    });
  }

  // If has mercadopago_id, check with Mercado Pago
  if (payment.mercadopago_id) {
    try {
      const mpStatus = await getPaymentStatus(payment.mercadopago_id);

      if (mpStatus.status === 'approved' && payment.status !== 'approved') {
        // Get duration setting
        const { data: durationSetting } = await admin
          .from('app_settings')
          .select('value')
          .eq('key', 'premium_duration_days')
          .single();

        const durationDays = parseInt(durationSetting?.value || '7');
        const premiumExpires = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        // Update payment
        await admin
          .from('payments')
          .update({
            status: 'approved',
            paid_at: mpStatus.paid_at || new Date().toISOString(),
          })
          .eq('id', paymentId);

        // Create premium access
        await admin.from('premium_access').insert({
          device_id: payment.device_id,
          payment_id: paymentId,
          expires_at: premiumExpires.toISOString(),
        });

        return NextResponse.json({
          status: 'approved',
          paid_at: mpStatus.paid_at,
          premium_expires_at: premiumExpires.toISOString(),
        });
      }

      // Update status if changed
      if (mpStatus.status !== payment.status) {
        await admin
          .from('payments')
          .update({ status: mpStatus.status })
          .eq('id', paymentId);
      }

      return NextResponse.json({ status: mpStatus.status });
    } catch (error) {
      // If MP check fails, return our last known status
      return NextResponse.json({ status: payment.status });
    }
  }

  return NextResponse.json({ status: payment.status });
}
