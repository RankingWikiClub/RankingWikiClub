-- OPCIONAL: copie registros antigos da tabela public.titulos.
-- Execute somente depois de criar public.titulos_futpedia.

INSERT INTO public.titulos_futpedia (
  id,
  ano,
  competicao_id,
  competicao_nome,
  abrangencia,
  campeao_id,
  campeao_nome,
  campeao_tipo,
  vice_id,
  vice_nome,
  vice_tipo
)
SELECT
  t.id::text,
  COALESCE(t.ano::text, ''),
  t.competicao_id::text,
  c.nome,
  NULL,
  t.campeao_id::text,
  COALESCE(tc.nome_curto, tc.nome),
  'clube',
  t.vice_id::text,
  COALESCE(tv.nome_curto, tv.nome),
  'clube'
FROM public.titulos t
LEFT JOIN public.competicoes c
  ON c.id::text = t.competicao_id::text
LEFT JOIN public.times tc
  ON tc.id::text = t.campeao_id::text
LEFT JOIN public.times tv
  ON tv.id::text = t.vice_id::text
WHERE t.id IS NOT NULL
  AND t.competicao_id IS NOT NULL
  AND t.campeao_id IS NOT NULL
  AND t.vice_id IS NOT NULL
ON CONFLICT (id) DO NOTHING;
