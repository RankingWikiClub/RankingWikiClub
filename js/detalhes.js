
/* Helpers próprios dos detalhes.
   A página Seleções não carrega banco.js, então estas funções precisam existir aqui também. */
function normalizarTextoBusca(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizarTipoParticipante(tipo) {
  const valor = normalizarTextoBusca(tipo);
  if (["selecao", "selecoes", "competicao de selecoes", "competicoes de selecoes"].includes(valor)) return "selecao";
  return "clube";
}

function buscarSelecaoDetalhePorIdOuNome(banco, id, nome) {
  const nomeNormalizado = normalizarTextoBusca(nome);
  return (banco.selecoes || []).find(s =>
    String(s.id || "") === String(id || "") ||
    normalizarTextoBusca(s.nome || s.pais || "") === nomeNormalizado ||
    normalizarTextoBusca(s.pais || s.nome || "") === nomeNormalizado
  );
}


function garantirPainelDetalhes() {
  let painel = document.getElementById("painelDetalhesGlobal");

  if (painel) return painel;

  painel = document.createElement("div");
  painel.id = "painelDetalhesGlobal";
  painel.className = "painel-detalhes-global";
  painel.innerHTML = `
    <div class="conteudo-detalhes-global">
      <button class="fechar-detalhes-global" onclick="fecharDetalhesGlobal()">Fechar</button>
      <div id="conteudoDetalhesGlobal"></div>
    </div>
  `;

  document.body.appendChild(painel);

  painel.addEventListener("click", event => {
    if (event.target.id === "painelDetalhesGlobal") fecharDetalhesGlobal();
  });

  return painel;
}

function fecharDetalhesGlobal() {
  const painel = document.getElementById("painelDetalhesGlobal");
  if (painel) painel.classList.remove("ativo");
}



function abrirDetalhesTime(id) {
  const banco = carregarBanco();
  const clube = banco.clubes.find(c => c.id === id);
  if (!clube) return;

  const titulos = banco.titulos.filter(t => t.campeaoId === id);
  const vices = banco.titulos.filter(t => t.viceId === id);
  const rivais = (clube.rivais || [])
    .map(rivalId => banco.clubes.find(c => c.id === rivalId))
    .filter(Boolean);

  const painel = garantirPainelDetalhes();
  const conteudo = document.getElementById("conteudoDetalhesGlobal");

  const escudoHtml = clube.escudo
    ? `<img class="detalhe-time-tabela-escudo" src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
    : `<div class="escudo-placeholder">⚽</div>`;

  const desempenhoPorCompeticao = contarTitulosEVicesPorCompeticao(titulos, vices, banco);

  conteudo.innerHTML = `
    <h2>${limparTexto(clube.nome)}</h2>

    <div class="tabela-container">
      <table class="tabela-detalhe-time tabela-detalhe-time-unica">
        <thead>
          <tr>
            <th>Informações do Time</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${escudoHtml}
              <p><strong>Nome curto:</strong> ${limparTexto(clube.nome)}</p>
              <p><strong>Nome completo:</strong> ${limparTexto(clube.nomeCompleto || clube.nome)}</p>
              <p><strong>País:</strong> ${bandeiraPaisHTML(clube.pais, clube.bandeira)} ${limparTexto(clube.pais || "Não informado")}</p>
              ${clube.pais === "Brasil" ? `<p><strong>Estado:</strong> ${limparTexto(clube.estado || "Não informado")} ${clube.siglaEstado ? `(${limparTexto(clube.siglaEstado)})` : ""}</p>` : ""}
              <p><strong>Cidade:</strong> ${limparTexto(clube.cidade || "Não informado")}</p>
              <p><strong>Fundação:</strong> ${limparTexto(formatarDataFundacao(clube.fundacao) || "Não informado")}</p>
              <p><strong>Idade do clube:</strong> ${limparTexto(textoIdadeFundacao(clube.fundacao))}</p>

              <div class="rivais-integrados-info">
                <p><strong>Rivais:</strong></p>
                ${
                  rivais.length
                    ? `<ul class="lista-rivais-detalhes lista-rivais-integrada">
                        ${rivais.map(r => `
                          <li class="rival-detalhe-item" onclick="abrirDetalhesTime('${r.id}')">
                            ${
                              r.escudo
                                ? `<img class="rival-escudo-mini" src="${r.escudo}" alt="Escudo de ${limparTexto(r.nome)}">`
                                : `<span class="rival-escudo-placeholder">⚽</span>`
                            }
                            <span class="rival-nome link-detalhe">${limparTexto(r.nome)}</span>
                          </li>
                        `).join("")}
                      </ul>`
                    : `<p>Nenhum rival cadastrado.</p>`
                }
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>    <br>

    <h3>Títulos e vices por competição</h3>

    ${
      desempenhoPorCompeticao.length
        ? `
          <div class="tabela-container">
            <table class="tabela-detalhe-time tabela-titulos-compacta tabela-titulos-vices-compacta">
              <thead>
                <tr>
                  <th>Competição</th>
                  <th class="th-total-titulos">Títulos</th>
                  <th class="th-total-vices">Vices</th>
                </tr>
              </thead>

              <tbody>
                ${desempenhoPorCompeticao.map(item => `
                  <tr>
                    <td>${linkLiga(item.competicaoId)}</td>
                    <td class="total-titulos-com-estrelas">
                      <div class="numero-total-titulos">${item.titulos}</div>
                      <div class="titulo-estrelas">${item.titulos ? "★".repeat(item.titulos) : "-"}</div>
                    </td>
                    <td class="total-vices-com-estrelas">
                      <div class="numero-total-vices">${item.vices}</div>
                      <div class="vice-estrelas">${item.vices ? "☆".repeat(item.vices) : "-"}</div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `
        : `<div class="time-sem-titulos">Nenhum título ou vice cadastrado.</div>`
    }

    <br>

    <h3>Histórico de títulos</h3>
    ${
      titulos.length
        ? titulos
            .slice()
            .sort((a, b) => Number(a.ano) - Number(b.ano))
            .map(t => `<div class="linha-historico"><span>${limparTexto(t.ano)} - ${linkLiga(t.competicaoId)}</span></div>`)
            .join("")
        : `<p>Nenhum título cadastrado.</p>`
    }

    <br>

    <h3>Vice-campeonatos</h3>
    ${
      vices.length
        ? vices
            .slice()
            .sort((a, b) => Number(a.ano) - Number(b.ano))
            .map(t => `<div class="linha-historico"><span>${limparTexto(t.ano)} - ${linkLiga(t.competicaoId)}</span></div>`)
            .join("")
        : `<p>Nenhum vice-campeonato cadastrado.</p>`
    }
  `;

  painel.classList.add("ativo");
}

function contarTitulosPorCompeticao(titulos, banco) {
  const mapa = {};

  titulos.forEach(titulo => {
    if (!titulo.competicaoId) return;

    if (!mapa[titulo.competicaoId]) {
      const competicao = banco.competicoes.find(c => c.id === titulo.competicaoId);

      mapa[titulo.competicaoId] = {
        competicaoId: titulo.competicaoId,
        nome: competicao ? competicao.nome : titulo.competicaoNome,
        total: 0
      };
    }

    mapa[titulo.competicaoId].total++;
  });

  return Object.values(mapa)
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
}

function contarTitulosEVicesPorCompeticao(titulos, vices, banco) {
  const mapa = {};

  function garantirCompeticao(registro) {
    if (!registro.competicaoId) return null;
    const chave = String(registro.competicaoId);

    if (!mapa[chave]) {
      const competicao = (banco.competicoes || []).find(c => String(c.id) === chave);
      mapa[chave] = {
        competicaoId: registro.competicaoId,
        nome: competicao ? competicao.nome : (registro.competicaoNome || "Competição"),
        titulos: 0,
        vices: 0
      };
    }

    return mapa[chave];
  }

  (titulos || []).forEach(registro => {
    const item = garantirCompeticao(registro);
    if (item) item.titulos++;
  });

  (vices || []).forEach(registro => {
    const item = garantirCompeticao(registro);
    if (item) item.vices++;
  });

  return Object.values(mapa)
    .sort((a, b) =>
      (b.titulos + b.vices) - (a.titulos + a.vices) ||
      b.titulos - a.titulos ||
      b.vices - a.vices ||
      String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR")
    );
}


function anoOrdenacaoCompeticaoDetalhe(valor) {
  const texto = String(valor || "");
  const encontrado = texto.match(/\d{4}/);
  return encontrado ? parseInt(encontrado[0], 10) : 999999;
}

function ordenarEdicoesPorAnoCrescente(edicoes) {
  return [...edicoes].sort((a, b) => {
    const anoA = anoOrdenacaoCompeticaoDetalhe(a.ano);
    const anoB = anoOrdenacaoCompeticaoDetalhe(b.ano);

    if (anoA !== anoB) return anoA - anoB;

    return String(a.ano || "").localeCompare(String(b.ano || ""), "pt-BR", { numeric: true });
  });
}


function nomeParticipanteCompeticaoDetalhe(id) {
  const banco = carregarBanco();
  const clube = (banco.clubes || []).find(c => String(c.id) === String(id));
  if (clube) return clube.nome || "";

  const selecao = (banco.selecoes || []).find(s => String(s.id) === String(id));
  if (selecao) return selecao.nome || selecao.pais || "";

  return "";
}

function contarRankingFinalistasCompeticaoDetalhe(edicoes) {
  const mapa = {};

  (edicoes || []).forEach(edicao => {
    const campeaoId = edicao.campeaoId;
    const viceId = edicao.viceId;

    if (campeaoId) {
      const chave = String(campeaoId);
      if (!mapa[chave]) mapa[chave] = { id: campeaoId, titulos: 0, vices: 0, finais: 0 };
      mapa[chave].titulos += 1;
      mapa[chave].finais += 1;
    }

    if (viceId) {
      const chave = String(viceId);
      if (!mapa[chave]) mapa[chave] = { id: viceId, titulos: 0, vices: 0, finais: 0 };
      mapa[chave].vices += 1;
      mapa[chave].finais += 1;
    }
  });

  return Object.values(mapa).sort((a, b) => {
    if (b.finais !== a.finais) return b.finais - a.finais;
    if (b.titulos !== a.titulos) return b.titulos - a.titulos;
    return String(nomeParticipanteCompeticaoDetalhe(a.id)).localeCompare(
      String(nomeParticipanteCompeticaoDetalhe(b.id)),
      "pt-BR"
    );
  });
}


function contarRankingParticipantesCompeticaoDetalhe(edicoes, campoId) {
  const mapa = {};

  (edicoes || []).forEach(edicao => {
    const participanteId = edicao[campoId];
    if (!participanteId) return;

    const chave = String(participanteId);
    if (!mapa[chave]) mapa[chave] = { id: participanteId, total: 0 };
    mapa[chave].total += 1;
  });

  return Object.values(mapa).sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;

    return String(nomeParticipanteCompeticaoDetalhe(a.id)).localeCompare(
      String(nomeParticipanteCompeticaoDetalhe(b.id)),
      "pt-BR"
    );
  });
}

function tabelaRankingSimplesCompeticaoDetalhe(tituloColuna, ranking, textoVazio) {
  if (!ranking.length) return `<p>${textoVazio}</p>`;

  const ehVice = normalizarTextoBusca(tituloColuna).includes("vice");
  const classeEstrelas = ehVice ? "ranking-estrelas ranking-estrelas-vice" : "ranking-estrelas ranking-estrelas-campeao";

  return `
    <div class="tabela-container">
      <table class="tabela-detalhe-time tabela-competicao-detalhe tabela-ranking-competicao-detalhe tabela-ranking-estrelas-competicao">
        <thead>
          <tr>
            <th>${tituloColuna}</th>
            <th class="coluna-total-ranking">Total</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(r => `
            <tr>
              <td>${linkTimeCompeticaoDetalhe(r.id)}</td>
              <td class="coluna-total-ranking total-ranking-com-estrelas">
                <div class="numero-total-ranking">${r.total}</div>
                <div class="${classeEstrelas}">${r.total ? "★".repeat(r.total) : "-"}</div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function tabelaRankingFinalistasCompeticaoDetalhe(ranking) {
  if (!ranking.length) return `<p>Nenhum finalista cadastrado.</p>`;

  return `
    <div class="tabela-container">
      <table class="tabela-detalhe-time tabela-competicao-detalhe tabela-ranking-competicao-detalhe">
        <thead>
          <tr>
            <th>Finalista</th>
            <th>Finais</th>
            <th>Títulos</th>
            <th>Vices</th>
          </tr>
        </thead>
        <tbody>
          ${ranking.map(r => `
            <tr>
              <td>${linkTimeCompeticaoDetalhe(r.id)}</td>
              <td>${r.finais}</td>
              <td>${r.titulos}</td>
              <td>${r.vices}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function tabelaEdicoesCompeticaoDetalhe(edicoes) {
  if (!edicoes.length) return `<p>Nenhuma edição cadastrada.</p>`;

  return `
    <div class="tabela-container">
      <table class="tabela-detalhe-time tabela-competicao-detalhe tabela-edicoes-competicao-detalhe">
        <thead>
          <tr>
            <th>Ano</th>
            <th>Campeão</th>
            <th>Vice</th>
          </tr>
        </thead>
        <tbody>
          ${edicoes.map(e => `
            <tr class="linha-edicao-competicao-detalhe">
              <td class="coluna-ano-edicao">${limparTexto(e.ano)}</td>
              <td>${linkTimeCompeticaoDetalhe(e.campeaoId)}</td>
              <td>${linkTimeCompeticaoDetalhe(e.viceId)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function abrirDetalhesLiga(id) {
  const banco = carregarBanco();
  const liga = banco.competicoes.find(c => c.id === id);
  if (!liga) return;

  const edicoes = ordenarEdicoesPorAnoCrescente(banco.titulos.filter(t => t.competicaoId === id));
  const rankingCampeoes = contarRankingParticipantesCompeticaoDetalhe(edicoes, "campeaoId");
  const rankingVices = contarRankingParticipantesCompeticaoDetalhe(edicoes, "viceId");
  const rankingFinalistas = contarRankingFinalistasCompeticaoDetalhe(edicoes);

  const painel = garantirPainelDetalhes();
  const conteudo = document.getElementById("conteudoDetalhesGlobal");

  conteudo.innerHTML = `
    <h2>${limparTexto(liga.nome)}</h2>
    ${
      liga.escudo
        ? `<img src="${liga.escudo}" alt="Escudo da competição ${limparTexto(liga.nome)}">`
        : `<div class="escudo-placeholder">🏆</div>`
    }

    <p><strong>Tipo:</strong> ${limparTexto(liga.tipo || "Não informado")}</p>
    <p><strong>Abrangência:</strong> ${limparTexto(liga.abrangencia || "Não informado")}</p>
    <p><strong>Local:</strong> ${limparTexto(liga.bandeira || "")} ${limparTexto(liga.local || "Não informado")}</p>
    ${liga.continente ? `<p><strong>Continente:</strong> ${limparTexto(liga.continente)}</p>` : ""}
    ${liga.estado ? `<p><strong>Estado:</strong> ${limparTexto(liga.estado)}</p>` : ""}
    <p><strong>Edições:</strong> ${edicoes.length}</p>

    <br>
    <h3 class="titulo-secao-competicao-detalhe">Ranking de Campeões</h3>
    ${tabelaRankingSimplesCompeticaoDetalhe("Campeão", rankingCampeoes, "Nenhum campeão cadastrado.")}

    <br>
    <h3 class="titulo-secao-competicao-detalhe">Ranking de Vices</h3>
    ${tabelaRankingSimplesCompeticaoDetalhe("Vice", rankingVices, "Nenhum vice cadastrado.")}

    <br>
    <h3 class="titulo-secao-competicao-detalhe">Ranking de Finalistas</h3>
    ${tabelaRankingFinalistasCompeticaoDetalhe(rankingFinalistas)}

    <br>
    <h3 class="titulo-secao-competicao-detalhe">Campeões e Vices</h3>
    <div id="listaEdicoesCompeticaoDetalhe">
      ${tabelaEdicoesCompeticaoDetalhe(edicoes)}
    </div>
  `;

  painel.classList.add("ativo");
}

function filtrarEdicoesCompeticaoDetalhe(valor) {
  const termo = String(valor || "").trim().toLowerCase();
  const linhas = document.querySelectorAll(".linha-edicao-competicao-detalhe");

  linhas.forEach(linha => {
    const texto = linha.textContent.toLowerCase();
    linha.style.display = texto.includes(termo) ? "" : "none";
  });
}

function linkTime(id) {
  const banco = carregarBanco();
  const clube = banco.clubes.find(c => c.id === id);

  if (!clube) return "Time não encontrado";

  const escudo = clube.escudo
    ? `<img class="escudo-inline" src="${clube.escudo}" alt="Escudo">`
    : "";

  return `
    <span class="linha-link link-detalhe" onclick="abrirDetalhesTime('${clube.id}')">
      ${escudo}${limparTexto(clube.nome)}
    </span>
  `;
}

function linkLiga(id) {
  const banco = carregarBanco();
  const liga = banco.competicoes.find(c => c.id === id);

  if (!liga) return "Competição não encontrada";

  const escudo = liga.escudo
    ? `<img class="escudo-inline" src="${liga.escudo}" alt="Escudo">`
    : "";

  return `
    <span class="linha-link link-detalhe" onclick="abrirDetalhesLiga('${liga.id}')">
      ${escudo}${limparTexto(liga.nome)}
    </span>
  `;
}

function contarRankingDetalhes(nomes) {
  const mapa = {};

  nomes.forEach(nome => {
    if (!nome) return;
    mapa[nome] = (mapa[nome] || 0) + 1;
  });

  return Object.entries(mapa)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
}


function linkTimeDetalheCompeticao(id) {
  return linkTimeCompeticaoDetalhe(id);
}


function linkTimeCompeticaoDetalhe(id) {
  const banco = carregarBanco();
  const clube = (banco.clubes || []).find(c => c.id === id);

  if (clube) {
    const escudo = clube.escudo
      ? `<img class="escudo-time-competicao-detalhe" src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
      : `<span class="placeholder-time-competicao-detalhe">⚽</span>`;

    return `
      <span class="linha-time-competicao-detalhe" onclick="abrirDetalhesTime('${clube.id}')">
        ${escudo}
        <span class="nome-time-competicao-detalhe">${limparTexto(clube.nome)}</span>
      </span>
    `;
  }

  const selecao = (banco.selecoes || []).find(s => s.id === id);

  if (selecao) {
    const nomeSelecao = selecao.nome || selecao.pais || "Seleção";
    const bandeira = selecao.bandeira
      ? `<span class="placeholder-time-competicao-detalhe">${limparTexto(selecao.bandeira)}</span>`
      : `<span class="placeholder-time-competicao-detalhe">🏳️</span>`;

    return `
      <span class="linha-time-competicao-detalhe" onclick="abrirDetalhesSelecao('${selecao.id}')">
        ${bandeira}
        <span class="nome-time-competicao-detalhe">${limparTexto(nomeSelecao)}</span>
      </span>
    `;
  }

  return "Participante não encontrado";
}


function abrirDetalhesSelecao(id) {
  const banco = carregarBanco();
  const selecao = buscarSelecaoDetalhePorIdOuNome(banco, id, id);
  if (!selecao) {
    alert("Seleção não encontrada.");
    return;
  }

  const painel = garantirPainelDetalhes();
  const conteudo = document.getElementById("conteudoDetalhesGlobal");

  const nomePais = selecao.pais || selecao.nome || "País não informado";
  const nomeNormalizado = normalizarTextoBusca(nomePais);
  const bandeira = typeof bandeiraPaisHTML === "function"
    ? bandeiraPaisHTML(nomePais, selecao.bandeira || "")
    : (selecao.bandeira || "");

  const titulosSelecao = (banco.titulos || []).filter(titulo => {
    const competicao = (banco.competicoes || []).find(c => String(c.id) === String(titulo.competicaoId));
    const categoriaCompeticao = competicao ? (competicao.categoria || normalizarCategoriaCompeticao(competicao)) : "";
    const tipoCampeao = normalizarTipoParticipante(titulo.campeaoTipo || categoriaCompeticao);
    const campeaoNome = normalizarTextoBusca(titulo.campeaoNome || "");

    return (
      tipoCampeao === "selecao" &&
      (
        String(titulo.campeaoId || "") === String(selecao.id) ||
        campeaoNome === nomeNormalizado
      )
    );
  });

  const vicesSelecao = (banco.titulos || []).filter(titulo => {
    const competicao = (banco.competicoes || []).find(c => String(c.id) === String(titulo.competicaoId));
    const categoriaCompeticao = competicao ? (competicao.categoria || normalizarCategoriaCompeticao(competicao)) : "";
    const tipoVice = normalizarTipoParticipante(titulo.viceTipo || categoriaCompeticao);
    const viceNome = normalizarTextoBusca(titulo.viceNome || "");

    return (
      tipoVice === "selecao" &&
      (
        String(titulo.viceId || "") === String(selecao.id) ||
        viceNome === nomeNormalizado
      )
    );
  });

  const desempenhoPorCompeticao = contarTitulosEVicesPorCompeticao(titulosSelecao, vicesSelecao, banco);

  conteudo.innerHTML = `
    <h2>${limparTexto(nomePais)}</h2>

    <div class="tabela-container">
      <table class="tabela-detalhe-time tabela-detalhe-time-unica">
        <thead>
          <tr>
            <th>Informações da Seleção</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              ${
                selecao.escudo
                  ? `<img class="detalhe-time-tabela-escudo" src="${selecao.escudo}" alt="Escudo de ${limparTexto(nomePais)}">`
                  : `<div class="escudo-placeholder">⚽</div>`
              }

              <p><strong>Nome:</strong> ${limparTexto(nomePais)}</p>
              <p><strong>Continente:</strong> ${limparTexto(selecao.continente || "Não informado")}</p>
              <p><strong>País:</strong> ${bandeira} ${limparTexto(nomePais)}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br>

    <h3>Títulos e vices por competição</h3>
    ${
      desempenhoPorCompeticao.length
        ? `
          <div class="tabela-container">
            <table class="tabela-detalhe-time tabela-titulos-compacta tabela-titulos-vices-compacta">
              <thead>
                <tr>
                  <th>Competição</th>
                  <th class="th-total-titulos">Títulos</th>
                  <th class="th-total-vices">Vices</th>
                </tr>
              </thead>

              <tbody>
                ${desempenhoPorCompeticao.map(item => `
                  <tr>
                    <td>${linkLiga(item.competicaoId)}</td>
                    <td class="total-titulos-com-estrelas">
                      <div class="numero-total-titulos">${item.titulos}</div>
                      <div class="titulo-estrelas">${item.titulos ? "★".repeat(item.titulos) : "-"}</div>
                    </td>
                    <td class="total-vices-com-estrelas">
                      <div class="numero-total-vices">${item.vices}</div>
                      <div class="vice-estrelas">${item.vices ? "☆".repeat(item.vices) : "-"}</div>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `
        : `<div class="time-sem-titulos">Nenhum título ou vice cadastrado.</div>`
    }

    <br>

    <h3>Histórico de títulos</h3>
    ${
      titulosSelecao.length
        ? titulosSelecao
            .slice()
            .sort((a, b) => Number(a.ano) - Number(b.ano))
            .map(t => `<div class="linha-historico"><span>${limparTexto(t.ano)} - ${linkLiga(t.competicaoId)}</span></div>`)
            .join("")
        : `<p>Nenhum título cadastrado.</p>`
    }

    <br>

    <h3>Vice-campeonatos</h3>
    ${
      vicesSelecao.length
        ? vicesSelecao
            .slice()
            .sort((a, b) => Number(a.ano) - Number(b.ano))
            .map(t => `<div class="linha-historico"><span>${limparTexto(t.ano)} - ${linkLiga(t.competicaoId)}</span></div>`)
            .join("")
        : `<p>Nenhum vice-campeonato cadastrado.</p>`
    }
  `;

  painel.classList.add("ativo");
}
