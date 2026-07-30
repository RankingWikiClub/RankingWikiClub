
-- Tabela de campeões e vices do RankingWikiClub
-- Execute no SQL Editor do Supabase.

CREATE TABLE IF NOT EXISTS public.titulos (
  id text PRIMARY KEY,
  ano text NOT NULL,
  competicao_id bigint NOT NULL,
  competicao_nome text,
  abrangencia text,
  campeao_id bigint NOT NULL,
  campeao_nome text,
  campeao_tipo text NOT NULL DEFAULT 'clube'
    CHECK (campeao_tipo IN ('clube', 'selecao')),
  vice_id bigint NOT NULL,
  vice_nome text,
  vice_tipo text NOT NULL DEFAULT 'clube'
    CHECK (vice_tipo IN ('clube', 'selecao')),
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_titulos_competicao_id
  ON public.titulos (competicao_id);

CREATE INDEX IF NOT EXISTS idx_titulos_campeao
  ON public.titulos (campeao_tipo, campeao_id);

CREATE INDEX IF NOT EXISTS idx_titulos_vice
  ON public.titulos (vice_tipo, vice_id);

ALTER TABLE public.titulos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de títulos" ON public.titulos;
CREATE POLICY "Leitura pública de títulos"
ON public.titulos
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Inserção pública de títulos" ON public.titulos;
CREATE POLICY "Inserção pública de títulos"
ON public.titulos
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Atualização pública de títulos" ON public.titulos;
CREATE POLICY "Atualização pública de títulos"
ON public.titulos
FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Exclusão pública de títulos" ON public.titulos;
CREATE POLICY "Exclusão pública de títulos"
ON public.titulos
FOR DELETE
USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.titulos
TO anon, authenticated;

NOTIFY pgrst, 'reload schema';

SELECT id, ano, competicao_nome, campeao_nome, vice_nome
FROM public.titulos
ORDER BY ano DESC;
