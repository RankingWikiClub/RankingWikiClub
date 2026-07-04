
document.addEventListener("DOMContentLoaded", () => {
  atualizarTotais();
  carregarLocaisEstatisticas();
  carregarCompeticoesEstatisticas();
  renderizarHistoricoEstatisticas();

  document.getElementById("filtroAbrangenciaEstatisticas")?.addEventListener("change", () => {
    carregarLocaisEstatisticas();
    carregarCompeticoesEstatisticas();
    renderizarHistoricoEstatisticas();
  });

  document.getElementById("filtroLocalEstatisticas")?.addEventListener("change", () => {
    carregarCompeticoesEstatisticas();
    renderizarHistoricoEstatisticas();
  });

  document.getElementById("filtroCompeticaoEstatisticas")?.addEventListener("change", renderizarHistoricoEstatisticas);
});

function atualizarTotais() {
  const banco = carregarBanco();
  setText("totalPaises", banco.paises.length);
  setText("totalClubes", banco.clubes.length);
  setText("totalSelecoes", banco.selecoes.length);
  setText("totalCompeticoes", banco.competicoes.length);
  setText("totalTitulos", banco.titulos.length);
}

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function carregarLocaisEstatisticas() {
  const banco = carregarBanco();
  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.value || "";
  const grupoLocal = document.getElementById("grupoFiltroLocalEstatisticas");
  const labelLocal = document.getElementById("labelFiltroLocalEstatisticas");
  const selectLocal = document.getElementById("filtroLocalEstatisticas");
  if (!grupoLocal || !labelLocal || !selectLocal) return;

  selectLocal.innerHTML = `<option value="">Todos</option>`;

  if (!abrangencia || abrangencia === "Mundial") {
    grupoLocal.classList.add("oculto");
    return;
  }

  grupoLocal.classList.remove("oculto");

  let locais = [];
  if (abrangencia === "Continental") {
    labelLocal.textContent = "Continente";
    locais = banco.competicoes.filter(c => c.abrangencia === "Continental").map(c => c.continente || c.local);
  }
  if (abrangencia === "País") {
    labelLocal.textContent = "País";
    locais = banco.competicoes.filter(c => c.abrangencia === "País").map(c => c.pais || c.local);
  }
  if (abrangencia === "Estadual") {
    labelLocal.textContent = "Estado";
    locais = banco.competicoes.filter(c => c.abrangencia === "Estadual").map(c => c.estado || c.local);
  }
  if (abrangencia === "Regional") {
    labelLocal.textContent = "Região";
    locais = banco.competicoes.filter(c => c.abrangencia === "Regional").map(c => c.regiao || c.local);
  }

  [...new Set(locais.filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .forEach(local => {
      const option = document.createElement("option");
      option.value = local;
      option.textContent = local;
      selectLocal.appendChild(option);
    });
}

function carregarCompeticoesEstatisticas() {
  const banco = carregarBanco();
  const select = document.getElementById("filtroCompeticaoEstatisticas");
  if (!select) return;

  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.value || "";
  const local = document.getElementById("filtroLocalEstatisticas")?.value || "";
  const competicoes = filtrarCompeticoesEstatisticas(banco, abrangencia, local);

  select.innerHTML = `<option value="">Todas as competições</option>`;

  competicoes.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nome;
    select.appendChild(option);
  });
}

function filtrarCompeticoesEstatisticas(banco, abrangencia, local) {
  return banco.competicoes.filter(c => {
    if (abrangencia && c.abrangencia !== abrangencia) return false;
    if (local) {
      const localCompeticao = c.estado || c.pais || c.continente || c.regiao || c.local || "";
      if (localCompeticao !== local) return false;
    }
    return true;
  });
}

function renderizarHistoricoEstatisticas() {
  const banco = carregarBanco();
  const abrangencia = document.getElementById("filtroAbrangenciaEstatisticas")?.value || "";
  const local = document.getElementById("filtroLocalEstatisticas")?.value || "";
  const competicaoId = document.getElementById("filtroCompeticaoEstatisticas")?.value || "";

  let competicoes = filtrarCompeticoesEstatisticas(banco, abrangencia, local);
  if (competicaoId) competicoes = competicoes.filter(c => c.id === competicaoId);

  const ids = competicoes.map(c => c.id);
  const edicoes = banco.titulos
    .filter(t => ids.includes(t.competicaoId))
    .sort((a, b) => Number(a.ano) - Number(b.ano));

  renderizarResumoEstatisticas(competicoes, edicoes);
  renderizarCampeoesCompeticaoSelecionada(banco, competicoes, edicoes, competicaoId);
  renderizarListaHistorico(competicoes, edicoes);
}

function renderizarResumoEstatisticas(competicoes, edicoes) {
  const area = document.getElementById("resumoCompeticaoEstatisticas");
  if (!area) return;

  const rankingCampeoes = contarRankingPorId(edicoes.map(e => e.campeaoId));
  const rankingVices = contarRankingPorId(edicoes.map(e => e.viceId));
  const maiorCampeao = rankingCampeoes[0];
  const maiorVice = rankingVices[0];

  area.innerHTML = `
    <div class="ranking-mini"><h3>Competições filtradas</h3><p>${competicoes.length}</p></div>
    <div class="ranking-mini"><h3>Edições cadastradas</h3><p>${edicoes.length}</p></div>
    <div class="ranking-mini"><h3>Time que mais foi campeão</h3>${maiorCampeao ? `<p>${linkTime(maiorCampeao.id)} - ${maiorCampeao.total} título(s)</p>` : `<p>Nenhum campeão cadastrado.</p>`}</div>
    <div class="ranking-mini"><h3>Time que mais foi vice</h3>${maiorVice ? `<p>${linkTime(maiorVice.id)} - ${maiorVice.total} vice(s)</p>` : `<p>Nenhum vice cadastrado.</p>`}</div>
  `;
}



function renderizarCampeoesCompeticaoSelecionada(banco, competicoes, edicoes, competicaoId) {
  const area = document.getElementById("campeoesCompeticaoSelecionada");
  if (!area) return;

  if (!competicaoId) {
    area.innerHTML = "";
    return;
  }

  const competicao = banco.competicoes.find(c => c.id === competicaoId);

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
      <div class="card">
        <h3>Nenhum campeão cadastrado</h3>
        <p>Essa competição ainda não possui campeões e vices registrados.</p>
      </div>
    `;
    return;
  }

  area.innerHTML = `
    <h2 class="titulo-secao-estatistica">Campeões de ${limparTexto(competicao.nome)}</h2>

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
          ${registros.map(registro => `
            <tr>
              <td><strong>${limparTexto(registro.ano)}</strong></td>
              <td>${linkLiga(registro.competicaoId)}</td>
              <td>
                <div class="estatistica-coluna-time sem-label">
                  ${linkTimeTabelaEstatistica(registro.campeaoId)}
                </div>
              </td>
              <td>
                <div class="estatistica-coluna-time sem-label">
                  ${linkTimeTabelaEstatistica(registro.viceId)}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
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

  area.innerHTML = `
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
              <td>
                <div class="estatistica-coluna-time sem-label">
                  ${linkTimeTabelaEstatistica(e.campeaoId)}
                </div>
              </td>
              <td>
                <div class="estatistica-coluna-time sem-label">
                  ${linkTimeTabelaEstatistica(e.viceId)}
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
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


function linkTimeEstatistica(id) {
  const banco = carregarBanco();
  const clube = banco.clubes.find(c => c.id === id);

  if (!clube) return "Time não encontrado";

  const escudo = clube.escudo
    ? `<img class="estatistica-time-escudo" src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
    : `<span class="estatistica-time-placeholder">⚽</span>`;

  return `
    <span class="estatistica-time-link" onclick="abrirDetalhesTime('${clube.id}')">
      ${escudo}
      <span>${limparTexto(clube.nome)}</span>
    </span>
  `;
}


function linkTimeTabelaEstatistica(id) {
  const banco = carregarBanco();
  const clube = banco.clubes.find(c => c.id === id);

  if (!clube) return "Time não encontrado";

  const escudo = clube.escudo
    ? `<img src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
    : `<span class="estatistica-time-tabela-placeholder">⚽</span>`;

  return `
    <span class="estatistica-time-tabela" onclick="abrirDetalhesTime('${clube.id}')">
      ${escudo}
      <span>${limparTexto(clube.nome)}</span>
    </span>
  `;
}
