-- FutPedia - Inserir times principais
-- Execute no Supabase SQL Editor depois de cadastrar os países.
-- O script busca o pais_id automaticamente pelo nome do país.

INSERT INTO public.times (
  pais_id,
  nome,
  nome_curto,
  apelido,
  cidade,
  estado,
  fundacao,
  site_oficial,
  escudo_url,
  estadio,
  capacidade_estadio,
  cores,
  ativo
)
SELECT
  p.id,
  t.nome,
  t.nome_curto,
  t.apelido,
  t.cidade,
  t.estado,
  t.fundacao,
  t.site_oficial,
  t.escudo_url,
  t.estadio,
  t.capacidade_estadio,
  t.cores,
  TRUE
FROM (
VALUES
-- Brasil
('Brasil','Flamengo','Flamengo','Mengão','Rio de Janeiro','RJ','1895','https://www.flamengo.com.br','','Maracanã',78838,'vermelho e preto'),
('Brasil','Corinthians','Corinthians','Timão','São Paulo','SP','1910','https://www.corinthians.com.br','','Neo Química Arena',49205,'preto e branco'),
('Brasil','Palmeiras','Palmeiras','Verdão','São Paulo','SP','1914','https://www.palmeiras.com.br','','Allianz Parque',43713,'verde e branco'),
('Brasil','São Paulo','São Paulo','Tricolor Paulista','São Paulo','SP','1930','https://www.saopaulofc.net','','Morumbi',66795,'vermelho, branco e preto'),
('Brasil','Santos','Santos','Peixe','Santos','SP','1912','https://www.santosfc.com.br','','Vila Belmiro',16068,'preto e branco'),
('Brasil','Vasco da Gama','Vasco','Gigante da Colina','Rio de Janeiro','RJ','1898','https://www.vasco.com.br','','São Januário',21880,'preto e branco'),
('Brasil','Fluminense','Fluminense','Tricolor Carioca','Rio de Janeiro','RJ','1902','https://www.fluminense.com.br','','Maracanã',78838,'verde, grená e branco'),
('Brasil','Botafogo','Botafogo','Glorioso','Rio de Janeiro','RJ','1904','https://www.botafogo.com.br','','Nilton Santos',44661,'preto e branco'),
('Brasil','Grêmio','Grêmio','Imortal','Porto Alegre','RS','1903','https://gremio.net','','Arena do Grêmio',55662,'azul, preto e branco'),
('Brasil','Internacional','Internacional','Colorado','Porto Alegre','RS','1909','https://internacional.com.br','','Beira-Rio',50128,'vermelho e branco'),
('Brasil','Cruzeiro','Cruzeiro','Raposa','Belo Horizonte','MG','1921','https://www.cruzeiro.com.br','','Mineirão',61846,'azul e branco'),
('Brasil','Atlético Mineiro','Atlético-MG','Galo','Belo Horizonte','MG','1908','https://atletico.com.br','','Arena MRV',46000,'preto e branco'),
('Brasil','Athletico Paranaense','Athletico-PR','Furacão','Curitiba','PR','1924','https://www.athletico.com.br','','Ligga Arena',42372,'vermelho e preto'),
('Brasil','Coritiba','Coritiba','Coxa','Curitiba','PR','1909','https://www.coritiba.com.br','','Couto Pereira',40502,'verde e branco'),
('Brasil','Bahia','Bahia','Esquadrão','Salvador','BA','1931','https://www.esporteclubebahia.com.br','','Arena Fonte Nova',47907,'azul, vermelho e branco'),
('Brasil','Vitória','Vitória','Leão da Barra','Salvador','BA','1899','https://ecvitoria.com.br','','Barradão',34535,'vermelho e preto'),
('Brasil','Sport Recife','Sport','Leão da Ilha','Recife','PE','1905','https://sportrecife.com.br','','Ilha do Retiro',32983,'vermelho e preto'),
('Brasil','Fortaleza','Fortaleza','Leão do Pici','Fortaleza','CE','1918','https://fortaleza1918.com.br','','Castelão',63903,'vermelho, azul e branco'),
('Brasil','Ceará','Ceará','Vozão','Fortaleza','CE','1914','https://cearasc.com','','Castelão',63903,'preto e branco'),
('Brasil','Goiás','Goiás','Esmeraldino','Goiânia','GO','1943','https://www.goiasec.com.br','','Serrinha',14525,'verde e branco'),
('Brasil','Atlético Goianiense','Atlético-GO','Dragão','Goiânia','GO','1937','https://atleticogoianiense.com.br','','Antônio Accioly',12500,'vermelho e preto'),
('Brasil','Cuiabá','Cuiabá','Dourado','Cuiabá','MT','2001','https://cuiabaesporteclube.com.br','','Arena Pantanal',44000,'amarelo e verde'),
('Brasil','América Mineiro','América-MG','Coelho','Belo Horizonte','MG','1912','https://www.americafc.com.br','','Independência',23018,'verde, preto e branco'),
('Brasil','Red Bull Bragantino','Bragantino','Massa Bruta','Bragança Paulista','SP','1928','https://www.redbullbragantino.com.br','','Nabi Abi Chedid',17128,'branco, vermelho e preto'),
('Brasil','Ponte Preta','Ponte Preta','Macaca','Campinas','SP','1900','https://pontepreta.com.br','','Moisés Lucarelli',19722,'preto e branco'),
('Brasil','Guarani','Guarani','Bugre','Campinas','SP','1911','https://guaranifc.com.br','','Brinco de Ouro',29130,'verde e branco'),

-- Argentina
('Argentina','Boca Juniors','Boca','Xeneize','Buenos Aires','','1905','https://www.bocajuniors.com.ar','','La Bombonera',54000,'azul e amarelo'),
('Argentina','River Plate','River','Millonario','Buenos Aires','','1901','https://www.cariverplate.com.ar','','Monumental',84567,'branco e vermelho'),
('Argentina','Independiente','Independiente','Rey de Copas','Avellaneda','','1905','','','Libertadores de América',48069,'vermelho'),
('Argentina','Racing Club','Racing','La Academia','Avellaneda','','1903','','','El Cilindro',51389,'azul e branco'),
('Argentina','San Lorenzo','San Lorenzo','Ciclón','Buenos Aires','','1908','','','Pedro Bidegain',47964,'azul e grená'),
('Argentina','Estudiantes','Estudiantes','Pincha','La Plata','','1905','','','Jorge Luis Hirschi',32000,'vermelho e branco'),
('Argentina','Vélez Sarsfield','Vélez','Fortín','Buenos Aires','','1910','','','José Amalfitani',49540,'branco e azul'),
('Argentina','Newell’s Old Boys','Newell’s','Leproso','Rosário','','1903','','','Marcelo Bielsa',42000,'vermelho e preto'),
('Argentina','Rosario Central','Rosario Central','Canalla','Rosário','','1889','','','Gigante de Arroyito',41654,'azul e amarelo'),

-- Uruguai / Chile / Colômbia
('Uruguai','Peñarol','Peñarol','Carbonero','Montevidéu','','1891','https://www.peñarol.org','','Campeón del Siglo',40000,'amarelo e preto'),
('Uruguai','Nacional','Nacional','Bolso','Montevidéu','','1899','https://nacional.uy','','Gran Parque Central',34000,'branco, azul e vermelho'),
('Chile','Colo-Colo','Colo-Colo','Cacique','Santiago','','1925','https://www.colocolo.cl','','Monumental David Arellano',47347,'branco e preto'),
('Chile','Universidad de Chile','U. de Chile','La U','Santiago','','1927','','','Nacional Julio Martínez Prádanos',48665,'azul'),
('Chile','Universidad Católica','U. Católica','Cruzados','Santiago','','1937','','','San Carlos de Apoquindo',14233,'azul e branco'),
('Colômbia','Atlético Nacional','Atlético Nacional','Verdolaga','Medellín','','1947','https://www.atlnacional.com.co','','Atanasio Girardot',45943,'verde e branco'),
('Colômbia','Millonarios','Millonarios','Embajador','Bogotá','','1946','','','El Campín',36343,'azul e branco'),
('Colômbia','América de Cali','América de Cali','Diablos Rojos','Cali','','1927','','','Pascual Guerrero',35405,'vermelho'),

-- Espanha
('Espanha','Real Madrid','Real Madrid','Merengues','Madrid','','1902','https://www.realmadrid.com','','Santiago Bernabéu',83000,'branco'),
('Espanha','Barcelona','Barcelona','Barça','Barcelona','','1899','https://www.fcbarcelona.com','','Camp Nou',99354,'azul e grená'),
('Espanha','Atlético de Madrid','Atlético','Colchoneros','Madrid','','1903','https://www.atleticodemadrid.com','','Metropolitano',70460,'vermelho, branco e azul'),
('Espanha','Sevilla','Sevilla','Sevillistas','Sevilha','','1890','https://www.sevillafc.es','','Ramón Sánchez Pizjuán',43883,'branco e vermelho'),
('Espanha','Valencia','Valencia','Che','Valência','','1919','https://www.valenciacf.com','','Mestalla',48600,'branco, preto e laranja'),
('Espanha','Villarreal','Villarreal','Submarino Amarelo','Vila-real','','1923','https://villarrealcf.es','','Estadio de la Cerámica',23500,'amarelo'),

-- Inglaterra
('Inglaterra','Manchester United','Man United','Red Devils','Manchester','','1878','https://www.manutd.com','','Old Trafford',74310,'vermelho'),
('Inglaterra','Liverpool','Liverpool','Reds','Liverpool','','1892','https://www.liverpoolfc.com','','Anfield',61276,'vermelho'),
('Inglaterra','Arsenal','Arsenal','Gunners','Londres','','1886','https://www.arsenal.com','','Emirates Stadium',60704,'vermelho e branco'),
('Inglaterra','Chelsea','Chelsea','Blues','Londres','','1905','https://www.chelseafc.com','','Stamford Bridge',40343,'azul'),
('Inglaterra','Manchester City','Man City','Citizens','Manchester','','1880','https://www.mancity.com','','Etihad Stadium',53400,'azul claro'),
('Inglaterra','Tottenham Hotspur','Tottenham','Spurs','Londres','','1882','https://www.tottenhamhotspur.com','','Tottenham Hotspur Stadium',62850,'branco e azul'),
('Inglaterra','Everton','Everton','Toffees','Liverpool','','1878','https://www.evertonfc.com','','Goodison Park',39414,'azul'),
('Inglaterra','Newcastle United','Newcastle','Magpies','Newcastle upon Tyne','','1892','https://www.newcastleunited.com','','St James Park',52305,'preto e branco'),

-- Itália
('Itália','Juventus','Juventus','Velha Senhora','Turim','','1897','https://www.juventus.com','','Allianz Stadium',41507,'preto e branco'),
('Itália','Milan','Milan','Rossoneri','Milão','','1899','https://www.acmilan.com','','San Siro',75817,'vermelho e preto'),
('Itália','Internazionale','Inter','Nerazzurri','Milão','','1908','https://www.inter.it','','San Siro',75817,'azul e preto'),
('Itália','Napoli','Napoli','Partenopei','Nápoles','','1926','https://sscnapoli.it','','Diego Armando Maradona',54726,'azul'),
('Itália','Roma','Roma','Giallorossi','Roma','','1927','https://www.asroma.com','','Olímpico de Roma',70634,'grená e amarelo'),
('Itália','Lazio','Lazio','Biancocelesti','Roma','','1900','https://www.sslazio.it','','Olímpico de Roma',70634,'azul claro e branco'),

-- Alemanha
('Alemanha','Bayern de Munique','Bayern','Bávaros','Munique','','1900','https://fcbayern.com','','Allianz Arena',75024,'vermelho e branco'),
('Alemanha','Borussia Dortmund','Dortmund','Aurinegros','Dortmund','','1909','https://www.bvb.de','','Signal Iduna Park',81365,'amarelo e preto'),
('Alemanha','Bayer Leverkusen','Leverkusen','Werkself','Leverkusen','','1904','https://www.bayer04.de','','BayArena',30210,'vermelho e preto'),
('Alemanha','Schalke 04','Schalke','Die Königsblauen','Gelsenkirchen','','1904','https://schalke04.de','','Veltins-Arena',62271,'azul e branco'),

-- França
('França','Paris Saint-Germain','PSG','Parisiens','Paris','','1970','https://www.psg.fr','','Parc des Princes',47929,'azul, vermelho e branco'),
('França','Olympique de Marseille','Marseille','OM','Marselha','','1899','https://www.om.fr','','Vélodrome',67394,'azul e branco'),
('França','Lyon','Lyon','Les Gones','Lyon','','1950','https://www.ol.fr','','Groupama Stadium',59186,'branco, azul e vermelho'),
('França','Monaco','Monaco','Les Monégasques','Mônaco','','1924','https://www.asmonaco.com','','Stade Louis II',18523,'vermelho e branco'),

-- Portugal
('Portugal','Benfica','Benfica','Águias','Lisboa','','1904','https://www.slbenfica.pt','','Estádio da Luz',64642,'vermelho e branco'),
('Portugal','Porto','Porto','Dragões','Porto','','1893','https://www.fcporto.pt','','Estádio do Dragão',50033,'azul e branco'),
('Portugal','Sporting CP','Sporting','Leões','Lisboa','','1906','https://www.sporting.pt','','José Alvalade',50095,'verde e branco'),

-- Países Baixos / Turquia
('Países Baixos','Ajax','Ajax','Godenzonen','Amsterdã','','1900','https://www.ajax.nl','','Johan Cruyff Arena',55865,'branco e vermelho'),
('Países Baixos','PSV Eindhoven','PSV','Boeren','Eindhoven','','1913','https://www.psv.nl','','Philips Stadion',35000,'vermelho e branco'),
('Países Baixos','Feyenoord','Feyenoord','De club aan de Maas','Roterdã','','1908','https://www.feyenoord.nl','','De Kuip',47500,'vermelho e branco'),
('Turquia','Galatasaray','Galatasaray','Aslanlar','Istambul','','1905','https://www.galatasaray.org','','Rams Park',52280,'amarelo e vermelho'),
('Turquia','Fenerbahçe','Fenerbahçe','Kanaryalar','Istambul','','1907','https://www.fenerbahce.org','','Şükrü Saracoğlu',47834,'amarelo e azul'),
('Turquia','Beşiktaş','Beşiktaş','Kara Kartallar','Istambul','','1903','https://bjk.com.tr','','Tüpraş Stadyumu',42590,'preto e branco'),

-- México / EUA
('México','Club América','América','Águilas','Cidade do México','','1916','https://www.clubamerica.com.mx','','Estadio Azteca',87523,'amarelo e azul'),
('México','Chivas Guadalajara','Chivas','Rebaño Sagrado','Guadalajara','','1906','https://www.chivasdecorazon.com.mx','','Estadio Akron',46609,'vermelho, branco e azul'),
('México','Cruz Azul','Cruz Azul','La Máquina','Cidade do México','','1927','','','Estadio Ciudad de los Deportes',36681,'azul'),
('México','Tigres UANL','Tigres','Felinos','San Nicolás de los Garza','','1960','','','Estadio Universitario',42000,'amarelo e azul'),
('Estados Unidos','LA Galaxy','LA Galaxy','Galaxy','Los Angeles','CA','1994','https://www.lagalaxy.com','','Dignity Health Sports Park',27000,'branco e azul'),
('Estados Unidos','Inter Miami','Inter Miami','Herons','Fort Lauderdale','FL','2018','https://www.intermiamicf.com','','Chase Stadium',21550,'rosa e preto'),
('Estados Unidos','Seattle Sounders','Seattle Sounders','Sounders','Seattle','WA','2007','https://www.soundersfc.com','','Lumen Field',68740,'verde e azul'),

-- África
('Egito','Al Ahly','Al Ahly','Clube do Século','Cairo','','1907','https://www.alahlyegypt.com','','Cairo International Stadium',75000,'vermelho'),
('Egito','Zamalek','Zamalek','White Knights','Cairo','','1911','https://www.zamaleksc.com','','Cairo International Stadium',75000,'branco'),
('Marrocos','Wydad Casablanca','Wydad','WAC','Casablanca','','1937','','','Mohammed V',45000,'vermelho'),
('Marrocos','Raja Casablanca','Raja','RCA','Casablanca','','1949','','','Mohammed V',45000,'verde e branco'),
('África do Sul','Mamelodi Sundowns','Sundowns','Brazilians','Pretória','','1970','','','Loftus Versfeld',51762,'amarelo e azul'),

-- Ásia
('Arábia Saudita','Al Hilal','Al Hilal','Al-Za’eem','Riad','','1957','https://alhilal.com','','Kingdom Arena',26000,'azul'),
('Arábia Saudita','Al Nassr','Al Nassr','Al-Alami','Riad','','1955','https://alnassr.sa','','Al-Awwal Park',25000,'amarelo e azul'),
('Japão','Urawa Red Diamonds','Urawa Reds','Reds','Saitama','','1950','https://www.urawa-reds.co.jp','','Saitama Stadium',63700,'vermelho'),
('Japão','Kashima Antlers','Kashima','Antlers','Kashima','','1947','https://www.antlers.co.jp','','Kashima Soccer Stadium',40728,'vermelho'),
('Coreia do Sul','Jeonbuk Hyundai Motors','Jeonbuk','Green Warriors','Jeonju','','1994','https://hyundai-motorsfc.com','','Jeonju World Cup Stadium',42477,'verde'),

-- Oceania
('Nova Zelândia','Auckland City','Auckland City','Navy Blues','Auckland','','2004','https://www.aucklandcityfc.com','','Kiwitea Street',3500,'azul'),
('Nova Zelândia','Wellington Phoenix','Wellington','Phoenix','Wellington','','2007','https://wellingtonphoenix.com','','Sky Stadium',34500,'amarelo e preto'),
('Austrália','Sydney FC','Sydney','Sky Blues','Sydney','','2004','https://sydneyfc.com','','Allianz Stadium',45500,'azul claro'),
('Austrália','Melbourne Victory','Melbourne Victory','Victory','Melbourne','','2004','https://melbournevictory.com.au','','AAMI Park',30050,'azul')
) AS t(
  pais,
  nome,
  nome_curto,
  apelido,
  cidade,
  estado,
  fundacao,
  site_oficial,
  escudo_url,
  estadio,
  capacidade_estadio,
  cores
)
JOIN public.paises p ON p.nome = t.pais
ON CONFLICT (nome, pais_id)
DO UPDATE SET
  nome_curto = EXCLUDED.nome_curto,
  apelido = EXCLUDED.apelido,
  cidade = EXCLUDED.cidade,
  estado = EXCLUDED.estado,
  fundacao = EXCLUDED.fundacao,
  site_oficial = EXCLUDED.site_oficial,
  escudo_url = EXCLUDED.escudo_url,
  estadio = EXCLUDED.estadio,
  capacidade_estadio = EXCLUDED.capacidade_estadio,
  cores = EXCLUDED.cores,
  ativo = TRUE;

SELECT COUNT(*) AS total_times FROM public.times;
