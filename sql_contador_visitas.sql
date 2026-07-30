-- RankingWikiClub: contador global de visitas
-- Execute este arquivo uma única vez no SQL Editor do Supabase.

create table if not exists public.contador_visitas (
  id smallint primary key default 1 check (id = 1),
  total bigint not null default 0 check (total >= 0),
  atualizado_em timestamptz not null default now()
);

insert into public.contador_visitas (id, total)
values (1, 0)
on conflict (id) do nothing;

alter table public.contador_visitas enable row level security;

revoke all on table public.contador_visitas from anon, authenticated;
grant select on table public.contador_visitas to anon, authenticated;

create policy "contador_visitas_leitura_publica"
on public.contador_visitas
for select
to anon, authenticated
using (id = 1);

create or replace function public.registrar_visita_futpedia()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_total bigint;
begin
  update public.contador_visitas
     set total = total + 1,
         atualizado_em = now()
   where id = 1
   returning total into novo_total;

  if novo_total is null then
    insert into public.contador_visitas (id, total)
    values (1, 1)
    returning total into novo_total;
  end if;

  return novo_total;
end;
$$;

revoke all on function public.registrar_visita_futpedia() from public;
grant execute on function public.registrar_visita_futpedia() to anon, authenticated;
