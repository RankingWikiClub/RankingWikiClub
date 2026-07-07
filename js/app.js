function inicializarBase() {
  const banco = carregarBanco();

  preencherSelect(
    "continenteClube",
    CONTINENTES,
    "Selecione o continente",
    c => c,
    c => c
  );

  preencherSelect(
    "pais",
    [],
    "Selecione primeiro o continente",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );

  preencherSelect(
    "paisCompeticao",
    (banco.paises || PAISES_MUNDO_COMPLETO).slice().sort((a, b) => a.nome.localeCompare(b.nome)),
    "Selecione o país da competição",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );

  preencherSelect(
    "continenteSelecao",
    CONTINENTES,
    "Selecione o continente",
    c => c,
    c => c
  );

  preencherSelect(
    "paisSelecao",
    [],
    "Selecione primeiro o continente",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );

  preencherSelect(
    "estado",
    ESTADOS_BRASIL,
    "Selecione o estado",
    e => e.nome,
    e => `${e.nome} - ${e.sigla}`
  );

  preencherSelect(
    "estadoCompeticao",
    ESTADOS_BRASIL,
    "Selecione o estado",
    e => e.nome,
    e => `${e.nome} - ${e.sigla}`
  );

  preencherSelect(
    "continenteCompeticao",
    CONTINENTES,
    "Selecione o continente",
    c => c,
    c => c
  );

  preencherSelect(
    "regiaoCompeticao",
    REGIOES,
    "Selecione a região",
    r => r,
    r => r
  );

  preencherSelectRivais();

  if (typeof carregarPaisesClubePorContinente === "function") carregarPaisesClubePorContinente();
  if (typeof carregarPaisesSelecaoPorContinente === "function") carregarPaisesSelecaoPorContinente();
  if (typeof carregarCompeticoesPorAbrangencia === "function") carregarCompeticoesPorAbrangencia();

  atualizarStatusInicio();
  carregarAniversariantesHoje();
  configurarFiltroTimesMaisAntigos();
  carregarTimesMaisVelhosPorPais();
  configurarPesquisaInicio();
}

function atualizarStatusInicio() {
  const banco = carregarBanco();

  const competicoes = document.getElementById("inicioCompeticoes");
  const clubes = document.getElementById("inicioClubes");
  const selecoes = document.getElementById("inicioSelecoes");

  if (competicoes) competicoes.textContent = banco.competicoes.length;
  if (clubes) clubes.textContent = banco.clubes.length;
  if (selecoes) selecoes.textContent = banco.selecoes.length;
}

document.addEventListener("DOMContentLoaded", inicializarBase);


function preencherSelectRivais() {
  const banco = carregarBanco();
  const clubes = banco.clubes.slice().sort((a, b) => a.nome.localeCompare(b.nome));

  for (let i = 1; i <= 5; i++) {
    preencherSelect(
      `rival${i}`,
      clubes,
      `Selecione o Rival ${i}`,
      c => c.id,
      c => `${c.nome} - ${c.pais || ""}`
    );
  }
}


function carregarAniversariantesHoje() {
  const lista = document.getElementById("listaAniversariantesHoje");
  const dataSpan = document.getElementById("dataAniversariosHoje");
  if (!lista) return;

  const hoje = new Date();
  const diaHoje = String(hoje.getDate()).padStart(2, "0");
  const mesHoje = String(hoje.getMonth() + 1).padStart(2, "0");

  if (dataSpan) dataSpan.textContent = `${diaHoje}/${mesHoje}`;

  const banco = carregarBanco();
  const clubes = (banco.clubes || [])
    .filter(clube => clube && clube.fundacao)
    .filter(clube => {
      const data = extrairDiaMesFundacao(clube.fundacao);
      return data && data.dia === diaHoje && data.mes === mesHoje;
    })
    .sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));

  if (!clubes.length) {
    lista.innerHTML = `<p class="mensagem-vazia">Nenhum clube faz aniversário hoje.</p>`;
    return;
  }

  lista.innerHTML = clubes.map(clube => {
    const escudo = clube.escudo
      ? `<img src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
      : `<span class="aniversario-fallback">⚽</span>`;

    const fundacao = formatarDataFundacao(clube.fundacao);
    const idade = calcularIdadeFundacao(clube.fundacao);
    const textoIdade = idade !== ""
      ? `🎉 Completando ${idade} ano${idade === 1 ? "" : "s"} hoje!`
      : "🎉 Aniversário hoje!";

    return `
      <div class="aniversario-card" onclick="abrirDetalhesTime('${clube.id}')">
        <div class="aniversario-escudo">${escudo}</div>
        <div class="aniversario-info">
          <h3>🎂 ${limparTexto(clube.nome)}</h3>
          <p>Fundação: ${limparTexto(fundacao)}</p>
          <p class="aniversario-idade">${limparTexto(textoIdade)}</p>
        </div>
      </div>
    `;
  }).join("");
}

function extrairDiaMesFundacao(valor) {
  const data = formatarDataFundacao(valor);
  const partes = String(data || "").split("/");
  if (partes.length < 2) return null;

  const dia = partes[0].padStart(2, "0");
  const mes = partes[1].padStart(2, "0");

  if (!/^\d{2}$/.test(dia) || !/^\d{2}$/.test(mes)) return null;
  return { dia, mes };
}



function normalizarTextoInicio(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .toLowerCase()
    .trim();
}

function obterDataFundacaoOrdenavel(valor) {
  const texto = formatarDataFundacao(valor);
  if (!texto) return null;

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    const [dia, mes, ano] = texto.split("/").map(Number);
    if (!dia || !mes || !ano) return null;
    return { valor: ano * 10000 + mes * 100 + dia, ano, mes, dia };
  }

  if (/^\d{4}$/.test(texto)) {
    const ano = Number(texto);
    return { valor: ano * 10000 + 101, ano, mes: 1, dia: 1 };
  }

  return null;
}

function obterNomePaisClube(clube) {
  return limparNomePaisParaComparacao(clube?.pais || clube?.paisNome || clube?.pais_clube || "");
}

function configurarFiltroTimesMaisAntigos() {
  const abrangencia = document.getElementById("abrangenciaTimesAntigos");
  const continente = document.getElementById("continenteTimesAntigos");
  if (!abrangencia || !continente) return;

  preencherSelect(
    "continenteTimesAntigos",
    CONTINENTES,
    "Selecione o continente",
    c => c,
    c => c
  );

  abrangencia.onchange = () => {
    const usarContinente = abrangencia.value === "continente";
    continente.style.display = usarContinente ? "block" : "none";
    if (!usarContinente) continente.value = "";
    carregarTimesMaisVelhosPorPais();
  };

  continente.onchange = carregarTimesMaisVelhosPorPais;
}

function limparNomePaisParaComparacao(valor) {
  return String(valor || "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .replace(/^[^A-Za-zÀ-ÿ0-9]+/g, "")
    .replace(/\s+-\s+.*$/g, "")
    .trim();
}

function obterContinenteDoPais(nomePais, banco) {
  const nomeOriginal = limparNomePaisParaComparacao(nomePais);
  const nome = normalizarTextoInicio(nomeOriginal);
  if (!nome) return "";

  const paisesDoBanco = Array.isArray(banco?.paises) ? banco.paises : [];
  const paisesCompletos = typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : [];
  const todosPaises = [...paisesDoBanco, ...paisesCompletos];

  // Alguns cadastros antigos guardam o país sem o campo continente.
  // Por isso não podemos parar no primeiro país encontrado; procuramos
  // primeiro um registro que tenha continente preenchido.
  const paisComContinente = todosPaises.find(p => {
    const nomeBanco = limparNomePaisParaComparacao(p?.nome || p?.pais || "");
    return normalizarTextoInicio(nomeBanco) === nome && p?.continente;
  });

  if (paisComContinente?.continente) return paisComContinente.continente;

  const paisEncontrado = todosPaises.find(p => {
    const nomeBanco = limparNomePaisParaComparacao(p?.nome || p?.pais || "");
    return normalizarTextoInicio(nomeBanco) === nome;
  });

  return paisEncontrado?.continente || "";
}

function carregarTimesMaisVelhosPorPais() {
  const lista = document.getElementById("listaTimesMaisVelhosPais");
  if (!lista) return;

  const banco = carregarBanco();
  const abrangencia = document.getElementById("abrangenciaTimesAntigos")?.value || "todos";
  const selectContinente = document.getElementById("continenteTimesAntigos");
  const continenteSelecionado = (selectContinente?.value || (selectContinente?.selectedIndex > 0 ? selectContinente.selectedOptions?.[0]?.textContent : "") || "").trim();
  const grupos = new Map();

  if (abrangencia === "continente" && !continenteSelecionado) {
    lista.innerHTML = `<p class="mensagem-vazia">Selecione um continente para ver os times mais antigos de cada país.</p>`;
    return;
  }

  (banco.clubes || [])
    .filter(clube => clube && clube.pais && clube.fundacao)
    .filter(clube => {
      if (abrangencia !== "continente" || !continenteSelecionado) return true;
      const continenteClube = clube.continente || obterContinenteDoPais(clube.pais, banco);
      return normalizarTextoInicio(continenteClube) === normalizarTextoInicio(continenteSelecionado);
    })
    .forEach(clube => {
      const data = obterDataFundacaoOrdenavel(clube.fundacao);
      if (!data) return;

      const pais = obterNomePaisClube(clube) || "País não informado";
      const atual = grupos.get(pais);

      if (!atual || data.valor < atual.data.valor || (data.valor === atual.data.valor && (clube.nome || "").localeCompare(atual.clube.nome || "", "pt-BR") < 0)) {
        grupos.set(pais, { clube, data });
      }
    });

  const registros = Array.from(grupos.entries())
    .map(([pais, info]) => ({ pais, ...info }))
    .sort((a, b) => a.pais.localeCompare(b.pais, "pt-BR"));

  if (!registros.length) {
    const texto = abrangencia === "continente" && continenteSelecionado
      ? `Nenhum clube com data de fundação cadastrada para ${limparTexto(continenteSelecionado)}.`
      : "Nenhum clube com data de fundação cadastrada.";
    lista.innerHTML = `<p class="mensagem-vazia">${texto}</p>`;
    return;
  }

  lista.innerHTML = registros.map(({ pais, clube, data }) => {
    const escudo = clube.escudo
      ? `<img src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
      : `<span class="time-velho-fallback">⚽</span>`;

    const bandeira = bandeiraPaisPequenaHTML(pais, clube.bandeira || "");
    const idade = calcularIdadeFundacao(clube.fundacao);
    const idadeTexto = idade !== "" ? ` • ${idade} ano${idade === 1 ? "" : "s"}` : "";

    return `
      <div class="time-velho-card" onclick="abrirDetalhesTime('${clube.id}')">
        <div class="time-velho-escudo">${escudo}</div>
        <div class="time-velho-info">
          <h3>${limparTexto(clube.nome)}</h3>
          <p>${bandeira} ${limparTexto(pais)}</p>
          <p>Fundação: ${limparTexto(formatarDataFundacao(clube.fundacao))}${limparTexto(idadeTexto)}</p>
        </div>
      </div>
    `;
  }).join("");
}

function configurarPesquisaInicio() {
  const campo = document.getElementById("pesquisaInicio");
  if (!campo) return;
  campo.addEventListener("input", filtrarConteudoInicio);
}

function filtrarConteudoInicio() {
  const campo = document.getElementById("pesquisaInicio");
  const termo = String(campo?.value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const itens = document.querySelectorAll(".aniversario-card, .time-velho-card, .status-card");

  itens.forEach(item => {
    const texto = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    item.style.display = !termo || texto.includes(termo) ? "" : "none";
  });
}
