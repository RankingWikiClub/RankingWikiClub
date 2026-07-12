-- CORREÇÃO DEFINITIVA DE CAMPEÕES E VICES
-- Cria uma tabela nova, independente da tabela antiga public.titulos.
-- Todos os IDs são TEXT, permitindo IDs numéricos e alfanuméricos.

BEGIN;

CREATE TABLE IF NOT EXISTS public.titulos_futpedia (
  id text PRIMARY KEY,
  ano text NOT NULL,
  competicao_id text NOT NULL,
  competicao_nome text,
  abrangencia text,
  campeao_id text NOT NULL,
  campeao_nome text,
  campeao_tipo text NOT NULL DEFAULT 'clube',
  vice_id text NOT NULL,
  vice_nome text,
  vice_tipo text NOT NULL DEFAULT 'clube',
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT titulos_futpedia_campeao_tipo_check
    CHECK (campeao_tipo IN ('clube', 'selecao')),

  CONSTRAINT titulos_futpedia_vice_tipo_check
    CHECK (vice_tipo IN ('clube', 'selecao'))
);

CREATE INDEX IF NOT EXISTS idx_titulos_futpedia_competicao
  ON public.titulos_futpedia (competicao_id);

CREATE INDEX IF NOT EXISTS idx_titulos_futpedia_campeao
  ON public.titulos_futpedia (campeao_tipo, campeao_id);

CREATE INDEX IF NOT EXISTS idx_titulos_futpedia_vice
  ON public.titulos_futpedia (vice_tipo, vice_id);

ALTER TABLE public.titulos_futpedia ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública títulos FutPédia"
  ON public.titulos_futpedia;
CREATE POLICY "Leitura pública títulos FutPédia"
ON public.titulos_futpedia
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Inserção pública títulos FutPédia"
  ON public.titulos_futpedia;
CREATE POLICY "Inserção pública títulos FutPédia"
ON public.titulos_futpedia
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Atualização pública títulos FutPédia"
  ON public.titulos_futpedia;
CREATE POLICY "Atualização pública títulos FutPédia"
ON public.titulos_futpedia
FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Exclusão pública títulos FutPédia"
  ON public.titulos_futpedia;
CREATE POLICY "Exclusão pública títulos FutPédia"
ON public.titulos_futpedia
FOR DELETE
USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.titulos_futpedia
TO anon, authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';

SELECT
  id,
  ano,
  competicao_id,
  competicao_nome,
  campeao_id,
  campeao_nome,
  campeao_tipo,
  vice_id,
  vice_nome,
  vice_tipo,
  atualizado_em
FROM public.titulos_futpedia
ORDER BY atualizado_em DESC;
