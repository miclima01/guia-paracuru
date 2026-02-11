# 🚀 Guia de Instalação - Guia Paracuru

## Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase (https://supabase.com)
- Conta no Mercado Pago (https://mercadopago.com.br)

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá em **SQL Editor** e execute todo o conteúdo do arquivo `schema.sql`
3. Copie as credenciais:
   - Vá em **Settings** > **API**
   - Copie `Project URL` e `anon public`
   - Copie `service_role` (em Service Role - mantenha em segredo!)

## 3. Configurar Mercado Pago

1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Obtenha o **Access Token** (produção ou teste)
4. Configure o **Webhook**:
   - URL: `https://seu-dominio.com/api/payments/webhook`
   - Eventos: `payment`

## 4. Configurar variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e preencha com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxx

# Admin (escolha uma senha forte)
ADMIN_SECRET_KEY=sua_senha_admin_super_segura

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Rodar o projeto

```bash
npm run dev
```

O app estará disponível em:
- **App público**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login

## 6. Primeiro acesso ao Admin

1. Acesse http://localhost:3000/admin/login
2. Digite a senha que você configurou em `ADMIN_SECRET_KEY`
3. Você terá acesso ao painel administrativo

## 7. Deploy (Produção)

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy!

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- Antigravity
- Etc.

## Estrutura do Projeto

```
src/
├── app/
│   ├── (public)/          # Páginas públicas
│   │   ├── page.tsx       # Home
│   │   ├── programacao/   # Programação
│   │   ├── noticias/      # Notícias
│   │   ├── mapa/          # Estabelecimentos
│   │   └── contatos/      # Contatos
│   ├── admin/             # Painel admin
│   └── api/               # API Routes
├── components/            # Componentes React
├── hooks/                 # Hooks personalizados
├── lib/                   # Bibliotecas e utilitários
└── types/                 # TypeScript types
```

## Problemas Comuns

### Erro ao conectar com Supabase
- Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas
- Certifique-se de que executou o `schema.sql` no Supabase

### Erro ao fazer login no admin
- Verifique se `ADMIN_SECRET_KEY` está configurado
- A senha é case-sensitive

### Pagamento Pix não funciona
- Verifique se `MERCADOPAGO_ACCESS_TOKEN` está correto
- Em desenvolvimento, use o token de TESTE
- Configure o webhook após o deploy

## Próximos Passos

1. Acesse o admin e configure os dados iniciais:
   - Adicione atrações do carnaval
   - Crie notícias
   - Cadastre estabelecimentos
   - Configure contatos de emergência

2. Personalize:
   - Edite as cores em `tailwind.config.ts`
   - Ajuste textos em `src/app/(public)/page.tsx`
   - Configure o preço premium em **Admin > Configurações**

3. Teste o fluxo de pagamento premium
