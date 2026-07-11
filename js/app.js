
// Helper global usado na página inicial e nas listas.
// Mostra nome curto quando existir e Estados Unidos nome completo como fallback.
function fpNomeCurtoClube(clube) {
  if (typeof fpNomeCurtoTime === "function") return fpNomeCurtoTime(clube);
  return String(clube?.nomeCurto || clube?.nome_curto || clube?.nome || "Sem nome").trim();
}

function fpEscudoClube(clube) {
  if (typeof fpLogoEntidade === "function") return fpLogoEntidade(clube);
  return clube?.escudo || clube?.escudo_url || clube?.logo_url || "";
}

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
  const clubes = fpOrdenarPorNomeCurto(banco.clubes || []);

  for (let i = 1; i <= 5; i++) {
    fpPreencherSelectTimesComLogo(
      `rival${i}`,
      clubes,
      `Selecione o Rival ${i}`,
      document.getElementById(`rival${i}`)?.value || ""
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
    .sort((a, b) => fpNomeCurtoClube(a).localeCompare(fpNomeCurtoClube(b), "pt-BR"));

  if (!clubes.length) {
    lista.innerHTML = `<p class="mensagem-vazia">Nenhum clube faz aniversário hoje.</p>`;
    return;
  }

  lista.innerHTML = clubes.map(clube => {
    const escudoUrl = fpEscudoClube(clube);
    const escudo = escudoUrl
      ? `<img src="${escudoUrl}" alt="Escudo de ${limparTexto(fpNomeCurtoClube(clube))}">`
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
          <h3>🎂 ${limparTexto(fpNomeCurtoClube(clube))}</h3>
          <p>📅 Fundação: ${limparTexto(fundacao)}</p>
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

      if (!atual || data.valor < atual.data.valor || (data.valor === atual.data.valor && (fpNomeCurtoClube(clube) || "").localeCompare(fpNomeCurtoClube(atual.clube) || "", "pt-BR") < 0)) {
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
    const escudoUrl = fpEscudoClube(clube);
    const escudo = escudoUrl
      ? `<img src="${escudoUrl}" alt="Escudo de ${limparTexto(fpNomeCurtoClube(clube))}">`
      : `<span class="time-velho-fallback">⚽</span>`;

    const bandeira = bandeiraPaisPequenaHTML(pais, clube.bandeira || "");
    const idade = calcularIdadeFundacao(clube.fundacao);
    const idadeTexto = idade !== "" ? ` • ${idade} ano${idade === 1 ? "" : "s"}` : "";

    return `
      <div class="time-velho-card" onclick="abrirDetalhesTime('${clube.id}')">
        <div class="time-velho-escudo">${escudo}</div>
        <div class="time-velho-info">
          <h3>${limparTexto(fpNomeCurtoClube(clube))}</h3>
          <p>${bandeira} ${limparTexto(pais)}</p>
          <p>📅 Fundação: ${limparTexto(formatarDataFundacao(clube.fundacao))}${limparTexto(idadeTexto)}</p>
        </div>
      </div>
    `;
  }).join("");
}

function normalizarPesquisaInicio(valor) {
  return String(valor || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function textoSeguroPesquisaInicio(valor) {
  if (typeof limparTexto === "function") return limparTexto(String(valor || ""));
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function logoPesquisaInicio(entidade, tipo) {
  const url = String(
    entidade?.escudo ||
    entidade?.escudo_url ||
    entidade?.logo ||
    entidade?.logo_url ||
    entidade?.bandeira_url ||
    ""
  ).trim();

  if (url) {
    return `<img src="${textoSeguroPesquisaInicio(url)}" alt="" loading="lazy">`;
  }

  if (tipo === "clube") return `<span class="resultado-pesquisa-placeholder">⚽</span>`;
  if (tipo === "selecao") {
    const bandeira = String(entidade?.bandeira || "").trim();
    return `<span class="resultado-pesquisa-placeholder">${textoSeguroPesquisaInicio(bandeira || "🏳️")}</span>`;
  }
  return `<span class="resultado-pesquisa-placeholder">🏆</span>`;
}

function nomeClubePesquisaInicio(clube) {
  return String(
    clube?.nomeCurto ||
    clube?.nome_curto ||
    clube?.nome ||
    clube?.nomeCompleto ||
    clube?.nome_completo ||
    "Clube"
  ).trim();
}

function nomeSelecaoPesquisaInicio(selecao) {
  return String(selecao?.nome || selecao?.pais || "Seleção").trim();
}

function nomeCompeticaoPesquisaInicio(competicao) {
  return String(competicao?.nome || "Competição").trim();
}

function configurarPesquisaInicio() {
  const campo = document.getElementById("pesquisaInicio");
  if (!campo || campo.dataset.pesquisaGeralConfigurada === "1") return;

  campo.dataset.pesquisaGeralConfigurada = "1";
  campo.addEventListener("input", pesquisarInformacoesGeraisInicio);
  campo.addEventListener("search", pesquisarInformacoesGeraisInicio);
}

function pesquisarInformacoesGeraisInicio() {
  const campo = document.getElementById("pesquisaInicio");
  const painel = document.getElementById("resultadosPesquisaInicio");
  const lista = document.getElementById("listaResultadosPesquisaInicio");
  const total = document.getElementById("totalPesquisaInicio");

  if (!campo || !painel || !lista || !total) return;

  const termoOriginal = String(campo.value || "").trim();
  const termo = normalizarPesquisaInicio(termoOriginal);

  if (!termo) {
    painel.hidden = true;
    lista.innerHTML = "";
    total.textContent = "0 resultados";
    return;
  }

  const banco = carregarBanco();
  const resultados = [];

  (banco.clubes || []).forEach(clube => {
    const nomeCurto = nomeClubePesquisaInicio(clube);
    const nomeCompleto = String(clube?.nomeCompleto || clube?.nome_completo || clube?.nome || "").trim();
    const textoBusca = normalizarPesquisaInicio([
      nomeCurto,
      nomeCompleto,
      clube?.pais,
      clube?.estado,
      clube?.siglaEstado,
      clube?.sigla_estado,
      clube?.cidade,
      clube?.apelido
    ].join(" "));

    if (textoBusca.includes(termo)) {
      resultados.push({
        tipo: "clube",
        id: clube.id,
        nome: nomeCurto,
        subtitulo: [
          nomeCompleto && nomeCompleto !== nomeCurto ? nomeCompleto : "",
          clube?.pais || "",
          clube?.estado || clube?.siglaEstado || clube?.sigla_estado || "",
          clube?.cidade || ""
        ].filter(Boolean).join(" • "),
        entidade: clube
      });
    }
  });

  (banco.selecoes || []).forEach(selecao => {
    const nome = nomeSelecaoPesquisaInicio(selecao);
    const textoBusca = normalizarPesquisaInicio([
      nome,
      selecao?.pais,
      selecao?.continente,
      selecao?.apelido
    ].join(" "));

    if (textoBusca.includes(termo)) {
      resultados.push({
        tipo: "selecao",
        id: selecao.id,
        nome,
        subtitulo: [
          selecao?.pais && selecao.pais !== nome ? selecao.pais : "",
          selecao?.continente || ""
        ].filter(Boolean).join(" • "),
        entidade: selecao
      });
    }
  });

  (banco.competicoes || []).forEach(competicao => {
    const nome = nomeCompeticaoPesquisaInicio(competicao);
    const textoBusca = normalizarPesquisaInicio([
      nome,
      competicao?.tipo,
      competicao?.categoria,
      competicao?.abrangencia,
      competicao?.pais,
      competicao?.continente,
      competicao?.estado,
      competicao?.local
    ].join(" "));

    if (textoBusca.includes(termo)) {
      resultados.push({
        tipo: "competicao",
        id: competicao.id,
        nome,
        subtitulo: [
          competicao?.tipo || "",
          competicao?.categoria || "",
          competicao?.abrangencia || "",
          competicao?.pais || competicao?.continente || competicao?.estado || ""
        ].filter(Boolean).join(" • "),
        entidade: competicao
      });
    }
  });

  const ordemTipo = { clube: 1, selecao: 2, competicao: 3 };
  resultados.sort((a, b) => {
    const inicioA = normalizarPesquisaInicio(a.nome).startsWith(termo) ? 0 : 1;
    const inicioB = normalizarPesquisaInicio(b.nome).startsWith(termo) ? 0 : 1;
    if (inicioA !== inicioB) return inicioA - inicioB;
    if (ordemTipo[a.tipo] !== ordemTipo[b.tipo]) return ordemTipo[a.tipo] - ordemTipo[b.tipo];
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  total.textContent = `${resultados.length.toLocaleString("pt-BR")} ${
    resultados.length === 1 ? "resultado" : "resultados"
  }`;

  if (!resultados.length) {
    lista.innerHTML = `
      <p class="mensagem-vazia resultado-pesquisa-vazio">
        Nenhum clube, seleção ou competição encontrado para
        <strong>${textoSeguroPesquisaInicio(termoOriginal)}</strong>.
      </p>
    `;
    painel.hidden = false;
    return;
  }

  const rotulos = {
    clube: "Clube",
    selecao: "Seleção",
    competicao: "Competição"
  };

  lista.innerHTML = resultados.map(resultado => {
    let acao = "";
    const idSeguro = String(resultado.id).replace(/'/g, "\\'");

    if (resultado.tipo === "clube") {
      acao = `abrirDetalhesTime('${idSeguro}')`;
    } else if (resultado.tipo === "selecao") {
      acao = `abrirDetalhesSelecao('${idSeguro}')`;
    } else {
      acao = `abrirDetalhesLiga('${idSeguro}')`;
    }

    return `
      <button type="button"
              class="resultado-pesquisa-item resultado-pesquisa-${resultado.tipo}"
              onclick="${acao}">
        <span class="resultado-pesquisa-logo">
          ${logoPesquisaInicio(resultado.entidade, resultado.tipo)}
        </span>
        <span class="resultado-pesquisa-conteudo">
          <span class="resultado-pesquisa-tipo">${rotulos[resultado.tipo]}</span>
          <span class="resultado-pesquisa-nome">${textoSeguroPesquisaInicio(resultado.nome)}</span>
          ${
            resultado.subtitulo
              ? `<span class="resultado-pesquisa-subtitulo">${textoSeguroPesquisaInicio(resultado.subtitulo)}</span>`
              : ""
          }
        </span>
        <span class="resultado-pesquisa-seta" aria-hidden="true">›</span>
      </button>
    `;
  }).join("");

  painel.hidden = false;
}

function filtrarConteudoInicio() {
  pesquisarInformacoesGeraisInicio();
}
