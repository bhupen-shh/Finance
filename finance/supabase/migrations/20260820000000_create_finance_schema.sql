-- Finance data model. Supabase Auth owns users in auth.users.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_blank check (length(btrim(name)) > 0),
  constraint categories_id_user_key unique (id, user_id),
  constraint categories_user_name_key unique (user_id, name)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null,
  category_id uuid not null,
  payment_method text not null,
  date date not null,
  type text not null default 'one-time',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expenses_title_not_blank check (length(btrim(title)) > 0),
  constraint expenses_amount_nonnegative check (amount >= 0),
  constraint expenses_payment_method_check check (payment_method in ('Cash', 'UPI', 'Card', 'Bank')),
  constraint expenses_type_check check (type in ('one-time', 'recurring')),
  constraint expenses_category_owner_fk
    foreign key (category_id, user_id)
    references public.categories (id, user_id)
    on delete restrict
);

create index categories_user_id_idx on public.categories (user_id);
create index expenses_user_id_date_idx on public.expenses (user_id, date desc);
create index expenses_category_id_idx on public.expenses (category_id);

alter table public.categories enable row level security;
alter table public.expenses enable row level security;

create policy "Users can select their own categories"
  on public.categories for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own categories"
  on public.categories for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own categories"
  on public.categories for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own categories"
  on public.categories for delete
  using ((select auth.uid()) = user_id);

create policy "Users can select their own expenses"
  on public.expenses for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using ((select auth.uid()) = user_id);