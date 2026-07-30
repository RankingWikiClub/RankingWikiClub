-- RankingWikiClub: contador global de visitas (versão corrigida e reutilizável)
-- Execute TODO este arquivo no SQL Editor do Supabase.
-- Ele pode ser executado novamente sem falhar por política já existente.

create table if not exists public.contador_visitas (
  id smallint primary key default 1 check (id = 1),
  total bigint not null default 0 check (total >= 0),
  atualizado_em timestamptz not null default now()
);

insert into public.contador_visitas (id, total)
values (1, 0)
on conflict (id) do nothing;

alter table public.contador_visitas enable row level security;

drop policy if exists "contador_visitas_leitura_publica" on public.contador_visitas;
create policy "contador_visitas_leitura_publica"
on public.contador_visitas
for select
to anon, authenticated
using (id = 1);

grant usage on schema public to anon, authenticated;
grant select on table public.contador_visitas to anon, authenticated;

create or replace function public.registrar_visita_rankingwikiclub()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_total bigint;
begin
  insert into public.contador_visitas (id, total, atualizado_em)
  values (1, 1, now())
  on conflict (id) do update
    set total = public.contador_visitas.total + 1,
        atualizado_em = now()
  returning total into novo_total;

  return novo_total;
end;
$$;

-- Compatibilidade com versões anteriores do site.
create or replace function public.registrar_visita_futpedia()
returns bigint
language sql
security definer
set search_path = public
as $$
  select public.registrar_visita_rankingwikiclub();
$$;

revoke all on function public.registrar_visita_rankingwikiclub() from public;
revoke all on function public.registrar_visita_futpedia() from public;
grant execute on function public.registrar_visita_rankingwikiclub() to anon, authenticated;
grant execute on function public.registrar_visita_futpedia() to anon, authenticated;

-- Força o PostgREST a atualizar o cache das funções imediatamente.
notify pgrst, 'reload schema';
