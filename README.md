# 🎉 Guia Paracuru - Carnaval 2026

App completo para centralizar informações úteis sobre o Carnaval de Paracuru para turistas.

## ✨ Funcionalidades

### Público (sem login)
- **Home** com notícias, atrações, destaques e contatos de emergência
- **Programação** do carnaval por dia (premium exibe programação completa)
- **Notícias** com categorias e detalhes
- **Estabelecimentos** (bares, restaurantes, hotéis, etc.)
- **Contatos** de emergência (hospital, polícia, bombeiros)
- **Táxi / Mototáxi** (lista completa é premium)

### Premium (pago via Pix)
- Programação detalhada completa
- Lista completa de táxis e mototáxis
- Estabelecimentos parceiros em destaque
- Sem login necessário — acesso salvo no navegador

### Admin (login com senha)
- CRUD completo: atrações, notícias, estabelecimentos, contatos, transporte
- Upload de imagens via Supabase Storage
- Configurações do app (preço premium, datas, textos)

---

## 🛠️ Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes + Supabase
- **Banco**: Supabase (PostgreSQL)
- **Pagamentos**: Mercado Pago Pix
- **State**: Zustand
- **Deploy**: Antigravity (ou Vercel)

---

## 🚀 Setup

### 1. Clone e instale

```bash
git clone <repo>
cd guia-paracuru
npm install
```

### 2. Configure o Supabase

1. Crie um projeto no [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Copie as credenciais do projeto

### 3. Configure o Mercado Pago

1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Obtenha o **Access Token** (produção)
4. Configure o **Webhook** para: `https://seu-dominio.com/api/payments/webhook`
   - Selecione: `payment` como tipo de notificação

### 4. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx

ADMIN_SECRET_KEY=sua_senha_admin_aqui

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Rode

```bash
npm run dev
```

- **App público**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

---

## 📁 Estrutura

```
src/
├── app/
│   ├── (public)/          # Páginas públicas (com bottom nav)
│   │   ├── page.tsx       # Home
│   │   ├── programacao/   # Programação do carnaval
│   │   ├── noticias/      # Listagem e detalhe de notícias
│   │   ├── mapa/          # Estabelecimentos
│   │   └── contatos/      # Contatos de emergência + transporte
│   ├── admin/             # Painel administrativo
│   │   ├── login/
│   │   ├── atracoes/
│   │   ├── noticias/
│   │   ├── estabelecimentos/
│   │   ├── contatos/
│   │   ├── transporte/
│   │   └── configuracoes/
│   └── api/               # API Routes
│       ├── auth/
│       ├── attractions/
│       ├── businesses/
│       ├── contacts/
│       ├── news/
│       ├── payments/
│       │   └── webhook/
│       ├── schedule/
│       └── upload/
├── components/
│   ├── admin/             # Componentes do admin
│   ├── payment/           # Modal de pagamento Pix
│   └── public/            # Componentes públicos (PremiumGate)
├── hooks/
│   ├── useCrud.ts         # Hook genérico para CRUD
│   └── useStore.ts        # Zustand stores
├── lib/
│   ├── admin-auth.ts      # Autenticação admin
│   ├── mercadopago.ts     # Integração Mercado Pago
│   ├── premium.ts         # Controle de acesso premium (localStorage)
│   ├── supabase.ts        # Cliente Supabase
│   └── utils.ts           # Utilitários
├── types/
│   └── index.ts           # TypeScript types
└── supabase/
    └── schema.sql         # Schema do banco de dados
```

---

## 💰 Fluxo de Pagamento Premium

1. Usuário tenta acessar conteúdo premium
2. Modal aparece com preço e benefícios
3. Usuário clica em "Pagar com Pix"
4. API cria cobrança no Mercado Pago
5. QR Code Pix é exibido + opção de copiar código
6. App faz polling a cada 3s para verificar pagamento
7. Webhook do MP também notifica a API
8. Ao confirmar: acesso salvo no `localStorage` do navegador
9. Acesso válido por 7 dias (configurável)

---

## 🔒 Segurança

- Admin usa senha + token de sessão (cookie httpOnly)
- RLS (Row Level Security) no Supabase
- Service Role Key só no servidor (API Routes)
- Pagamentos verificados via API do Mercado Pago
- Sem dados sensíveis no frontend
