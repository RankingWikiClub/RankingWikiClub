document.addEventListener("DOMContentLoaded", () => {
  atualizarTotais();
  prepararFiltrosEstatisticas();
  carregarLocaisEstatisticas();
  carregarCompeticoesEstatisticas();
  renderizarHistoricoEstatisticas();

  document.getElementById("filtroCategoriaEstatisticas")?.addEventListener("change", () => {
    resetarSeletoresEstatisticas(["filtroAbrangenciaEstatisticas", "filtroLocalEstatisticas", "filtroPaisEstatisticas", "filtroCompeticaoEstatisticas"]);
    prepararFiltrosEstatisticas();
    carregarLocaisEstatisticas();
    carregarCompeticoesEstatisticas();
    renderizarHistoricoEstatisticas();
  });

  document.getElementById("filtroAbrangenciaEstatisticas")?.addEventListener("change", () => {
    resetarSeletoresEstatisticas(["filtroLocalEstatisticas", "filtroPaisEstatisticas", "filtroCompeticaoEstatisticas"]);
    carregarLocaisEstatisticas();
    carregarCompeticoesEstatisticas();
    renderizarHistoricoEstatisticas();
  });

  document.getElementById("filtroLocalEstatisticas")?.addEventListener("change", () => {
    resetarSeletoresEstatisticas(["filtroPaisEstatisticas", "filtroCompeticaoEstatisticas"]);
    carregarPaisesEstatisticas();
    carregarCompeticoesEstatisticas();
    renderizarHistoricoEstatisticas();
  });

  document.getElementById("filtroPaisEstatisticas")?.addEventListener("change", () => {
    resetarSeletoresEstatisticas(["filtroCompeticaoEstatisticas"]);
    carregarCompeticoesEstatisticas();
    renderizarHistoricoEstatisticas();
  });

  document.getElementById("filtroCompeticaoEstatisticas")?.addEventListener("change", () => {
    renderizarHistoricoEstatisticas();
  });
});

function atualizarTotais() {
  const banco = carregarBanco();
  setText("totalPaises", (banco.paises || []).length);
  setText("totalClubes", (banco.clubes || []).length);
  setText("totalSelecoes", (banco.selecoes || []).length);
  setText("totalCompeticoes", (banco.competicoes || []).length);
  setText("totalTitulos", (banco.titulos || []).length);
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function resetarSeletoresEstatisticas(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function prepararFiltrosEstatisticas() {
  const categoria = document.getElementById("filtroCategoriaEstatisticas");
  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas");
  const grupoLocal = document.getElementById("grupoFiltroLocalEstatisticas");
  const labelLocal = document.getElementById("labelFiltroLocalEstatisticas");

  if (categoria) {
    const valorAtual = categoria.value || "clube";
    categoria.innerHTML = `
      <option value="clube">Competições de clubes</option>
      <option value="selecao">Competições de seleções</option>
      <option value="todas">Todas as categorias</option>
    `;
    categoria.value = ["clube", "selecao", "todas"].includes(valorAtual) ? valorAtual : "clube";
  }

  if (abrangencia) {
    const valorAtual = abrangencia.value || "Todas";
    const categoriaAtual = categoria?.value || "clube";

    if (categoriaAtual === "selecao") {
      abrangencia.innerHTML = `<option value="Todas">Todas</option>`;
      abrangencia.value = "Todas";
    } else {
      abrangencia.innerHTML = `
        <option value="Todas">Todas</option>
        <option value="Continental">Continente</option>
        <option value="País">País</option>
      `;
      abrangencia.value = ["Todas", "Continental", "País"].includes(valorAtual) ? valorAtual : "Todas";
    }
  }

  if (grupoLocal && !document.getElementById("grupoFiltroPaisEstatisticas")) {
    grupoLocal.insertAdjacentHTML("afterend", `
      <div id="grupoFiltroPaisEstatisticas" class="grupo oculto">
        <label>País</label>
        <select id="filtroPaisEstatisticas">
          <option value="">Selecione um país</option>
        </select>
      </div>
    `);

    document.getElementById("filtroPaisEstatisticas")?.addEventListener("change", () => {
      resetarSeletoresEstatisticas(["filtroCompeticaoEstatisticas"]);
      carregarCompeticoesEstatisticas();
      renderizarHistoricoEstatisticas();
    });
  }

  if (labelLocal) labelLocal.textContent = "Continente";
  atualizarVisibilidadeFiltrosEstatisticas();
}
function atualizarVisibilidadeFiltrosEstatisticas() {
  const categoria = document.getElementById("filtroCategoriaEstatisticas")?.value || "clube";
  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.value || "Todas";
  const grupoAbrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.closest(".grupo");
  const grupoLocal = document.getElementById("grupoFiltroLocalEstatisticas");
  const grupoPais = document.getElementById("grupoFiltroPaisEstatisticas");

  const ehClubes = categoria === "clube";

  if (grupoAbrangencia) grupoAbrangencia.classList.toggle("oculto", false);
  if (grupoLocal) grupoLocal.classList.toggle("oculto", !(ehClubes && abrangencia === "Continental"));
  if (grupoPais) grupoPais.classList.toggle("oculto", !(ehClubes && abrangencia === "País"));
}
function carregarLocaisEstatisticas() {
  const selectContinente = document.getElementById("filtroLocalEstatisticas");
  const categoria = document.getElementById("filtroCategoriaEstatisticas")?.value || "clube";
  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.value || "Todas";

  atualizarVisibilidadeFiltrosEstatisticas();
  if (!selectContinente) return;

  selectContinente.innerHTML = `<option value="">Selecione um continente</option>`;

  if (categoria !== "clube" || abrangencia !== "Continental") {
    carregarPaisesEstatisticas();
    return;
  }

  const continentes = typeof CONTINENTES !== "undefined"
    ? CONTINENTES
    : [...new Set(listaPaisesEstatisticas().map(p => p.continente).filter(Boolean))];

  continentes.forEach(cont => {
    const option = document.createElement("option");
    option.value = cont;
    option.textContent = cont;
    selectContinente.appendChild(option);
  });

  carregarPaisesEstatisticas();
}
function carregarPaisesEstatisticas() {
  const selectPais = document.getElementById("filtroPaisEstatisticas");
  const categoria = document.getElementById("filtroCategoriaEstatisticas")?.value || "clube";
  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.value || "Todas";
  const continente = document.getElementById("filtroLocalEstatisticas")?.value || "";

  if (!selectPais) return;

  selectPais.innerHTML = `<option value="">Selecione um país</option>`;

  if (categoria !== "clube" || !["Continental", "País"].includes(abrangencia)) return;

  let paises = listaPaisesEstatisticas();
  if (abrangencia === "Continental" && continente) {
    paises = paises.filter(p => p.continente === continente);
  }

  paises.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nome;
    option.textContent = `${p.bandeira || ""} ${p.nome}`.trim();
    selectPais.appendChild(option);
  });
}
function carregarCompeticoesEstatisticas() {
  const banco = carregarBanco();
  const select = document.getElementById("filtroCompeticaoEstatisticas");
  if (!select) return;

  const filtros = obterFiltrosEstatisticas();
  const competicoes = filtrarCompeticoesEstatisticas(banco, filtros)
    .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));

  select.innerHTML = `<option value="">Todas as competições</option>`;

  competicoes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nome;
    select.appendChild(option);
  });
}

function obterFiltrosEstatisticas() {
  return {
    categoria: document.getElementById("filtroCategoriaEstatisticas")?.value || "todas",
    abrangencia: document.getElementById("filtroAbrangenciaEstatisticas")?.value || "Todas",
    continente: document.getElementById("filtroLocalEstatisticas")?.value || "",
    pais: document.getElementById("filtroPaisEstatisticas")?.value || "",
    competicaoId: document.getElementById("filtroCompeticaoEstatisticas")?.value || "",
    pesquisa: normalizarTextoBusca(document.getElementById("pesquisaEstatisticas")?.value || "")
  };
}

function filtrarCompeticoesEstatisticas(banco, filtros) {
  const categoria = filtros.categoria || "clube";
  const abrangencia = filtros.abrangencia || "Todas";
  const continente = filtros.continente || "";
  const pais = filtros.pais || "";

  return (banco.competicoes || []).filter(c => {
    const cat = categoriaCompeticaoEstatisticas(c);

    if (categoria !== "todas" && cat !== categoria) return false;

    // Em competições de seleções, a abrangência "Todas" deve trazer todos os campeões
    // de seleções de todas as competições cadastradas.
    if (cat === "selecao") return true;

    // Competições de clubes
    if (abrangencia === "Todas") return true;

    if (abrangencia === "Continental") {
      if (!continente) return false;
      return continenteCompeticaoEstatisticas(c) === continente;
    }

    if (abrangencia === "País") {
      if (!pais) return false;
      return paisCompeticaoEstatisticas(c) === pais;
    }

    return true;
  });
}

function renderizarHistoricoEstatisticas() {
  const banco = carregarBanco();
  const filtros = obterFiltrosEstatisticas();

  let competicoes = filtrarCompeticoesEstatisticas(banco, filtros);
  if (filtros.pesquisa) {
    competicoes = competicoes.filter(c => normalizarTextoBusca([c.nome, c.tipo, c.categoria, c.abrangencia, c.local, c.pais, c.continente, c.estado].join(" ")).includes(filtros.pesquisa));
  }
  if (filtros.competicaoId) {
    competicoes = competicoes.filter(c => c.id === filtros.competicaoId);
  }

  const ids = competicoes.map(c => c.id);
  let edicoes = (banco.titulos || [])
    .filter(t => ids.includes(t.competicaoId));

  if (filtros.pesquisa) {
    edicoes = edicoes.filter(t => normalizarTextoBusca([t.ano, t.competicaoNome, t.campeaoNome, t.viceNome].join(" ")).includes(filtros.pesquisa));
  }

  edicoes = edicoes.sort((a, b) => Number(a.ano) - Number(b.ano));

  renderizarResumoEstatisticas(competicoes, edicoes);

  const areaCampeoes = document.getElementById("campeoesCompeticaoSelecionada");
  const areaHistorico = document.getElementById("historicoCompeticoesEstatisticas");

  if (filtros.competicaoId) {
    renderizarCampeoesCompeticaoSelecionada(banco, competicoes, edicoes, filtros.competicaoId);
    if (areaHistorico) areaHistorico.innerHTML = "";
    return;
  }

  if (areaCampeoes) areaCampeoes.innerHTML = "";
  renderizarListaHistorico(competicoes, edicoes);
}

function renderizarResumoEstatisticas(competicoes, edicoes) {
  const area = document.getElementById("resumoCompeticaoEstatisticas");
  if (!area) return;

  const rankingCampeoes = contarRankingPorId(edicoes.map(e => e.campeaoId));
  const rankingVices = contarRankingPorId(edicoes.map(e => e.viceId));
  const rankingFinalistas = contarRankingFinalistasEstatisticas(edicoes);
  const maiorCampeao = rankingCampeoes[0];
  const maiorVice = rankingVices[0];
  const maiorFinalista = rankingFinalistas[0];

  area.innerHTML = `
    <div class="tabela-container">
      <table class="tabela-estatisticas-campeoes tabela-estatisticas-resumo-filtro">
        <thead>
          <tr>
            <th>Maior campeão</th>
            <th>Maior vice</th>
            <th>Maior finalista</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${maiorCampeao ? `${linkParticipanteTabelaEstatistica(maiorCampeao.id)}<br><small>${maiorCampeao.total} título(s)</small>` : `Nenhum campeão cadastrado.`}</td>
            <td>${maiorVice ? `${linkParticipanteTabelaEstatistica(maiorVice.id)}<br><small>${maiorVice.total} vice(s)</small>` : `Nenhum vice cadastrado.`}</td>
            <td>${maiorFinalista ? `${linkParticipanteTabelaEstatistica(maiorFinalista.id)}<br><small>${maiorFinalista.finais} final(is)</small>` : `Nenhum finalista cadastrado.`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  renderizarRankingsEstatisticas(edicoes);
}



function nomeCompeticaoEstatistica(id) {
  const banco = carregarBanco();
  const competicao = (banco.competicoes || []).find(c => String(c.id) === String(id));
  return competicao?.nome || "";
}

function renderizarRankingsEstatisticas(edicoes) {
  const area = document.getElementById("rankingsEstatisticas");
  if (!area) return;

  const banco = carregarBanco();
  const categoriaFiltro = document.getElementById("filtroCategoriaEstatisticas")?.value || "todas";

  const edicoesClubes = filtrarEdicoesRankingPorCategoria(edicoes, banco, "clube");
  const edicoesSelecoes = filtrarEdicoesRankingPorCategoria(edicoes, banco, "selecao");

  if (categoriaFiltro === "clube") {
    area.innerHTML = renderizarGrupoRankingsCategoria("🏆 Clubes", edicoesClubes);
    return;
  }

  if (categoriaFiltro === "selecao") {
    area.innerHTML = renderizarGrupoRankingsCategoria("🌍 Seleções", edicoesSelecoes);
    return;
  }

  area.innerHTML = `
    ${renderizarGrupoRankingsCategoria("🏆 Clubes", edicoesClubes)}
    ${renderizarGrupoRankingsCategoria("🌍 Seleções", edicoesSelecoes)}
  `;
}

function filtrarEdicoesRankingPorCategoria(edicoes, banco, categoria) {
  return (edicoes || []).filter(edicao => {
    const competicao = (banco.competicoes || []).find(c => c.id === edicao.competicaoId);
    if (competicao) {
      return categoriaCompeticaoEstatisticas(competicao) === categoria;
    }

    const campeao = buscarParticipanteEstatistica(edicao.campeaoId);
    const vice = buscarParticipanteEstatistica(edicao.viceId);
    return campeao?.tipo === categoria || vice?.tipo === categoria;
  });
}

function renderizarGrupoRankingsCategoria(titulo, edicoesCategoria) {
  return `
    <div class="rankings-categoria-dashboard">
      <h3 class="titulo-ranking-categoria">${titulo}</h3>
      ${renderizarTabelaRankingCampeoes(edicoesCategoria)}
      ${renderizarTabelaRankingVices(edicoesCategoria)}
      ${renderizarTabelaRankingFinalistas(edicoesCategoria)}
    </div>
  `;
}

function renderizarTabelaRankingCampeoes(edicoes) {
  const rankingCampeoes = contarRankingPorId((edicoes || []).map(e => e.campeaoId));
  return tabelaRankingEstatisticas("🥇 Ranking de Campeões", ["Posição", "Campeão", "Total"], rankingCampeoes.slice(0, 10).map((item, index) => [
    `${index + 1}º`,
    linkParticipanteTabelaEstatistica(item.id),
    `${item.total} título(s)`
  ]), "Nenhum campeão cadastrado.");
}

function renderizarTabelaRankingVices(edicoes) {
  const rankingVices = contarRankingPorId((edicoes || []).map(e => e.viceId));
  return tabelaRankingEstatisticas("🥈 Ranking de Vices", ["Posição", "Vice", "Total"], rankingVices.slice(0, 10).map((item, index) => [
    `${index + 1}º`,
    linkParticipanteTabelaEstatistica(item.id),
    `${item.total} vice(s)`
  ]), "Nenhum vice cadastrado.");
}

function renderizarTabelaRankingFinalistas(edicoes) {
  const rankingFinalistas = contarRankingFinalistasEstatisticas(edicoes || []);
  return tabelaRankingEstatisticas("⭐ Ranking de Finalistas", ["Posição", "Finalista", "Finais", "Títulos", "Vices"], rankingFinalistas.slice(0, 10).map((item, index) => [
    `${index + 1}º`,
    linkParticipanteTabelaEstatistica(item.id),
    `${item.finais}`,
    `${item.titulos}`,
    `${item.vices}`
  ]), "Nenhum finalista cadastrado.");
}

function tabelaRankingEstatisticas(titulo, colunas, linhas, mensagemVazia) {
  if (!linhas.length) {
    return `
      <h3 class="titulo-tabela-estatistica">${titulo}</h3>
      <div class="tabela-container">
        <table class="tabela-estatisticas-campeoes tabela-ranking-estatisticas">
          <thead><tr><th>${colunas.join("</th><th>")}</th></tr></thead>
          <tbody><tr><td colspan="${colunas.length}">${mensagemVazia}</td></tr></tbody>
        </table>
      </div>
    `;
  }

  return `
    <h3 class="titulo-tabela-estatistica">${titulo}</h3>
    <div class="tabela-container">
      <table class="tabela-estatisticas-campeoes tabela-ranking-estatisticas">
        <thead>
          <tr>${colunas.map(c => `<th>${c}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${linhas.map(linha => `<tr>${linha.map(valor => `<td>${valor}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderizarCampeoesCompeticaoSelecionada(banco, competicoes, edicoes, competicaoId) {
  const area = document.getElementById("campeoesCompeticaoSelecionada");
  if (!area) return;

  const competicao = (banco.competicoes || []).find(c => c.id === competicaoId);
  if (!competicao) {
    area.innerHTML = "";
    return;
  }

  const registros = edicoes
    .filter(e => e.competicaoId === competicaoId)
    .sort((a, b) => Number(a.ano) - Number(b.ano));

  if (registros.length === 0) {
    area.innerHTML = `
      <h2 class="titulo-secao-estatistica">Campeões de ${limparTexto(competicao.nome)}</h2>
      <div class="card"><h3>Nenhum campeão cadastrado</h3><p>Essa competição ainda não possui campeões e vices registrados.</p></div>
    `;
    return;
  }

  area.innerHTML = `
    <h2 class="titulo-secao-estatistica">Campeões de ${limparTexto(competicao.nome)}</h2>
    ${tabelaHistoricoEstatisticas(registros)}
  `;
}

function renderizarListaHistorico(competicoes, edicoes) {
  const area = document.getElementById("historicoCompeticoesEstatisticas");
  if (!area) return;

  if (competicoes.length === 0) {
    area.innerHTML = `<div class="card"><h3>Nenhuma competição encontrada</h3><p>Cadastre competições ou altere os filtros.</p></div>`;
    return;
  }

  if (edicoes.length === 0) {
    area.innerHTML = `<div class="card"><h3>Sem histórico cadastrado</h3><p>As competições filtradas ainda não possuem campeões e vices cadastrados.</p></div>`;
    return;
  }

  area.innerHTML = tabelaHistoricoEstatisticas(edicoes);
}

function tabelaHistoricoEstatisticas(edicoes) {
  return `
    <div class="tabela-container">
      <table class="tabela-estatisticas-campeoes tabela-estatisticas-esquerda">
        <thead>
          <tr>
            <th>Ano</th>
            <th>Competição</th>
            <th>Campeão</th>
            <th>Vice</th>
          </tr>
        </thead>
        <tbody>
          ${edicoes.map(e => `
            <tr>
              <td><strong>${limparTexto(e.ano)}</strong></td>
              <td>${linkLiga(e.competicaoId)}</td>
              <td><div class="estatistica-coluna-time sem-label">${linkParticipanteTabelaEstatistica(e.campeaoId)}</div></td>
              <td><div class="estatistica-coluna-time sem-label">${linkParticipanteTabelaEstatistica(e.viceId)}</div></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}


function contarRankingFinalistasEstatisticas(edicoes) {
  const mapa = {};

  (edicoes || []).forEach(edicao => {
    const campeaoId = edicao.campeaoId;
    const viceId = edicao.viceId;

    if (campeaoId) {
      if (!mapa[campeaoId]) mapa[campeaoId] = { id: campeaoId, titulos: 0, vices: 0, finais: 0 };
      mapa[campeaoId].titulos += 1;
      mapa[campeaoId].finais += 1;
    }

    if (viceId) {
      if (!mapa[viceId]) mapa[viceId] = { id: viceId, titulos: 0, vices: 0, finais: 0 };
      mapa[viceId].vices += 1;
      mapa[viceId].finais += 1;
    }
  });

  return Object.values(mapa).sort((a, b) => {
    if (b.finais !== a.finais) return b.finais - a.finais;
    if (b.titulos !== a.titulos) return b.titulos - a.titulos;
    return String(nomeParticipanteEstatistica(a.id)).localeCompare(String(nomeParticipanteEstatistica(b.id)));
  });
}

function nomeParticipanteEstatistica(id) {
  const participante = buscarParticipanteEstatistica(id);
  return participante?.nome || "";
}

function contarRankingPorId(ids) {
  const mapa = {};
  ids.forEach(id => {
    if (!id) return;
    mapa[id] = (mapa[id] || 0) + 1;
  });

  return Object.entries(mapa)
    .map(([id, total]) => ({ id, total }))
    .sort((a, b) => b.total - a.total);
}

function categoriaCompeticaoEstatisticas(c) {
  if (!c) return "clube";
  return c.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : "clube") || "clube";
}

function textoNormalEstatisticas(valor) {
  return String(valor || "").trim().toLowerCase();
}

function competicaoEhMundoEstatisticas(c) {
  const abrangencia = textoNormalEstatisticas(c.abrangencia);
  const tipo = textoNormalEstatisticas(c.tipo);
  const local = textoNormalEstatisticas(c.local);
  return abrangencia === "mundial" || abrangencia === "mundo" || tipo.includes("mund") || local === "mundial" || local === "mundo";
}

function continenteCompeticaoEstatisticas(c) {
  if (!c) return "";
  if (c.continente) return c.continente;
  if (c.abrangencia === "Continental") return c.local || "";
  const pais = paisCompeticaoEstatisticas(c);
  return continentePaisEstatisticas(pais);
}

function paisCompeticaoEstatisticas(c) {
  if (!c) return "";
  if (c.pais) return c.pais;
  if (c.abrangencia === "País" || c.abrangencia === "Pais") return c.local || "";
  return c.local || "";
}

function listaPaisesEstatisticas() {
  const banco = carregarBanco();
  const mapa = new Map();
  const base = [
    ...(typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []),
    ...((banco.paises || []).map(p => ({
      nome: p.nome,
      continente: p.continente || continentePaisEstatisticas(p.nome),
      bandeira: p.bandeira || ""
    })))
  ];

  base.forEach(p => {
    if (!p || !p.nome) return;
    mapa.set(p.nome, {
      nome: p.nome,
      continente: p.continente || continentePaisEstatisticas(p.nome),
      bandeira: p.bandeira || ""
    });
  });

  return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
}

function continentePaisEstatisticas(nome) {
  if (!nome) return "";
  if (typeof buscarPaisSelecao === "function") return buscarPaisSelecao(nome)?.continente || "";
  const p = (typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []).find(item => item.nome === nome);
  return p?.continente || "";
}

function buscarParticipanteEstatistica(id) {
  const banco = carregarBanco();
  const idTexto = String(id || "");

  const clube = (banco.clubes || []).find(c => String(c.id) === idTexto);
  if (clube) {
    return { id: clube.id, nome: clube.nome, escudo: clube.escudo || "", tipo: "clube" };
  }

  const selecao = (banco.selecoes || []).find(s => String(s.id) === idTexto);
  if (selecao) {
    return {
      id: selecao.id,
      nome: selecao.nome || selecao.pais,
      escudo: selecao.escudo || "",
      bandeira: selecao.bandeira || "",
      pais: selecao.pais || selecao.nome,
      tipo: "selecao"
    };
  }

  return null;
}

function abrirDetalhesParticipanteEstatistica(participante) {
  if (!participante) return "";
  return participante.tipo === "selecao"
    ? `abrirDetalhesSelecao('${participante.id}')`
    : `abrirDetalhesTime('${participante.id}')`;
}

function linkParticipanteEstatistica(id) {
  const participante = buscarParticipanteEstatistica(id);
  if (!participante) return "Não encontrado";

  const escudo = participante.escudo
    ? `<img class="estatistica-time-escudo" src="${participante.escudo}" alt="Escudo de ${limparTexto(participante.nome)}">`
    : participante.tipo === "selecao"
      ? `<span class="estatistica-time-placeholder">${limparTexto(participante.bandeira || "🏳️")}</span>`
      : `<span class="estatistica-time-placeholder">⚽</span>`;

  return `
    <span class="estatistica-time-link" onclick="${abrirDetalhesParticipanteEstatistica(participante)}">
      ${escudo}
      <span>${limparTexto(participante.nome)}</span>
    </span>
  `;
}

function linkParticipanteTabelaEstatistica(id) {
  const participante = buscarParticipanteEstatistica(id);
  if (!participante) return "Não encontrado";

  const escudo = participante.escudo
    ? `<img src="${participante.escudo}" alt="Escudo de ${limparTexto(participante.nome)}">`
    : participante.tipo === "selecao"
      ? `<span class="estatistica-time-tabela-placeholder">${limparTexto(participante.bandeira || "🏳️")}</span>`
      : `<span class="estatistica-time-tabela-placeholder">⚽</span>`;

  return `
    <span class="estatistica-time-tabela" onclick="${abrirDetalhesParticipanteEstatistica(participante)}">
      ${escudo}
      <span>${limparTexto(participante.nome)}</span>
    </span>
  `;
}


/* Pesquisa principal da página Estatísticas */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pesquisaEstatisticas")?.addEventListener("input", renderizarHistoricoEstatisticas);
});
