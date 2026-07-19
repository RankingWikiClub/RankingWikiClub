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
    atualizado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.titulos_futpedia
    DROP CONSTRAINT IF EXISTS titulos_futpedia_campeao_tipo_check,
    DROP CONSTRAINT IF EXISTS titulos_futpedia_vice_tipo_check;

ALTER TABLE public.titulos_futpedia
    ADD CONSTRAINT titulos_futpedia_campeao_tipo_check
        CHECK (campeao_tipo IN ('clube', 'selecao')),
    ADD CONSTRAINT titulos_futpedia_vice_tipo_check
        CHECK (vice_tipo IN ('clube', 'selecao'));

CREATE INDEX IF NOT EXISTS idx_titulos_futpedia_competicao
    ON public.titulos_futpedia (competicao_id);

CREATE INDEX IF NOT EXISTS idx_titulos_futpedia_campeao
    ON public.titulos_futpedia (campeao_tipo, campeao_id);

CREATE INDEX IF NOT EXISTS idx_titulos_futpedia_vice
    ON public.titulos_futpedia (vice_tipo, vice_id);

ALTER TABLE public.titulos_futpedia ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "titulos_futpedia_select" ON public.titulos_futpedia;
CREATE POLICY "titulos_futpedia_select"
ON public.titulos_futpedia FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "titulos_futpedia_insert" ON public.titulos_futpedia;
CREATE POLICY "titulos_futpedia_insert"
ON public.titulos_futpedia FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "titulos_futpedia_update" ON public.titulos_futpedia;
CREATE POLICY "titulos_futpedia_update"
ON public.titulos_futpedia FOR UPDATE TO anon, authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "titulos_futpedia_delete" ON public.titulos_futpedia;
CREATE POLICY "titulos_futpedia_delete"
ON public.titulos_futpedia FOR DELETE TO anon, authenticated
USING (true);

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.titulos_futpedia
TO anon, authenticated;

COMMIT;

NOTIFY pgrst, 'reload schema';

SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'titulos_futpedia';
