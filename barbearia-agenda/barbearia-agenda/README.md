# Barbearia Agenda

Sistema de agendamento para barbeiros (multi-tenant). Cada barbeiro tem um link
público que seus clientes usam para marcar horário.

## Stack

- **Next.js 14** (App Router) — frontend + API
- **Supabase** (PostgreSQL + Auth + RLS) — banco e segurança

## Como rodar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Supabase](https://supabase.com) e rode o `schema.sql`
   (SQL Editor → New query → cole o conteúdo → Run).

3. Copie `.env.local.example` para `.env.local` e preencha com suas chaves
   (Supabase → Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

4. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Insira um barbeiro e um serviço de teste na mão (Supabase → Table Editor) e
   acesse `http://localhost:3000/agendar/SEU-SLUG`.

## Estrutura

```
app/
  agendar/[slug]/page.js     página pública de agendamento (cliente)
  api/barber/[slug]/route.js  busca barbeiro + serviços
  api/appointments/route.js   cria o agendamento
lib/
  supabaseAdmin.js            conexão servidor (service_role)
schema.sql                    banco de dados
```

## Próximos passos

- [ ] Gerar horários livres a partir da tabela `availability`
- [ ] Notificação no WhatsApp para o barbeiro
- [ ] Autenticação e painel do barbeiro
- [ ] Cobrança recorrente (Asaas)

## ⚠️ Segurança

Nunca suba o arquivo `.env.local` para o GitHub. Ele contém a chave
`service_role`, que dá acesso total ao banco. O `.gitignore` já bloqueia isso.
