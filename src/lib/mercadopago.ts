// Mercado Pago Pix Payment Integration
// Uses REST API directly for better control

const MERCADOPAGO_API = 'https://api.mercadopago.com';

interface PixPaymentRequest {
  amount: number;
  description: string;
  external_reference: string; // our payment ID
  payer_email?: string;
}

interface PixPaymentResponse {
  id: number;
  status: string;
  point_of_interaction: {
    transaction_data: {
      qr_code: string;
      qr_code_base64: string;
      ticket_url: string;
    };
  };
  date_of_expiration: string;
}

// Create a Pix payment
export async function createPixPayment(data: PixPaymentRequest): Promise<PixPaymentResponse> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error('Mercado Pago access token not configured');

  const response = await fetch(`${MERCADOPAGO_API}/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-Idempotency-Key': data.external_reference,
    },
    body: JSON.stringify({
      transaction_amount: data.amount,
      description: data.description,
      payment_method_id: 'pix',
      payer: {
        email: data.payer_email || 'cliente@guiaparacuru.com.br',
        first_name: 'Cliente',
        last_name: 'Guia Paracuru',
        identification: {
          type: 'CPF',
          number: '00000000000',
        },
      },
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      external_reference: data.external_reference,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Mercado Pago error:', error);
    throw new Error(`Payment creation failed: ${error.message || response.statusText}`);
  }

  return response.json();
}

// Check payment status
export async function getPaymentStatus(paymentId: string): Promise<{ status: string; paid_at: string | null }> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error('Mercado Pago access token not configured');

  const response = await fetch(`${MERCADOPAGO_API}/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch payment status');
  }

  const data = await response.json();
  return {
    status: data.status,
    paid_at: data.date_approved || null,
  };
}
