-- ============================================================
-- CRUCIAL FINANCIAL — Schema Inicial
-- Execute este SQL no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensão UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELA: categories
-- ============================================================
create table if not exists categories (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('RECEITA', 'DESPESA')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_categories_user_id on categories(user_id);

-- RLS
alter table categories enable row level security;

create policy "Users can manage their own categories"
  on categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- TABELA: transactions
-- ============================================================
create table if not exists transactions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  date          date not null,
  description   text not null,
  category_id   uuid references categories(id) on delete set null,
  type          text not null check (type in ('RECEITA', 'DESPESA')),
  vertente      text not null check (vertente in ('GERAL', 'SERVICO', 'INFOPRODUTO')),
  value_bruto   numeric(15, 2) not null default 0,
  tax_rate      numeric(6, 2) not null default 0,
  tax_value     numeric(15, 2) not null default 0,
  value_liquido numeric(15, 2) not null default 0,
  value_total   numeric(15, 2) not null default 0,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_transactions_user_id on transactions(user_id);
create index if not exists idx_transactions_date    on transactions(date desc);
create index if not exists idx_transactions_vertente on transactions(vertente);
create index if not exists idx_transactions_type    on transactions(type);

-- RLS
alter table transactions enable row level security;

create policy "Users can manage their own transactions"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger transactions_updated_at
  before update on transactions
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- TABELA: vertente_config
-- Armazena a alíquota de imposto padrão por vertente/usuário
-- ============================================================
create table if not exists vertente_config (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  vertente   text not null check (vertente in ('GERAL', 'SERVICO', 'INFOPRODUTO')),
  tax_rate   numeric(6, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, vertente)
);

alter table vertente_config enable row level security;

create policy "Users can manage their own vertente configs"
  on vertente_config for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger vertente_config_updated_at
  before update on vertente_config
  for each row execute procedure update_updated_at_column();

-- ============================================================
-- TABELA: monthly_data
-- Armazena dados isolados por mês (pró-labore, saldo inicial)
-- ============================================================
create table if not exists monthly_data (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  year          integer not null,
  month         integer not null check (month between 1 and 12),
  pro_labore    numeric(15, 2) not null default 0,
  saldo_inicial numeric(15, 2) not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(user_id, year, month)
);

alter table monthly_data enable row level security;

create policy "Users can manage their own monthly data"
  on monthly_data for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger monthly_data_updated_at
  before update on monthly_data
  for each row execute procedure update_updated_at_column();
