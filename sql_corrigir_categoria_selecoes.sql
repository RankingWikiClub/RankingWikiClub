-- FutPedia - Corrigir categoria das competições de seleções
-- Execute no Supabase SQL Editor para padronizar as competições de seleções.

UPDATE public.competicoes
SET categoria = 'selecao'
WHERE
  lower(unaccent(coalesce(categoria, ''))) LIKE '%selec%'
  OR lower(unaccent(coalesce(tipo, ''))) LIKE '%selec%'
  OR lower(unaccent(coalesce(nome, ''))) LIKE '%copa do mundo%'
  OR lower(unaccent(coalesce(nome, ''))) LIKE '%eurocopa%'
  OR lower(unaccent(coalesce(nome, ''))) LIKE '%copa america%'
  OR lower(unaccent(coalesce(nome, ''))) LIKE '%copa das nacoes%'
  OR lower(unaccent(coalesce(nome, ''))) LIKE '%nations league%';

-- Se a extensão unaccent não existir, use este bloco alternativo:
-- UPDATE public.competicoes
-- SET categoria = 'selecao'
-- WHERE categoria ILIKE '%sele%' OR tipo ILIKE '%sele%' OR nome ILIKE '%Copa do Mundo%' OR nome ILIKE '%Eurocopa%' OR nome ILIKE '%Copa América%';

SELECT id, nome, tipo, categoria
FROM public.competicoes
WHERE categoria = 'selecao'
ORDER BY nome;
