# FutPédia - Edições de Competições ajustadas

Atualização aplicada na página **Edições > Editar Competições**:

- Em **Competições de clubes**, a abrangência agora possui:
  - Mundo
  - Continente
  - País
- **Mundo** exibe competições mundiais de clubes.
- **Continente** exibe competições internacionais/continentais cadastradas.
- **País** exibe a lista de países cadastrados e filtra competições do país selecionado.
- A lógica de **Competições de seleções** foi mantida conforme a versão anterior.

## Sincronização dos dados entre computador e celular

Nesta versão, a conexão do Supabase foi ajustada para sincronizar o banco local do FutPédia com uma tabela única no Supabase. Assim, computador e celular passam a consultar a mesma base de dados.

Execute este SQL uma única vez no Supabase, em SQL Editor:

```sql
create table if not exists futpedia_dados (
  id text primary key,
  dados jsonb not null,
  atualizado_em timestamptz default now()
);

alter table futpedia_dados enable row level security;

drop policy if exists "futpedia_dados leitura publica" on futpedia_dados;
create policy "futpedia_dados leitura publica"
on futpedia_dados for select
using (true);

drop policy if exists "futpedia_dados escrita autenticada" on futpedia_dados;
create policy "futpedia_dados escrita autenticada"
on futpedia_dados for all
to authenticated
using (true)
with check (true);
```

Depois de publicar esta versão, faça login como administrador no computador onde estão os dados completos. O sistema enviará os dados para o Supabase. Em seguida, ao abrir no celular, ele carregará os mesmos dados da nuvem.
