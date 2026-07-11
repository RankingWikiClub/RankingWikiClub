-- Atualiza os nomes sem modificar os IDs ou vínculos.
BEGIN;

UPDATE public.paises
SET nome = 'Países Baixos'
WHERE lower(nome) IN (
  lower('Holanda'),
  lower('Netherlands'),
  lower('The Netherlands'),
  lower('Países Baixos')
);

UPDATE public.paises
SET nome = 'Tchéquia'
WHERE lower(nome) IN (
  lower('República Tcheca'),
  lower('Czech Republic'),
  lower('Czechia'),
  lower('Chéquia'),
  lower('Tchéquia')
);

UPDATE public.paises
SET nome = 'País de Gales'
WHERE lower(nome) IN (
  lower('Gales'),
  lower('Wales'),
  lower('País de Gales')
);

UPDATE public.paises
SET nome = 'Moldávia'
WHERE lower(nome) IN (
  lower('Moldova'),
  lower('Republic of Moldova'),
  lower('Moldávia')
);

UPDATE public.paises
SET nome = 'Macedônia do Norte'
WHERE lower(nome) IN (
  lower('Macedonia'),
  lower('North Macedonia'),
  lower('Macedônia do Norte')
);

COMMIT;

SELECT id, nome
FROM public.paises
ORDER BY nome;
