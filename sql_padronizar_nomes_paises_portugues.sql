-- Padroniza os nomes dos países em português sem alterar IDs.
-- Execute no SQL Editor do Supabase.

BEGIN;

UPDATE public.paises
SET nome = 'Países Baixos'
WHERE lower(nome) IN (lower('Holanda'), lower('Netherlands'), lower('The Netherlands'), lower('Países Baixos'));

UPDATE public.paises
SET nome = 'Tchéquia'
WHERE lower(nome) IN (lower('República Tcheca'), lower('Czech Republic'), lower('Czechia'), lower('Chequia'), lower('Chéquia'), lower('Tchéquia'));

UPDATE public.paises
SET nome = 'País de Gales'
WHERE lower(nome) IN (lower('Gales'), lower('Wales'), lower('País de Gales'));

UPDATE public.paises
SET nome = 'Moldávia'
WHERE lower(nome) IN (lower('Moldova'), lower('Republic of Moldova'), lower('Moldávia'));

UPDATE public.paises
SET nome = 'Macedônia do Norte'
WHERE lower(nome) IN (lower('Macedonia'), lower('North Macedonia'), lower('Macedônia do Norte'));

UPDATE public.paises
SET nome = 'Belarus'
WHERE lower(nome) IN (lower('Bielorrússia'), lower('Belorussia'), lower('Belarus'));

UPDATE public.paises
SET nome = 'Essuatíni'
WHERE lower(nome) IN (lower('Eswatini'), lower('Swaziland'), lower('Essuatíni'));

UPDATE public.paises
SET nome = 'Mianmar'
WHERE lower(nome) IN (lower('Myanmar'), lower('Burma'), lower('Mianmar'));

UPDATE public.paises
SET nome = 'Turquia'
WHERE lower(nome) IN (lower('Turkey'), lower('Türkiye'), lower('Turquia'));

UPDATE public.paises
SET nome = 'Vaticano'
WHERE lower(nome) IN (lower('Vatican City'), lower('Cidade do Vaticano'), lower('Vaticano'));

UPDATE public.paises
SET nome = 'Estados Unidos'
WHERE lower(nome) IN (lower('United States'), lower('United States of America'), lower('USA'), lower('Estados Unidos'));

UPDATE public.paises
SET nome = 'Coreia do Norte'
WHERE lower(nome) IN (lower('North Korea'), lower('Coreia do Norte'));

UPDATE public.paises
SET nome = 'Coreia do Sul'
WHERE lower(nome) IN (lower('South Korea'), lower('Coreia do Sul'));

UPDATE public.paises
SET nome = 'Emirados Árabes Unidos'
WHERE lower(nome) IN (lower('United Arab Emirates'), lower('Emirados Árabes Unidos'));

UPDATE public.paises
SET nome = 'Costa do Marfim'
WHERE lower(nome) IN (lower('Ivory Coast'), lower('Côte d''Ivoire'), lower('Costa do Marfim'));

UPDATE public.paises
SET nome = 'República Democrática do Congo'
WHERE lower(nome) IN (lower('Democratic Republic of the Congo'), lower('DR Congo'), lower('República Democrática do Congo'));

UPDATE public.paises
SET nome = 'Irlanda'
WHERE lower(nome) IN (lower('Republic of Ireland'), lower('Irlanda'));

COMMIT;

SELECT id, nome FROM public.paises ORDER BY nome;