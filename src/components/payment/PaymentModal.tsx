'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, QrCode, Clock, CheckCircle2, Loader2, Copy, AlertCircle, Lock, MapPin, Calendar, Store, Newspaper, Shield, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/hooks/useStore';
import { getDeviceId, savePremiumAccess } from '@/lib/premium';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

type PaymentStep = 'intro' | 'loading' | 'qrcode' | 'checking' | 'success' | 'error';

export default function PaymentModal() {
  const { closePaymentModal, setIsPremium } = useAppStore();
  const [step, setStep] = useState<PaymentStep>('intro');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!paymentData?.expires_at) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, new Date(paymentData.expires_at).getTime() - Date.now());
      setTimeLeft(Math.floor(diff / 1000));
      if (diff <= 0) { setStep('error'); setError('Tempo expirado. Tente novamente.'); clearInterval(interval); }
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentData?.expires_at]);

  useEffect(() => {
    if (step !== 'qrcode' && step !== 'checking') return;
    if (!paymentData?.payment_id) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments?id=${paymentData.payment_id}`);
        const data = await res.json();
        if (data.status === 'approved') {
          clearInterval(poll);
          savePremiumAccess(paymentData.payment_id, data.premium_expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
          setIsPremium(true); setStep('success'); toast.success('Pagamento confirmado!');
        }
      } catch { }
    }, 3000);
    return () => clearInterval(poll);
  }, [step, paymentData?.payment_id, setIsPremium]);

  const createPayment = useCallback(async () => {
    setStep('loading'); setError('');
    try {
      const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ device_id: getDeviceId() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPaymentData(data); setStep('qrcode');
    } catch (e: any) { setError(e.message || 'Erro ao criar pagamento'); setStep('error'); }
  }, []);

  const copyPixCode = useCallback(() => {
    if (paymentData?.qr_code) { navigator.clipboard.writeText(paymentData.qr_code); toast.success('Código Pix copiado!'); }
  }, [paymentData?.qr_code]);

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const benefits = [
    { icon: MapPin, text: 'Mapa interativo completo' },
    { icon: Newspaper, text: 'Todas as notícias e atualizações' },
    { icon: Calendar, text: 'Programação dos blocos e bares' },
    { icon: Store, text: 'Todos os locais que você precisa durante o carnaval' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closePaymentModal} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row">
        <button
          onClick={closePaymentModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/5 text-surface-500 hover:bg-black/10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side - Advantages (Always Visible) */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center relative overflow-hidden">

          <div className="mb-8">
            <h2 className="font-display text-2xl text-surface-900 mb-2">Acesso Premium</h2>
            <p className="text-surface-500 text-sm">Desbloqueie todas as funcionalidades do Guia Oficial do Carnaval de Paracuru 2026.</p>
          </div>

          <div className="space-y-4">
            {benefits.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 p-1 rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={14} />
                </div>
                <span className="text-surface-700 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Payment Action */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center min-h-[400px]">
          {step === 'intro' && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="py-8">
                <p className="text-surface-500 font-medium mb-2">Valor único de</p>
                <div className="flex items-center justify-center gap-1 text-surface-900">
                  <span className="text-2xl font-medium text-surface-400">R$</span>
                  <span className="text-5xl font-display font-bold text-green-600 tracking-tight">1,99</span>
                </div>
                <p className="text-xs text-surface-400 mt-2 bg-surface-100 inline-block px-3 py-1 rounded-full">
                  Válido por todo o carnaval
                </p>
              </div>

              <button
                onClick={createPayment}
                className="w-3/4 mx-auto py-3 rounded-xl bg-green-600 text-white font-bold text-base hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Gerar Código Pix</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 opacity-50 grayscale">
                <p className="text-[10px] text-surface-400">Processado via <strong>Mercado Pago</strong></p>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="relative mx-auto w-16 h-16">
                <Loader2 size={64} className="animate-spin text-green-600 opacity-20 absolute inset-0" />
                <Loader2 size={64} className="animate-spin text-green-600 absolute inset-0" strokeWidth={1} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <p className="text-surface-500 font-medium">Gerando seu QR Code...</p>
            </div>
          )}

          {step === 'qrcode' && paymentData && (
            <div className="text-center space-y-6 animate-fade-in">
              <div>
                <h3 className="text-surface-900 font-bold text-xl">Escaneie para pagar</h3>
                <div className="flex items-center justify-center gap-1.5 mt-1 text-sm text-orange-600 font-medium">
                  <Clock size={14} />
                  <span>Expira em {fmtTime(timeLeft)}</span>
                </div>
              </div>

              <div className="inline-block p-4 bg-white rounded-2xl border-2 border-surface-100 shadow-sm">
                {paymentData.qr_code_base64 ?
                  <img src={`data:image/png;base64,${paymentData.qr_code_base64}`} alt="QR Code Pix" className="w-48 h-48 mix-blend-multiply" /> :
                  <div className="w-48 h-48 flex items-center justify-center text-surface-300"><QrCode size={80} /></div>
                }
              </div>

              <button
                onClick={copyPixCode}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-surface-100 text-surface-900 hover:bg-surface-200 font-bold transition-colors"
              >
                <Copy size={18} />
                Copiar código Pix
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-surface-400">
                <Loader2 size={12} className="animate-spin text-green-600" />
                Aguardando confirmação automática...
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-short">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h2 className="font-display text-2xl text-surface-900">Pagamento Confirmado!</h2>
                <p className="text-surface-500 mt-2">Você agora é Premium. Aproveite!</p>
              </div>
              <button
                onClick={closePaymentModal}
                className="w-full py-4 rounded-xl bg-surface-900 text-white font-bold shadow-lg hover:bg-black active:scale-[0.98] transition-all"
              >
                Acessar Conteúdo
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8 space-y-6 animate-fade-in">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} />
              </div>
              <div>
                <h2 className="font-display text-xl text-surface-900">Algo deu errado</h2>
                <p className="text-surface-500 mt-2 text-sm max-w-[200px] mx-auto">{error}</p>
              </div>
              <button
                onClick={() => setStep('intro')}
                className="w-full py-3.5 rounded-xl bg-surface-100 text-surface-900 font-bold hover:bg-surface-200 transition-all"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}
