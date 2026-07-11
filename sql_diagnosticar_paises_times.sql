-- Diagnóstico de nomes de países usados pelos clubes
-- Este arquivo não altera dados. Ele mostra clubes cujo pais_id não encontra país
-- e os nomes oficiais cadastrados na tabela public.paises.

SELECT
  t.id,
  t.nome_curto,
  t.nome,
  t.pais_id,
  p.nome AS pais_oficial
FROM public.times t
LEFT JOIN public.paises p ON p.id = t.pais_id
WHERE p.id IS NULL
ORDER BY t.nome_curto;

SELECT id, nome, sigla, continente_id
FROM public.paises
ORDER BY nome;
