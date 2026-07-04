
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

  const titulosPorCompeticao = contarTitulosPorCompeticao(titulos, banco);

  conteudo.innerHTML = `
    <h2>${limparTexto(clube.nome)}</h2>

    <div class="tabela-container">
      <table class="tabela-detalhe-time">
        <thead>
          <tr>
            <th>Informações do Time</th>
            <th>Rivais</th>
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
              <p><strong>Estádio:</strong> ${limparTexto(clube.estadio || "Não informado")}</p>
              <p><strong>Capacidade:</strong> ${limparTexto(clube.capacidade || "Não informado")}</p>
            </td>

            <td>
              ${
                rivais.length
                  ? `<ul class="lista-rivais-detalhes">
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br>

    <h3>Títulos conquistados por competição</h3>

    ${
      titulosPorCompeticao.length
        ? `
          <div class="tabela-container">
            <table class="tabela-detalhe-time">
              <thead>
                <tr>
                  <th>Competição</th>
                  <th>Total de títulos</th>
                  <th>Estrelas</th>
                </tr>
              </thead>

              <tbody>
                ${titulosPorCompeticao.map(item => `
                  <tr>
                    <td>${linkLiga(item.competicaoId)}</td>
                    <td>${item.total}</td>
                    <td><span class="titulo-estrelas">${"★".repeat(item.total)}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `
        : `<div class="time-sem-titulos">Nenhum título cadastrado.</div>`
    }

    <br>

    <h3>Histórico de títulos</h3>
    ${
      titulos.length
        ? titulos
            .slice()
            .sort((a, b) => Number(a.ano) - Number(b.ano))
            .map(t => `<p>${limparTexto(t.ano)} - ${linkLiga(t.competicaoId)}</p>`)
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
            .map(t => `<p>${limparTexto(t.ano)} - ${linkLiga(t.competicaoId)}</p>`)
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

function abrirDetalhesLiga(id) {
  const banco = carregarBanco();
  const liga = banco.competicoes.find(c => c.id === id);
  if (!liga) return;

  const edicoes = banco.titulos.filter(t => t.competicaoId === id);
  const rankingCampeoes = contarRankingDetalhes(edicoes.map(e => e.campeaoNome));
  const rankingVices = contarRankingDetalhes(edicoes.map(e => e.viceNome));

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
    <p><strong>Edições cadastradas:</strong> ${edicoes.length}</p>

    <br>
    <h3>Campeões e Vices</h3>
    ${
      edicoes.length
        ? edicoes.map(e => `<p>${limparTexto(e.ano)} - Campeão: ${linkTimeCompeticaoDetalhe(e.campeaoId)} | Vice: ${linkTimeCompeticaoDetalhe(e.viceId)}</p>`).join("")
        : `<p>Nenhuma edição cadastrada.</p>`
    }

    <br>
    <h3>Ranking de Campeões</h3>
    ${
      rankingCampeoes.length
        ? rankingCampeoes.map(r => `<p>${limparTexto(r.nome)}: ${r.total}</p>`).join("")
        : `<p>Nenhum campeão cadastrado.</p>`
    }

    <br>
    <h3>Ranking de Vices</h3>
    ${
      rankingVices.length
        ? rankingVices.map(r => `<p>${limparTexto(r.nome)}: ${r.total}</p>`).join("")
        : `<p>Nenhum vice cadastrado.</p>`
    }
  `;

  painel.classList.add("ativo");
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
  const clube = banco.clubes.find(c => c.id === id);

  if (!clube) return "Time não encontrado";

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


function abrirDetalhesSelecao(id) {
  const banco = carregarBanco();
  const selecao = banco.selecoes.find(s => s.id === id);
  if (!selecao) return;

  const painel = garantirPainelDetalhes();
  const conteudo = document.getElementById("conteudoDetalhesGlobal");

  const nomePais = selecao.pais || selecao.nome || "País não informado";
  const bandeira = typeof bandeiraPaisHTML === "function"
    ? bandeiraPaisHTML(nomePais, selecao.bandeira || "")
    : (selecao.bandeira || "");

  conteudo.innerHTML = `
    <h2>${limparTexto(nomePais)}</h2>

    <div class="tabela-container">
      <table class="tabela-detalhe-time">
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
  `;

  painel.classList.add("ativo");
}
