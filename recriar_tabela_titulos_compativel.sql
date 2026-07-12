
-- CORREÇÃO FINAL DA TABELA DE CAMPEÕES E VICES
-- Padroniza a tabela para funcionar com clubes e seleções.
-- Preserva a tabela antiga como public.titulos_backup_futpedia.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.titulos') IS NOT NULL
     AND to_regclass('public.titulos_backup_futpedia') IS NULL THEN
    ALTER TABLE public.titulos RENAME TO titulos_backup_futpedia;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.titulos (
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
  CONSTRAINT titulos_campeao_tipo_check
    CHECK (campeao_tipo IN ('clube', 'selecao')),
  CONSTRAINT titulos_vice_tipo_check
    CHECK (vice_tipo IN ('clube', 'selecao'))
);

-- Tenta importar os dados da tabela antiga, quando as colunas principais existem.
DO $$
DECLARE
  possui_colunas boolean;
BEGIN
  IF to_regclass('public.titulos_backup_futpedia') IS NULL THEN
    RETURN;
  END IF;

  SELECT
    COUNT(*) = 5
  INTO possui_colunas
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'titulos_backup_futpedia'
    AND column_name IN ('id', 'ano', 'competicao_id', 'campeao_id', 'vice_id');

  IF possui_colunas THEN
    EXECUTE $sql$
      INSERT INTO public.titulos (
        id,
        ano,
        competicao_id,
        campeao_id,
        vice_id
      )
      SELECT
        id::text,
        COALESCE(ano::text, ''),
        competicao_id::text,
        campeao_id::text,
        vice_id::text
      FROM public.titulos_backup_futpedia
      WHERE id IS NOT NULL
        AND competicao_id IS NOT NULL
        AND campeao_id IS NOT NULL
        AND vice_id IS NOT NULL
      ON CONFLICT (id) DO NOTHING
    $sql$;
  END IF;
END $$;

-- Preenche nomes das competições em registros importados.
UPDATE public.titulos t
SET competicao_nome = c.nome
FROM public.competicoes c
WHERE c.id::text = t.competicao_id
  AND COALESCE(btrim(t.competicao_nome), '') = '';

-- Preenche nomes de clubes.
UPDATE public.titulos t
SET campeao_nome = COALESCE(tm.nome_curto, tm.nome)
FROM public.times tm
WHERE tm.id::text = t.campeao_id
  AND t.campeao_tipo = 'clube'
  AND COALESCE(btrim(t.campeao_nome), '') = '';

UPDATE public.titulos t
SET vice_nome = COALESCE(tm.nome_curto, tm.nome)
FROM public.times tm
WHERE tm.id::text = t.vice_id
  AND t.vice_tipo = 'clube'
  AND COALESCE(btrim(t.vice_nome), '') = '';

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
  vice_tipo
FROM public.titulos
ORDER BY ano DESC;
