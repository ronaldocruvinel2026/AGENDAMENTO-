-- =============================================
-- SCHEMA: Agendamento para barbeiros (multi-tenant)
-- Cole isto no Supabase: SQL Editor -> New query -> Run
-- =============================================

-- 1. BARBEIROS
create table barbers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  name text not null,
  slug text not null unique,          -- usado no link público: /agendar/joao-barbearia
  phone text,                          -- WhatsApp do barbeiro (pra receber notificações)
  created_at timestamptz default now()
);

-- 2. SERVIÇOS (corte, barba, etc.)
create table services (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id) on delete cascade not null,
  name text not null,
  price numeric(10,2) not null,
  duration_minutes int not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- 3. DISPONIBILIDADE (weekday: 0=domingo ... 6=sábado)
create table availability (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id) on delete cascade not null,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now()
);

-- 4. CLIENTES (sem login — só nome e telefone)
create table clients (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id) on delete cascade not null,
  name text not null,
  phone text not null,
  created_at timestamptz default now()
);

-- 5. AGENDAMENTOS
create table appointments (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  service_id uuid references services(id) not null,
  scheduled_at timestamptz not null,
  status text not null default 'confirmed',  -- confirmed | cancelled | done
  created_at timestamptz default now(),

  -- TRAVA DE CONCORRÊNCIA: impede dois cortes no mesmo horário
  unique (barber_id, scheduled_at)
);

-- =============================================
-- SEGURANÇA (Row Level Security)
-- =============================================
alter table barbers      enable row level security;
alter table services     enable row level security;
alter table availability enable row level security;
alter table clients      enable row level security;
alter table appointments enable row level security;

create policy "barbeiro vê a si mesmo"
  on barbers for all
  using (user_id = auth.uid());

create policy "serviços do próprio barbeiro"
  on services for all
  using (barber_id in (select id from barbers where user_id = auth.uid()));

create policy "disponibilidade do próprio barbeiro"
  on availability for all
  using (barber_id in (select id from barbers where user_id = auth.uid()));

create policy "clientes do próprio barbeiro"
  on clients for all
  using (barber_id in (select id from barbers where user_id = auth.uid()));

create policy "agendamentos do próprio barbeiro"
  on appointments for all
  using (barber_id in (select id from barbers where user_id = auth.uid()));
