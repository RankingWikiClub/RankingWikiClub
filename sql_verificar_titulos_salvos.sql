-- Execute após editar campeão e vice no site.
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
FROM public.titulos
ORDER BY atualizado_em DESC NULLS LAST, ano DESC;
