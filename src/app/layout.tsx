import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://guiaparacuru.com.br'),
  title: 'Guia Paracuru - Carnaval 2026',
  description: 'Seu guia completo para o Carnaval de Paracuru 2026',
  keywords: ['Paracuru', 'Carnaval', 'Ceará', 'Turismo', 'Eventos'],
  authors: [{ name: 'Guia Paracuru' }],
  openGraph: {
    title: 'Guia Paracuru - Carnaval 2026',
    description: 'Seu guia completo para o Carnaval de Paracuru 2026',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fcmcccohjoizjvkkauhz.supabase.co" />
        <link rel="preconnect" href="https://www.transparenttextures.com" />
      </head>
      <body className={inter.variable}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
            },
          }}
        />
      </body>
    </html>
  );
}
