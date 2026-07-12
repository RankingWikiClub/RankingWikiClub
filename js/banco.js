
function mostrarEdicao(tipo) {
  const banco = carregarBanco();
  const area = document.getElementById("areaEdicao");
  if (!area) return;

  area.innerHTML = "";

  if (tipo === "clubes") area.innerHTML = tabelaClubes(banco);
  else if (tipo === "selecoes") area.innerHTML = tabelaSelecoesSimplificada(banco);
  else if (tipo === "competicoes") area.innerHTML = tabelaCompeticoes(banco);
  else if (tipo === "titulos") area.innerHTML = tabelaTitulos(banco);
  else area.innerHTML = "<p>Opção de edição não encontrada.</p>";

  area.scrollIntoView({ behavior: "smooth", block: "start" });
}

function tabelaClubes(banco) {
  const clubesOrdenados = (banco.clubes || []).slice().sort((a, b) =>
    (typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(a) : (a.nome || "")).localeCompare(
      typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(b) : (b.nome || ""),
      "pt-BR",
      { sensitivity: "base" }
    )
  );

  return tabela(["Time", "País", "Estado", "Fundação", "Rivais", "Ações"], clubesOrdenados.map(c => [
    `<span class="link-detalhe" onclick="abrirDetalhesTime(\'${c.id}\')">${imagemNome(c.escudo, c.nome, "⚽")}</span>`,
    `${bandeiraPaisHTML(c.pais, c.bandeira)} ${c.pais || ""}`,
    c.siglaEstado || "",
    formatarDataFundacao(c.fundacao) || "",
    (c.rivais || []).map(id => {
      const rival = banco.clubes.find(clube => String(clube.id) === String(id));
      return rival ? (typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(rival) : rival.nome) : "";
    }).filter(Boolean).sort((a,b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" })).join(", "),
    botoesEditarExcluir("clubes", c.id)
  ]));
}

function tabelaSelecoes(banco) {
  return tabelaSelecoesSimplificada(banco);
}

function filtrosEdicao(prefixo, funcao) {
  return `
    <div class="filtros filtros-edicao">
      <div>
        <label>Categoria</label>
        <select id="${prefixo}Categoria" onchange="${funcao}()">
          <option value="">Clubes e seleções</option>
          <option value="clube">Competições de clubes</option>
          <option value="selecao">Competições de seleções</option>
        </select>
      </div>
      <div>
        <label>Abrangência</label>
        <select id="${prefixo}Abrangencia" onchange="${funcao}()">
          <option value="">Todas as abrangências</option>
          <option value="Mundial">Mundial</option>
          <option value="Continental">Continental</option>
          <option value="Regional">Regional</option>
          <option value="País">País</option>
          <option value="Estadual">Estadual</option>
        </select>
      </div>
    </div>
  `;
}

function tabelaCompeticoes(banco) {
  const linhas = (banco.competicoes || []).map(c => {
    const categoria = c.categoria || normalizarCategoriaCompeticao(c) || "clube";
    return `
      <tr data-categoria="${categoria}" data-abrangencia="${limparTexto(c.abrangencia || "")}">
        <td><span class="link-detalhe" onclick="abrirDetalhesLiga('${c.id}')">${imagemNome(c.escudo, c.nome, "🏆")}</span></td>
        <td>${categoria === "selecao" ? "Competição de seleções" : "Competição de clubes"}</td>
        <td>${limparTexto(c.tipo || "Não informado")}</td>
        <td>${limparTexto(c.abrangencia || "")}</td>
        <td>${c.bandeira || ""} ${limparTexto(c.local || "")}</td>
        <td>${botoesEditarExcluir("competicoes", c.id)}</td>
      </tr>
    `;
  }).join("");

  if (!linhas) return `<div class="tabela-container"><p>Nenhuma competição cadastrada para editar.</p></div>`;

  return `
    ${filtrosEdicao("filtroEdicaoCompeticoes", "aplicarFiltrosEdicaoCompeticoes")}
    <div class="tabela-container">
      <table class="tabela" id="tabelaEdicaoCompeticoes">
        <tr><th>Competição</th><th>Categoria</th><th>Tipo</th><th>Abrangência</th><th>Local</th><th>Ações</th></tr>
        ${linhas}
      </table>
    </div>
  `;
}

function tabelaTitulos(banco) {
  const linhas = (banco.titulos || []).map(t => {
    const competicao = (banco.competicoes || []).find(c => c.id === t.competicaoId);
    const categoria = t.campeaoTipo || t.viceTipo || (competicao ? (competicao.categoria || normalizarCategoriaCompeticao(competicao)) : "") || "clube";
    return `
      <tr data-categoria="${categoria}" data-abrangencia="${limparTexto(t.abrangencia || competicao?.abrangencia || "")}">
        <td>${limparTexto(t.ano || "")}</td>
        <td>${categoria === "selecao" ? "Seleções" : "Clubes"}</td>
        <td>${limparTexto(t.abrangencia || competicao?.abrangencia || "")}</td>
        <td>${linkLiga(t.competicaoId)}</td>
        <td>${linkParticipanteEdicao(t.campeaoId, t.campeaoTipo, t.campeaoNome)}</td>
        <td>${linkParticipanteEdicao(t.viceId, t.viceTipo, t.viceNome)}</td>
        <td>${botoesEditarExcluir("titulos", t.id)}</td>
      </tr>
    `;
  }).join("");

  if (!linhas) return `<div class="tabela-container"><p>Nenhum campeão ou vice cadastrado para editar.</p></div>`;

  return `
    ${filtrosEdicao("filtroEdicaoTitulos", "aplicarFiltrosEdicaoTitulos")}
    <div class="tabela-container">
      <table class="tabela" id="tabelaEdicaoTitulos">
        <tr><th>Ano</th><th>Categoria</th><th>Abrangência</th><th>Competição</th><th>Campeão</th><th>Vice</th><th>Ações</th></tr>
        ${linhas}
      </table>
    </div>
  `;
}

function aplicarFiltrosTabelaEdicao(tabelaId, categoriaId, abrangenciaId) {
  const categoria = document.getElementById(categoriaId)?.value || "";
  const abrangencia = document.getElementById(abrangenciaId)?.value || "";
  const linhas = document.querySelectorAll(`#${tabelaId} tr[data-categoria]`);

  linhas.forEach(linha => {
    const okCategoria = !categoria || linha.dataset.categoria === categoria;
    const okAbrangencia = !abrangencia || linha.dataset.abrangencia === abrangencia;
    linha.style.display = okCategoria && okAbrangencia ? "" : "none";
  });
}

function aplicarFiltrosEdicaoCompeticoes() {
  aplicarFiltrosTabelaEdicao("tabelaEdicaoCompeticoes", "filtroEdicaoCompeticoesCategoria", "filtroEdicaoCompeticoesAbrangencia");
}

function aplicarFiltrosEdicaoTitulos() {
  aplicarFiltrosTabelaEdicao("tabelaEdicaoTitulos", "filtroEdicaoTitulosCategoria", "filtroEdicaoTitulosAbrangencia");
}

function linkParticipanteEdicao(id, tipo, nomeSalvo = "") {
  const banco = carregarBanco();
  const idTexto = String(id || "");
  const tipoNormalizado = normalizarTipoParticipante(tipo);
  let encontrado = null;
  let ehSelecao = tipoNormalizado === "selecao";

  if (tipoNormalizado === "selecao") {
    encontrado = (banco.selecoes || []).find(s => String(s.id) === idTexto);
  } else if (tipoNormalizado === "clube") {
    encontrado = (banco.clubes || []).find(c => String(c.id) === idTexto);
  }

  if (!encontrado) {
    encontrado = (banco.selecoes || []).find(s => String(s.id) === idTexto || normalizarTextoBusca(s.nome || s.pais) === normalizarTextoBusca(nomeSalvo));
    ehSelecao = !!encontrado;
  }

  if (!encontrado) {
    encontrado = (banco.clubes || []).find(c => String(c.id) === idTexto || normalizarTextoBusca(c.nome) === normalizarTextoBusca(nomeSalvo));
    ehSelecao = false;
  }

  if (!encontrado && nomeSalvo) return limparTexto(nomeSalvo);
  if (!encontrado) return "Time não encontrado";

  const nome = ehSelecao ? (encontrado.nome || encontrado.pais) : encontrado.nome;
  const escudo = encontrado.escudo
    ? `<img class="escudo-inline" src="${encontrado.escudo}" alt="Escudo">`
    : (ehSelecao && encontrado.bandeira ? `<span class="escudo-inline">${encontrado.bandeira}</span>` : "");
  const acao = ehSelecao ? `abrirDetalhesSelecao('${encontrado.id}')` : `abrirDetalhesTime('${encontrado.id}')`;

  return `<span class="linha-link link-detalhe" onclick="${acao}">${escudo}${limparTexto(nome)}</span>`;
}

function normalizarTipoParticipante(tipo) {
  const t = String(tipo || "").toLowerCase();
  if (t.includes("sele")) return "selecao";
  if (t.includes("clu") || t.includes("time")) return "clube";
  return "";
}

function normalizarTextoBusca(valor) {
  return String(valor || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function imagemNome(src, nome, fallback) {
  const img = src
    ? `<img class="imagem-mini-tabela" src="${src}" alt="Imagem">`
    : `<span class="imagem-mini-tabela" style="display:inline-flex;align-items:center;justify-content:center;">${fallback}</span>`;
  return `${img}${limparTexto(nome)}`;
}

function tabela(cabecalhos, linhas) {
  if (!linhas || linhas.length === 0) {
    return `<div class="tabela-container"><p>Nenhum registro cadastrado para editar.</p></div>`;
  }

  return `
    <div class="tabela-container">
      <table class="tabela">
        <tr>${cabecalhos.map(c => `<th>${c}</th>`).join("")}</tr>
        ${linhas.map(linha => `<tr>${linha.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
      </table>
    </div>
  `;
}

function botoesEditarExcluir(tipo, id) {
  return `
    <button class="btn-editar" onclick="abrirFormularioEdicao('${tipo}', '${id}')">Editar</button>
    <button class="btn-excluir" onclick="excluirRegistro('${tipo}', '${id}')">Excluir</button>
  `;
}

function abrirFormularioEdicao(tipo, id) {
  const banco = carregarBanco();
  const item = banco[tipo].find(registro => registro.id === id);
  const area = document.getElementById("areaEdicao");

  if (!item || !area) return;

  if (tipo === "clubes") {
    area.innerHTML = formularioEditarClube(item, banco);
    setTimeout(() => {
      iniciarMascaraEditFundacao();
      atualizarEstadoEdicaoClube();
      if (typeof fpAtualizarPreviewRival === "function") {
        for (let i = 1; i <= 5; i++) {
          const select = document.getElementById(`editRival${i}`);
          if (select) {
            select.addEventListener("change", () => fpAtualizarPreviewRival(select));
            fpAtualizarPreviewRival(select);
          }
        }
      }
    }, 50);
  }
  if (tipo === "selecoes") area.innerHTML = formularioEditarSelecao(item, banco);
  if (tipo === "competicoes") area.innerHTML = formularioEditarCompeticao(item);
  if (tipo === "titulos") area.innerHTML = formularioEditarTitulo(item, banco);
}


function fpNormalizarLocalRivalEdicao(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function fpClubesRivaisElegiveis(clubeAtual, clubes, selecionados = []) {
  const pais = fpNormalizarLocalRivalEdicao(clubeAtual?.pais);
  const brasil = pais === "brasil";
  const estado = fpNormalizarLocalRivalEdicao(clubeAtual?.siglaEstado || clubeAtual?.sigla_estado || clubeAtual?.estado);
  const selecionadosSet = new Set((selecionados || []).map(String));

  return (clubes || []).filter(c => {
    if (String(c.id) === String(clubeAtual?.id)) return false;
    if (selecionadosSet.has(String(c.id))) return true;
    if (fpNormalizarLocalRivalEdicao(c.pais) !== pais) return false;
    if (!brasil) return true;
    const estadoC = fpNormalizarLocalRivalEdicao(c.siglaEstado || c.sigla_estado || c.estado);
    return !!estado && estadoC === estado;
  });
}

function formularioEditarClube(clube, banco) {
  const opcoesPais = banco.paises.map(p => `
    <option value="${limparTexto(p.nome)}" ${p.nome === clube.pais ? "selected" : ""}>
      ${p.bandeira || ""} ${limparTexto(p.nome)}
    </option>
  `).join("");

  const estadoAtualObj = buscarEstado(clube.estado || clube.siglaEstado || "");
  const estadoAtualNome = estadoAtualObj.nome || clube.estado || "";
  const estadoAtualSigla = estadoAtualObj.sigla || clube.siglaEstado || "";

  const opcoesEstado = ESTADOS_BRASIL.map(e => {
    const selecionado =
      e.nome === estadoAtualNome ||
      e.sigla === estadoAtualSigla ||
      e.nome === clube.estado ||
      e.sigla === clube.estado ||
      e.nome === clube.siglaEstado ||
      e.sigla === clube.siglaEstado;

    return `
      <option value="${limparTexto(e.nome)}" ${selecionado ? "selected" : ""}>
        ${limparTexto(e.nome)} - ${e.sigla}
      </option>
    `;
  }).join("");

  function opcoesRivais(valorAtual) {
    return fpClubesRivaisElegiveis(clube, banco.clubes || [], clube.rivais || [])
      .slice()
      .sort((a, b) => {
        const na = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(a) : (a.nome || "");
        const nb = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(b) : (b.nome || "");
        return na.localeCompare(nb, "pt-BR", { sensitivity: "base" });
      })
      .map(c => {
        const nome = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(c) : (c.nome || "");
        const logo = typeof fpLogoEntidade === "function" ? fpLogoEntidade(c) : (c.escudo || "");
        return `
          <option value="${c.id}" data-logo="${limparTexto(logo)}" ${String(c.id) === String(valorAtual) ? "selected" : ""}>
            ${limparTexto(nome)}
          </option>
        `;
      }).join("");
  }

  const rivaisAtuais = clube.rivais || [];

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoClube(event, '${clube.id}')">
      <h2>Editar informações do time</h2>

      <label>Escudo atual</label>
      ${
        clube.escudo
          ? `<img class="preview-edicao" src="${clube.escudo}" alt="Escudo atual">`
          : `<div class="escudo-placeholder">⚽</div>`
      }

      <label>Alterar escudo do time</label>
      <input type="file" id="editEscudo" accept="image/*">

      <label>Nome curto do time</label>
      <input type="text" id="editNome" value="${limparTexto(clube.nomeCurto || clube.nome)}">

      <label>Nome completo do time</label>
      <input type="text" id="editNomeCompleto" value="${limparTexto(clube.nomeCompleto || clube.nome)}">

      <label>País</label>
      <select id="editPais" onchange="atualizarEstadoEdicaoClube(); atualizarListaRivaisEdicaoClube()">${opcoesPais}</select>

      <div id="grupoEditEstadoClube" class="grupo">
        <label>Estado</label>
        <select id="editEstado" onchange="preencherSiglaEdicaoClube(); atualizarListaRivaisEdicaoClube()">${opcoesEstado}</select>
      </div>

      <div id="grupoEditSiglaEstadoClube" class="grupo">
        <label>Sigla do Estado</label>
        <input type="text" id="editSiglaEstado" value="${limparTexto(estadoAtualSigla || "")}" readonly>
      </div>

      <label>Cidade</label>
      <input type="text" id="editCidade" value="${limparTexto(clube.cidade || "")}">

      <label>Ano de fundação</label>
      <input type="text" id="editFundacao" placeholder="DD/MM/AAAA" maxlength="10" inputmode="numeric" autocomplete="off" value="${limparTexto(formatarDataFundacao(clube.fundacao) || "")}">


      <label>Rival 1</label>
      <select id="editRival1"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[0] || "")}</select>
      <div id="editRival1Preview" class="rival-preview"></div>

      <label>Rival 2</label>
      <select id="editRival2"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[1] || "")}</select>
      <div id="editRival2Preview" class="rival-preview"></div>

      <label>Rival 3</label>
      <select id="editRival3"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[2] || "")}</select>
      <div id="editRival3Preview" class="rival-preview"></div>

      <label>Rival 4</label>
      <select id="editRival4"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[3] || "")}</select>
      <div id="editRival4Preview" class="rival-preview"></div>

      <label>Rival 5</label>
      <select id="editRival5"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[4] || "")}</select>
      <div id="editRival5Preview" class="rival-preview"></div>

      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações do time</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('clubes', '${clube.id}')">Excluir time</button>
        <button type="button" onclick="mostrarEdicao('clubes')">Cancelar</button>
      </div>
    </form>
  `;
}

function formularioEditarSelecao(selecao, banco) {
  return `
    <form class="form-edicao" onsubmit="salvarEdicaoSelecao(event, '${selecao.id}')">
      <h2>Editar Seleção</h2>

      ${selecao.escudo ? `<img class="preview-edicao" src="${selecao.escudo}" alt="Escudo atual">` : ""}

      <label>Nome</label>
      <input type="text" id="editNome" value="${limparTexto(selecao.nome || selecao.pais)}" readonly>

      <label>Continente da seleção</label>
      <input type="text" id="editContinenteSelecao" value="${limparTexto(selecao.continente || "")}" readonly>

      <label>Cadastrar/Trocar escudo da seleção</label>
      <input type="file" id="editEscudo" accept="image/*">

      <div class="acoes-form-edicao">
        <button type="submit">Salvar escudo</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('selecoes', '${selecao.id}')">Excluir seleção</button>
        <button type="button" onclick="mostrarEdicao('selecoes')">Cancelar</button>
      </div>
    </form>
  `;
}

function opcoesAbrangenciaEdicao(valorAtual) {
  const abrangencias = [
    { valor: "Mundial", texto: "Mundo" },
    { valor: "Continental", texto: "Continente" },
    { valor: "Regional", texto: "Regional" },
    { valor: "País", texto: "País" },
    { valor: "Estadual", texto: "Estadual" }
  ];

  return abrangencias.map(a => `
    <option value="${a.valor}" ${a.valor === valorAtual ? "selected" : ""}>${a.texto}</option>
  `).join("");
}

function formularioEditarCompeticao(competicao) {
  const categoriaAtual = competicao.categoria || normalizarCategoriaCompeticao(competicao) || "clube";
  const continentes = (typeof CONTINENTES !== "undefined" ? CONTINENTES : ["América Central", "América do Norte", "América do Sul", "África", "Ásia", "Caribe", "Europa", "Oceania"]);
  const banco = carregarBanco();
  const paisesBase = (banco.paises && banco.paises.length ? banco.paises : (typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []));

  const opcoesContinentes = continentes.map(c => `<option value="${limparTexto(c)}" ${(competicao.continente || competicao.local) === c ? "selected" : ""}>${limparTexto(c)}</option>`).join("");
  const opcoesPaises = paisesBase
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(p => `<option value="${limparTexto(p.nome)}" ${(competicao.pais || competicao.local) === p.nome ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");

  setTimeout(atualizarCamposAbrangenciaEdicaoCompeticao, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoCompeticao(event, '${competicao.id}')">
      <h2>Editar Competição/Liga</h2>

      ${competicao.escudo ? `<img class="preview-edicao" src="${competicao.escudo}" alt="Escudo atual">` : ""}

      <label>Categoria da competição</label>
      <select id="editCategoriaCompeticao" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>

      <div id="grupoEditAbrangenciaCompeticao" class="grupo">
        <label>Abrangência da competição</label>
        <select id="editAbrangencia" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">
          ${opcoesAbrangenciaEdicao(competicao.abrangencia)}
        </select>
      </div>

      <div id="grupoEditContinenteCompeticao" class="grupo">
        <label>Continente</label>
        <select id="editContinenteCompeticao">
          <option value="">Selecione um continente</option>
          ${opcoesContinentes}
        </select>
      </div>

      <div id="grupoEditPaisCompeticao" class="grupo">
        <label>País</label>
        <select id="editPaisCompeticao">
          <option value="">Selecione um país</option>
          ${opcoesPaises}
        </select>
      </div>

      <label>Nome</label>
      <input type="text" id="editNome" value="${limparTexto(competicao.nome)}">

      <label>Tipo da competição</label>
      <select id="editTipoCompeticao">
        <option value="">Selecione o tipo da competição</option>
        <option value="Liga" ${competicao.tipo === "Liga" ? "selected" : ""}>Liga</option>
        <option value="Copa" ${competicao.tipo === "Copa" ? "selected" : ""}>Copa</option>
        <option value="Supercopa" ${competicao.tipo === "Supercopa" ? "selected" : ""}>Supercopa</option>
        <option value="Recopa" ${competicao.tipo === "Recopa" ? "selected" : ""}>Recopa</option>
        <option value="Taça" ${competicao.tipo === "Taça" ? "selected" : ""}>Taça</option>
        <option value="Torneio" ${competicao.tipo === "Torneio" ? "selected" : ""}>Torneio</option>
        <option value="Campeonato" ${competicao.tipo === "Campeonato" ? "selected" : ""}>Campeonato</option>
        <option value="Mundial de Clubes" ${competicao.tipo === "Mundial de Clubes" ? "selected" : ""}>Mundial de Clubes</option>
        <option value="Copa Continental" ${competicao.tipo === "Copa Continental" ? "selected" : ""}>Copa Continental</option>
        <option value="Copa Regional" ${competicao.tipo === "Copa Regional" ? "selected" : ""}>Copa Regional</option>
        <option value="Estadual" ${competicao.tipo === "Estadual" ? "selected" : ""}>Estadual</option>
        <option value="Interestadual" ${competicao.tipo === "Interestadual" ? "selected" : ""}>Interestadual</option>
        <option value="Amistoso" ${competicao.tipo === "Amistoso" ? "selected" : ""}>Amistoso</option>
        <option value="Outros" ${competicao.tipo === "Outros" ? "selected" : ""}>Outros</option>
      </select>

      <label>Cadastrar/Trocar escudo da liga/competição</label>
      <input type="file" id="editEscudo" accept="image/*">

      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('competicoes', '${competicao.id}')">Excluir competição</button>
        <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
      </div>
    </form>
  `;
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
  const abrangencia = document.getElementById("editAbrangencia")?.value || "";
  const grupoAbrangencia = document.getElementById("grupoEditAbrangenciaCompeticao");
  const grupoContinente = document.getElementById("grupoEditContinenteCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");

  if (categoria === "selecao") {
    if (grupoAbrangencia) grupoAbrangencia.classList.add("oculto");
    if (grupoContinente) grupoContinente.classList.remove("oculto");
    if (grupoPais) grupoPais.classList.remove("oculto");
    return;
  }

  if (grupoAbrangencia) grupoAbrangencia.classList.remove("oculto");
  if (grupoContinente) grupoContinente.classList.toggle("oculto", abrangencia !== "Continental");
  if (grupoPais) grupoPais.classList.toggle("oculto", abrangencia !== "País");
}

function listarParticipantesEdicaoTitulo(banco) {
  const clubes = (banco.clubes || []).map(c => ({
    id: c.id,
    nome: c.nome,
    pais: c.pais || "",
    tipo: "clube"
  }));

  const selecoes = (banco.selecoes || []).map(s => ({
    id: s.id,
    nome: s.nome || s.pais,
    pais: s.pais || s.nome || "",
    tipo: "selecao"
  }));

  return [...clubes, ...selecoes]
    .filter(item => item.id && item.nome)
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

function buscarParticipanteEdicaoTitulo(banco, id) {
  const clube = (banco.clubes || []).find(c => c.id === id);
  if (clube) return { ...clube, tipo: "clube" };

  const selecao = (banco.selecoes || []).find(s => s.id === id);
  if (selecao) return { ...selecao, nome: selecao.nome || selecao.pais, tipo: "selecao" };

  return null;
}

function formularioEditarTitulo(titulo, banco) {
  const competicaoAtualTitulo = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || (competicaoAtualTitulo ? (competicaoAtualTitulo.categoria || normalizarCategoriaCompeticao(competicaoAtualTitulo)) : "") || ((banco.selecoes || []).some(s => s.id === titulo.campeaoId || s.id === titulo.viceId) ? "selecao" : "clube") || "clube";
  const abrangencias = ["Mundial", "Continental", "Regional", "País", "Estadual"];

  const opcoesAbrangencia = `
    <option value="">Todas as abrangências</option>
    ${abrangencias.map(a => `<option value="${a}" ${a === titulo.abrangencia ? "selected" : ""}>${a}</option>`).join("")}
  `;

  const opcoesCompeticoes = banco.competicoes
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(c => `
      <option
        value="${c.id}"
        data-abrangencia="${limparTexto(c.abrangencia || "")}"
        data-categoria="${limparTexto(c.categoria || normalizarCategoriaCompeticao(c) || "clube")}"
        ${c.id === titulo.competicaoId ? "selected" : ""}
      >
        ${limparTexto(c.nome)}
      </option>
    `).join("");

  const opcoesTimes = listarParticipantesEdicaoTitulo(banco)
    .map(item => `
      <option value="${item.id}" data-tipo="${item.tipo}">
        ${limparTexto(item.nome)} - ${item.tipo === "selecao" ? "Seleção" : "Clube"}${item.pais ? " - " + limparTexto(item.pais) : ""}
      </option>
    `).join("");

  setTimeout(() => {
    const categoria = document.getElementById("editCategoriaTitulo");
    const campeao = document.getElementById("editCampeao");
    const vice = document.getElementById("editVice");

    if (categoria) categoria.value = categoriaAtual;
    if (campeao) campeao.value = titulo.campeaoId || "";
    if (vice) vice.value = titulo.viceId || "";

    filtrarCompeticoesEdicaoTitulo();
  }, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')">
      <h2>Editar Campeão e Vice</h2>

      <label>Categoria da competição</label>
      <select id="editCategoriaTitulo" onchange="filtrarCompeticoesEdicaoTitulo()">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>

      <label>Ano</label>
      <input type="number" id="editAno" value="${limparTexto(titulo.ano || "")}">

      <label>Abrangência</label>
      <select id="editAbrangenciaTitulo" onchange="filtrarCompeticoesEdicaoTitulo()">
        ${opcoesAbrangencia}
      </select>

      <label>Competição</label>
      <select id="editCompeticaoTitulo">
        <option value="">Selecione a competição</option>
        ${opcoesCompeticoes}
      </select>

      <label>Campeão</label>
      <select id="editCampeao">
        <option value="">Selecione o campeão</option>
        ${opcoesTimes}
      </select>

      <label>Vice-campeão</label>
      <select id="editVice">
        <option value="">Selecione o vice</option>
        ${opcoesTimes}
      </select>

      <button type="submit">Salvar alterações</button>
      <button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button>
    </form>
  `;
}

function filtrarCompeticoesEdicaoTitulo() {
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "";
  const competicao = document.getElementById("editCompeticaoTitulo");
  const campeao = document.getElementById("editCampeao");
  const vice = document.getElementById("editVice");

  if (competicao) {
    let primeiraVisivel = "";

    Array.from(competicao.options).forEach(option => {
      if (!option.value) {
        option.hidden = false;
        return;
      }

      const optionAbrangencia = option.getAttribute("data-abrangencia") || "";
      const optionCategoria = option.getAttribute("data-categoria") || "clube";
      const mostrar = (!abrangencia || optionAbrangencia === abrangencia) && optionCategoria === categoria;

      option.hidden = !mostrar;
      if (mostrar && !primeiraVisivel) primeiraVisivel = option.value;
    });

    const selecionada = competicao.options[competicao.selectedIndex];
    if (selecionada && selecionada.hidden) competicao.value = primeiraVisivel || "";
  }

  [campeao, vice].forEach(select => {
    if (!select) return;

    let primeiraVisivel = "";
    Array.from(select.options).forEach(option => {
      if (!option.value) {
        option.hidden = false;
        return;
      }

      const tipo = option.getAttribute("data-tipo") || "clube";
      const mostrar = tipo === categoria;
      option.hidden = !mostrar;
      if (mostrar && !primeiraVisivel) primeiraVisivel = option.value;
    });

    const selecionada = select.options[select.selectedIndex];
    if (selecionada && selecionada.hidden) select.value = "";
  });
}

function lerImagem(inputId, callback) {
  const arquivo = document.getElementById(inputId)?.files?.[0];

  if (!arquivo) {
    callback("");
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => callback(ev.target.result);
  reader.readAsDataURL(arquivo);
}


async function fpSalvarRivaisTimeSql(timeId, rivaisIds) {
  const supa = typeof fpEdicaoSqlCliente === "function" ? fpEdicaoSqlCliente() : null;
  if (!supa || !timeId) return true;

  const id = Number(timeId);
  const rivais = (rivaisIds || [])
    .map(v => Number(v))
    .filter(v => Number.isFinite(v) && v && v !== id)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .slice(0, 5);

  const relacionados = [id, ...rivais];

  const { error: delError } = await supa
    .from("time_rivais")
    .delete()
    .or(`time_id.in.(${relacionados.join(",")}),rival_id.in.(${relacionados.join(",")})`);

  if (delError) {
    console.warn("Não foi possível limpar rivais antigos no Supabase:", delError.message || delError);
    throw new Error(delError.message || "Erro ao atualizar rivais.");
  }

  const linhas = [];
  rivais.forEach(rivalId => {
    linhas.push({ time_id: id, rival_id: rivalId });
    linhas.push({ time_id: rivalId, rival_id: id });
  });

  if (!linhas.length) return true;

  const { error: insertError } = await supa
    .from("time_rivais")
    .upsert(linhas, { onConflict: "time_id,rival_id" });

  if (insertError) {
    console.warn("Não foi possível salvar rivais no Supabase:", insertError.message || insertError);
    throw new Error(insertError.message || "Erro ao salvar rivais.");
  }

  return true;
}


function atualizarListaRivaisEdicaoClube() {
  const banco = carregarBanco();
  const params = new URLSearchParams(location.search);
  const idUrl = params.get("id");
  const form = document.querySelector("form.form-edicao");
  const idForm = form?.getAttribute("onsubmit")?.match(/'([^']+)'/)?.[1] || idUrl;
  const clubeBase = (banco.clubes || []).find(c => String(c.id) === String(idForm));
  if (!clubeBase) return;

  const pais = document.getElementById("editPais")?.value || clubeBase.pais || "";
  const estado = pais === "Brasil"
    ? (document.getElementById("editSiglaEstado")?.value || document.getElementById("editEstado")?.value || "")
    : "";
  const atual = { ...clubeBase, pais, estado, siglaEstado: estado };
  const selecionados = [];
  for (let i = 1; i <= 5; i++) {
    const v = document.getElementById(`editRival${i}`)?.value || "";
    if (v) selecionados.push(v);
  }
  const elegiveis = fpClubesRivaisElegiveis(atual, banco.clubes || [], selecionados)
    .slice().sort((a,b) => {
      const na = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(a) : (a.nome || "");
      const nb = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(b) : (b.nome || "");
      return na.localeCompare(nb, "pt-BR", { sensitivity: "base" });
    });

  for (let i = 1; i <= 5; i++) {
    const select = document.getElementById(`editRival${i}`);
    if (!select) continue;
    const valor = select.value || "";
    select.innerHTML = '<option value="">Sem rival</option>' + elegiveis.map(c => {
      const nome = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(c) : (c.nome || "");
      const logo = typeof fpLogoEntidade === "function" ? fpLogoEntidade(c) : (c.escudo || "");
      return `<option value="${c.id}" data-logo="${limparTexto(logo)}" ${String(c.id) === String(valor) ? "selected" : ""}>${limparTexto(nome)}</option>`;
    }).join("");
    if (typeof fpAtualizarPreviewRival === "function") fpAtualizarPreviewRival(select);
  }
}

function salvarEdicaoClube(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const clube = banco.clubes.find(c => c.id === id);
  if (!clube) return;

  lerImagem("editEscudo", novaImagem => {
    const paisNome = document.getElementById("editPais").value;
    const pais = buscarPais(paisNome);
    const estadoNome = paisNome === "Brasil" ? document.getElementById("editEstado").value : "";
    const estadoObj = paisNome === "Brasil" ? buscarEstado(estadoNome) : { sigla: "" };

    clube.nome = document.getElementById("editNome").value.trim();
    clube.nomeCompleto = document.getElementById("editNomeCompleto").value.trim() || clube.nome;
    clube.pais = paisNome;
    clube.bandeira = pais.bandeira;
    clube.estado = estadoNome;
    clube.siglaEstado = paisNome === "Brasil"
      ? (document.getElementById("editSiglaEstado").value.trim() || estadoObj.sigla || "")
      : "";
    clube.cidade = document.getElementById("editCidade").value.trim();
    clube.fundacao = formatarDataFundacao(document.getElementById("editFundacao").value);

    if (novaImagem) clube.escudo = novaImagem;

    clube.rivais = [];
    for (let i = 1; i <= 5; i++) {
      const rival = document.getElementById(`editRival${i}`).value;
      if (rival && !clube.rivais.includes(rival)) clube.rivais.push(rival);
    }

    banco.titulos.forEach(titulo => {
      if (titulo.campeaoId === clube.id) titulo.campeaoNome = clube.nome;
      if (titulo.viceId === clube.id) titulo.viceNome = clube.nome;
    });

    sincronizarRivaisBidirecionais(banco);
    salvarBanco(banco);

    (async () => {
      try {
        if (typeof fpEdicaoAtualizarTimeSql === "function") {
          await fpEdicaoAtualizarTimeSql(clube.id, clube);
        }
        await fpSalvarRivaisTimeSql(clube.id, clube.rivais || []);
        if (typeof carregarDadosRelacionaisSupabase === "function") {
          await carregarDadosRelacionaisSupabase();
        }
        alert("Time atualizado com sucesso!");
        mostrarEdicao("clubes");
      } catch (erro) {
        console.error("Erro ao salvar time/rivais:", erro);
        alert("O time foi atualizado localmente, mas houve erro ao salvar no Supabase: " + (erro.message || erro));
      }
    })();
  });
}

function salvarEdicaoSelecao(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const selecao = banco.selecoes.find(s => s.id === id);
  if (!selecao) return;

  lerImagem("editEscudo", novaImagem => {
    if (novaImagem) selecao.escudo = novaImagem;

    banco.titulos.forEach(titulo => {
      if (titulo.campeaoId === selecao.id) {
        titulo.campeaoNome = selecao.nome || selecao.pais;
        titulo.campeaoTipo = "selecao";
      }
      if (titulo.viceId === selecao.id) {
        titulo.viceNome = selecao.nome || selecao.pais;
        titulo.viceTipo = "selecao";
      }
    });

    salvarBanco(banco);
    alert("Escudo da seleção atualizado com sucesso!");
    mostrarEdicao("selecoes");
  });
}

function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const competicao = banco.competicoes.find(c => c.id === id);
  if (!competicao) return;

  lerImagem("editEscudo", novaImagem => {
    competicao.nome = document.getElementById("editNome").value.trim();
    competicao.categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
    competicao.tipo = document.getElementById("editTipoCompeticao").value || "Não informado";
    competicao.abrangencia = competicao.categoria === "selecao" ? "Seleções" : (document.getElementById("editAbrangencia")?.value || "");

    competicao.local = "";
    competicao.bandeira = "";
    competicao.continente = "";
    competicao.pais = "";

    if (competicao.categoria === "selecao") {
      const continente = document.getElementById("editContinenteCompeticao")?.value || "";
      const paisNome = document.getElementById("editPaisCompeticao")?.value || "";

      if (!continente) {
        alert("Selecione o continente da competição de seleção.");
        return;
      }

      if (!paisNome) {
        alert("Selecione o país da competição de seleção.");
        return;
      }

      const pais = buscarPais(paisNome);
      competicao.continente = continente;
      competicao.pais = paisNome;
      competicao.local = paisNome;
      competicao.bandeira = pais.bandeira || "🌎";
    } else {
      if (competicao.abrangencia === "Mundial") {
        competicao.local = "Mundial";
        competicao.bandeira = "🌍";
      }

      if (competicao.abrangencia === "Continental") {
        const continente = document.getElementById("editContinenteCompeticao")?.value || "";
        if (!continente) {
          alert("Selecione o continente da competição.");
          return;
        }
        competicao.continente = continente;
        competicao.local = continente;
        competicao.bandeira = "🌎";
      }

      if (competicao.abrangencia === "País") {
        const paisNome = document.getElementById("editPaisCompeticao")?.value || "";
        if (!paisNome) {
          alert("Selecione o país da competição.");
          return;
        }
        const pais = buscarPais(paisNome);
        competicao.pais = paisNome;
        competicao.local = paisNome;
        competicao.bandeira = pais.bandeira || "";
      }

      if (competicao.abrangencia === "Regional" || competicao.abrangencia === "Estadual") {
        competicao.local = competicao.abrangencia;
      }
    }

    if (novaImagem) competicao.escudo = novaImagem;

    banco.titulos.forEach(titulo => {
      if (titulo.competicaoId === competicao.id) {
        titulo.competicaoNome = competicao.nome;
        titulo.abrangencia = competicao.abrangencia;
      }
    });

    salvarBanco(banco);
    alert("Competição atualizada com sucesso!");
    mostrarEdicao("competicoes");
  });
}

function salvarEdicaoTitulo(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const titulo = banco.titulos.find(t => String(t.id) === String(id));
  if (!titulo) return;

  const ano = document.getElementById("editAno").value;
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const competicaoId = document.getElementById("editCompeticaoTitulo").value;
  const campeaoId = document.getElementById("editCampeao").value;
  const viceId = document.getElementById("editVice").value || "";

  if (!ano || !competicaoId || !campeaoId || !viceId) {
    alert("Preencha ano, competição, campeão e vice.");
    return;
  }

  if (campeaoId === viceId) {
    alert(categoria === "selecao" ? "Campeão e vice não podem ser a mesma seleção." : "Campeão e vice não podem ser o mesmo time.");
    return;
  }

  const competicao = banco.competicoes.find(c => String(c.id) === String(competicaoId));
  const campeao = buscarParticipanteEdicaoTitulo(banco, campeaoId);
  const vice = buscarParticipanteEdicaoTitulo(banco, viceId);

  if (!competicao || !campeao || !vice) {
    alert("Não foi possível encontrar competição, campeão ou vice no banco de dados.");
    return;
  }

  const categoriaCompeticao = normalizarCategoriaCompeticao(competicao) || "clube";

  if (categoria === "clube") {
    if (categoriaCompeticao !== "clube" || campeao.tipo !== "clube" || vice.tipo !== "clube") {
      alert("A categoria da competição precisa combinar com campeão e vice de clubes.");
      return;
    }
  }
  // Para seleções, mantém o campo vice, mas remove o bloqueio de combinação.

  titulo.ano = ano;
  titulo.competicaoId = competicao.id;
  titulo.competicaoNome = competicao.nome;
  titulo.abrangencia = competicao.abrangencia;
  titulo.campeaoId = campeao.id;
  titulo.campeaoNome = campeao.nome;
  titulo.campeaoTipo = categoria === "selecao" ? "selecao" : campeao.tipo;
  titulo.viceId = vice.id;
  titulo.viceNome = vice.nome;
  titulo.viceTipo = categoria === "selecao" ? "selecao" : vice.tipo;

  salvarBanco(banco);
  alert("Campeão e vice atualizados com sucesso!");
  mostrarEdicao("titulos");
}

async function excluirRegistro(tipo, id) {
  if (tipo === "titulos" && typeof excluirTituloSupabase === "function") {
    excluirTituloSupabase(id);
    return;
  }
  if (!confirm("Deseja excluir este registro?")) return;

  const mapa = { clubes:"times", competicoes:"competicoes", selecoes:"selecoes" };
  const tabela = mapa[tipo];

  try {
    if (tabela && typeof fpEdicaoSqlCliente === "function") {
      const supa = fpEdicaoSqlCliente();
      if (tipo === "clubes") {
        await supa.from("time_rivais").delete().or(`time_id.eq.${id},rival_id.eq.${id}`);
      }
      const { error } = await supa.from(tabela).delete().eq("id", Number(id));
      if (error) throw error;
    }
  } catch(e) {
    alert("Erro ao excluir do Supabase: " + (e.message||e));
    return;
  }

  const banco = carregarBanco();
  if (Array.isArray(banco[tipo])) banco[tipo]=banco[tipo].filter(i=>String(i.id)!==String(id));

  if (tipo==="competicoes")
    banco.titulos=(banco.titulos||[]).filter(t=>String(t.competicaoId)!==String(id));

  if (tipo==="clubes"){
    banco.titulos=(banco.titulos||[]).filter(t=>String(t.campeaoId)!==String(id)&&String(t.viceId)!==String(id));
    (banco.clubes||[]).forEach(c=>c.rivais=(c.rivais||[]).filter(r=>String(r)!==String(id)));
  }

  if (tipo==="selecoes")
    banco.titulos=(banco.titulos||[]).filter(t=>String(t.campeaoId)!==String(id)&&String(t.viceId)!==String(id));

  salvarBanco(banco);

  if (typeof carregarDadosRelacionaisSupabase==="function"){
    await carregarDadosRelacionaisSupabase();
  }

  alert("Registro excluído com sucesso.");
  mostrarEdicao(tipo);
}

function iniciarMascaraEditFundacao() {
  const campo = document.getElementById("editFundacao");
  if (!campo) return;

  campo.setAttribute("type", "text");
  campo.setAttribute("maxlength", "10");
  campo.setAttribute("placeholder", "DD/MM/AAAA");
  campo.setAttribute("inputmode", "numeric");
  campo.setAttribute("autocomplete", "off");

  campo.value = aplicarMascaraDataEdicao(campo.value);

  campo.addEventListener("input", () => {
    campo.value = aplicarMascaraDataEdicao(campo.value);
  });

  campo.addEventListener("paste", () => {
    setTimeout(() => {
      campo.value = aplicarMascaraDataEdicao(campo.value);
    }, 10);
  });
}

function aplicarMascaraDataEdicao(valor) {
  let numeros = String(valor || "").replace(/\D/g, "").slice(0, 8);

  if (numeros.length >= 5) {
    return numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
  }

  if (numeros.length >= 3) {
    return numeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
  }

  return numeros;
}


function atualizarEstadoEdicaoClube() {
  const pais = document.getElementById("editPais")?.value || "";
  const grupoEstado = document.getElementById("grupoEditEstadoClube");
  const grupoSigla = document.getElementById("grupoEditSiglaEstadoClube");
  const estado = document.getElementById("editEstado");
  const sigla = document.getElementById("editSiglaEstado");

  const mostrarEstado = pais === "Brasil";

  if (grupoEstado) grupoEstado.classList.toggle("oculto", !mostrarEstado);
  if (grupoSigla) grupoSigla.classList.toggle("oculto", !mostrarEstado);

  if (!mostrarEstado) {
    if (estado) estado.value = "";
    if (sigla) sigla.value = "";
    return;
  }

  if (estado && estado.value) {
    const estadoObj = buscarEstado(estado.value);
    if (estadoObj.nome && estado.value !== estadoObj.nome) estado.value = estadoObj.nome;
  }

  preencherSiglaEdicaoClube();
}

function preencherSiglaEdicaoClube() {
  const estadoValor = document.getElementById("editEstado")?.value || "";
  const sigla = document.getElementById("editSiglaEstado");
  const estado = buscarEstado(estadoValor);

  if (sigla) sigla.value = estado.sigla || estadoValor || "";
}


function tabelaSelecoesSimplificada(banco) {
  const selecoes = banco.selecoes
    .slice()
    .sort((a, b) => (a.continente || "").localeCompare(b.continente || "") || (a.nome || "").localeCompare(b.nome || ""));

  return tabela(["Nome", "Continente", "Ações"], selecoes.map(s => [
    `<span class="link-detalhe" onclick="abrirDetalhesSelecao('${s.id}')">${s.escudo ? `<img class="escudo-inline" src="${s.escudo}" alt="Escudo">` : ""}${limparTexto(s.nome || s.pais)}</span>`,
    limparTexto(s.continente || "Não informado"),
    botoesEditarExcluir("selecoes", s.id)
  ]));
}


// Garante acesso global das funções usadas pela página Edições.
window.mostrarEdicao = mostrarEdicao;
window.abrirFormularioEdicao = abrirFormularioEdicao;
window.excluirRegistro = excluirRegistro;
window.salvarEdicaoClube = salvarEdicaoClube;
window.salvarEdicaoSelecao = salvarEdicaoSelecao;
window.salvarEdicaoCompeticao = salvarEdicaoCompeticao;
window.salvarEdicaoTitulo = salvarEdicaoTitulo;
window.filtrarCompeticoesEdicaoTitulo = filtrarCompeticoesEdicaoTitulo;
window.atualizarEstadoEdicaoClube = atualizarEstadoEdicaoClube;
window.preencherSiglaEdicaoClube = preencherSiglaEdicaoClube;
window.atualizarCamposAbrangenciaEdicaoCompeticao = atualizarCamposAbrangenciaEdicaoCompeticao;
window.aplicarFiltrosEdicaoCompeticoes = aplicarFiltrosEdicaoCompeticoes;
window.aplicarFiltrosEdicaoTitulos = aplicarFiltrosEdicaoTitulos;

/* ===== Correção extra: filtros de categoria/abrangência/local nas edições ===== */
function fpListaPaisesCompletaEdicao() {
  const banco = carregarBanco();
  const mapa = new Map();
  [...(typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []), ...(banco.paises || [])].forEach(p => {
    if (p && p.nome) mapa.set(p.nome, { ...p, continente: p.continente || "", bandeira: p.bandeira || "" });
  });
  return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
}

function fpContinentesEdicao() {
  return (typeof CONTINENTES !== "undefined" ? CONTINENTES : ["América Central", "América do Norte", "América do Sul", "África", "Ásia", "Caribe", "Europa", "Oceania"]);
}

function fpOpcoesAbrangenciaPorCategoria(categoria, valorAtual = "") {
  const lista = categoria === "selecao"
    ? ["Mundial", "Continental"]
    : ["Mundial", "Continental", "Regional", "País", "Estadual"];
  return `<option value="">Todas as abrangências</option>` + lista.map(a => `<option value="${a}" ${a === valorAtual ? "selected" : ""}>${a}</option>`).join("");
}

function filtrosEdicao(prefixo, funcao) {
  return `
    <div class="filtros filtros-edicao">
      <div>
        <label>Categoria</label>
        <select id="${prefixo}Categoria" onchange="atualizarAbrangenciasFiltroEdicao('${prefixo}', '${funcao}')">
          <option value="">Clubes e seleções</option>
          <option value="clube">Competições de clubes</option>
          <option value="selecao">Competições de seleções</option>
        </select>
      </div>
      <div>
        <label>Abrangência</label>
        <select id="${prefixo}Abrangencia" onchange="atualizarLocaisFiltroEdicao('${prefixo}'); ${funcao}()">
          ${fpOpcoesAbrangenciaPorCategoria("")}
        </select>
      </div>
      <div id="${prefixo}GrupoContinente" class="oculto">
        <label>Continente</label>
        <select id="${prefixo}Continente" onchange="carregarPaisesFiltroEdicao('${prefixo}'); ${funcao}()">
          <option value="">Todos os continentes</option>
          ${fpContinentesEdicao().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}
        </select>
      </div>
      <div id="${prefixo}GrupoPais" class="oculto">
        <label>País</label>
        <select id="${prefixo}Pais" onchange="${funcao}()">
          <option value="">Todos os países</option>
        </select>
      </div>
    </div>
  `;
}

function atualizarAbrangenciasFiltroEdicao(prefixo, funcao) {
  const categoria = document.getElementById(`${prefixo}Categoria`)?.value || "";
  const selectAbr = document.getElementById(`${prefixo}Abrangencia`);
  if (selectAbr) {
    const atual = selectAbr.value;
    selectAbr.innerHTML = fpOpcoesAbrangenciaPorCategoria(categoria, atual);
    if (atual && !Array.from(selectAbr.options).some(o => o.value === atual)) selectAbr.value = "";
  }
  atualizarLocaisFiltroEdicao(prefixo);
  if (typeof window[funcao] === "function") window[funcao]();
}

function atualizarLocaisFiltroEdicao(prefixo) {
  const abrangencia = document.getElementById(`${prefixo}Abrangencia`)?.value || "";
  const grupoContinente = document.getElementById(`${prefixo}GrupoContinente`);
  const grupoPais = document.getElementById(`${prefixo}GrupoPais`);
  if (grupoContinente) grupoContinente.classList.toggle("oculto", abrangencia !== "Continental");
  if (grupoPais) grupoPais.classList.toggle("oculto", abrangencia !== "País");
  carregarPaisesFiltroEdicao(prefixo);
}

function carregarPaisesFiltroEdicao(prefixo) {
  const selectPais = document.getElementById(`${prefixo}Pais`);
  if (!selectPais) return;
  const continente = document.getElementById(`${prefixo}Continente`)?.value || "";
  const abrangencia = document.getElementById(`${prefixo}Abrangencia`)?.value || "";
  const paises = fpListaPaisesCompletaEdicao().filter(p => !continente || p.continente === continente);
  const valorAtual = selectPais.value;
  selectPais.innerHTML = `<option value="">Todos os países</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === valorAtual)) selectPais.value = valorAtual;
  if (abrangencia !== "País") selectPais.value = "";
}

function tabelaCompeticoes(banco) {
  const linhas = (banco.competicoes || []).map(c => {
    const categoria = c.categoria || normalizarCategoriaCompeticao(c) || "clube";
    const pais = c.pais || (c.abrangencia === "País" ? c.local : "");
    const continente = c.continente || (pais ? (buscarPaisSelecao(pais).continente || "") : (c.abrangencia === "Continental" ? c.local : ""));
    return `
      <tr data-categoria="${categoria}" data-abrangencia="${limparTexto(c.abrangencia || "")}" data-continente="${limparTexto(continente || "")}" data-pais="${limparTexto(pais || "")}">
        <td><span class="link-detalhe" onclick="abrirDetalhesLiga('${c.id}')">${imagemNome(c.escudo, c.nome, "🏆")}</span></td>
        <td>${categoria === "selecao" ? "Competição de seleções" : "Competição de clubes"}</td>
        <td>${limparTexto(c.tipo || "Não informado")}</td>
        <td>${limparTexto(c.abrangencia || "")}</td>
        <td>${c.bandeira || ""} ${limparTexto(c.local || "")}</td>
        <td>${botoesEditarExcluir("competicoes", c.id)}</td>
      </tr>
    `;
  }).join("");
  if (!linhas) return `<div class="tabela-container"><p>Nenhuma competição cadastrada para editar.</p></div>`;
  return `${filtrosEdicao("filtroEdicaoCompeticoes", "aplicarFiltrosEdicaoCompeticoes")}
    <div class="tabela-container"><table class="tabela" id="tabelaEdicaoCompeticoes">
    <tr><th>Competição</th><th>Categoria</th><th>Tipo</th><th>Abrangência</th><th>Local</th><th>Ações</th></tr>${linhas}</table></div>`;
}

function tabelaTitulos(banco) {
  const linhas = (banco.titulos || []).map(t => {
    const competicao = (banco.competicoes || []).find(c => c.id === t.competicaoId);
    const categoria = t.campeaoTipo || t.viceTipo || (competicao ? (competicao.categoria || normalizarCategoriaCompeticao(competicao)) : "") || "clube";
    const pais = competicao?.pais || (competicao?.abrangencia === "País" ? competicao?.local : "");
    const continente = competicao?.continente || (pais ? (buscarPaisSelecao(pais).continente || "") : (competicao?.abrangencia === "Continental" ? competicao?.local : ""));
    return `
      <tr data-categoria="${categoria}" data-abrangencia="${limparTexto(t.abrangencia || competicao?.abrangencia || "")}" data-continente="${limparTexto(continente || "")}" data-pais="${limparTexto(pais || "")}">
        <td>${limparTexto(t.ano || "")}</td><td>${categoria === "selecao" ? "Seleções" : "Clubes"}</td>
        <td>${limparTexto(t.abrangencia || competicao?.abrangencia || "")}</td><td>${linkLiga(t.competicaoId)}</td>
        <td>${linkParticipanteEdicao(t.campeaoId, t.campeaoTipo, t.campeaoNome)}</td><td>${linkParticipanteEdicao(t.viceId, t.viceTipo, t.viceNome)}</td>
        <td>${botoesEditarExcluir("titulos", t.id)}</td>
      </tr>`;
  }).join("");
  if (!linhas) return `<div class="tabela-container"><p>Nenhum campeão ou vice cadastrado para editar.</p></div>`;
  return `${filtrosEdicao("filtroEdicaoTitulos", "aplicarFiltrosEdicaoTitulos")}
    <div class="tabela-container"><table class="tabela" id="tabelaEdicaoTitulos">
    <tr><th>Ano</th><th>Categoria</th><th>Abrangência</th><th>Competição</th><th>Campeão</th><th>Vice</th><th>Ações</th></tr>${linhas}</table></div>`;
}

function aplicarFiltrosTabelaEdicao(tabelaId, categoriaId, abrangenciaId) {
  const prefixo = categoriaId.replace("Categoria", "");
  const categoria = document.getElementById(categoriaId)?.value || "";
  const abrangencia = document.getElementById(abrangenciaId)?.value || "";
  const continente = document.getElementById(`${prefixo}Continente`)?.value || "";
  const pais = document.getElementById(`${prefixo}Pais`)?.value || "";
  const linhas = document.querySelectorAll(`#${tabelaId} tr[data-categoria]`);
  linhas.forEach(linha => {
    const okCategoria = !categoria || linha.dataset.categoria === categoria;
    const okAbrangencia = !abrangencia || linha.dataset.abrangencia === abrangencia;
    const okContinente = !continente || linha.dataset.continente === continente;
    const okPais = !pais || linha.dataset.pais === pais;
    linha.style.display = okCategoria && okAbrangencia && okContinente && okPais ? "" : "none";
  });
}

function opcoesAbrangenciaEdicao(valorAtual = "", categoria = "clube") {
  const lista = categoria === "selecao"
    ? [{ valor: "Mundial", texto: "Mundial" }, { valor: "Continental", texto: "Continente" }]
    : [{ valor: "Mundial", texto: "Mundial" }, { valor: "Continental", texto: "Continente" }, { valor: "Regional", texto: "Regional" }, { valor: "País", texto: "País" }, { valor: "Estadual", texto: "Estadual" }];
  return lista.map(a => `<option value="${a.valor}" ${a.valor === valorAtual ? "selected" : ""}>${a.texto}</option>`).join("");
}

function formularioEditarCompeticao(competicao) {
  const categoriaAtual = competicao.categoria || normalizarCategoriaCompeticao(competicao) || "clube";
  const continentes = fpContinentesEdicao();
  const paisesBase = fpListaPaisesCompletaEdicao();
  const continenteAtual = competicao.continente || (competicao.abrangencia === "Continental" ? competicao.local : "") || "";
  const paisAtual = competicao.pais || (competicao.abrangencia === "País" ? competicao.local : "") || "";
  const opcoesContinentes = continentes.map(c => `<option value="${limparTexto(c)}" ${continenteAtual === c ? "selected" : ""}>${limparTexto(c)}</option>`).join("");
  const opcoesPaises = paisesBase.filter(p => !continenteAtual || p.continente === continenteAtual).map(p => `<option value="${limparTexto(p.nome)}" ${paisAtual === p.nome ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  setTimeout(() => { atualizarAbrangenciasEdicaoCompeticao(); atualizarCamposAbrangenciaEdicaoCompeticao(); }, 50);
  return `
    <form class="form-edicao" onsubmit="salvarEdicaoCompeticao(event, '${competicao.id}')">
      <h2>Editar Competição/Liga</h2>
      ${competicao.escudo ? `<img class="preview-edicao" src="${competicao.escudo}" alt="Escudo atual">` : ""}
      <label>Categoria da competição</label>
      <select id="editCategoriaCompeticao" onchange="atualizarAbrangenciasEdicaoCompeticao()">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>
      <label>Abrangência da competição</label>
      <select id="editAbrangencia" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">${opcoesAbrangenciaEdicao(competicao.abrangencia, categoriaAtual)}</select>
      <div id="grupoEditContinenteCompeticao" class="grupo"><label>Continente</label><select id="editContinenteCompeticao" onchange="carregarPaisesEdicaoCompeticao()"><option value="">Selecione um continente</option>${opcoesContinentes}</select></div>
      <div id="grupoEditPaisCompeticao" class="grupo"><label>País</label><select id="editPaisCompeticao"><option value="">Selecione um país</option>${opcoesPaises}</select></div>
      <label>Nome</label><input type="text" id="editNome" value="${limparTexto(competicao.nome)}">
      <label>Tipo da competição</label>
      <select id="editTipoCompeticao">
        <option value="">Selecione o tipo da competição</option>
        ${["Liga","Copa","Supercopa","Recopa","Taça","Torneio","Campeonato","Mundial de Clubes","Copa Continental","Copa Regional","Estadual","Interestadual","Amistoso","Outros"].map(t => `<option value="${t}" ${competicao.tipo === t ? "selected" : ""}>${t}</option>`).join("")}
      </select>
      <label>Cadastrar/Trocar escudo da liga/competição</label><input type="file" id="editEscudo" accept="image/*">
      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('competicoes', '${competicao.id}')">Excluir competição</button>
        <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
      </div>
    </form>`;
}

function atualizarAbrangenciasEdicaoCompeticao() {
  const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
  const select = document.getElementById("editAbrangencia");
  if (select) {
    const atual = select.value;
    select.innerHTML = opcoesAbrangenciaEdicao(atual, categoria);
    if (atual && !Array.from(select.options).some(o => o.value === atual)) select.value = "Mundial";
  }
  atualizarCamposAbrangenciaEdicaoCompeticao();
}

function carregarPaisesEdicaoCompeticao() {
  const continente = document.getElementById("editContinenteCompeticao")?.value || "";
  const selectPais = document.getElementById("editPaisCompeticao");
  if (!selectPais) return;
  const atual = selectPais.value;
  const paises = fpListaPaisesCompletaEdicao().filter(p => !continente || p.continente === continente);
  selectPais.innerHTML = `<option value="">Selecione um país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === atual)) selectPais.value = atual;
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const abrangencia = document.getElementById("editAbrangencia")?.value || "";
  const grupoContinente = document.getElementById("grupoEditContinenteCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");
  if (grupoContinente) grupoContinente.classList.toggle("oculto", abrangencia !== "Continental");
  if (grupoPais) grupoPais.classList.toggle("oculto", abrangencia !== "País");
  carregarPaisesEdicaoCompeticao();
}

function formularioEditarTitulo(titulo, banco) {
  const competicaoAtualTitulo = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || (competicaoAtualTitulo ? (competicaoAtualTitulo.categoria || normalizarCategoriaCompeticao(competicaoAtualTitulo)) : "") || "clube";
  const abrangenciaAtual = titulo.abrangencia || competicaoAtualTitulo?.abrangencia || "";
  const continenteAtual = competicaoAtualTitulo?.continente || (competicaoAtualTitulo?.abrangencia === "Continental" ? competicaoAtualTitulo?.local : "") || "";
  const paisAtual = competicaoAtualTitulo?.pais || (competicaoAtualTitulo?.abrangencia === "País" ? competicaoAtualTitulo?.local : "") || "";
  const opcoesCompeticoes = banco.competicoes.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map(c => {
    const pais = c.pais || (c.abrangencia === "País" ? c.local : "");
    const continente = c.continente || (pais ? (buscarPaisSelecao(pais).continente || "") : (c.abrangencia === "Continental" ? c.local : ""));
    return `<option value="${c.id}" data-abrangencia="${limparTexto(c.abrangencia || "")}" data-categoria="${limparTexto(c.categoria || normalizarCategoriaCompeticao(c) || "clube")}" data-continente="${limparTexto(continente || "")}" data-pais="${limparTexto(pais || "")}" ${c.id === titulo.competicaoId ? "selected" : ""}>${limparTexto(c.nome)}</option>`;
  }).join("");
  const opcoesTimes = listarParticipantesEdicaoTitulo(banco).map(item => {
    const paisNome = item.tipo === "selecao" ? (item.pais || item.nome) : item.pais;
    const continente = paisNome ? (buscarPaisSelecao(paisNome).continente || "") : "";
    return `<option value="${item.id}" data-tipo="${item.tipo}" data-pais="${limparTexto(paisNome || "")}" data-continente="${limparTexto(continente)}">${limparTexto(item.nome)} - ${item.tipo === "selecao" ? "Seleção" : "Clube"}${item.pais ? " - " + limparTexto(item.pais) : ""}</option>`;
  }).join("");
  setTimeout(() => {
    const categoria = document.getElementById("editCategoriaTitulo");
    const abrangencia = document.getElementById("editAbrangenciaTitulo");
    const continente = document.getElementById("editContinenteTitulo");
    const pais = document.getElementById("editPaisTitulo");
    if (categoria) categoria.value = categoriaAtual;
    atualizarAbrangenciasEdicaoTitulo();
    if (abrangencia) abrangencia.value = abrangenciaAtual;
    atualizarCamposLocalEdicaoTitulo();
    if (continente) continente.value = continenteAtual;
    carregarPaisesEdicaoTitulo();
    if (pais) pais.value = paisAtual;
    const campeao = document.getElementById("editCampeao");
    const vice = document.getElementById("editVice");
    if (campeao) campeao.value = titulo.campeaoId || "";
    if (vice) vice.value = titulo.viceId || "";
    filtrarCompeticoesEdicaoTitulo();
  }, 50);
  return `<form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')"><h2>Editar Campeão e Vice</h2>
    <label>Categoria da competição</label><select id="editCategoriaTitulo" onchange="atualizarAbrangenciasEdicaoTitulo()"><option value="clube">Competição de clubes</option><option value="selecao">Competição de seleções</option></select>
    <label>Ano</label><input type="number" id="editAno" value="${limparTexto(titulo.ano || "")}">
    <label>Abrangência</label><select id="editAbrangenciaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()">${fpOpcoesAbrangenciaPorCategoria(categoriaAtual, abrangenciaAtual)}</select>
    <div id="grupoEditContinenteTitulo" class="grupo"><label>Continente</label><select id="editContinenteTitulo" onchange="carregarPaisesEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um continente</option>${fpContinentesEdicao().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}</select></div>
    <div id="grupoEditPaisTitulo" class="grupo"><label>País</label><select id="editPaisTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um país</option></select></div>
    <label>Competição</label><select id="editCompeticaoTitulo"><option value="">Selecione a competição</option>${opcoesCompeticoes}</select>
    <label>Campeão</label><select id="editCampeao"><option value="">Selecione o campeão</option>${opcoesTimes}</select>
    <label>Vice-campeão</label><select id="editVice"><option value="">Selecione o vice</option>${opcoesTimes}</select>
    <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button></form>`;
}

function atualizarAbrangenciasEdicaoTitulo() {
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const select = document.getElementById("editAbrangenciaTitulo");
  if (select) {
    const atual = select.value;
    select.innerHTML = fpOpcoesAbrangenciaPorCategoria(categoria, atual);
    if (atual && !Array.from(select.options).some(o => o.value === atual)) select.value = "Mundial";
  }
  atualizarCamposLocalEdicaoTitulo();
  filtrarCompeticoesEdicaoTitulo();
}

function atualizarCamposLocalEdicaoTitulo() {
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "";
  document.getElementById("grupoEditContinenteTitulo")?.classList.toggle("oculto", abrangencia !== "Continental");
  document.getElementById("grupoEditPaisTitulo")?.classList.toggle("oculto", abrangencia !== "País");
  carregarPaisesEdicaoTitulo();
}

function carregarPaisesEdicaoTitulo() {
  const continente = document.getElementById("editContinenteTitulo")?.value || "";
  const selectPais = document.getElementById("editPaisTitulo");
  if (!selectPais) return;
  const atual = selectPais.value;
  const paises = fpListaPaisesCompletaEdicao().filter(p => !continente || p.continente === continente);
  selectPais.innerHTML = `<option value="">Todos os países</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === atual)) selectPais.value = atual;
}

function filtrarCompeticoesEdicaoTitulo() {
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "";
  const continente = document.getElementById("editContinenteTitulo")?.value || "";
  const pais = document.getElementById("editPaisTitulo")?.value || "";
  const competicao = document.getElementById("editCompeticaoTitulo");
  const campeao = document.getElementById("editCampeao");
  const vice = document.getElementById("editVice");
  if (competicao) {
    let primeiraVisivel = "";
    Array.from(competicao.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      const mostrar = (!abrangencia || option.dataset.abrangencia === abrangencia) && option.dataset.categoria === categoria && (!continente || option.dataset.continente === continente) && (!pais || option.dataset.pais === pais);
      option.hidden = !mostrar;
      if (mostrar && !primeiraVisivel) primeiraVisivel = option.value;
    });
    if (competicao.selectedOptions[0]?.hidden) competicao.value = primeiraVisivel || "";
  }
  [campeao, vice].forEach(select => {
    if (!select) return;
    Array.from(select.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      const mostrar = option.dataset.tipo === categoria && (!pais || option.dataset.pais === pais) && (!continente || option.dataset.continente === continente);
      option.hidden = !mostrar;
    });
    if (select.selectedOptions[0]?.hidden) select.value = "";
  });
}

function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const competicao = banco.competicoes.find(c => c.id === id);
  if (!competicao) return;
  lerImagem("editEscudo", novaImagem => {
    competicao.nome = document.getElementById("editNome").value.trim();
    competicao.categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
    competicao.tipo = document.getElementById("editTipoCompeticao").value || "Não informado";
    competicao.abrangencia = document.getElementById("editAbrangencia").value;
    competicao.local = ""; competicao.bandeira = ""; competicao.continente = ""; competicao.pais = "";
    if (competicao.abrangencia === "Mundial") { competicao.local = "Mundial"; competicao.bandeira = "🌍"; }
    if (competicao.abrangencia === "Continental") {
      const continente = document.getElementById("editContinenteCompeticao")?.value || "";
      if (!continente) { alert("Selecione o continente da competição."); return; }
      competicao.continente = continente; competicao.local = continente; competicao.bandeira = "🌎";
    }
    if (competicao.abrangencia === "País") {
      const paisNome = document.getElementById("editPaisCompeticao")?.value || "";
      if (!paisNome) { alert("Selecione o país da competição."); return; }
      const pais = buscarPaisSelecao(paisNome);
      competicao.pais = paisNome; competicao.continente = pais.continente || ""; competicao.local = paisNome; competicao.bandeira = pais.bandeira || "";
    }
    if (competicao.abrangencia === "Regional" || competicao.abrangencia === "Estadual") competicao.local = competicao.abrangencia;
    if (novaImagem) competicao.escudo = novaImagem;
    banco.titulos.forEach(titulo => { if (titulo.competicaoId === competicao.id) { titulo.competicaoNome = competicao.nome; titulo.abrangencia = competicao.abrangencia; } });
    salvarBanco(banco); alert("Competição atualizada com sucesso!"); mostrarEdicao("competicoes");
  });
}

/* ===== Correção: edição de campeão/vice com Mundo e Continental por continente -> país ===== */
function fpOpcoesAbrangenciaTitulo(valorAtual = "") {
  const lista = [
    { valor: "Mundial", texto: "Mundo" },
    { valor: "Continental", texto: "Continental" }
  ];
  return lista.map(a => `<option value="${a.valor}" ${a.valor === valorAtual ? "selected" : ""}>${a.texto}</option>`).join("");
}

function fpNormalizarTextoFiltro(valor) {
  return String(valor || "").trim().toLowerCase();
}

function fpCompeticaoEhMundo(c) {
  const abrangencia = fpNormalizarTextoFiltro(c.abrangencia);
  const tipo = fpNormalizarTextoFiltro(c.tipo);
  const local = fpNormalizarTextoFiltro(c.local);
  return abrangencia === "mundial" || abrangencia === "mundo" || tipo.includes("mund") || local === "mundial" || local === "mundo";
}

function formularioEditarTitulo(titulo, banco) {
  const competicaoAtualTitulo = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || (competicaoAtualTitulo ? (competicaoAtualTitulo.categoria || normalizarCategoriaCompeticao(competicaoAtualTitulo)) : "") || "clube";
  const abrangenciaAtualOriginal = titulo.abrangencia || competicaoAtualTitulo?.abrangencia || "Mundial";
  const abrangenciaAtual = fpCompeticaoEhMundo(competicaoAtualTitulo || { abrangencia: abrangenciaAtualOriginal }) ? "Mundial" : "Continental";
  const continenteAtual = competicaoAtualTitulo?.continente || (competicaoAtualTitulo?.abrangencia === "Continental" ? competicaoAtualTitulo?.local : "") || "";
  const paisAtual = competicaoAtualTitulo?.pais || (competicaoAtualTitulo?.abrangencia === "País" ? competicaoAtualTitulo?.local : "") || "";

  const opcoesCompeticoes = banco.competicoes.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map(c => {
    const pais = c.pais || (c.abrangencia === "País" ? c.local : "");
    const continente = c.continente || (pais ? (buscarPaisSelecao(pais).continente || "") : (c.abrangencia === "Continental" ? c.local : ""));
    const categoria = c.categoria || normalizarCategoriaCompeticao(c) || "clube";
    const ehMundo = fpCompeticaoEhMundo(c) ? "sim" : "nao";
    return `<option value="${c.id}" data-abrangencia="${limparTexto(c.abrangencia || "")}" data-categoria="${limparTexto(categoria)}" data-continente="${limparTexto(continente || "")}" data-pais="${limparTexto(pais || "")}" data-mundo="${ehMundo}" ${c.id === titulo.competicaoId ? "selected" : ""}>${limparTexto(c.nome)}</option>`;
  }).join("");

  const opcoesTimes = listarParticipantesEdicaoTitulo(banco).map(item => {
    const paisNome = item.tipo === "selecao" ? (item.pais || item.nome) : item.pais;
    const continente = paisNome ? (buscarPaisSelecao(paisNome).continente || "") : "";
    return `<option value="${item.id}" data-tipo="${item.tipo}" data-pais="${limparTexto(paisNome || "")}" data-continente="${limparTexto(continente)}">${limparTexto(item.nome)} - ${item.tipo === "selecao" ? "Seleção" : "Clube"}${item.pais ? " - " + limparTexto(item.pais) : ""}</option>`;
  }).join("");

  setTimeout(() => {
    const categoria = document.getElementById("editCategoriaTitulo");
    const abrangencia = document.getElementById("editAbrangenciaTitulo");
    const continente = document.getElementById("editContinenteTitulo");
    const pais = document.getElementById("editPaisTitulo");
    if (categoria) categoria.value = categoriaAtual;
    if (abrangencia) abrangencia.value = abrangenciaAtual;
    atualizarCamposLocalEdicaoTitulo();
    if (continente) continente.value = continenteAtual;
    carregarPaisesEdicaoTitulo();
    if (pais) pais.value = paisAtual;
    const campeao = document.getElementById("editCampeao");
    const vice = document.getElementById("editVice");
    if (campeao) campeao.value = titulo.campeaoId || "";
    if (vice) vice.value = titulo.viceId || "";
    filtrarCompeticoesEdicaoTitulo();
  }, 50);

  return `<form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')"><h2>Editar Campeão e Vice</h2>
    <label>Categoria da competição</label><select id="editCategoriaTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option><option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option></select>
    <label>Ano</label><input type="number" id="editAno" value="${limparTexto(titulo.ano || "")}">
    <label>Abrangência</label><select id="editAbrangenciaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()">${fpOpcoesAbrangenciaTitulo(abrangenciaAtual)}</select>
    <div id="grupoEditContinenteTitulo" class="grupo"><label>Continente</label><select id="editContinenteTitulo" onchange="carregarPaisesEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um continente</option>${fpContinentesEdicao().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}</select></div>
    <div id="grupoEditPaisTitulo" class="grupo"><label>País</label><select id="editPaisTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um país</option></select></div>
    <label>Competição</label><select id="editCompeticaoTitulo"><option value="">Selecione a competição</option>${opcoesCompeticoes}</select>
    <label>Campeão</label><select id="editCampeao"><option value="">Selecione o campeão</option>${opcoesTimes}</select>
    <label>Vice-campeão</label><select id="editVice"><option value="">Selecione o vice</option>${opcoesTimes}</select>
    <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button></form>`;
}

function atualizarCamposLocalEdicaoTitulo() {
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "Mundial";
  const grupoContinente = document.getElementById("grupoEditContinenteTitulo");
  const grupoPais = document.getElementById("grupoEditPaisTitulo");
  const mostrarLocal = abrangencia === "Continental";
  if (grupoContinente) grupoContinente.classList.toggle("oculto", !mostrarLocal);
  if (grupoPais) grupoPais.classList.toggle("oculto", !mostrarLocal);
  if (!mostrarLocal) {
    const continente = document.getElementById("editContinenteTitulo");
    const pais = document.getElementById("editPaisTitulo");
    if (continente) continente.value = "";
    if (pais) pais.innerHTML = `<option value="">Selecione um país</option>`;
  } else {
    carregarPaisesEdicaoTitulo();
  }
}

function carregarPaisesEdicaoTitulo() {
  const continente = document.getElementById("editContinenteTitulo")?.value || "";
  const selectPais = document.getElementById("editPaisTitulo");
  if (!selectPais) return;
  const atual = selectPais.value;
  const paises = fpListaPaisesCompletaEdicao().filter(p => !continente || p.continente === continente);
  selectPais.innerHTML = `<option value="">Selecione um país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === atual)) selectPais.value = atual;
}

function filtrarCompeticoesEdicaoTitulo() {
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "Mundial";
  const continente = document.getElementById("editContinenteTitulo")?.value || "";
  const pais = document.getElementById("editPaisTitulo")?.value || "";
  const competicao = document.getElementById("editCompeticaoTitulo");
  const campeao = document.getElementById("editCampeao");
  const vice = document.getElementById("editVice");

  if (competicao) {
    let primeiraVisivel = "";
    Array.from(competicao.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      const mesmaCategoria = option.dataset.categoria === categoria;
      let mostrar = false;
      if (abrangencia === "Mundial") {
        mostrar = mesmaCategoria && option.dataset.mundo === "sim";
      } else if (abrangencia === "Continental") {
        mostrar = mesmaCategoria && (!continente || option.dataset.continente === continente) && (!pais || option.dataset.pais === pais);
      }
      option.hidden = !mostrar;
      if (mostrar && !primeiraVisivel) primeiraVisivel = option.value;
    });
    if (competicao.selectedOptions[0]?.hidden) competicao.value = primeiraVisivel || "";
  }

  [campeao, vice].forEach(select => {
    if (!select) return;
    Array.from(select.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      let mostrar = option.dataset.tipo === categoria;
      if (abrangencia === "Continental" && continente) {
        if (categoria === "selecao") mostrar = mostrar && option.dataset.continente === continente;
        if (categoria === "clube" && pais) mostrar = mostrar && option.dataset.pais === pais;
      }
      option.hidden = !mostrar;
    });
    if (select.selectedOptions[0]?.hidden) select.value = "";
  });
}

window.formularioEditarTitulo = formularioEditarTitulo;
window.atualizarCamposLocalEdicaoTitulo = atualizarCamposLocalEdicaoTitulo;
window.carregarPaisesEdicaoTitulo = carregarPaisesEdicaoTitulo;
window.filtrarCompeticoesEdicaoTitulo = filtrarCompeticoesEdicaoTitulo;

/* ===== Ajuste final: Editar Competições de Clubes com a mesma lógica de Campeão/Vice ===== */
function fpOpcoesAbrangenciaCompeticaoClube(valorAtual = "") {
  const lista = [
    { valor: "Mundial", texto: "Mundo" },
    { valor: "Continental", texto: "Continental" }
  ];
  return lista.map(a => `<option value="${a.valor}" ${a.valor === valorAtual ? "selected" : ""}>${a.texto}</option>`).join("");
}

function formularioEditarCompeticao(competicao) {
  const categoriaAtual = competicao.categoria || normalizarCategoriaCompeticao(competicao) || "clube";
  const abrangenciaOriginal = competicao.abrangencia || "Mundial";
  const abrangenciaAtual = categoriaAtual === "clube"
    ? (fpCompeticaoEhMundo(competicao) ? "Mundial" : "Continental")
    : (fpCompeticaoEhMundo(competicao) ? "Mundial" : "Continental");
  const continenteAtual = competicao.continente || (competicao.abrangencia === "Continental" ? competicao.local : "") || "";
  const paisAtual = competicao.pais || (competicao.abrangencia === "País" ? competicao.local : "") || "";
  const continentes = fpContinentesEdicao();
  const paisesBase = fpListaPaisesCompletaEdicao();
  const opcoesContinentes = continentes.map(c => `<option value="${limparTexto(c)}" ${continenteAtual === c ? "selected" : ""}>${limparTexto(c)}</option>`).join("");
  const opcoesPaises = paisesBase
    .filter(p => !continenteAtual || p.continente === continenteAtual)
    .map(p => `<option value="${limparTexto(p.nome)}" ${paisAtual === p.nome ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`)
    .join("");

  setTimeout(() => {
    const categoria = document.getElementById("editCategoriaCompeticao");
    const abrangencia = document.getElementById("editAbrangencia");
    const continente = document.getElementById("editContinenteCompeticao");
    const pais = document.getElementById("editPaisCompeticao");
    if (categoria) categoria.value = categoriaAtual;
    if (abrangencia) abrangencia.value = abrangenciaAtual;
    atualizarCamposAbrangenciaEdicaoCompeticao();
    if (continente) continente.value = continenteAtual;
    carregarPaisesEdicaoCompeticao();
    if (pais) pais.value = paisAtual;
  }, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoCompeticao(event, '${competicao.id}')">
      <h2>Editar Competição/Liga</h2>
      ${competicao.escudo ? `<img class="preview-edicao" src="${competicao.escudo}" alt="Escudo atual">` : ""}
      <label>Categoria da competição</label>
      <select id="editCategoriaCompeticao" onchange="atualizarAbrangenciasEdicaoCompeticao()">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>
      <label>Abrangência da competição</label>
      <select id="editAbrangencia" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">${fpOpcoesAbrangenciaCompeticaoClube(abrangenciaAtual)}</select>
      <div id="grupoEditContinenteCompeticao" class="grupo">
        <label>Continente</label>
        <select id="editContinenteCompeticao" onchange="carregarPaisesEdicaoCompeticao()"><option value="">Selecione um continente</option>${opcoesContinentes}</select>
      </div>
      <div id="grupoEditPaisCompeticao" class="grupo">
        <label>País</label>
        <select id="editPaisCompeticao"><option value="">Selecione um país</option>${opcoesPaises}</select>
      </div>
      <label>Nome</label><input type="text" id="editNome" value="${limparTexto(competicao.nome)}">
      <label>Tipo da competição</label>
      <select id="editTipoCompeticao">
        <option value="">Selecione o tipo da competição</option>
        ${["Liga","Copa","Supercopa","Recopa","Taça","Torneio","Campeonato","Mundial de Clubes","Copa Continental","Copa Regional","Estadual","Interestadual","Amistoso","Outros"].map(t => `<option value="${t}" ${competicao.tipo === t ? "selected" : ""}>${t}</option>`).join("")}
      </select>
      <label>Cadastrar/Trocar escudo da liga/competição</label><input type="file" id="editEscudo" accept="image/*">
      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('competicoes', '${competicao.id}')">Excluir competição</button>
        <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
      </div>
    </form>`;
}

function atualizarAbrangenciasEdicaoCompeticao() {
  const select = document.getElementById("editAbrangencia");
  if (select) {
    const atual = select.value || "Mundial";
    select.innerHTML = fpOpcoesAbrangenciaCompeticaoClube(atual);
    if (!Array.from(select.options).some(o => o.value === atual)) select.value = "Mundial";
  }
  atualizarCamposAbrangenciaEdicaoCompeticao();
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const abrangencia = document.getElementById("editAbrangencia")?.value || "Mundial";
  const grupoContinente = document.getElementById("grupoEditContinenteCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");
  const mostrarLocal = abrangencia === "Continental";
  if (grupoContinente) grupoContinente.classList.toggle("oculto", !mostrarLocal);
  if (grupoPais) grupoPais.classList.toggle("oculto", !mostrarLocal);
  if (!mostrarLocal) {
    const continente = document.getElementById("editContinenteCompeticao");
    const pais = document.getElementById("editPaisCompeticao");
    if (continente) continente.value = "";
    if (pais) pais.innerHTML = `<option value="">Selecione um país</option>`;
  } else {
    carregarPaisesEdicaoCompeticao();
  }
}

function carregarPaisesEdicaoCompeticao() {
  const continente = document.getElementById("editContinenteCompeticao")?.value || "";
  const selectPais = document.getElementById("editPaisCompeticao");
  if (!selectPais) return;
  const atual = selectPais.value;
  const paises = fpListaPaisesCompletaEdicao().filter(p => !continente || p.continente === continente);
  selectPais.innerHTML = `<option value="">Selecione um país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === atual)) selectPais.value = atual;
}

function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const competicao = banco.competicoes.find(c => c.id === id);
  if (!competicao) return;
  lerImagem("editEscudo", novaImagem => {
    competicao.nome = document.getElementById("editNome").value.trim();
    competicao.categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
    competicao.tipo = document.getElementById("editTipoCompeticao").value || "Não informado";
    competicao.abrangencia = document.getElementById("editAbrangencia")?.value || "Mundial";
    competicao.local = "";
    competicao.bandeira = "";
    competicao.continente = "";
    competicao.pais = "";

    if (competicao.abrangencia === "Mundial") {
      competicao.local = "Mundial";
      competicao.bandeira = "🌍";
    }

    if (competicao.abrangencia === "Continental") {
      const continente = document.getElementById("editContinenteCompeticao")?.value || "";
      const paisNome = document.getElementById("editPaisCompeticao")?.value || "";
      if (!continente) { alert("Selecione o continente da competição."); return; }
      if (!paisNome) { alert("Selecione o país da competição."); return; }
      const pais = buscarPaisSelecao(paisNome);
      competicao.continente = continente;
      competicao.pais = paisNome;
      competicao.local = paisNome;
      competicao.bandeira = pais.bandeira || "🌎";
    }

    if (novaImagem) competicao.escudo = novaImagem;
    banco.titulos.forEach(titulo => {
      if (titulo.competicaoId === competicao.id) {
        titulo.competicaoNome = competicao.nome;
        titulo.abrangencia = competicao.abrangencia;
      }
    });
    salvarBanco(banco);
    alert("Competição atualizada com sucesso!");
    mostrarEdicao("competicoes");
  });
}

window.formularioEditarCompeticao = formularioEditarCompeticao;
window.atualizarAbrangenciasEdicaoCompeticao = atualizarAbrangenciasEdicaoCompeticao;
window.atualizarCamposAbrangenciaEdicaoCompeticao = atualizarCamposAbrangenciaEdicaoCompeticao;
window.carregarPaisesEdicaoCompeticao = carregarPaisesEdicaoCompeticao;
window.salvarEdicaoCompeticao = salvarEdicaoCompeticao;

/* ===== Correção solicitada: Edição de competições de clubes e campeão/vice de clubes =====
   Abrangências: Mundo e Continentes.
   Mundo: mostra competições de nível mundial.
   Continentes: mostra continentes -> países do continente -> competições do país selecionado.
*/
function fpAbrangenciasClubeMundoContinentes(valorAtual = "") {
  const atual = valorAtual === "Mundial" || valorAtual === "Mundo" ? "Mundial" : "Continental";
  return [
    { valor: "Mundial", texto: "Mundo" },
    { valor: "Continental", texto: "Continentes" }
  ].map(a => `<option value="${a.valor}" ${a.valor === atual ? "selected" : ""}>${a.texto}</option>`).join("");
}

function fpCategoriaCompeticaoSegura(c) {
  return (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : (c?.categoria || "clube")) || "clube";
}

function fpPaisDaCompeticao(c) {
  if (!c) return "";
  if (c.pais) return c.pais;
  if (c.abrangencia === "País" && c.local) return c.local;
  return "";
}

function fpContinenteDaCompeticao(c) {
  if (!c) return "";
  if (c.continente) return c.continente;
  const pais = fpPaisDaCompeticao(c);
  if (pais && typeof buscarPaisSelecao === "function") return buscarPaisSelecao(pais).continente || "";
  if (c.abrangencia === "Continental" && c.local) return c.local;
  return "";
}

function fpCompeticaoDoPais(c, pais) {
  if (!pais) return false;
  const paisCompeticao = fpPaisDaCompeticao(c);
  return paisCompeticao === pais || c.local === pais;
}

function fpCompeticaoContinentalDoContinente(c, continente) {
  if (!continente) return false;
  return c.abrangencia === "Continental" && fpContinenteDaCompeticao(c) === continente;
}

function formularioEditarCompeticao(competicao) {
  const categoriaAtual = competicao.categoria || normalizarCategoriaCompeticao(competicao) || "clube";
  const paisAtual = fpPaisDaCompeticao(competicao);
  const continenteAtual = fpContinenteDaCompeticao(competicao) || (paisAtual ? (buscarPaisSelecao(paisAtual).continente || "") : "");
  const abrangenciaAtual = fpCompeticaoEhMundo(competicao) ? "Mundial" : "Continental";

  setTimeout(() => {
    const categoria = document.getElementById("editCategoriaCompeticao");
    const abrangencia = document.getElementById("editAbrangencia");
    const continente = document.getElementById("editContinenteCompeticao");
    const pais = document.getElementById("editPaisCompeticao");
    if (categoria) categoria.value = categoriaAtual;
    if (abrangencia) abrangencia.value = abrangenciaAtual;
    atualizarCamposAbrangenciaEdicaoCompeticao();
    if (continente) continente.value = continenteAtual;
    carregarPaisesEdicaoCompeticao();
    if (pais) pais.value = paisAtual;
  }, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoCompeticao(event, '${competicao.id}')">
      <h2>Editar Competição/Liga</h2>
      ${competicao.escudo ? `<img class="preview-edicao" src="${competicao.escudo}" alt="Escudo atual">` : ""}
      <label>Categoria da competição</label>
      <select id="editCategoriaCompeticao">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>
      <label>Abrangência da competição</label>
      <select id="editAbrangencia" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">${fpAbrangenciasClubeMundoContinentes(abrangenciaAtual)}</select>
      <div id="grupoEditContinenteCompeticao" class="grupo">
        <label>Continente</label>
        <select id="editContinenteCompeticao" onchange="carregarPaisesEdicaoCompeticao()"><option value="">Selecione um continente</option>${fpContinentesEdicao().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}</select>
      </div>
      <div id="grupoEditPaisCompeticao" class="grupo">
        <label>País</label>
        <select id="editPaisCompeticao"><option value="">Selecione um país</option></select>
      </div>
      <label>Nome</label><input type="text" id="editNome" value="${limparTexto(competicao.nome)}">
      <label>Tipo da competição</label>
      <select id="editTipoCompeticao">
        <option value="">Selecione o tipo da competição</option>
        ${["Liga","Copa","Supercopa","Recopa","Taça","Torneio","Campeonato","Mundial de Clubes","Copa Continental","Copa Regional","Estadual","Interestadual","Amistoso","Outros"].map(t => `<option value="${t}" ${competicao.tipo === t ? "selected" : ""}>${t}</option>`).join("")}
      </select>
      <label>Cadastrar/Trocar escudo da liga/competição</label><input type="file" id="editEscudo" accept="image/*">
      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('competicoes', '${competicao.id}')">Excluir competição</button>
        <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
      </div>
    </form>`;
}

function atualizarAbrangenciasEdicaoCompeticao() {
  const select = document.getElementById("editAbrangencia");
  if (select) select.innerHTML = fpAbrangenciasClubeMundoContinentes(select.value || "Mundial");
  atualizarCamposAbrangenciaEdicaoCompeticao();
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const abrangencia = document.getElementById("editAbrangencia")?.value || "Mundial";
  const grupoContinente = document.getElementById("grupoEditContinenteCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");
  const mostrar = abrangencia === "Continental";
  if (grupoContinente) grupoContinente.classList.toggle("oculto", !mostrar);
  if (grupoPais) grupoPais.classList.toggle("oculto", !mostrar);
  if (!mostrar) {
    const continente = document.getElementById("editContinenteCompeticao");
    const pais = document.getElementById("editPaisCompeticao");
    if (continente) continente.value = "";
    if (pais) pais.innerHTML = `<option value="">Selecione um país</option>`;
  } else {
    carregarPaisesEdicaoCompeticao();
  }
}

function carregarPaisesEdicaoCompeticao() {
  const continente = document.getElementById("editContinenteCompeticao")?.value || "";
  const selectPais = document.getElementById("editPaisCompeticao");
  if (!selectPais) return;
  const atual = selectPais.value;
  const paises = fpListaPaisesCompletaEdicao().filter(p => !continente || p.continente === continente);
  selectPais.innerHTML = `<option value="">Selecione um país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === atual)) selectPais.value = atual;
}

function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const competicao = banco.competicoes.find(c => c.id === id);
  if (!competicao) return;
  lerImagem("editEscudo", novaImagem => {
    competicao.nome = document.getElementById("editNome").value.trim();
    competicao.categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
    competicao.tipo = document.getElementById("editTipoCompeticao").value || "Não informado";
    const abrangenciaTela = document.getElementById("editAbrangencia")?.value || "Mundial";

    competicao.local = "";
    competicao.bandeira = "";
    competicao.continente = "";
    competicao.pais = "";

    if (abrangenciaTela === "Mundial") {
      competicao.abrangencia = "Mundial";
      competicao.local = "Mundial";
      competicao.bandeira = "🌍";
    } else {
      const continente = document.getElementById("editContinenteCompeticao")?.value || "";
      const paisNome = document.getElementById("editPaisCompeticao")?.value || "";
      if (!continente) { alert("Selecione o continente."); return; }
      if (!paisNome) { alert("Selecione o país."); return; }
      const pais = buscarPaisSelecao(paisNome);
      competicao.abrangencia = "País";
      competicao.continente = continente;
      competicao.pais = paisNome;
      competicao.local = paisNome;
      competicao.bandeira = pais.bandeira || "";
    }

    if (novaImagem) competicao.escudo = novaImagem;
    banco.titulos.forEach(titulo => {
      if (titulo.competicaoId === competicao.id) {
        titulo.competicaoNome = competicao.nome;
        titulo.abrangencia = competicao.abrangencia;
      }
    });
    salvarBanco(banco);
    alert("Competição atualizada com sucesso!");
    mostrarEdicao("competicoes");
  });
}

function fpOpcoesAbrangenciaTitulo(valorAtual = "") {
  return fpAbrangenciasClubeMundoContinentes(valorAtual);
}

function formularioEditarTitulo(titulo, banco) {
  const competicaoAtualTitulo = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || (competicaoAtualTitulo ? fpCategoriaCompeticaoSegura(competicaoAtualTitulo) : "clube") || "clube";
  const paisAtual = fpPaisDaCompeticao(competicaoAtualTitulo);
  const continenteAtual = fpContinenteDaCompeticao(competicaoAtualTitulo) || (paisAtual ? (buscarPaisSelecao(paisAtual).continente || "") : "");
  const abrangenciaAtual = fpCompeticaoEhMundo(competicaoAtualTitulo || {}) ? "Mundial" : "Continental";

  const opcoesCompeticoes = banco.competicoes.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map(c => {
    const pais = fpPaisDaCompeticao(c);
    const continente = fpContinenteDaCompeticao(c);
    const categoria = fpCategoriaCompeticaoSegura(c);
    const mundo = fpCompeticaoEhMundo(c) ? "sim" : "nao";
    return `<option value="${c.id}" data-categoria="${limparTexto(categoria)}" data-pais="${limparTexto(pais)}" data-continente="${limparTexto(continente)}" data-mundo="${mundo}" ${c.id === titulo.competicaoId ? "selected" : ""}>${limparTexto(c.nome)}</option>`;
  }).join("");

  const opcoesTimes = listarParticipantesEdicaoTitulo(banco).map(item => {
    const paisNome = item.tipo === "selecao" ? (item.pais || item.nome) : item.pais;
    const continente = paisNome ? (buscarPaisSelecao(paisNome).continente || "") : "";
    return `<option value="${item.id}" data-tipo="${item.tipo}" data-pais="${limparTexto(paisNome || "")}" data-continente="${limparTexto(continente)}">${limparTexto(item.nome)} - ${item.tipo === "selecao" ? "Seleção" : "Clube"}${item.pais ? " - " + limparTexto(item.pais) : ""}</option>`;
  }).join("");

  setTimeout(() => {
    const categoria = document.getElementById("editCategoriaTitulo");
    const abrangencia = document.getElementById("editAbrangenciaTitulo");
    const continente = document.getElementById("editContinenteTitulo");
    const pais = document.getElementById("editPaisTitulo");
    if (categoria) categoria.value = categoriaAtual;
    if (abrangencia) abrangencia.value = abrangenciaAtual;
    atualizarCamposLocalEdicaoTitulo();
    if (continente) continente.value = continenteAtual;
    carregarPaisesEdicaoTitulo();
    if (pais) pais.value = paisAtual;
    const campeao = document.getElementById("editCampeao");
    const vice = document.getElementById("editVice");
    if (campeao) campeao.value = titulo.campeaoId || "";
    if (vice) vice.value = titulo.viceId || "";
    filtrarCompeticoesEdicaoTitulo();
  }, 50);

  return `<form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')"><h2>Editar Campeão e Vice</h2>
    <label>Categoria da competição</label><select id="editCategoriaTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option><option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option></select>
    <label>Ano</label><input type="number" id="editAno" value="${limparTexto(titulo.ano || "")}">
    <label>Abrangência</label><select id="editAbrangenciaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()">${fpOpcoesAbrangenciaTitulo(abrangenciaAtual)}</select>
    <div id="grupoEditContinenteTitulo" class="grupo"><label>Continente</label><select id="editContinenteTitulo" onchange="carregarPaisesEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um continente</option>${fpContinentesEdicao().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}</select></div>
    <div id="grupoEditPaisTitulo" class="grupo"><label>País</label><select id="editPaisTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um país</option></select></div>
    <label>Competição</label><select id="editCompeticaoTitulo"><option value="">Selecione a competição</option>${opcoesCompeticoes}</select>
    <label>Campeão</label><select id="editCampeao"><option value="">Selecione o campeão</option>${opcoesTimes}</select>
    <label>Vice-campeão</label><select id="editVice"><option value="">Selecione o vice</option>${opcoesTimes}</select>
    <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button></form>`;
}

function atualizarCamposLocalEdicaoTitulo() {
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "Mundial";
  const grupoContinente = document.getElementById("grupoEditContinenteTitulo");
  const grupoPais = document.getElementById("grupoEditPaisTitulo");
  const mostrar = abrangencia === "Continental";
  if (grupoContinente) grupoContinente.classList.toggle("oculto", !mostrar);
  if (grupoPais) grupoPais.classList.toggle("oculto", !mostrar);
  if (!mostrar) {
    const continente = document.getElementById("editContinenteTitulo");
    const pais = document.getElementById("editPaisTitulo");
    if (continente) continente.value = "";
    if (pais) pais.innerHTML = `<option value="">Selecione um país</option>`;
  } else {
    carregarPaisesEdicaoTitulo();
  }
}

function filtrarCompeticoesEdicaoTitulo() {
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "Mundial";
  const continente = document.getElementById("editContinenteTitulo")?.value || "";
  const pais = document.getElementById("editPaisTitulo")?.value || "";
  const competicao = document.getElementById("editCompeticaoTitulo");
  const campeao = document.getElementById("editCampeao");
  const vice = document.getElementById("editVice");

  if (competicao) {
    let primeiraVisivel = "";
    Array.from(competicao.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      const mesmaCategoria = option.dataset.categoria === categoria;
      let mostrar = false;
      if (abrangencia === "Mundial") {
        mostrar = mesmaCategoria && option.dataset.mundo === "sim";
      } else {
        mostrar = mesmaCategoria && !!continente && !!pais && option.dataset.pais === pais;
      }
      option.hidden = !mostrar;
      if (mostrar && !primeiraVisivel) primeiraVisivel = option.value;
    });
    if (competicao.selectedOptions[0]?.hidden) competicao.value = primeiraVisivel || "";
  }

  [campeao, vice].forEach(select => {
    if (!select) return;
    Array.from(select.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      let mostrar = option.dataset.tipo === categoria;
      if (abrangencia === "Continental") {
        mostrar = mostrar && !!pais && option.dataset.pais === pais;
      }
      option.hidden = !mostrar;
    });
    if (select.selectedOptions[0]?.hidden) select.value = "";
  });
}

window.formularioEditarCompeticao = formularioEditarCompeticao;
window.atualizarAbrangenciasEdicaoCompeticao = atualizarAbrangenciasEdicaoCompeticao;
window.atualizarCamposAbrangenciaEdicaoCompeticao = atualizarCamposAbrangenciaEdicaoCompeticao;
window.carregarPaisesEdicaoCompeticao = carregarPaisesEdicaoCompeticao;
window.salvarEdicaoCompeticao = salvarEdicaoCompeticao;
window.formularioEditarTitulo = formularioEditarTitulo;
window.atualizarCamposLocalEdicaoTitulo = atualizarCamposLocalEdicaoTitulo;
window.carregarPaisesEdicaoTitulo = carregarPaisesEdicaoTitulo;
window.filtrarCompeticoesEdicaoTitulo = filtrarCompeticoesEdicaoTitulo;

/* ===== Fluxo final solicitado: Edições Clubes/Seleções ===== */
function fpFinalCat(c){ return (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : (c?.categoria || "clube")) || "clube"; }
function fpFinalTxt(v){ return String(v||"").trim().toLowerCase(); }
function fpFinalMundo(c){ const a=fpFinalTxt(c?.abrangencia),t=fpFinalTxt(c?.tipo),l=fpFinalTxt(c?.local); return a==="mundial"||a==="mundo"||t.includes("mund")||l==="mundial"||l==="mundo"; }
function fpFinalPais(c){ return c?.pais || ((c?.abrangencia === "País" || c?.abrangencia === "Pais") ? c.local : "") || ""; }
function fpFinalContinente(c){ const p=fpFinalPais(c); if(c?.continente)return c.continente; if(p&&typeof buscarPaisSelecao==="function")return buscarPaisSelecao(p).continente||""; return c?.abrangencia==="Continental"?(c.local||""):""; }
function fpFinalPaises(){ return fpListaPaisesCompletaEdicao(); }
function fpFinalAbrangenciaVisual(c){ return fpFinalMundo(c) ? "Mundial" : "Continental"; }
function filtrosEdicao(prefixo, funcao) {
  return `<div class="filtros filtros-edicao">
    <div><label>Categoria</label><select id="${prefixo}Categoria" onchange="fpFinalAtualizarFiltroEdicao('${prefixo}', '${funcao}')"><option value="clube">Clubes</option><option value="selecao">Seleções</option></select></div>
    <div id="${prefixo}GrupoAbrangencia"><label>Abrangência</label><select id="${prefixo}Abrangencia" onchange="fpFinalAtualizarFiltroEdicao('${prefixo}', '${funcao}')"><option value="Mundial">Mundo</option><option value="Continental">Continentes</option></select></div>
    <div id="${prefixo}GrupoContinente" class="oculto"><label>Continente</label><select id="${prefixo}Continente" onchange="carregarPaisesFiltroEdicao('${prefixo}'); ${funcao}()"><option value="">Selecione um continente</option>${fpContinentesEdicao().map(c=>`<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}</select></div>
    <div id="${prefixo}GrupoPais" class="oculto"><label>País</label><select id="${prefixo}Pais" onchange="${funcao}()"><option value="">Selecione um país</option></select></div>
  </div>`;
}
function fpFinalAtualizarFiltroEdicao(prefixo, funcao) {
  const cat=document.getElementById(`${prefixo}Categoria`)?.value||"clube";
  const abr=document.getElementById(`${prefixo}Abrangencia`)?.value||"Mundial";
  const gAbr=document.getElementById(`${prefixo}GrupoAbrangencia`), gC=document.getElementById(`${prefixo}GrupoContinente`), gP=document.getElementById(`${prefixo}GrupoPais`);
  if(gAbr) gAbr.classList.toggle("oculto", cat!=="clube");
  if(gC) gC.classList.toggle("oculto", !(cat==="clube" && abr==="Continental"));
  if(gP) gP.classList.toggle("oculto", !(cat==="clube" && abr==="Continental"));
  carregarPaisesFiltroEdicao(prefixo);
  if (typeof window[funcao] === "function") window[funcao]();
}
function carregarPaisesFiltroEdicao(prefixo) {
  const selectPais=document.getElementById(`${prefixo}Pais`); if(!selectPais)return;
  const continente=document.getElementById(`${prefixo}Continente`)?.value||"";
  const atual=selectPais.value;
  const paises=fpFinalPaises().filter(p=>!continente||p.continente===continente);
  selectPais.innerHTML=`<option value="">Selecione um país</option>`+paises.map(p=>`<option value="${limparTexto(p.nome)}">${p.bandeira||""} ${limparTexto(p.nome)}</option>`).join("");
  if(paises.some(p=>p.nome===atual)) selectPais.value=atual;
}
function tabelaCompeticoes(banco) {
  const linhas=(banco.competicoes||[]).map(c=>{
    const categoria=fpFinalCat(c), pais=fpFinalPais(c), continente=fpFinalContinente(c), mundo=fpFinalMundo(c)?"sim":"nao";
    return `<tr data-categoria="${limparTexto(categoria)}" data-mundo="${mundo}" data-continente="${limparTexto(continente)}" data-pais="${limparTexto(pais)}"><td><span class="link-detalhe" onclick="abrirDetalhesLiga('${c.id}')">${imagemNome(c.escudo,c.nome,"🏆")}</span></td><td>${categoria==="selecao"?"Competição de seleções":"Competição de clubes"}</td><td>${limparTexto(c.tipo||"Não informado")}</td><td>${limparTexto(c.abrangencia||"")}</td><td>${c.bandeira||""} ${limparTexto(c.local||"")}</td><td>${botoesEditarExcluir("competicoes",c.id)}</td></tr>`;
  }).join("");
  if(!linhas)return `<div class="tabela-container"><p>Nenhuma competição cadastrada para editar.</p></div>`;
  return `${filtrosEdicao("filtroEdicaoCompeticoes","aplicarFiltrosEdicaoCompeticoes")}<div class="tabela-container"><table class="tabela" id="tabelaEdicaoCompeticoes"><tr><th>Competição</th><th>Categoria</th><th>Tipo</th><th>Abrangência</th><th>Local</th><th>Ações</th></tr>${linhas}</table></div>`;
}
function tabelaTitulos(banco) {
  const linhas=(banco.titulos||[]).map(t=>{
    const comp=(banco.competicoes||[]).find(c=>c.id===t.competicaoId);
    const categoria=t.campeaoTipo||t.viceTipo||(comp?fpFinalCat(comp):"clube");
    const pais=fpFinalPais(comp), continente=fpFinalContinente(comp), mundo=fpFinalMundo(comp)?"sim":"nao";
    return `<tr data-categoria="${limparTexto(categoria)}" data-mundo="${mundo}" data-continente="${limparTexto(continente)}" data-pais="${limparTexto(pais)}"><td>${limparTexto(t.ano||"")}</td><td>${categoria==="selecao"?"Seleções":"Clubes"}</td><td>${limparTexto(t.abrangencia||comp?.abrangencia||"")}</td><td>${linkLiga(t.competicaoId)}</td><td>${linkParticipanteEdicao(t.campeaoId,t.campeaoTipo,t.campeaoNome)}</td><td>${linkParticipanteEdicao(t.viceId,t.viceTipo,t.viceNome)}</td><td>${botoesEditarExcluir("titulos",t.id)}</td></tr>`;
  }).join("");
  if(!linhas)return `<div class="tabela-container"><p>Nenhum campeão ou vice cadastrado para editar.</p></div>`;
  return `${filtrosEdicao("filtroEdicaoTitulos","aplicarFiltrosEdicaoTitulos")}<div class="tabela-container"><table class="tabela" id="tabelaEdicaoTitulos"><tr><th>Ano</th><th>Categoria</th><th>Abrangência</th><th>Competição</th><th>Campeão</th><th>Vice</th><th>Ações</th></tr>${linhas}</table></div>`;
}
function aplicarFiltrosTabelaEdicao(tabelaId,categoriaId,abrangenciaId){
  const prefixo=categoriaId.replace("Categoria",""); const cat=document.getElementById(categoriaId)?.value||"clube"; const abr=document.getElementById(abrangenciaId)?.value||"Mundial"; const cont=document.getElementById(`${prefixo}Continente`)?.value||""; const pais=document.getElementById(`${prefixo}Pais`)?.value||"";
  document.querySelectorAll(`#${tabelaId} tr[data-categoria]`).forEach(linha=>{
    let ok=linha.dataset.categoria===cat;
    if(cat==="clube"){
      if(abr==="Mundial") ok=ok&&linha.dataset.mundo==="sim";
      else ok=ok&&linha.dataset.pais&&(!cont||linha.dataset.continente===cont)&&(!pais||linha.dataset.pais===pais);
    }
    linha.style.display=ok?"":"none";
  });
}
function filtrarCompeticoesEdicaoTitulo(){
  const categoria=document.getElementById("editCategoriaTitulo")?.value||"clube"; const abrangencia=document.getElementById("editAbrangenciaTitulo")?.value||"Mundial"; const continente=document.getElementById("editContinenteTitulo")?.value||""; const pais=document.getElementById("editPaisTitulo")?.value||""; const competicao=document.getElementById("editCompeticaoTitulo"); const campeao=document.getElementById("editCampeao"); const vice=document.getElementById("editVice");
  if(competicao){ let primeira=""; Array.from(competicao.options).forEach(o=>{ if(!o.value){o.hidden=false;return;} const mesma=o.dataset.categoria===categoria; let mostrar=mesma; if(categoria==="clube"){ if(abrangencia==="Mundial") mostrar=mesma&&o.dataset.mundo==="sim"; else mostrar=mesma&&!!o.dataset.pais&&(!continente||o.dataset.continente===continente)&&(!pais||o.dataset.pais===pais); } o.hidden=!mostrar; if(mostrar&&!primeira)primeira=o.value; }); if(competicao.selectedOptions[0]?.hidden) competicao.value=primeira||""; }
  [campeao,vice].forEach(s=>{ if(!s)return; Array.from(s.options).forEach(o=>{ if(!o.value){o.hidden=false;return;} let mostrar=o.dataset.tipo===categoria; if(categoria==="clube"&&abrangencia==="Continental"&&pais) mostrar=mostrar&&o.dataset.pais===pais; o.hidden=!mostrar; }); if(s.selectedOptions[0]?.hidden)s.value=""; });
}
window.carregarPaisesFiltroEdicao=carregarPaisesFiltroEdicao;
window.fpFinalAtualizarFiltroEdicao=fpFinalAtualizarFiltroEdicao;
window.tabelaCompeticoes=tabelaCompeticoes;
window.tabelaTitulos=tabelaTitulos;
window.aplicarFiltrosTabelaEdicao=aplicarFiltrosTabelaEdicao;
window.filtrarCompeticoesEdicaoTitulo=filtrarCompeticoesEdicaoTitulo;

/* ===== Ajuste solicitado: Edições > Editar Competições =====
   Clubes: abrangências Mundo, Continente e País.
   - Mundo: competições mundiais de clubes.
   - Continente: carrega diretamente todas as competições internacionais/continentais de clubes, sem exibir continente ou país.
   - País: lista todos os países do banco e carrega competições nacionais do país selecionado.
   Seleções: mantém sem campo de abrangência, exibindo continente e países agrupados por continente. */
function fpEdicaoNormalizar(valor) {
  return String(valor || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function fpEdicaoEhMundo(c) {
  const abrangencia = fpEdicaoNormalizar(c?.abrangencia);
  const tipo = fpEdicaoNormalizar(c?.tipo);
  const local = fpEdicaoNormalizar(c?.local);
  const nome = fpEdicaoNormalizar(c?.nome);
  return abrangencia === "mundial" || abrangencia === "mundo" || local === "mundial" || local === "mundo" || tipo.includes("mundial") || tipo.includes("mundo") || nome.includes("mundial") || nome.includes("intercontinental");
}

function fpEdicaoListaContinentesNormais() {
  try {
    return (fpContinentesEdicao() || []).map(c => String(c || ""));
  } catch (e) {
    return ["América Central", "América do Norte", "América do Sul", "África", "Ásia", "Caribe", "Europa", "Oceania"];
  }
}

function fpEdicaoEhNomeContinente(valor) {
  const n = fpEdicaoNormalizar(valor);
  return fpEdicaoListaContinentesNormais().some(c => fpEdicaoNormalizar(c) === n);
}

function fpEdicaoPaisDaCompeticao(c) {
  if (!c) return "";
  if (c.pais) return c.pais;
  const abrangencia = fpEdicaoNormalizar(c.abrangencia);
  const local = c.local || "";
  if (["pais", "país", "nacional", "estadual", "regional", "municipal", "interestadual"].includes(abrangencia) && !fpEdicaoEhNomeContinente(local)) return local;
  return "";
}

function fpEdicaoContinenteDaCompeticao(c) {
  if (!c) return "";
  if (c.continente) return c.continente;
  const pais = fpEdicaoPaisDaCompeticao(c);
  if (pais && typeof buscarPaisSelecao === "function") return buscarPaisSelecao(pais)?.continente || "";
  if (fpEdicaoEhNomeContinente(c.local)) return c.local || "";
  const abrangencia = fpEdicaoNormalizar(c.abrangencia);
  return abrangencia === "continental" || abrangencia === "continente" ? (c.local || "") : "";
}

function fpEdicaoEhContinental(c) {
  if (!c || fpEdicaoEhMundo(c)) return false;
  const abrangencia = fpEdicaoNormalizar(c.abrangencia);
  const tipo = fpEdicaoNormalizar(c.tipo);
  const local = fpEdicaoNormalizar(c.local);
  const pais = fpEdicaoPaisDaCompeticao(c);
  return abrangencia === "continental" || abrangencia === "continente" || tipo.includes("continental") || (!pais && fpEdicaoEhNomeContinente(c.local)) || ["europa", "africa", "asia", "oceania", "caribe"].includes(local) || local.includes("america");
}

function fpEdicaoPaisesAgrupadosOptions(valorAtual = "", continenteSelecionado = "") {
  const grupos = new Map();
  fpListaPaisesCompletaEdicao().forEach(p => {
    const continente = p.continente || "Outros";
    if (continenteSelecionado && continente !== continenteSelecionado) return;
    if (!grupos.has(continente)) grupos.set(continente, []);
    grupos.get(continente).push(p);
  });
  return Array.from(grupos.entries()).map(([continente, paises]) => {
    const opcoes = paises
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""))
      .map(p => `<option value="${limparTexto(p.nome)}" ${p.nome === valorAtual ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`)
      .join("");
    return `<optgroup label="${limparTexto(continente)}">${opcoes}</optgroup>`;
  }).join("");
}

function filtrosEdicao(prefixo, funcao) {
  return `<div class="filtros filtros-edicao">
    <div>
      <label>Categoria</label>
      <select id="${prefixo}Categoria" onchange="fpAtualizarFiltroCompeticoesEdicao('${prefixo}', '${funcao}')">
        <option value="clube">Competições de clubes</option>
        <option value="selecao">Competições de seleções</option>
      </select>
    </div>
    <div id="${prefixo}GrupoAbrangencia">
      <label>Abrangência</label>
      <select id="${prefixo}Abrangencia" onchange="fpAtualizarFiltroCompeticoesEdicao('${prefixo}', '${funcao}')">
        <option value="Mundial">Mundo</option>
        <option value="Continental">Continente</option>
        <option value="Pais">País</option>
      </select>
    </div>
    <div id="${prefixo}GrupoContinente" class="oculto">
      <label>Continente</label>
      <select id="${prefixo}Continente" onchange="fpCarregarPaisesAgrupadosEdicao('${prefixo}'); ${funcao}()">
        <option value="">Todos os continentes</option>
        ${fpEdicaoListaContinentesNormais().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("")}
      </select>
    </div>
    <div id="${prefixo}GrupoPais" class="oculto">
      <label>País</label>
      <select id="${prefixo}Pais" onchange="${funcao}()">
        <option value="">Selecione um país</option>
        ${fpEdicaoPaisesAgrupadosOptions()}
      </select>
    </div>
  </div>`;
}

function fpCarregarPaisesAgrupadosEdicao(prefixo) {
  const selectPais = document.getElementById(`${prefixo}Pais`);
  if (!selectPais) return;
  const valorAtual = selectPais.value;
  const categoria = document.getElementById(`${prefixo}Categoria`)?.value || "clube";
  const abrangencia = document.getElementById(`${prefixo}Abrangencia`)?.value || "Mundial";
  const continente = document.getElementById(`${prefixo}Continente`)?.value || "";
  const usarContinente = categoria === "selecao" || (categoria === "clube" && abrangencia === "Pais");
  selectPais.innerHTML = `<option value="">${categoria === "clube" ? "Selecione um país" : "Todos os países"}</option>${fpEdicaoPaisesAgrupadosOptions(valorAtual, usarContinente ? continente : "")}`;
  if (![...selectPais.options].some(o => o.value === valorAtual)) selectPais.value = "";
}

function fpAtualizarFiltroCompeticoesEdicao(prefixo, funcao) {
  const categoria = document.getElementById(`${prefixo}Categoria`)?.value || "clube";
  const abrangencia = document.getElementById(`${prefixo}Abrangencia`)?.value || "Mundial";
  const grupoAbrangencia = document.getElementById(`${prefixo}GrupoAbrangencia`);
  const grupoContinente = document.getElementById(`${prefixo}GrupoContinente`);
  const grupoPais = document.getElementById(`${prefixo}GrupoPais`);

  if (grupoAbrangencia) grupoAbrangencia.classList.toggle("oculto", categoria !== "clube");
  if (grupoContinente) grupoContinente.classList.toggle("oculto", categoria !== "selecao");
  if (grupoPais) grupoPais.classList.toggle("oculto", !(categoria === "selecao" || (categoria === "clube" && abrangencia === "Pais")));

  fpCarregarPaisesAgrupadosEdicao(prefixo);
  if (typeof window[funcao] === "function") window[funcao]();
}

function tabelaCompeticoes(banco) {
  const linhas = (banco.competicoes || []).map(c => {
    const categoria = fpFinalCat(c);
    const pais = fpEdicaoPaisDaCompeticao(c);
    const continente = fpEdicaoContinenteDaCompeticao(c);
    const mundo = fpEdicaoEhMundo(c) ? "sim" : "nao";
    const continental = fpEdicaoEhContinental(c) ? "sim" : "nao";
    return `<tr data-categoria="${limparTexto(categoria)}" data-mundo="${mundo}" data-continental="${continental}" data-continente="${limparTexto(continente)}" data-pais="${limparTexto(pais)}">
      <td><span class="link-detalhe" onclick="abrirDetalhesLiga('${c.id}')">${imagemNome(c.escudo, c.nome, "🏆")}</span></td>
      <td>${categoria === "selecao" ? "Competição de seleções" : "Competição de clubes"}</td>
      <td>${limparTexto(c.tipo || "Não informado")}</td>
      <td>${limparTexto(c.abrangencia || "")}</td>
      <td>${c.bandeira || ""} ${limparTexto(c.local || pais || continente || "")}</td>
      <td>${botoesEditarExcluir("competicoes", c.id)}</td>
    </tr>`;
  }).join("");
  if (!linhas) return `<div class="tabela-container"><p>Nenhuma competição cadastrada para editar.</p></div>`;
  setTimeout(() => fpAtualizarFiltroCompeticoesEdicao("filtroEdicaoCompeticoes", "aplicarFiltrosEdicaoCompeticoes"), 50);
  return `${filtrosEdicao("filtroEdicaoCompeticoes", "aplicarFiltrosEdicaoCompeticoes")}
    <div class="tabela-container"><table class="tabela" id="tabelaEdicaoCompeticoes">
      <tr><th>Competição</th><th>Categoria</th><th>Tipo</th><th>Abrangência</th><th>Local</th><th>Ações</th></tr>${linhas}
    </table></div>`;
}

function aplicarFiltrosTabelaEdicao(tabelaId, categoriaId, abrangenciaId) {
  const prefixo = categoriaId.replace("Categoria", "");
  const categoria = document.getElementById(categoriaId)?.value || "clube";
  const abrangencia = document.getElementById(abrangenciaId)?.value || "Mundial";
  const continente = document.getElementById(`${prefixo}Continente`)?.value || "";
  const pais = document.getElementById(`${prefixo}Pais`)?.value || "";

  document.querySelectorAll(`#${tabelaId} tr[data-categoria]`).forEach(linha => {
    let mostrar = linha.dataset.categoria === categoria;

    if (categoria === "clube") {
      if (abrangencia === "Mundial") {
        mostrar = mostrar && linha.dataset.mundo === "sim";
      } else if (abrangencia === "Continental") {
        mostrar = mostrar && linha.dataset.continental === "sim";
      } else if (abrangencia === "Pais") {
        mostrar = mostrar && !!linha.dataset.pais;
        if (pais) mostrar = mostrar && linha.dataset.pais === pais;
      }
    } else if (categoria === "selecao") {
      if (continente) mostrar = mostrar && (!linha.dataset.continente || linha.dataset.continente === continente);
      if (pais) mostrar = mostrar && (!linha.dataset.pais || linha.dataset.pais === pais);
    }

    linha.style.display = mostrar ? "" : "none";
  });
}

function aplicarFiltrosEdicaoCompeticoes() {
  aplicarFiltrosTabelaEdicao("tabelaEdicaoCompeticoes", "filtroEdicaoCompeticoesCategoria", "filtroEdicaoCompeticoesAbrangencia");
}

window.fpAtualizarFiltroCompeticoesEdicao = fpAtualizarFiltroCompeticoesEdicao;
window.fpCarregarPaisesAgrupadosEdicao = fpCarregarPaisesAgrupadosEdicao;
window.filtrosEdicao = filtrosEdicao;
window.tabelaCompeticoes = tabelaCompeticoes;
window.aplicarFiltrosTabelaEdicao = aplicarFiltrosTabelaEdicao;
window.aplicarFiltrosEdicaoCompeticoes = aplicarFiltrosEdicaoCompeticoes;

/* ===== Ajuste solicitado: Edições > Editar Competições de Clubes =====
   Fluxo: Abrangência única com Mundo, Continente e País.
   Mundo = competições de nível mundo.
   Continente = competições internacionais/continentais cadastradas.
   País = mostra países cadastrados e carrega competições do país selecionado.
   Não altera a lógica de Campeões e Vices. */
const fpFiltrosEdicaoOriginalFinal = typeof filtrosEdicao === "function" ? filtrosEdicao : null;
const fpAtualizarAbrangenciasFiltroOriginalFinal = typeof atualizarAbrangenciasFiltroEdicao === "function" ? atualizarAbrangenciasFiltroEdicao : null;
const fpAtualizarLocaisFiltroOriginalFinal = typeof atualizarLocaisFiltroEdicao === "function" ? atualizarLocaisFiltroEdicao : null;
const fpAplicarFiltrosTabelaOriginalFinal = typeof aplicarFiltrosTabelaEdicao === "function" ? aplicarFiltrosTabelaEdicao : null;
const fpOpcoesAbrangenciaEdicaoOriginalFinal = typeof opcoesAbrangenciaEdicao === "function" ? opcoesAbrangenciaEdicao : null;
const fpAtualizarCamposAbrangenciaCompeticaoOriginalFinal = typeof atualizarCamposAbrangenciaEdicaoCompeticao === "function" ? atualizarCamposAbrangenciaEdicaoCompeticao : null;

function fpOpcoesAbrangenciaClubesEdicao(valorAtual = "") {
  const lista = [
    { valor: "Mundial", texto: "Mundo" },
    { valor: "Continental", texto: "Continente" },
    { valor: "País", texto: "País" }
  ];
  return `<option value="">Selecione a abrangência</option>` + lista.map(a => `<option value="${a.valor}" ${a.valor === valorAtual ? "selected" : ""}>${a.texto}</option>`).join("");
}

function fpOpcoesAbrangenciaCompeticoesFiltro(valorAtual = "") {
  return fpOpcoesAbrangenciaClubesEdicao(valorAtual);
}

function filtrosEdicao(prefixo, funcao) {
  if (prefixo !== "filtroEdicaoCompeticoes") {
    return fpFiltrosEdicaoOriginalFinal ? fpFiltrosEdicaoOriginalFinal(prefixo, funcao) : "";
  }
  return `
    <div class="filtros filtros-edicao">
      <div>
        <label>Categoria</label>
        <select id="${prefixo}Categoria" onchange="atualizarAbrangenciasFiltroEdicao('${prefixo}', '${funcao}')">
          <option value="">Clubes e seleções</option>
          <option value="clube">Competições de clubes</option>
          <option value="selecao">Competições de seleções</option>
        </select>
      </div>
      <div id="${prefixo}GrupoAbrangencia">
        <label>Abrangência</label>
        <select id="${prefixo}Abrangencia" onchange="atualizarLocaisFiltroEdicao('${prefixo}'); ${funcao}()">
          ${fpOpcoesAbrangenciaCompeticoesFiltro()}
        </select>
      </div>
      <div id="${prefixo}GrupoPais" class="oculto">
        <label>País</label>
        <select id="${prefixo}Pais" onchange="${funcao}()">
          <option value="">Selecione um país</option>
        </select>
      </div>
    </div>
  `;
}

function atualizarAbrangenciasFiltroEdicao(prefixo, funcao) {
  if (prefixo !== "filtroEdicaoCompeticoes") {
    if (fpAtualizarAbrangenciasFiltroOriginalFinal) return fpAtualizarAbrangenciasFiltroOriginalFinal(prefixo, funcao);
    return;
  }
  const categoria = document.getElementById(`${prefixo}Categoria`)?.value || "";
  const grupoAbrangencia = document.getElementById(`${prefixo}GrupoAbrangencia`);
  const selectAbr = document.getElementById(`${prefixo}Abrangencia`);

  // Seleções: não precisa de abrangência neste filtro.
  if (grupoAbrangencia) grupoAbrangencia.classList.toggle("oculto", categoria === "selecao");

  if (selectAbr) {
    const atual = selectAbr.value;
    selectAbr.innerHTML = fpOpcoesAbrangenciaCompeticoesFiltro(atual);
    if (categoria === "selecao") selectAbr.value = "";
    if (atual && !Array.from(selectAbr.options).some(o => o.value === atual)) selectAbr.value = "";
  }
  atualizarLocaisFiltroEdicao(prefixo);
  if (typeof window[funcao] === "function") window[funcao]();
}

function atualizarLocaisFiltroEdicao(prefixo) {
  if (prefixo !== "filtroEdicaoCompeticoes") {
    if (fpAtualizarLocaisFiltroOriginalFinal) return fpAtualizarLocaisFiltroOriginalFinal(prefixo);
    return;
  }
  const categoria = document.getElementById(`${prefixo}Categoria`)?.value || "";
  const abrangencia = document.getElementById(`${prefixo}Abrangencia`)?.value || "";
  const grupoPais = document.getElementById(`${prefixo}GrupoPais`);
  if (grupoPais) grupoPais.classList.toggle("oculto", !(categoria === "clube" && abrangencia === "País"));
  carregarPaisesFiltroEdicao(prefixo);
}

function carregarPaisesFiltroEdicao(prefixo) {
  const selectPais = document.getElementById(`${prefixo}Pais`);
  if (!selectPais) return;
  const valorAtual = selectPais.value;
  const paises = fpListaPaisesCompletaEdicao();
  selectPais.innerHTML = `<option value="">Selecione um país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
  if (paises.some(p => p.nome === valorAtual)) selectPais.value = valorAtual;
}

function aplicarFiltrosTabelaEdicao(tabelaId, categoriaId, abrangenciaId) {
  const prefixo = categoriaId.replace("Categoria", "");
  if (prefixo !== "filtroEdicaoCompeticoes") {
    if (fpAplicarFiltrosTabelaOriginalFinal) return fpAplicarFiltrosTabelaOriginalFinal(tabelaId, categoriaId, abrangenciaId);
    return;
  }
  const categoria = document.getElementById(categoriaId)?.value || "";
  const abrangencia = document.getElementById(abrangenciaId)?.value || "";
  const pais = document.getElementById(`${prefixo}Pais`)?.value || "";
  const linhas = document.querySelectorAll(`#${tabelaId} tr[data-categoria]`);

  linhas.forEach(linha => {
    const okCategoria = !categoria || linha.dataset.categoria === categoria;
    let okAbrangencia = true;
    let okPais = true;

    if (categoria === "clube" && abrangencia) {
      okAbrangencia = linha.dataset.abrangencia === abrangencia;
      if (abrangencia === "País" && pais) okPais = linha.dataset.pais === pais;
    }

    linha.style.display = okCategoria && okAbrangencia && okPais ? "" : "none";
  });
}

function opcoesAbrangenciaEdicao(valorAtual = "", categoria = "clube") {
  if (categoria === "clube") return fpOpcoesAbrangenciaClubesEdicao(valorAtual).replace('<option value="">Selecione a abrangência</option>', '');
  // Para seleção, mantém a opção sem campo extra de abrangência visual quando possível.
  if (categoria === "selecao") return [{ valor: "Seleções", texto: "Seleções" }].map(a => `<option value="${a.valor}" ${a.valor === valorAtual ? "selected" : ""}>${a.texto}</option>`).join("");
  return fpOpcoesAbrangenciaEdicaoOriginalFinal ? fpOpcoesAbrangenciaEdicaoOriginalFinal(valorAtual, categoria) : "";
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
  const abrangencia = document.getElementById("editAbrangencia")?.value || "";
  const grupoContinente = document.getElementById("grupoEditContinenteCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");

  // Mantém o campo Abrangência no mesmo lugar.
  // Ao escolher Continente em competições de clubes, exibe a lista de continentes.
  // Ao escolher País, exibe a lista de países.
  if (grupoContinente) grupoContinente.classList.toggle("oculto", !(categoria === "clube" && abrangencia === "Continental"));
  if (grupoPais) grupoPais.classList.toggle("oculto", !(categoria === "clube" && abrangencia === "País"));
  carregarPaisesEdicaoCompeticao();
}

const fpSalvarEdicaoCompeticaoOriginalFinal = typeof salvarEdicaoCompeticao === "function" ? salvarEdicaoCompeticao : null;
function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const competicao = banco.competicoes.find(c => c.id === id);
  if (!competicao) return;
  lerImagem("editEscudo", novaImagem => {
    competicao.nome = document.getElementById("editNome").value.trim();
    competicao.categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
    competicao.tipo = document.getElementById("editTipoCompeticao").value || "Não informado";

    if (competicao.categoria === "selecao") {
      competicao.abrangencia = "Seleções";
      competicao.local = "Seleções";
      competicao.bandeira = "🌍";
      competicao.continente = "";
      competicao.pais = "";
    } else {
      competicao.abrangencia = document.getElementById("editAbrangencia")?.value || "Mundial";
      competicao.local = ""; competicao.bandeira = ""; competicao.continente = ""; competicao.pais = "";
      if (competicao.abrangencia === "Mundial") {
        competicao.local = "Mundial"; competicao.bandeira = "🌍";
      }
      if (competicao.abrangencia === "Continental") {
        const continente = document.getElementById("editContinenteCompeticao")?.value || "";
        competicao.continente = continente;
        competicao.local = continente || "Continente";
        competicao.bandeira = "🌎";
      }
      if (competicao.abrangencia === "País") {
        const paisNome = document.getElementById("editPaisCompeticao")?.value || "";
        if (!paisNome) { alert("Selecione o país da competição."); return; }
        const pais = buscarPaisSelecao(paisNome);
        competicao.pais = paisNome;
        competicao.continente = pais.continente || "";
        competicao.local = paisNome;
        competicao.bandeira = pais.bandeira || "";
      }
    }

    if (novaImagem) competicao.escudo = novaImagem;
    banco.titulos.forEach(titulo => {
      if (titulo.competicaoId === competicao.id) {
        titulo.competicaoNome = competicao.nome;
        titulo.abrangencia = competicao.abrangencia;
      }
    });
    salvarBanco(banco);
    alert("Competição atualizada com sucesso!");
    mostrarEdicao("competicoes");
  });
}

window.filtrosEdicao = filtrosEdicao;
window.atualizarAbrangenciasFiltroEdicao = atualizarAbrangenciasFiltroEdicao;
window.atualizarLocaisFiltroEdicao = atualizarLocaisFiltroEdicao;
window.aplicarFiltrosTabelaEdicao = aplicarFiltrosTabelaEdicao;
window.opcoesAbrangenciaEdicao = opcoesAbrangenciaEdicao;
window.atualizarCamposAbrangenciaEdicaoCompeticao = atualizarCamposAbrangenciaEdicaoCompeticao;
window.salvarEdicaoCompeticao = salvarEdicaoCompeticao;

/* ===== Ajuste final solicitado: formulário de edição de competições =====
   Mantém o filtro principal da página Edições como está.
   No formulário "Editar Competição/Liga", quando a categoria for clube,
   o campo Abrangência fica com as três opções no mesmo select:
   Mundo, Continente e País. País aparece apenas como campo auxiliar quando
   a abrangência escolhida for País.
*/
function fpOpcoesAbrangenciaFormularioCompeticao(valorAtual = "") {
  const normalizado = valorAtual === "Mundo" ? "Mundial" : valorAtual;
  const lista = [
    { valor: "Mundial", texto: "Mundo" },
    { valor: "Continental", texto: "Continente" },
    { valor: "País", texto: "País" }
  ];
  return `<option value="">Selecione a abrangência</option>` + lista.map(a =>
    `<option value="${a.valor}" ${a.valor === normalizado ? "selected" : ""}>${a.texto}</option>`
  ).join("");
}

function fpTiposCompeticaoEdicaoPorCategoria(categoriaAtual, tipoAtual = "") {
  const tiposClubes = [
    "Copa Nacional",
    "Liga Nacional",
    "Campeonato Estadual",
    "Copa Regional",
    "Copa Estadual",
    "Campeonato Continental",
    "Campeonato Mundial",
    "Campeonato Interestadual",
    "Campeonato Intercontinental",
    "Mundial de Clubes",
    "Copa Continental",
    "Liga",
    "Copa",
    "Supercopa",
    "Recopa",
    "Taça",
    "Torneio",
    "Campeonato"
  ];
  const tiposSelecoes = [
    "Copa do Mundo",
    "Copa Continental de Seleções",
    "Copa das Confederações",
    "Finalíssima",
    "Olimpíadas"
  ];
  const lista = categoriaAtual === "selecao" ? tiposSelecoes : tiposClubes;
  return `<option value="">Selecione o tipo da competição</option>` + lista.map(t =>
    `<option value="${limparTexto(t)}" ${t === tipoAtual ? "selected" : ""}>${limparTexto(t)}</option>`
  ).join("");
}

function formularioEditarCompeticao(competicao) {
  const banco = carregarBanco();
  const categoriaAtual = competicao.categoria || normalizarCategoriaCompeticao(competicao) || "clube";
  const paisAtual = competicao.pais || (competicao.abrangencia === "País" ? competicao.local : "") || "";
  const paises = (banco.paises && banco.paises.length ? banco.paises : (typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []))
    .slice()
    .sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")));
  const opcoesPaises = paises.map(p =>
    `<option value="${limparTexto(p.nome)}" ${p.nome === paisAtual ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`
  ).join("");

  setTimeout(() => {
    atualizarCamposAbrangenciaEdicaoCompeticao();
    atualizarTiposEdicaoCompeticao();
  }, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoCompeticao(event, '${competicao.id}')">
      <h2>Editar Competição/Liga</h2>
      ${competicao.escudo ? `<img class="preview-edicao" src="${competicao.escudo}" alt="Escudo atual">` : ""}

      <label>Categoria da competição</label>
      <select id="editCategoriaCompeticao" onchange="atualizarCamposAbrangenciaEdicaoCompeticao(); atualizarTiposEdicaoCompeticao();">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>

      <div id="grupoEditAbrangenciaCompeticao" class="grupo">
        <label>Abrangência da competição</label>
        <select id="editAbrangencia" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">
          ${fpOpcoesAbrangenciaFormularioCompeticao(competicao.abrangencia)}
        </select>
      </div>

      <div id="grupoEditPaisCompeticao" class="grupo oculto">
        <label>País</label>
        <select id="editPaisCompeticao">
          <option value="">Selecione um país</option>
          ${opcoesPaises}
        </select>
      </div>

      <label>Nome</label>
      <input type="text" id="editNome" value="${limparTexto(competicao.nome || "")}">

      <label>Tipo da competição</label>
      <select id="editTipoCompeticao" data-tipo-atual="${limparTexto(competicao.tipo || "")}">
        ${fpTiposCompeticaoEdicaoPorCategoria(categoriaAtual, competicao.tipo || "")}
      </select>

      <label>Cadastrar/Trocar escudo da liga/competição</label>
      <input type="file" id="editEscudo" accept="image/*">

      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('competicoes', '${competicao.id}')">Excluir competição</button>
        <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
      </div>
    </form>
  `;
}

function atualizarTiposEdicaoCompeticao() {
  const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
  const select = document.getElementById("editTipoCompeticao");
  if (!select) return;
  const atual = select.value || select.getAttribute("data-tipo-atual") || "";
  select.innerHTML = fpTiposCompeticaoEdicaoPorCategoria(categoria, atual);
  if (Array.from(select.options).some(o => o.value === atual)) select.value = atual;
  select.setAttribute("data-tipo-atual", select.value || atual);
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
  const grupoAbrangencia = document.getElementById("grupoEditAbrangenciaCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");
  const selectAbrangencia = document.getElementById("editAbrangencia");

  if (categoria === "selecao") {
    if (grupoAbrangencia) grupoAbrangencia.classList.add("oculto");
    if (grupoPais) grupoPais.classList.add("oculto");
    return;
  }

  if (grupoAbrangencia) grupoAbrangencia.classList.remove("oculto");
  const abrangencia = selectAbrangencia?.value || "";
  if (grupoPais) grupoPais.classList.toggle("oculto", abrangencia !== "País");
}

function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const competicao = banco.competicoes.find(c => c.id === id);
  if (!competicao) return;

  lerImagem("editEscudo", novaImagem => {
    const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
    competicao.nome = document.getElementById("editNome")?.value.trim() || competicao.nome;
    competicao.categoria = categoria;
    competicao.tipo = document.getElementById("editTipoCompeticao")?.value || "Não informado";

    competicao.local = "";
    competicao.bandeira = "";
    competicao.continente = "";
    competicao.pais = "";

    if (categoria === "selecao") {
      competicao.abrangencia = "Seleções";
      competicao.local = "Seleções";
      competicao.bandeira = "🏆";
    } else {
      const abrangencia = document.getElementById("editAbrangencia")?.value || "Mundial";
      competicao.abrangencia = abrangencia;

      if (abrangencia === "Mundial") {
        competicao.local = "Mundial";
        competicao.bandeira = "🌍";
      } else if (abrangencia === "Continental") {
        competicao.local = "Continente";
        competicao.bandeira = "🌎";
      } else if (abrangencia === "País") {
        const paisNome = document.getElementById("editPaisCompeticao")?.value || "";
        if (!paisNome) {
          alert("Selecione o país da competição.");
          return;
        }
        const pais = buscarPaisSelecao(paisNome);
        competicao.pais = paisNome;
        competicao.continente = pais?.continente || "";
        competicao.local = paisNome;
        competicao.bandeira = pais?.bandeira || "";
      }
    }

    if (novaImagem) competicao.escudo = novaImagem;
    (banco.titulos || []).forEach(titulo => {
      if (titulo.competicaoId === competicao.id) {
        titulo.competicaoNome = competicao.nome;
        titulo.abrangencia = competicao.abrangencia;
      }
    });

    salvarBanco(banco);
    alert("Competição atualizada com sucesso!");
    mostrarEdicao("competicoes");
  });
}

window.formularioEditarCompeticao = formularioEditarCompeticao;
window.atualizarCamposAbrangenciaEdicaoCompeticao = atualizarCamposAbrangenciaEdicaoCompeticao;
window.atualizarTiposEdicaoCompeticao = atualizarTiposEdicaoCompeticao;
window.salvarEdicaoCompeticao = salvarEdicaoCompeticao;


/* ===== Correção: botão Editar Campeões e Vices =====
   Mantém a edição de competições como está e reforça a abertura/listagem
   dos registros de campeões e vices na página Edições. */
function fpCategoriaTituloEdicao(titulo, banco) {
  const comp = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  return titulo.campeaoTipo || titulo.viceTipo || (comp ? (comp.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(comp) : "clube")) : "clube") || "clube";
}

function filtrosEdicaoTitulosCorrigido() {
  return `<div class="filtros filtros-edicao">
    <div>
      <label>Categoria</label>
      <select id="filtroEdicaoTitulosCategoria" onchange="aplicarFiltrosEdicaoTitulos()">
        <option value="">Clubes e seleções</option>
        <option value="clube">Clubes</option>
        <option value="selecao">Seleções</option>
      </select>
    </div>
    <div>
      <label>Abrangência</label>
      <select id="filtroEdicaoTitulosAbrangencia" onchange="aplicarFiltrosEdicaoTitulos()">
        <option value="">Todas as abrangências</option>
        <option value="Mundial">Mundo</option>
        <option value="Continental">Continente</option>
        <option value="País">País</option>
        <option value="Seleções">Seleções</option>
      </select>
    </div>
  </div>`;
}

function tabelaTitulos(banco) {
  const titulos = banco.titulos || [];
  const linhas = titulos.map(t => {
    const comp = (banco.competicoes || []).find(c => c.id === t.competicaoId);
    const categoria = fpCategoriaTituloEdicao(t, banco);
    const abrangencia = t.abrangencia || (comp && comp.abrangencia) || "";
    return `<tr data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(abrangencia)}">
      <td>${limparTexto(t.ano || "")}</td>
      <td>${categoria === "selecao" ? "Seleções" : "Clubes"}</td>
      <td>${limparTexto(abrangencia)}</td>
      <td>${linkLiga(t.competicaoId)}</td>
      <td>${linkParticipanteEdicao(t.campeaoId, t.campeaoTipo, t.campeaoNome)}</td>
      <td>${linkParticipanteEdicao(t.viceId, t.viceTipo, t.viceNome)}</td>
      <td>${botoesEditarExcluir("titulos", t.id)}</td>
    </tr>`;
  }).join("");

  if (!linhas) return `<div class="tabela-container"><p>Nenhum campeão ou vice cadastrado para editar.</p></div>`;

  return `${filtrosEdicaoTitulosCorrigido()}
    <div class="tabela-container">
      <table class="tabela" id="tabelaEdicaoTitulos">
        <tr><th>Ano</th><th>Categoria</th><th>Abrangência</th><th>Competição</th><th>Campeão</th><th>Vice</th><th>Ações</th></tr>
        ${linhas}
      </table>
    </div>`;
}

function aplicarFiltrosEdicaoTitulos() {
  const categoria = document.getElementById("filtroEdicaoTitulosCategoria")?.value || "";
  const abrangencia = document.getElementById("filtroEdicaoTitulosAbrangencia")?.value || "";
  document.querySelectorAll("#tabelaEdicaoTitulos tr[data-categoria]").forEach(linha => {
    const okCategoria = !categoria || linha.dataset.categoria === categoria;
    const okAbrangencia = !abrangencia || linha.dataset.abrangencia === abrangencia;
    linha.style.display = okCategoria && okAbrangencia ? "" : "none";
  });
}

window.tabelaTitulos = tabelaTitulos;
window.aplicarFiltrosEdicaoTitulos = aplicarFiltrosEdicaoTitulos;

/* ===== Correção final: página principal Edições > filtros de competições por abrangência =====
   Mantém a ordem e os campos atuais. Apenas garante que a tabela principal de
   "Editar Competições" carregue/filtre as competições do banco por:
   Mundo, Continente e País. */
function fpEdicoesCategoriaCompeticaoFinal(c) {
  return c?.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : "clube") || "clube";
}

function fpEdicoesPaisCompeticaoFinal(c) {
  return c?.pais || ((c?.abrangencia === "País" || c?.abrangencia === "Pais") ? c.local : "") || "";
}

function fpEdicoesContinenteCompeticaoFinal(c) {
  const pais = fpEdicoesPaisCompeticaoFinal(c);
  if (c?.continente) return c.continente;
  if (pais && typeof buscarPaisSelecao === "function") return buscarPaisSelecao(pais).continente || "";
  return c?.abrangencia === "Continental" ? (c.local || "") : "";
}

function fpEdicoesAbrangenciaCompeticaoFinal(c) {
  const abrangencia = String(c?.abrangencia || "").trim();
  const tipo = String(c?.tipo || "").toLowerCase();
  const local = String(c?.local || "").toLowerCase();

  if (abrangencia === "Mundial" || abrangencia === "Mundo" || tipo.includes("mund") || local === "mundial" || local === "mundo") return "Mundial";
  if (abrangencia === "País" || abrangencia === "Pais") return "País";
  if (abrangencia === "Continental" || abrangencia === "Continente") return "Continental";
  if (abrangencia === "Seleções") return "Seleções";
  return abrangencia;
}

function fpEdicoesPaisesBancoFinal() {
  return fpListaPaisesCompletaEdicao().slice().sort((a, b) => String(a.nome || "").localeCompare(String(b.nome || "")));
}

const fpEdicoesFiltrosOriginalFinalBanco = typeof filtrosEdicao === "function" ? filtrosEdicao : null;
function filtrosEdicao(prefixo, funcao) {
  if (prefixo !== "filtroEdicaoCompeticoes") {
    return fpEdicoesFiltrosOriginalFinalBanco ? fpEdicoesFiltrosOriginalFinalBanco(prefixo, funcao) : "";
  }

  return `<div class="filtros filtros-edicao">
    <div>
      <label>Categoria</label>
      <select id="${prefixo}Categoria" onchange="fpAtualizarFiltroEdicoesCompeticoesBanco('${prefixo}', '${funcao}')">
        <option value="">Clubes e seleções</option>
        <option value="clube">Competições de clubes</option>
        <option value="selecao">Competições de seleções</option>
      </select>
    </div>
    <div id="${prefixo}GrupoAbrangencia">
      <label>Abrangência</label>
      <select id="${prefixo}Abrangencia" onchange="fpAtualizarFiltroEdicoesCompeticoesBanco('${prefixo}', '${funcao}')">
        <option value="">Todas as abrangências</option>
        <option value="Mundial">Mundo</option>
        <option value="Continental">Continente</option>
        <option value="País">País</option>
      </select>
    </div>
    <div id="${prefixo}GrupoPais" class="oculto">
      <label>País</label>
      <select id="${prefixo}Pais" onchange="${funcao}()">
        <option value="">Todos os países</option>
        ${fpEdicoesPaisesBancoFinal().map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("")}
      </select>
    </div>
  </div>`;
}

function fpAtualizarFiltroEdicoesCompeticoesBanco(prefixo, funcao) {
  const categoria = document.getElementById(`${prefixo}Categoria`)?.value || "";
  const abrangencia = document.getElementById(`${prefixo}Abrangencia`)?.value || "";
  const grupoAbrangencia = document.getElementById(`${prefixo}GrupoAbrangencia`);
  const grupoPais = document.getElementById(`${prefixo}GrupoPais`);

  // Seleções não precisam de país; clubes com País exibem a lista de países do banco.
  if (grupoAbrangencia) grupoAbrangencia.classList.toggle("oculto", categoria === "selecao");
  if (grupoPais) grupoPais.classList.toggle("oculto", !(categoria !== "selecao" && abrangencia === "País"));

  if (categoria === "selecao") {
    const abr = document.getElementById(`${prefixo}Abrangencia`);
    const pais = document.getElementById(`${prefixo}Pais`);
    if (abr) abr.value = "";
    if (pais) pais.value = "";
  }

  if (typeof window[funcao] === "function") window[funcao]();
}

function tabelaCompeticoes(banco) {
  const linhas = (banco.competicoes || []).map(c => {
    const categoria = fpEdicoesCategoriaCompeticaoFinal(c);
    const abrangencia = fpEdicoesAbrangenciaCompeticaoFinal(c);
    const pais = fpEdicoesPaisCompeticaoFinal(c);
    const continente = fpEdicoesContinenteCompeticaoFinal(c);
    return `<tr data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(abrangencia)}" data-pais="${limparTexto(pais)}" data-continente="${limparTexto(continente)}">
      <td><span class="link-detalhe" onclick="abrirDetalhesLiga('${c.id}')">${imagemNome(c.escudo, c.nome, "🏆")}</span></td>
      <td>${categoria === "selecao" ? "Competição de seleções" : "Competição de clubes"}</td>
      <td>${limparTexto(c.tipo || "Não informado")}</td>
      <td>${limparTexto(c.abrangencia || "")}</td>
      <td>${c.bandeira || ""} ${limparTexto(c.local || "")}</td>
      <td>${botoesEditarExcluir("competicoes", c.id)}</td>
    </tr>`;
  }).join("");

  if (!linhas) return `<div class="tabela-container"><p>Nenhuma competição cadastrada para editar.</p></div>`;

  return `${filtrosEdicao("filtroEdicaoCompeticoes", "aplicarFiltrosEdicaoCompeticoes")}
    <div class="tabela-container">
      <table class="tabela" id="tabelaEdicaoCompeticoes">
        <tr><th>Competição</th><th>Categoria</th><th>Tipo</th><th>Abrangência</th><th>Local</th><th>Ações</th></tr>
        ${linhas}
      </table>
    </div>`;
}

function aplicarFiltrosEdicaoCompeticoes() {
  const categoria = document.getElementById("filtroEdicaoCompeticoesCategoria")?.value || "";
  const abrangencia = document.getElementById("filtroEdicaoCompeticoesAbrangencia")?.value || "";
  const pais = document.getElementById("filtroEdicaoCompeticoesPais")?.value || "";

  document.querySelectorAll("#tabelaEdicaoCompeticoes tr[data-categoria]").forEach(linha => {
    const okCategoria = !categoria || linha.dataset.categoria === categoria;
    const okAbrangencia = !abrangencia || linha.dataset.abrangencia === abrangencia;
    const okPais = !pais || linha.dataset.pais === pais;
    linha.style.display = okCategoria && okAbrangencia && okPais ? "" : "none";
  });
}

window.filtrosEdicao = filtrosEdicao;
window.fpAtualizarFiltroEdicoesCompeticoesBanco = fpAtualizarFiltroEdicoesCompeticoesBanco;
window.tabelaCompeticoes = tabelaCompeticoes;
window.aplicarFiltrosEdicaoCompeticoes = aplicarFiltrosEdicaoCompeticoes;

/* ===== Ajuste: edição de seleção igual ao cadastro de seleções ===== */
function fpPaisSelecaoAtual(selecao) {
  return selecao.pais || selecao.nome || "";
}

function formularioEditarSelecao(selecao, banco) {
  const continentes = fpContinentesEdicao();
  const paisAtual = fpPaisSelecaoAtual(selecao);
  const paisInfo = buscarPaisSelecao(paisAtual) || {};
  const continenteAtual = selecao.continente || paisInfo.continente || "";
  const opcoesContinentes = continentes
    .map(c => `<option value="${limparTexto(c)}" ${c === continenteAtual ? "selected" : ""}>${limparTexto(c)}</option>`)
    .join("");

  const paisesBase = fpListaPaisesCompletaEdicao();
  const opcoesPaises = paisesBase
    .filter(p => !continenteAtual || p.continente === continenteAtual)
    .map(p => `<option value="${limparTexto(p.nome)}" ${p.nome === paisAtual ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`)
    .join("");

  setTimeout(() => {
    const continente = document.getElementById("editContinenteSelecao");
    const pais = document.getElementById("editPaisSelecao");
    if (continente) continente.value = continenteAtual;
    carregarPaisesEdicaoSelecao();
    if (pais) pais.value = paisAtual;
  }, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoSelecao(event, '${selecao.id}')">
      <h2>Editar Seleção</h2>

      ${selecao.escudo ? `<img class="preview-edicao" src="${selecao.escudo}" alt="Escudo atual">` : ""}

      <label>Continente</label>
      <select id="editContinenteSelecao" onchange="carregarPaisesEdicaoSelecao()">
        <option value="">Selecione um continente</option>
        ${opcoesContinentes}
      </select>

      <label>País da seleção</label>
      <select id="editPaisSelecao">
        <option value="">Selecione o país da seleção</option>
        ${opcoesPaises}
      </select>

      <label>Escudo da seleção</label>
      <input type="file" id="editEscudo" accept="image/*">

      <div class="acoes-form-edicao">
        <button type="submit">Salvar alterações da seleção</button>
        <button type="button" class="botao-excluir-registro" onclick="excluirRegistro('selecoes', '${selecao.id}')">Excluir seleção</button>
        <button type="button" onclick="mostrarEdicao('selecoes')">Cancelar</button>
      </div>
    </form>
  `;
}

function carregarPaisesEdicaoSelecao() {
  const continente = document.getElementById("editContinenteSelecao")?.value || "";
  const select = document.getElementById("editPaisSelecao");
  if (!select) return;
  const valorAtual = select.value || "";
  const paises = fpListaPaisesCompletaEdicao()
    .filter(p => !continente || p.continente === continente);
  select.innerHTML = `<option value="">${continente ? "Selecione o país da seleção" : "Selecione primeiro o continente"}</option>` +
    paises.map(p => `<option value="${limparTexto(p.nome)}" ${p.nome === valorAtual ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
}

function salvarEdicaoSelecao(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const selecao = banco.selecoes.find(s => s.id === id);
  if (!selecao) return;

  const paisNome = document.getElementById("editPaisSelecao")?.value || "";
  const continente = document.getElementById("editContinenteSelecao")?.value || "";
  if (!continente) { alert("Selecione o continente da seleção."); return; }
  if (!paisNome) { alert("Selecione o país da seleção."); return; }

  const pais = buscarPaisSelecao(paisNome) || fpListaPaisesCompletaEdicao().find(p => p.nome === paisNome) || {};

  lerImagem("editEscudo", novaImagem => {
    selecao.nome = paisNome;
    selecao.pais = paisNome;
    selecao.continente = continente || pais.continente || "";
    selecao.bandeira = pais.bandeira || selecao.bandeira || "";
    if (novaImagem) selecao.escudo = novaImagem;

    banco.titulos.forEach(titulo => {
      if (titulo.campeaoId === selecao.id) {
        titulo.campeaoNome = selecao.nome || selecao.pais;
        titulo.campeaoTipo = "selecao";
      }
      if (titulo.viceId === selecao.id) {
        titulo.viceNome = selecao.nome || selecao.pais;
        titulo.viceTipo = "selecao";
      }
    });

    salvarBanco(banco);
    alert("Seleção atualizada com sucesso!");
    mostrarEdicao("selecoes");
  });
}

window.carregarPaisesEdicaoSelecao = carregarPaisesEdicaoSelecao;
window.salvarEdicaoSelecao = salvarEdicaoSelecao;

/* ===== Ajuste: Edições > Editar Competições simplificado =====
   Exibe somente logo + nome da competição e os botões de ação.
*/
function fpCompeticaoEdicaoNomeLogo(c) {
  const img = c.escudo
    ? `<img class="imagem-mini-tabela edicao-competicao-logo" src="${c.escudo}" alt="${limparTexto(c.nome)}">`
    : `<span class="imagem-mini-tabela edicao-competicao-logo edicao-competicao-fallback">🏆</span>`;
  return `<span class="edicao-competicao-info link-detalhe" onclick="abrirDetalhesLiga('${c.id}')">${img}<strong>${limparTexto(c.nome)}</strong></span>`;
}

function tabelaCompeticoes(banco) {
  const linhas = (banco.competicoes || []).map(c => {
    const categoria = typeof fpEdicoesCategoriaCompeticaoFinal === "function" ? fpEdicoesCategoriaCompeticaoFinal(c) : (c.categoria || normalizarCategoriaCompeticao(c) || "clube");
    const abrangencia = typeof fpEdicoesAbrangenciaCompeticaoFinal === "function" ? fpEdicoesAbrangenciaCompeticaoFinal(c) : (c.abrangencia || "");
    const pais = typeof fpEdicoesPaisCompeticaoFinal === "function" ? fpEdicoesPaisCompeticaoFinal(c) : (c.pais || c.local || "");
    const continente = typeof fpEdicoesContinenteCompeticaoFinal === "function" ? fpEdicoesContinenteCompeticaoFinal(c) : (c.continente || "");
    return `<tr data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(abrangencia)}" data-pais="${limparTexto(pais)}" data-continente="${limparTexto(continente)}">
      <td>${fpCompeticaoEdicaoNomeLogo(c)}</td>
      <td class="edicao-acoes">${botoesEditarExcluir("competicoes", c.id)}</td>
    </tr>`;
  }).join("");

  if (!linhas) return `<div class="tabela-container"><p>Nenhuma competição cadastrada para editar.</p></div>`;

  return `${filtrosEdicao("filtroEdicaoCompeticoes", "aplicarFiltrosEdicaoCompeticoes")}
    <div class="tabela-container tabela-edicao-competicoes-container">
      <table class="tabela tabela-edicao-competicoes" id="tabelaEdicaoCompeticoes">
        <tr><th>Competição</th><th>Ações</th></tr>
        ${linhas}
      </table>
    </div>`;
}

window.tabelaCompeticoes = tabelaCompeticoes;

/* ===== Correção final: Edições > Campeões e Vices =====
   - Não altera as abrangências dos outros cadastros.
   - Em categoria clube, permite escolher país e país do vice.
   - Ao escolher abrangência País, os dois países são preenchidos automaticamente
     com o país selecionado no filtro da competição.
   - Opções de campeão/vice mostram somente o nome do time, sem o país ao lado.
   - Mundo mostra competições mundiais cadastradas; Continente mostra competições
     continentais cadastradas; País mostra competições do país selecionado.
*/
function fpEdTituloNorm(v) {
  return String(v || '').trim().toLowerCase();
}
function fpEdTituloCategoriaCompeticao(c) {
  return c?.categoria || (typeof normalizarCategoriaCompeticao === 'function' ? normalizarCategoriaCompeticao(c) : 'clube') || 'clube';
}
function fpEdTituloEhMundo(c) {
  const a = fpEdTituloNorm(c?.abrangencia), t = fpEdTituloNorm(c?.tipo), l = fpEdTituloNorm(c?.local);
  return a === 'mundial' || a === 'mundo' || l === 'mundial' || l === 'mundo' || t.includes('mund');
}
function fpEdTituloPaisCompeticao(c) {
  if (!c) return '';
  if (c.pais) return c.pais;
  const a = fpEdTituloNorm(c.abrangencia);
  if (a === 'país' || a === 'pais') return c.local || '';
  return '';
}
function fpEdTituloContinenteCompeticao(c) {
  if (!c) return '';
  if (c.continente) return c.continente;
  const pais = fpEdTituloPaisCompeticao(c);
  if (pais && typeof buscarPaisSelecao === 'function') return buscarPaisSelecao(pais)?.continente || '';
  const a = fpEdTituloNorm(c.abrangencia);
  if (a === 'continental' || a === 'continente') return c.local || '';
  return '';
}
function fpEdTituloEhContinental(c) {
  if (!c || fpEdTituloEhMundo(c)) return false;
  const a = fpEdTituloNorm(c.abrangencia), t = fpEdTituloNorm(c.tipo);
  return a === 'continental' || a === 'continente' || t.includes('continental') || !!fpEdTituloContinenteCompeticao(c);
}
function fpEdTituloPaisesComClubes(banco) {
  const mapa = new Map();
  (banco.clubes || []).forEach(clube => {
    if (!clube?.pais) return;
    const paisBase = typeof buscarPaisSelecao === 'function' ? buscarPaisSelecao(clube.pais) : {};
    mapa.set(clube.pais, { nome: clube.pais, bandeira: clube.bandeira || paisBase?.bandeira || '', continente: paisBase?.continente || '' });
  });
  return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
}
function fpEdTituloOptionsPaisesClubes(banco, valorAtual = '', continente = '') {
  return fpEdTituloPaisesComClubes(banco)
    .filter(p => !continente || p.continente === continente)
    .map(p => `<option value="${limparTexto(p.nome)}" ${p.nome === valorAtual ? 'selected' : ''}>${p.bandeira || ''} ${limparTexto(p.nome)}</option>`)
    .join('');
}
function fpEdTituloOptionsParticipantes(banco, tipo, paisAtual = '') {
  if (tipo === 'selecao') {
    return (banco.selecoes || [])
      .map(s => ({ id: s.id, nome: s.nome || s.pais }))
      .filter(s => s.id && s.nome)
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map(s => `<option value="${s.id}">${limparTexto(s.nome)}</option>`)
      .join('');
  }
  return (banco.clubes || [])
    .filter(c => c.id && c.nome && (!paisAtual || c.pais === paisAtual))
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(c => `<option value="${c.id}" data-pais="${limparTexto(c.pais || '')}">${limparTexto(c.nome)}</option>`)
    .join('');
}
function fpEdTituloAbrangenciaFromCompeticao(c) {
  if (!c) return 'Mundial';
  const a = fpEdTituloNorm(c.abrangencia);
  if (fpEdTituloEhMundo(c)) return 'Mundial';
  if (a === 'país' || a === 'pais' || fpEdTituloPaisCompeticao(c)) return 'País';
  return 'Continental';
}

function formularioEditarTitulo(titulo, banco) {
  const compAtual = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || fpEdTituloCategoriaCompeticao(compAtual) || 'clube';
  const abrangenciaAtual = fpEdTituloAbrangenciaFromCompeticao(compAtual || { abrangencia: titulo.abrangencia });
  const continenteAtual = fpEdTituloContinenteCompeticao(compAtual) || '';
  const paisAtual = fpEdTituloPaisCompeticao(compAtual) || '';
  const campeaoAtual = buscarParticipanteEdicaoTitulo(banco, titulo.campeaoId);
  const viceAtual = buscarParticipanteEdicaoTitulo(banco, titulo.viceId);
  const paisCampeaoAtual = categoriaAtual === 'clube' ? (campeaoAtual?.pais || paisAtual || '') : '';
  const paisViceAtual = categoriaAtual === 'clube' ? (viceAtual?.pais || paisAtual || '') : '';

  const opcoesCompeticoes = (banco.competicoes || []).slice().sort((a, b) => a.nome.localeCompare(b.nome)).map(c => {
    const categoria = fpEdTituloCategoriaCompeticao(c);
    const pais = fpEdTituloPaisCompeticao(c);
    const continente = fpEdTituloContinenteCompeticao(c);
    const abrangencia = fpEdTituloEhMundo(c) ? 'Mundial' : (pais ? 'País' : 'Continental');
    return `<option value="${c.id}" data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(abrangencia)}" data-continente="${limparTexto(continente)}" data-pais="${limparTexto(pais)}" ${c.id === titulo.competicaoId ? 'selected' : ''}>${limparTexto(c.nome)}</option>`;
  }).join('');

  setTimeout(() => {
    const cat = document.getElementById('editCategoriaTitulo');
    const abr = document.getElementById('editAbrangenciaTitulo');
    const cont = document.getElementById('editContinenteTitulo');
    const pais = document.getElementById('editPaisTitulo');
    if (cat) cat.value = categoriaAtual;
    if (abr) abr.value = abrangenciaAtual;
    atualizarCamposLocalEdicaoTitulo();
    if (cont) cont.value = continenteAtual;
    carregarPaisesEdicaoTitulo();
    if (pais) pais.value = paisAtual;
    filtrarCompeticoesEdicaoTitulo();
    const paisCamp = document.getElementById('editPaisCampeaoTitulo');
    const paisVice = document.getElementById('editPaisViceTitulo');
    if (paisCamp) paisCamp.value = paisCampeaoAtual;
    if (paisVice) paisVice.value = paisViceAtual;
    carregarParticipantesEdicaoTituloSelect('campeao');
    carregarParticipantesEdicaoTituloSelect('vice');
    const camp = document.getElementById('editCampeao');
    const vice = document.getElementById('editVice');
    if (camp) camp.value = titulo.campeaoId || '';
    if (vice) vice.value = titulo.viceId || '';
  }, 60);

  return `<form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')"><h2>Editar Campeão e Vice</h2>
    <label>Categoria da competição</label>
    <select id="editCategoriaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="clube" ${categoriaAtual === 'clube' ? 'selected' : ''}>Competição de clubes</option><option value="selecao" ${categoriaAtual === 'selecao' ? 'selected' : ''}>Competição de seleções</option></select>
    <label>Abrangência</label><select id="editAbrangenciaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="Mundial" ${abrangenciaAtual === 'Mundial' ? 'selected' : ''}>Mundo</option><option value="Continental" ${abrangenciaAtual === 'Continental' ? 'selected' : ''}>Continente</option><option value="País" ${abrangenciaAtual === 'País' ? 'selected' : ''}>País</option></select>
    <div id="grupoEditContinenteTitulo" class="grupo"><label>Continente</label><select id="editContinenteTitulo" onchange="carregarPaisesEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um continente</option>${fpEdicaoListaContinentesNormais().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join('')}</select></div>
    <div id="grupoEditPaisTitulo" class="grupo"><label>País da competição</label><select id="editPaisTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um país</option></select></div>
    <div id="grupoEditPaisCampeaoTitulo" class="grupo"><label>País</label><select id="editPaisCampeaoTitulo" onchange="carregarParticipantesEdicaoTituloSelect('campeao')"><option value="">Selecione o país</option>${fpEdTituloOptionsPaisesClubes(banco, paisCampeaoAtual)}</select></div>
    <label>Ano</label><input type="number" id="editAno" value="${limparTexto(titulo.ano || '')}">
    <label>Competição cadastrada</label><select id="editCompeticaoTitulo"><option value="">Selecione a competição</option>${opcoesCompeticoes}</select>
    <label>Campeão</label><select id="editCampeao"><option value="">Selecione o campeão</option></select>
    <div id="grupoEditPaisViceTitulo" class="grupo"><label>País do vice</label><select id="editPaisViceTitulo" onchange="carregarParticipantesEdicaoTituloSelect('vice')"><option value="">Selecione o país do vice</option>${fpEdTituloOptionsPaisesClubes(banco, paisViceAtual)}</select></div>
    <label>Vice-campeão</label><select id="editVice"><option value="">Selecione o vice</option></select>
    <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button></form>`;
}

function atualizarCamposLocalEdicaoTitulo() {
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const abrangencia = document.getElementById('editAbrangenciaTitulo')?.value || 'Mundial';
  const grupoCont = document.getElementById('grupoEditContinenteTitulo');
  const grupoPais = document.getElementById('grupoEditPaisTitulo');
  const grupoPaisCamp = document.getElementById('grupoEditPaisCampeaoTitulo');
  const grupoPaisVice = document.getElementById('grupoEditPaisViceTitulo');
  if (grupoCont) grupoCont.classList.toggle('oculto', !(categoria === 'clube' && abrangencia === 'Continental'));
  if (grupoPais) grupoPais.classList.toggle('oculto', !(categoria === 'clube' && abrangencia === 'País'));
  if (grupoPaisCamp) grupoPaisCamp.classList.toggle('oculto', categoria !== 'clube');
  if (grupoPaisVice) grupoPaisVice.classList.toggle('oculto', categoria !== 'clube');
  if (categoria !== 'clube') {
    const pc = document.getElementById('editPaisCampeaoTitulo');
    const pv = document.getElementById('editPaisViceTitulo');
    if (pc) pc.value = '';
    if (pv) pv.value = '';
  }
  carregarParticipantesEdicaoTituloSelect('campeao');
  carregarParticipantesEdicaoTituloSelect('vice');
}

function carregarPaisesEdicaoTitulo() {
  const banco = carregarBanco();
  const selectPais = document.getElementById('editPaisTitulo');
  if (!selectPais) return;
  const continente = document.getElementById('editContinenteTitulo')?.value || '';
  const atual = selectPais.value;
  selectPais.innerHTML = `<option value="">Selecione um país</option>${fpEdTituloOptionsPaisesClubes(banco, atual, continente)}`;
  if ([...selectPais.options].some(o => o.value === atual)) selectPais.value = atual;
}

function carregarParticipantesEdicaoTituloSelect(tipo) {
  const banco = carregarBanco();
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const select = document.getElementById(tipo === 'vice' ? 'editVice' : 'editCampeao');
  if (!select) return;
  const atual = select.value;
  let pais = '';
  if (categoria === 'clube') {
    pais = document.getElementById(tipo === 'vice' ? 'editPaisViceTitulo' : 'editPaisCampeaoTitulo')?.value || '';
  }
  const placeholder = tipo === 'vice' ? (categoria === 'clube' && !pais ? 'Selecione primeiro o país do vice' : 'Selecione o vice') : (categoria === 'clube' && !pais ? 'Selecione primeiro o país' : 'Selecione o campeão');
  select.innerHTML = `<option value="">${placeholder}</option>${fpEdTituloOptionsParticipantes(banco, categoria, pais)}`;
  if ([...select.options].some(o => o.value === atual)) select.value = atual;
}

function filtrarCompeticoesEdicaoTitulo() {
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const abrangencia = document.getElementById('editAbrangenciaTitulo')?.value || 'Mundial';
  const continente = document.getElementById('editContinenteTitulo')?.value || '';
  const pais = document.getElementById('editPaisTitulo')?.value || '';
  const competicao = document.getElementById('editCompeticaoTitulo');

  // Quando a abrangência da competição for País, aplica o país escolhido também
  // nos países de campeão e vice para carregar os times daquele país.
  if (categoria === 'clube' && abrangencia === 'País' && pais) {
    const pc = document.getElementById('editPaisCampeaoTitulo');
    const pv = document.getElementById('editPaisViceTitulo');
    if (pc) pc.value = pais;
    if (pv) pv.value = pais;
  }

  if (competicao) {
    let primeira = '';
    Array.from(competicao.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      let mostrar = option.dataset.categoria === categoria;
      if (categoria === 'clube') {
        if (abrangencia === 'Mundial') mostrar = mostrar && option.dataset.abrangencia === 'Mundial';
        if (abrangencia === 'Continental') mostrar = mostrar && option.dataset.abrangencia === 'Continental' && (!continente || option.dataset.continente === continente);
        if (abrangencia === 'País') mostrar = mostrar && option.dataset.abrangencia === 'País' && (!pais || option.dataset.pais === pais);
      }
      option.hidden = !mostrar;
      if (mostrar && !primeira) primeira = option.value;
    });
    if (competicao.selectedOptions[0]?.hidden) competicao.value = primeira || '';
  }
  carregarParticipantesEdicaoTituloSelect('campeao');
  carregarParticipantesEdicaoTituloSelect('vice');
}

window.formularioEditarTitulo = formularioEditarTitulo;
window.atualizarCamposLocalEdicaoTitulo = atualizarCamposLocalEdicaoTitulo;
window.carregarPaisesEdicaoTitulo = carregarPaisesEdicaoTitulo;
window.carregarParticipantesEdicaoTituloSelect = carregarParticipantesEdicaoTituloSelect;
window.filtrarCompeticoesEdicaoTitulo = filtrarCompeticoesEdicaoTitulo;

/* ===== Correção: Edições > Editar Campeões e Vices com filtro em cascata =====
   Abrangência País -> seleciona país -> mostra competições desse país.
   Abrangência Continente -> seleciona continente -> mostra competições continentais.
   Abrangência Mundo -> mostra competições mundiais.
   Ao selecionar competição, lista somente os registros daquela competição.
*/
function fpEdTitulosLocalCompeticao(c) {
  const categoria = (typeof fpEdTituloCategoriaCompeticao === 'function') ? fpEdTituloCategoriaCompeticao(c) : (c?.categoria || 'clube');
  let abrangencia = 'Mundial';
  let pais = '';
  let continente = '';

  if (typeof fpEdTituloEhMundo === 'function' && fpEdTituloEhMundo(c)) {
    abrangencia = 'Mundial';
  } else if (typeof fpEdTituloPaisCompeticao === 'function' && fpEdTituloPaisCompeticao(c)) {
    abrangencia = 'País';
    pais = fpEdTituloPaisCompeticao(c);
    continente = (typeof fpEdTituloContinenteCompeticao === 'function') ? (fpEdTituloContinenteCompeticao(c) || '') : '';
  } else if (typeof fpEdTituloEhContinental === 'function' && fpEdTituloEhContinental(c)) {
    abrangencia = 'Continental';
    continente = (typeof fpEdTituloContinenteCompeticao === 'function') ? (fpEdTituloContinenteCompeticao(c) || '') : (c?.continente || c?.local || '');
  } else {
    const a = String(c?.abrangencia || '').trim();
    if (a === 'País' || a.toLowerCase() === 'pais') {
      abrangencia = 'País';
      pais = c?.pais || c?.local || '';
      continente = (typeof fpEdTituloContinenteCompeticao === 'function') ? (fpEdTituloContinenteCompeticao(c) || '') : '';
    } else if (a === 'Continental' || a === 'Continente') {
      abrangencia = 'Continental';
      continente = c?.continente || c?.local || '';
    } else if (a) {
      abrangencia = a;
    }
  }

  if (!continente && pais && typeof buscarPaisSelecao === 'function') {
    continente = buscarPaisSelecao(pais)?.continente || '';
  }
  return { categoria, abrangencia, pais, continente };
}

function fpEdTitulosCompeticoesFiltradas(banco, categoria, abrangencia, continente, pais) {
  return (banco.competicoes || [])
    .map(c => ({ ...c, __local: fpEdTitulosLocalCompeticao(c) }))
    .filter(c => {
      const l = c.__local;
      if (categoria && l.categoria !== categoria) return false;
      if (abrangencia && l.abrangencia !== abrangencia) return false;
      if (categoria === 'clube' && abrangencia === 'Continental' && continente && l.continente !== continente) return false;
      if (categoria === 'clube' && abrangencia === 'País' && pais && l.pais !== pais) return false;
      return true;
    })
    .sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || '')));
}

function fpEdTitulosPaisesComCompeticoes(banco, categoria = 'clube', continente = '') {
  const mapa = new Map();
  (banco.competicoes || []).forEach(c => {
    const l = fpEdTitulosLocalCompeticao(c);
    if (categoria && l.categoria !== categoria) return;
    if (l.abrangencia !== 'País' || !l.pais) return;
    if (continente && l.continente !== continente) return;
    const paisBase = typeof buscarPaisSelecao === 'function' ? buscarPaisSelecao(l.pais) : {};
    mapa.set(l.pais, { nome: l.pais, bandeira: paisBase?.bandeira || '', continente: l.continente || paisBase?.continente || '' });
  });
  return Array.from(mapa.values()).sort((a, b) => a.nome.localeCompare(b.nome));
}

function tabelaTitulos(banco) {
  const linhas = (banco.titulos || []).map(t => {
    const competicao = (banco.competicoes || []).find(c => c.id === t.competicaoId);
    const local = fpEdTitulosLocalCompeticao(competicao || { abrangencia: t.abrangencia, categoria: t.campeaoTipo || t.viceTipo || 'clube' });
    const categoria = t.campeaoTipo || t.viceTipo || local.categoria || 'clube';
    return `<tr data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(local.abrangencia || t.abrangencia || '')}" data-continente="${limparTexto(local.continente || '')}" data-pais="${limparTexto(local.pais || '')}" data-competicao="${limparTexto(t.competicaoId || '')}">
      <td>${limparTexto(t.ano || '')}</td>
      <td>${categoria === 'selecao' ? 'Seleções' : 'Clubes'}</td>
      <td>${limparTexto(local.abrangencia || t.abrangencia || '')}</td>
      <td>${linkLiga(t.competicaoId)}</td>
      <td>${linkParticipanteEdicao(t.campeaoId, t.campeaoTipo, t.campeaoNome)}</td>
      <td>${linkParticipanteEdicao(t.viceId, t.viceTipo, t.viceNome)}</td>
      <td>${botoesEditarExcluir('titulos', t.id)}</td>
    </tr>`;
  }).join('');

  if (!linhas) return `<div class="tabela-container"><p>Nenhum campeão ou vice cadastrado para editar.</p></div>`;

  const continentes = (typeof fpEdicaoListaContinentesNormais === 'function' ? fpEdicaoListaContinentesNormais() : [])
    .map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join('');

  return `
    <div class="filtros filtros-edicao filtros-edicao-titulos">
      <div>
        <label>Categoria</label>
        <select id="filtroEdicaoTitulosCategoria" onchange="atualizarFiltrosEdicaoTitulos()">
          <option value="">Clubes e seleções</option>
          <option value="clube">Competições de clubes</option>
          <option value="selecao">Competições de seleções</option>
        </select>
      </div>
      <div>
        <label>Abrangência</label>
        <select id="filtroEdicaoTitulosAbrangencia" onchange="atualizarFiltrosEdicaoTitulos()">
          <option value="">Todas as abrangências</option>
          <option value="Mundial">Mundo</option>
          <option value="Continental">Continente</option>
          <option value="País">País</option>
        </select>
      </div>
      <div id="grupoFiltroEdicaoTitulosContinente" class="oculto">
        <label>Continente</label>
        <select id="filtroEdicaoTitulosContinente" onchange="atualizarFiltrosEdicaoTitulos()">
          <option value="">Selecione o continente</option>${continentes}
        </select>
      </div>
      <div id="grupoFiltroEdicaoTitulosPais" class="oculto">
        <label>País</label>
        <select id="filtroEdicaoTitulosPais" onchange="atualizarFiltrosEdicaoTitulos()">
          <option value="">Selecione o país</option>
        </select>
      </div>
      <div>
        <label>Competição</label>
        <select id="filtroEdicaoTitulosCompeticao" onchange="aplicarFiltrosEdicaoTitulos()">
          <option value="">Todas as competições</option>
        </select>
      </div>
    </div>
    <div class="tabela-container">
      <table class="tabela" id="tabelaEdicaoTitulos">
        <tr><th>Ano</th><th>Categoria</th><th>Abrangência</th><th>Competição</th><th>Campeão</th><th>Vice</th><th>Ações</th></tr>
        ${linhas}
      </table>
    </div>
    <script>setTimeout(function(){ if (typeof atualizarFiltrosEdicaoTitulos === 'function') atualizarFiltrosEdicaoTitulos(); }, 0);</script>
  `;
}

function atualizarFiltrosEdicaoTitulos() {
  const banco = carregarBanco();
  const categoria = document.getElementById('filtroEdicaoTitulosCategoria')?.value || '';
  const abrangencia = document.getElementById('filtroEdicaoTitulosAbrangencia')?.value || '';
  const grupoContinente = document.getElementById('grupoFiltroEdicaoTitulosContinente');
  const grupoPais = document.getElementById('grupoFiltroEdicaoTitulosPais');
  const selectContinente = document.getElementById('filtroEdicaoTitulosContinente');
  const selectPais = document.getElementById('filtroEdicaoTitulosPais');
  const selectCompeticao = document.getElementById('filtroEdicaoTitulosCompeticao');

  if (grupoContinente) grupoContinente.classList.toggle('oculto', !(categoria === 'clube' && abrangencia === 'Continental'));
  if (grupoPais) grupoPais.classList.toggle('oculto', !(categoria === 'clube' && abrangencia === 'País'));

  if (!(categoria === 'clube' && abrangencia === 'Continental') && selectContinente) selectContinente.value = '';

  const continente = selectContinente?.value || '';
  const paisAtual = selectPais?.value || '';

  if (selectPais) {
    const paises = (categoria === 'clube' && abrangencia === 'País') ? fpEdTitulosPaisesComCompeticoes(banco, 'clube', continente) : [];
    selectPais.innerHTML = `<option value="">Selecione o país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}" ${p.nome === paisAtual ? 'selected' : ''}>${p.bandeira || ''} ${limparTexto(p.nome)}</option>`).join('');
    if (![...selectPais.options].some(o => o.value === paisAtual)) selectPais.value = '';
  }

  const pais = selectPais?.value || '';
  if (selectCompeticao) {
    const competicoes = fpEdTitulosCompeticoesFiltradas(banco, categoria, abrangencia, continente, pais);
    const atual = selectCompeticao.value;
    selectCompeticao.innerHTML = `<option value="">Todas as competições</option>` + competicoes.map(c => `<option value="${c.id}" ${c.id === atual ? 'selected' : ''}>${limparTexto(c.nome || '')}</option>`).join('');
    if (![...selectCompeticao.options].some(o => o.value === atual)) selectCompeticao.value = '';
  }

  aplicarFiltrosEdicaoTitulos();
}

function aplicarFiltrosEdicaoTitulos() {
  const categoria = document.getElementById('filtroEdicaoTitulosCategoria')?.value || '';
  const abrangencia = document.getElementById('filtroEdicaoTitulosAbrangencia')?.value || '';
  const continente = document.getElementById('filtroEdicaoTitulosContinente')?.value || '';
  const pais = document.getElementById('filtroEdicaoTitulosPais')?.value || '';
  const competicao = document.getElementById('filtroEdicaoTitulosCompeticao')?.value || '';
  const linhas = document.querySelectorAll('#tabelaEdicaoTitulos tr[data-categoria]');

  linhas.forEach(linha => {
    let mostrar = true;
    if (categoria) mostrar = mostrar && linha.dataset.categoria === categoria;
    if (abrangencia) mostrar = mostrar && linha.dataset.abrangencia === abrangencia;
    if (categoria === 'clube' && abrangencia === 'Continental' && continente) mostrar = mostrar && linha.dataset.continente === continente;
    if (categoria === 'clube' && abrangencia === 'País' && pais) mostrar = mostrar && linha.dataset.pais === pais;
    if (competicao) mostrar = mostrar && linha.dataset.competicao === competicao;
    linha.style.display = mostrar ? '' : 'none';
  });
}

window.tabelaTitulos = tabelaTitulos;
window.atualizarFiltrosEdicaoTitulos = atualizarFiltrosEdicaoTitulos;
window.aplicarFiltrosEdicaoTitulos = aplicarFiltrosEdicaoTitulos;

/* Reaplica inicialização dos filtros ao abrir a aba de Campeões e Vices. */
function mostrarEdicao(tipo) {
  const banco = carregarBanco();
  const area = document.getElementById("areaEdicao");
  if (!area) return;

  area.innerHTML = "";

  if (tipo === "clubes") area.innerHTML = tabelaClubes(banco);
  else if (tipo === "selecoes") area.innerHTML = tabelaSelecoesSimplificada(banco);
  else if (tipo === "competicoes") area.innerHTML = tabelaCompeticoes(banco);
  else if (tipo === "titulos") {
    area.innerHTML = tabelaTitulos(banco);
    setTimeout(() => {
      if (typeof atualizarFiltrosEdicaoTitulos === 'function') atualizarFiltrosEdicaoTitulos();
    }, 0);
  }
  else area.innerHTML = "<p>Opção de edição não encontrada.</p>";

  area.scrollIntoView({ behavior: "smooth", block: "start" });
}
window.mostrarEdicao = mostrarEdicao;


/* ===== Correção final: ordem dos campos em Edições > Editar Campeões e Vices =====
   Ordem solicitada: País, Ano, Competição cadastrada, Campeão, País do vice e Vice-campeão.
   Também renomeia "País" para apenas "País".
*/
function formularioEditarTitulo(titulo, banco) {
  const compAtual = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || fpEdTituloCategoriaCompeticao(compAtual) || 'clube';
  const abrangenciaAtual = fpEdTituloAbrangenciaFromCompeticao(compAtual || { abrangencia: titulo.abrangencia });
  const continenteAtual = fpEdTituloContinenteCompeticao(compAtual) || '';
  const paisAtual = fpEdTituloPaisCompeticao(compAtual) || '';
  const campeaoAtual = buscarParticipanteEdicaoTitulo(banco, titulo.campeaoId);
  const viceAtual = buscarParticipanteEdicaoTitulo(banco, titulo.viceId);
  const paisCampeaoAtual = categoriaAtual === 'clube' ? (campeaoAtual?.pais || paisAtual || '') : '';
  const paisViceAtual = categoriaAtual === 'clube' ? (viceAtual?.pais || paisAtual || '') : '';

  const opcoesCompeticoes = (banco.competicoes || []).slice().sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''))).map(c => {
    const categoria = fpEdTituloCategoriaCompeticao(c);
    const pais = fpEdTituloPaisCompeticao(c);
    const continente = fpEdTituloContinenteCompeticao(c);
    const abrangencia = fpEdTituloEhMundo(c) ? 'Mundial' : (pais ? 'País' : 'Continental');
    return `<option value="${c.id}" data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(abrangencia)}" data-continente="${limparTexto(continente)}" data-pais="${limparTexto(pais)}" ${c.id === titulo.competicaoId ? 'selected' : ''}>${limparTexto(c.nome)}</option>`;
  }).join('');

  setTimeout(() => {
    const cat = document.getElementById('editCategoriaTitulo');
    const abr = document.getElementById('editAbrangenciaTitulo');
    const cont = document.getElementById('editContinenteTitulo');
    const pais = document.getElementById('editPaisTitulo');
    if (cat) cat.value = categoriaAtual;
    if (abr) abr.value = abrangenciaAtual;
    atualizarCamposLocalEdicaoTitulo();
    if (cont) cont.value = continenteAtual;
    carregarPaisesEdicaoTitulo();
    if (pais) pais.value = paisAtual;
    filtrarCompeticoesEdicaoTitulo();
    const paisCamp = document.getElementById('editPaisCampeaoTitulo');
    const paisVice = document.getElementById('editPaisViceTitulo');
    if (paisCamp) paisCamp.value = paisCampeaoAtual;
    if (paisVice) paisVice.value = paisViceAtual;
    carregarParticipantesEdicaoTituloSelect('campeao');
    carregarParticipantesEdicaoTituloSelect('vice');
    const camp = document.getElementById('editCampeao');
    const vice = document.getElementById('editVice');
    if (camp) camp.value = titulo.campeaoId || '';
    if (vice) vice.value = titulo.viceId || '';
  }, 80);

  return `<form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')"><h2>Editar Campeão e Vice</h2>
    <label>Categoria da competição</label>
    <select id="editCategoriaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="clube" ${categoriaAtual === 'clube' ? 'selected' : ''}>Competição de clubes</option><option value="selecao" ${categoriaAtual === 'selecao' ? 'selected' : ''}>Competição de seleções</option></select>
    <label>Abrangência</label><select id="editAbrangenciaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="Mundial" ${abrangenciaAtual === 'Mundial' ? 'selected' : ''}>Mundo</option><option value="Continental" ${abrangenciaAtual === 'Continental' ? 'selected' : ''}>Continente</option><option value="País" ${abrangenciaAtual === 'País' ? 'selected' : ''}>País</option></select>
    <div id="grupoEditContinenteTitulo" class="grupo"><label>Continente</label><select id="editContinenteTitulo" onchange="carregarPaisesEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um continente</option>${fpEdicaoListaContinentesNormais().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join('')}</select></div>
    <div id="grupoEditPaisTitulo" class="grupo"><label>País da competição</label><select id="editPaisTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um país</option></select></div>
    <div id="grupoEditPaisCampeaoTitulo" class="grupo"><label>País</label><select id="editPaisCampeaoTitulo" onchange="carregarParticipantesEdicaoTituloSelect('campeao')"><option value="">Selecione o país</option>${fpEdTituloOptionsPaisesClubes(banco, paisCampeaoAtual)}</select></div>
    <label>Ano</label><input type="number" id="editAno" value="${limparTexto(titulo.ano || '')}">
    <label>Competição cadastrada</label><select id="editCompeticaoTitulo"><option value="">Selecione a competição</option>${opcoesCompeticoes}</select>
    <label>Campeão</label><select id="editCampeao"><option value="">Selecione o campeão</option></select>
    <div id="grupoEditPaisViceTitulo" class="grupo"><label>País do vice</label><select id="editPaisViceTitulo" onchange="carregarParticipantesEdicaoTituloSelect('vice')"><option value="">Selecione o país do vice</option>${fpEdTituloOptionsPaisesClubes(banco, paisViceAtual)}</select></div>
    <label>Vice-campeão</label><select id="editVice"><option value="">Selecione o vice</option></select>
    <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button></form>`;
}
window.formularioEditarTitulo = formularioEditarTitulo;

/* ===== Correção final solicitada: Edições > Campeão e Vice =====
   O campo visível "País" passa a controlar também o filtro de competições.
   Quando a abrangência for País, ao selecionar o País são exibidas apenas as
   competições cadastradas daquele país. */
function fpSyncPaisVisivelCompeticaoTitulo() {
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const abrangencia = document.getElementById('editAbrangenciaTitulo')?.value || 'Mundial';
  if (!(categoria === 'clube' && abrangencia === 'País')) return;

  const paisVisivel = document.getElementById('editPaisCampeaoTitulo');
  const paisCompeticao = document.getElementById('editPaisTitulo');
  const paisVice = document.getElementById('editPaisViceTitulo');
  const valor = paisVisivel?.value || '';

  if (paisCompeticao) paisCompeticao.value = valor;
  if (paisVice && valor) paisVice.value = valor;
}

function formularioEditarTitulo(titulo, banco) {
  const compAtual = (banco.competicoes || []).find(c => c.id === titulo.competicaoId);
  const categoriaAtual = titulo.campeaoTipo || titulo.viceTipo || fpEdTituloCategoriaCompeticao(compAtual) || 'clube';
  const abrangenciaAtual = fpEdTituloAbrangenciaFromCompeticao(compAtual || { abrangencia: titulo.abrangencia });
  const continenteAtual = fpEdTituloContinenteCompeticao(compAtual) || '';
  const paisAtual = fpEdTituloPaisCompeticao(compAtual) || '';
  const campeaoAtual = buscarParticipanteEdicaoTitulo(banco, titulo.campeaoId);
  const viceAtual = buscarParticipanteEdicaoTitulo(banco, titulo.viceId);
  const paisCampeaoAtual = categoriaAtual === 'clube' ? (campeaoAtual?.pais || paisAtual || '') : '';
  const paisViceAtual = categoriaAtual === 'clube' ? (viceAtual?.pais || paisAtual || '') : '';

  const opcoesCompeticoes = (banco.competicoes || []).slice().sort((a, b) => String(a.nome || '').localeCompare(String(b.nome || ''))).map(c => {
    const categoria = fpEdTituloCategoriaCompeticao(c);
    const pais = fpEdTituloPaisCompeticao(c);
    const continente = fpEdTituloContinenteCompeticao(c);
    const abrangencia = fpEdTituloEhMundo(c) ? 'Mundial' : (pais ? 'País' : 'Continental');
    return `<option value="${c.id}" data-categoria="${limparTexto(categoria)}" data-abrangencia="${limparTexto(abrangencia)}" data-continente="${limparTexto(continente)}" data-pais="${limparTexto(pais)}" ${c.id === titulo.competicaoId ? 'selected' : ''}>${limparTexto(c.nome || '')}</option>`;
  }).join('');

  setTimeout(() => {
    const cat = document.getElementById('editCategoriaTitulo');
    const abr = document.getElementById('editAbrangenciaTitulo');
    const cont = document.getElementById('editContinenteTitulo');
    const paisCompeticao = document.getElementById('editPaisTitulo');
    if (cat) cat.value = categoriaAtual;
    if (abr) abr.value = abrangenciaAtual;
    atualizarCamposLocalEdicaoTitulo();
    if (cont) cont.value = continenteAtual;
    carregarPaisesEdicaoTitulo();
    if (paisCompeticao) paisCompeticao.value = paisAtual;

    const paisCamp = document.getElementById('editPaisCampeaoTitulo');
    const paisVice = document.getElementById('editPaisViceTitulo');
    if (paisCamp) paisCamp.value = paisCampeaoAtual || paisAtual || '';
    if (paisVice) paisVice.value = paisViceAtual || paisAtual || '';

    fpSyncPaisVisivelCompeticaoTitulo();
    filtrarCompeticoesEdicaoTitulo();
    carregarParticipantesEdicaoTituloSelect('campeao');
    carregarParticipantesEdicaoTituloSelect('vice');

    const camp = document.getElementById('editCampeao');
    const vice = document.getElementById('editVice');
    if (camp) camp.value = titulo.campeaoId || '';
    if (vice) vice.value = titulo.viceId || '';
  }, 80);

  return `<form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')"><h2>Editar Campeão e Vice</h2>
    <label>Categoria da competição</label>
    <select id="editCategoriaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="clube" ${categoriaAtual === 'clube' ? 'selected' : ''}>Competição de clubes</option><option value="selecao" ${categoriaAtual === 'selecao' ? 'selected' : ''}>Competição de seleções</option></select>
    <label>Abrangência</label><select id="editAbrangenciaTitulo" onchange="atualizarCamposLocalEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="Mundial" ${abrangenciaAtual === 'Mundial' ? 'selected' : ''}>Mundo</option><option value="Continental" ${abrangenciaAtual === 'Continental' ? 'selected' : ''}>Continente</option><option value="País" ${abrangenciaAtual === 'País' ? 'selected' : ''}>País</option></select>
    <div id="grupoEditContinenteTitulo" class="grupo"><label>Continente</label><select id="editContinenteTitulo" onchange="carregarPaisesEdicaoTitulo(); filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um continente</option>${fpEdicaoListaContinentesNormais().map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join('')}</select></div>
    <div id="grupoEditPaisTitulo" class="grupo oculto"><label>País da competição</label><select id="editPaisTitulo" onchange="filtrarCompeticoesEdicaoTitulo()"><option value="">Selecione um país</option></select></div>
    <div id="grupoEditPaisCampeaoTitulo" class="grupo"><label>País</label><select id="editPaisCampeaoTitulo" onchange="fpSyncPaisVisivelCompeticaoTitulo(); filtrarCompeticoesEdicaoTitulo(); carregarParticipantesEdicaoTituloSelect('campeao')"><option value="">Selecione o país</option>${fpEdTituloOptionsPaisesClubes(banco, paisCampeaoAtual || paisAtual)}</select></div>
    <label>Ano</label><input type="number" id="editAno" value="${limparTexto(titulo.ano || '')}">
    <label>Competição cadastrada</label><select id="editCompeticaoTitulo"><option value="">Selecione a competição</option>${opcoesCompeticoes}</select>
    <label>Campeão</label><select id="editCampeao"><option value="">Selecione o campeão</option></select>
    <div id="grupoEditPaisViceTitulo" class="grupo"><label>País do vice</label><select id="editPaisViceTitulo" onchange="carregarParticipantesEdicaoTituloSelect('vice')"><option value="">Selecione o país do vice</option>${fpEdTituloOptionsPaisesClubes(banco, paisViceAtual || paisAtual)}</select></div>
    <label>Vice-campeão</label><select id="editVice"><option value="">Selecione o vice</option></select>
    <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('titulos')">Cancelar</button></form>`;
}

function atualizarCamposLocalEdicaoTitulo() {
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const abrangencia = document.getElementById('editAbrangenciaTitulo')?.value || 'Mundial';
  const grupoCont = document.getElementById('grupoEditContinenteTitulo');
  const grupoPaisCompeticao = document.getElementById('grupoEditPaisTitulo');
  const grupoPaisCamp = document.getElementById('grupoEditPaisCampeaoTitulo');
  const grupoPaisVice = document.getElementById('grupoEditPaisViceTitulo');

  if (grupoCont) grupoCont.classList.toggle('oculto', !(categoria === 'clube' && abrangencia === 'Continental'));
  // O país da competição fica oculto porque o campo visível "País" faz esse papel.
  if (grupoPaisCompeticao) grupoPaisCompeticao.classList.add('oculto');
  if (grupoPaisCamp) grupoPaisCamp.classList.toggle('oculto', categoria !== 'clube');
  if (grupoPaisVice) grupoPaisVice.classList.toggle('oculto', categoria !== 'clube');

  if (categoria !== 'clube') {
    const pc = document.getElementById('editPaisCampeaoTitulo');
    const pv = document.getElementById('editPaisViceTitulo');
    const pcomp = document.getElementById('editPaisTitulo');
    if (pc) pc.value = '';
    if (pv) pv.value = '';
    if (pcomp) pcomp.value = '';
  }

  fpSyncPaisVisivelCompeticaoTitulo();
  carregarParticipantesEdicaoTituloSelect('campeao');
  carregarParticipantesEdicaoTituloSelect('vice');
}

function filtrarCompeticoesEdicaoTitulo() {
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const abrangencia = document.getElementById('editAbrangenciaTitulo')?.value || 'Mundial';
  const continente = document.getElementById('editContinenteTitulo')?.value || '';
  const paisVisivel = document.getElementById('editPaisCampeaoTitulo')?.value || '';
  const paisCompeticao = document.getElementById('editPaisTitulo')?.value || '';
  const pais = (categoria === 'clube' && abrangencia === 'País') ? (paisVisivel || paisCompeticao) : paisCompeticao;
  const competicao = document.getElementById('editCompeticaoTitulo');

  if (categoria === 'clube' && abrangencia === 'País') {
    const pcomp = document.getElementById('editPaisTitulo');
    const pvice = document.getElementById('editPaisViceTitulo');
    if (pcomp) pcomp.value = pais || '';
    if (pvice && pais) pvice.value = pais;
  }

  if (competicao) {
    let primeira = '';
    Array.from(competicao.options).forEach(option => {
      if (!option.value) { option.hidden = false; return; }
      let mostrar = option.dataset.categoria === categoria;
      if (categoria === 'clube') {
        if (abrangencia === 'Mundial') mostrar = mostrar && option.dataset.abrangencia === 'Mundial';
        if (abrangencia === 'Continental') mostrar = mostrar && option.dataset.abrangencia === 'Continental' && (!continente || option.dataset.continente === continente);
        if (abrangencia === 'País') mostrar = mostrar && option.dataset.abrangencia === 'País' && !!pais && option.dataset.pais === pais;
      }
      option.hidden = !mostrar;
      if (mostrar && !primeira) primeira = option.value;
    });
    if (!competicao.value || competicao.selectedOptions[0]?.hidden) competicao.value = primeira || '';
  }

  carregarParticipantesEdicaoTituloSelect('campeao');
  carregarParticipantesEdicaoTituloSelect('vice');
}

window.fpSyncPaisVisivelCompeticaoTitulo = fpSyncPaisVisivelCompeticaoTitulo;
window.formularioEditarTitulo = formularioEditarTitulo;
window.atualizarCamposLocalEdicaoTitulo = atualizarCamposLocalEdicaoTitulo;
window.filtrarCompeticoesEdicaoTitulo = filtrarCompeticoesEdicaoTitulo;


/* ===== FutPedia: edição direta vinda da página de detalhes + salvamento nas tabelas SQL =====
   Esta camada mantém a edição antiga no localStorage, mas também atualiza as tabelas reais
   do Supabase: times, selecoes e competicoes. Assim as alterações permanecem no banco SQL. */
function fpEdicaoSqlCliente() {
  return typeof clienteSupabase === "function" ? clienteSupabase() : null;
}

function fpEdicaoNormalizarData(valor) {
  const v = String(valor || "").trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return v;
}

async function fpEdicaoBuscarPaisId(nomePais) {
  const supa = fpEdicaoSqlCliente();
  if (!supa || !nomePais) return null;
  const { data, error } = await supa
    .from("paises")
    .select("id")
    .eq("nome", nomePais)
    .maybeSingle();
  if (error) {
    console.warn("Não foi possível buscar o país no Supabase:", error.message || error);
    return null;
  }
  return data?.id || null;
}

async function fpEdicaoBuscarContinenteId(nomeContinente) {
  const supa = fpEdicaoSqlCliente();
  if (!supa || !nomeContinente) return null;
  const { data, error } = await supa
    .from("continentes")
    .select("id")
    .eq("nome", nomeContinente)
    .maybeSingle();
  if (error) {
    console.warn("Não foi possível buscar o continente no Supabase:", error.message || error);
    return null;
  }
  return data?.id || null;
}

async function fpEdicaoAtualizarTimeSql(id, dados) {
  const supa = fpEdicaoSqlCliente();
  if (!supa) return true;
  const { error } = await supa.rpc("fp_salvar_time", {
    p_id: Number(id) || null,
    p_pais_nome: dados.pais || null,
    p_nome_curto: dados.nomeCurto || dados.nome || null,
    p_nome: dados.nomeCompleto || dados.nomeCurto || dados.nome || null,
    p_fundacao: dados.fundacao || null,
    p_estado: dados.estado || null,
    p_cidade: dados.cidade || null,
    p_escudo_url: dados.escudo || null
  });
  if (error) {
    console.error("Erro RPC fp_salvar_time:", error);
    throw new Error(error.message || "Erro ao atualizar time no Supabase.");
  }
  return true;
}

async function fpEdicaoAtualizarSelecaoSql(id, dados) {
  const supa = fpEdicaoSqlCliente();
  if (!supa) return true;
  const { error } = await supa.rpc("fp_salvar_selecao", {
    p_id: Number(id) || null,
    p_pais_nome: dados.pais || dados.nome || null,
    p_nome: dados.nome || dados.pais || null,
    p_escudo_url: dados.escudo || null
  });
  if (error) {
    console.error("Erro RPC fp_salvar_selecao:", error);
    throw new Error(error.message || "Erro ao atualizar seleção no Supabase.");
  }
  return true;
}

function fpEdicaoAbrangenciaParaSql(abrangencia) {
  const v = String(abrangencia || "").toLowerCase();
  if (v.includes("mund")) return "mundo";
  if (v.includes("continent")) return "continente";
  if (v.includes("país") || v.includes("pais")) return "pais";
  if (v.includes("sele")) return "continente";
  return v || null;
}

async function fpEdicaoAtualizarCompeticaoSql(id, dados) {
  const supa = fpEdicaoSqlCliente();
  if (!supa) return true;
  const { error } = await supa.rpc("fp_salvar_competicao", {
    p_id: Number(id) || null,
    p_nome: dados.nome || null,
    p_tipo: dados.categoria === "selecao" ? "selecoes" : "clubes",
    p_abrangencia: fpEdicaoAbrangenciaParaSql(dados.abrangencia),
    p_pais_nome: dados.pais || null,
    p_continente_nome: dados.continente || null,
    p_logo_url: dados.escudo || null,
    p_organizador: dados.organizador || null,
    p_nivel: dados.tipo || null,
    p_genero: "masculino",
    p_sigla: dados.sigla || null,
    p_descricao: dados.descricao || null,
    p_divisao: null,
    p_periodicidade: null,
    p_primeira_edicao: null,
    p_status: "Ativa",
    p_categoria: "Profissional"
  });
  if (error) {
    console.error("Erro RPC fp_salvar_competicao:", error);
    throw new Error(error.message || "Erro ao atualizar competição no Supabase.");
  }
  return true;
}

window.salvarEdicaoClube = 
async function fpSalvarRivaisTimeSql(timeId, rivaisIds) {
  const supa = typeof fpEdicaoSqlCliente === "function" ? fpEdicaoSqlCliente() : null;
  if (!supa || !timeId) return true;

  const id = Number(timeId);
  const rivais = (rivaisIds || [])
    .map(v => Number(v))
    .filter(v => Number.isFinite(v) && v && v !== id)
    .filter((v, idx, arr) => arr.indexOf(v) === idx)
    .slice(0, 5);

  const relacionados = [id, ...rivais];

  const { error: delError } = await supa
    .from("time_rivais")
    .delete()
    .or(`time_id.in.(${relacionados.join(",")}),rival_id.in.(${relacionados.join(",")})`);

  if (delError) {
    console.warn("Não foi possível limpar rivais antigos no Supabase:", delError.message || delError);
    throw new Error(delError.message || "Erro ao atualizar rivais.");
  }

  const linhas = [];
  rivais.forEach(rivalId => {
    linhas.push({ time_id: id, rival_id: rivalId });
    linhas.push({ time_id: rivalId, rival_id: id });
  });

  if (!linhas.length) return true;

  const { error: insertError } = await supa
    .from("time_rivais")
    .upsert(linhas, { onConflict: "time_id,rival_id" });

  if (insertError) {
    console.warn("Não foi possível salvar rivais no Supabase:", insertError.message || insertError);
    throw new Error(insertError.message || "Erro ao salvar rivais.");
  }

  return true;
}


function salvarEdicaoClube(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const clube = (banco.clubes || []).find(c => String(c.id) === String(id));
  if (!clube) return;

  lerImagem("editEscudo", async novaImagem => {
    try {
      const paisNome = document.getElementById("editPais")?.value || clube.pais || "";
      const pais = typeof buscarPais === "function" ? (buscarPais(paisNome) || {}) : {};
      const estadoNome = paisNome === "Brasil" ? (document.getElementById("editEstado")?.value || "") : "";
      const estadoObj = paisNome === "Brasil" && typeof buscarEstado === "function" ? (buscarEstado(estadoNome) || {}) : { sigla: "" };
      const nomeCurto = document.getElementById("editNome")?.value.trim() || clube.nomeCurto || clube.nome;
      const nomeCompleto = document.getElementById("editNomeCompleto")?.value.trim() || nomeCurto;
      const fundacao = fpEdicaoNormalizarData(document.getElementById("editFundacao")?.value || "");

      clube.nome = nomeCurto;
      clube.nomeCompleto = nomeCompleto;
      clube.nomeCurto = nomeCurto;
      clube.pais = paisNome;
      clube.bandeira = pais.bandeira || clube.bandeira || "";
      clube.estado = estadoNome;
      clube.siglaEstado = paisNome === "Brasil" ? (document.getElementById("editSiglaEstado")?.value.trim() || estadoObj.sigla || estadoNome || "") : "";
      clube.cidade = document.getElementById("editCidade")?.value.trim() || "";
      clube.fundacao = fundacao || "";
      if (novaImagem) clube.escudo = novaImagem;

      clube.rivais = [];
      for (let i = 1; i <= 5; i++) {
        const rival = document.getElementById(`editRival${i}`)?.value || "";
        if (rival && !clube.rivais.includes(rival)) clube.rivais.push(rival);
      }

      (banco.titulos || []).forEach(titulo => {
        if (String(titulo.campeaoId) === String(clube.id)) titulo.campeaoNome = clube.nome;
        if (String(titulo.viceId) === String(clube.id)) titulo.viceNome = clube.nome;
      });

      if (typeof sincronizarRivaisBidirecionais === "function") sincronizarRivaisBidirecionais(banco);
      await fpEdicaoAtualizarTimeSql(id, clube);
      salvarBanco(banco);
      alert("Time atualizado com sucesso!");
      if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();
      mostrarEdicao("clubes");
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível salvar o time no Supabase: " + (erro.message || erro));
    }
  });
};

window.salvarEdicaoSelecao = function salvarEdicaoSelecao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const selecao = (banco.selecoes || []).find(s => String(s.id) === String(id));
  if (!selecao) return;

  lerImagem("editEscudo", async novaImagem => {
    try {
      const paisNome = document.getElementById("editPaisSelecao")?.value || selecao.pais || selecao.nome || "";
      const continente = document.getElementById("editContinenteSelecao")?.value || selecao.continente || "";
      selecao.nome = paisNome;
      selecao.pais = paisNome;
      selecao.continente = continente;
      if (novaImagem) selecao.escudo = novaImagem;

      (banco.titulos || []).forEach(titulo => {
        if (String(titulo.campeaoId) === String(selecao.id)) {
          titulo.campeaoNome = selecao.nome || selecao.pais;
          titulo.campeaoTipo = "selecao";
        }
        if (String(titulo.viceId) === String(selecao.id)) {
          titulo.viceNome = selecao.nome || selecao.pais;
          titulo.viceTipo = "selecao";
        }
      });

      await fpEdicaoAtualizarSelecaoSql(id, selecao);
      salvarBanco(banco);
      alert("Seleção atualizada com sucesso!");
      if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();
      mostrarEdicao("selecoes");
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível salvar a seleção no Supabase: " + (erro.message || erro));
    }
  });
};

window.salvarEdicaoCompeticao = function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const competicao = (banco.competicoes || []).find(c => String(c.id) === String(id));
  if (!competicao) return;

  lerImagem("editEscudo", async novaImagem => {
    try {
      const categoria = document.getElementById("editCategoriaCompeticao")?.value || "clube";
      competicao.nome = document.getElementById("editNome")?.value.trim() || competicao.nome;
      competicao.categoria = categoria;
      competicao.tipo = document.getElementById("editTipoCompeticao")?.value || competicao.tipo || "Não informado";
      competicao.abrangencia = categoria === "selecao" ? "Seleções" : (document.getElementById("editAbrangencia")?.value || competicao.abrangencia || "");
      competicao.local = "";
      competicao.bandeira = "";
      competicao.continente = "";
      competicao.pais = "";

      if (categoria === "selecao") {
        competicao.continente = document.getElementById("editContinenteCompeticao")?.value || "";
        competicao.pais = document.getElementById("editPaisCompeticao")?.value || "";
        competicao.local = competicao.pais || competicao.continente || "Seleções";
        competicao.bandeira = competicao.pais ? (buscarPaisSelecao(competicao.pais)?.bandeira || "") : "🏆";
      } else if (competicao.abrangencia === "Mundial") {
        competicao.local = "Mundial";
        competicao.bandeira = "🌍";
      } else if (competicao.abrangencia === "Continental") {
        competicao.continente = document.getElementById("editContinenteCompeticao")?.value || competicao.continente || "";
        competicao.local = competicao.continente;
        competicao.bandeira = "🌎";
      } else if (competicao.abrangencia === "País") {
        competicao.pais = document.getElementById("editPaisCompeticao")?.value || "";
        const pais = typeof buscarPaisSelecao === "function" ? (buscarPaisSelecao(competicao.pais) || {}) : {};
        competicao.continente = pais.continente || competicao.continente || "";
        competicao.local = competicao.pais;
        competicao.bandeira = pais.bandeira || "";
      }

      if (novaImagem) competicao.escudo = novaImagem;
      (banco.titulos || []).forEach(titulo => {
        if (String(titulo.competicaoId) === String(competicao.id)) {
          titulo.competicaoNome = competicao.nome;
          titulo.abrangencia = competicao.abrangencia;
        }
      });

      await fpEdicaoAtualizarCompeticaoSql(id, competicao);
      salvarBanco(banco);
      alert("Competição atualizada com sucesso!");
      if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();
      mostrarEdicao("competicoes");
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível salvar a competição no Supabase: " + (erro.message || erro));
    }
  });
};


/* ===== Correção final: escudos sempre salvos no Supabase Storage e em public.times.escudo_url ===== */
async function fpUploadEscudoEdicaoFinal(inputId, bucket, nomeBase, urlAtual = "") {
  const input = document.getElementById(inputId);
  const arquivo = input?.files?.[0];
  if (!arquivo) return urlAtual || "";

  if (typeof fpUploadArquivoStorage === "function") {
    return await fpUploadArquivoStorage(bucket, arquivo, nomeBase || arquivo.name);
  }

  if (typeof fpUploadImagemInput === "function") {
    const url = await fpUploadImagemInput(inputId, bucket, nomeBase || arquivo.name);
    return url || urlAtual || "";
  }

  throw new Error("Função de upload para Supabase Storage não encontrada.");
}

async function fpSalvarEscudoTimeDiretoFinal(timeId, escudoUrl) {
  const supa = typeof fpEdicaoSqlCliente === "function" ? fpEdicaoSqlCliente() : (typeof clienteSupabase === "function" ? clienteSupabase() : null);
  if (!supa || !timeId || !escudoUrl) return true;

  const { error } = await supa
    .from("times")
    .update({ escudo_url: escudoUrl })
    .eq("id", Number(timeId));

  if (error) throw error;
  return true;
}

async function fpSalvarEscudoSelecaoDiretoFinal(selecaoId, escudoUrl) {
  const supa = typeof fpEdicaoSqlCliente === "function" ? fpEdicaoSqlCliente() : (typeof clienteSupabase === "function" ? clienteSupabase() : null);
  if (!supa || !selecaoId || !escudoUrl) return true;

  const { error } = await supa
    .from("selecoes")
    .update({ escudo_url: escudoUrl })
    .eq("id", Number(selecaoId));

  if (error) throw error;
  return true;
}

async function fpSalvarLogoCompeticaoDiretoFinal(competicaoId, logoUrl) {
  const supa = typeof fpEdicaoSqlCliente === "function" ? fpEdicaoSqlCliente() : (typeof clienteSupabase === "function" ? clienteSupabase() : null);
  if (!supa || !competicaoId || !logoUrl) return true;

  const { error } = await supa
    .from("competicoes")
    .update({ logo_url: logoUrl })
    .eq("id", Number(competicaoId));

  if (error) throw error;
  return true;
}

window.salvarEdicaoClube = async function salvarEdicaoClube(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const clube = (banco.clubes || []).find(c => String(c.id) === String(id));
  if (!clube) return;

  try {
    const paisNome = document.getElementById("editPais")?.value || clube.pais || "";
    const pais = typeof buscarPais === "function" ? (buscarPais(paisNome) || {}) : {};
    const estadoNome = paisNome === "Brasil" ? (document.getElementById("editEstado")?.value || "") : "";
    const estadoObj = paisNome === "Brasil" && typeof buscarEstado === "function" ? (buscarEstado(estadoNome) || {}) : { sigla: "" };
    const nomeCurto = document.getElementById("editNome")?.value.trim() || clube.nomeCurto || clube.nome;
    const nomeCompleto = document.getElementById("editNomeCompleto")?.value.trim() || clube.nomeCompleto || nomeCurto;
    const fundacao = typeof fpEdicaoNormalizarData === "function"
      ? fpEdicaoNormalizarData(document.getElementById("editFundacao")?.value || "")
      : (document.getElementById("editFundacao")?.value || "");

    const escudoUrl = await fpUploadEscudoEdicaoFinal("editEscudo", "escudos-times", nomeCompleto || nomeCurto, clube.escudo || "");

    clube.nome = nomeCurto;
    clube.nomeCompleto = nomeCompleto;
    clube.nomeCurto = nomeCurto;
    clube.pais = paisNome;
    clube.bandeira = pais.bandeira || clube.bandeira || "";
    clube.estado = estadoNome;
    clube.siglaEstado = paisNome === "Brasil" ? (document.getElementById("editSiglaEstado")?.value.trim() || estadoObj.sigla || estadoNome || "") : "";
    clube.cidade = document.getElementById("editCidade")?.value.trim() || "";
    clube.fundacao = fundacao || "";
    clube.escudo = escudoUrl || "";

    clube.rivais = [];
    for (let i = 1; i <= 5; i++) {
      const rival = document.getElementById(`editRival${i}`)?.value || "";
      if (rival && !clube.rivais.includes(rival)) clube.rivais.push(rival);
    }

    (banco.titulos || []).forEach(titulo => {
      if (String(titulo.campeaoId) === String(clube.id)) titulo.campeaoNome = clube.nome;
      if (String(titulo.viceId) === String(clube.id)) titulo.viceNome = clube.nome;
    });

    if (typeof sincronizarRivaisBidirecionais === "function") sincronizarRivaisBidirecionais(banco);

    if (typeof fpEdicaoAtualizarTimeSql === "function") {
      await fpEdicaoAtualizarTimeSql(id, clube);
    }

    if (escudoUrl) {
      await fpSalvarEscudoTimeDiretoFinal(id, escudoUrl);
    }

    if (typeof fpSalvarRivaisTimeSql === "function") {
      await fpSalvarRivaisTimeSql(id, clube.rivais || []);
    }

    salvarBanco(banco);

    if (typeof carregarDadosRelacionaisSupabase === "function") {
      await carregarDadosRelacionaisSupabase();
    }

    alert("Time atualizado com sucesso!");
    mostrarEdicao("clubes");
  } catch (erro) {
    console.error("Erro ao salvar time/escudo:", erro);
    alert("Não foi possível salvar o time no Supabase: " + (erro.message || erro));
  }
};

window.salvarEdicaoSelecao = async function salvarEdicaoSelecao(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const selecao = (banco.selecoes || []).find(s => String(s.id) === String(id));
  if (!selecao) return;

  try {
    const escudoUrl = await fpUploadEscudoEdicaoFinal("editEscudo", "escudos-selecoes", selecao.nome || selecao.pais || "selecao", selecao.escudo || "");
    if (escudoUrl) selecao.escudo = escudoUrl;

    if (typeof fpEdicaoAtualizarSelecaoSql === "function") {
      await fpEdicaoAtualizarSelecaoSql(id, selecao);
    }

    if (escudoUrl) {
      await fpSalvarEscudoSelecaoDiretoFinal(id, escudoUrl);
    }

    salvarBanco(banco);
    if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();

    alert("Seleção atualizada com sucesso!");
    mostrarEdicao("selecoes");
  } catch (erro) {
    console.error("Erro ao salvar seleção/escudo:", erro);
    alert("Não foi possível salvar a seleção no Supabase: " + (erro.message || erro));
  }
};

window.salvarEdicaoCompeticao = async function salvarEdicaoCompeticao(event, id) {
  event.preventDefault();

  const banco = carregarBanco();
  const competicao = (banco.competicoes || []).find(c => String(c.id) === String(id));
  if (!competicao) return;

  try {
    const logoUrl = await fpUploadEscudoEdicaoFinal("editEscudo", "logos-competicoes", competicao.nome || "competicao", competicao.escudo || "");
    if (logoUrl) competicao.escudo = logoUrl;

    if (typeof fpEdicaoAtualizarCompeticaoSql === "function") {
      await fpEdicaoAtualizarCompeticaoSql(id, competicao);
    }

    if (logoUrl) {
      await fpSalvarLogoCompeticaoDiretoFinal(id, logoUrl);
    }

    salvarBanco(banco);
    if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();

    alert("Competição atualizada com sucesso!");
    mostrarEdicao("competicoes");
  } catch (erro) {
    console.error("Erro ao salvar competição/logo:", erro);
    alert("Não foi possível salvar a competição no Supabase: " + (erro.message || erro));
  }
};

window.excluirRegistro = excluirRegistro;


/* ===== CORREÇÃO FINAL: edição de campeão/vice respeita clube x seleção ===== */
function fpBuscarParticipanteEdicaoPorCategoria(banco, id, categoria) {
  const chave = String(id || '');
  if (categoria === 'selecao') {
    const s = (banco.selecoes || []).find(item => String(item.id) === chave);
    return s ? { ...s, nome: s.nome || s.pais, pais: s.pais || s.nome || '', tipo: 'selecao' } : null;
  }
  const c = (banco.clubes || []).find(item => String(item.id) === chave);
  return c ? { ...c, tipo: 'clube' } : null;
}

function carregarParticipantesEdicaoTituloSelect(tipo) {
  const banco = carregarBanco();
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const select = document.getElementById(tipo === 'vice' ? 'editVice' : 'editCampeao');
  if (!select) return;
  const atual = select.value;
  let itens;
  if (categoria === 'selecao') {
    itens = (banco.selecoes || []).map(s => ({id:s.id,nome:s.nome||s.pais,tipo:'selecao'}));
  } else {
    const pais = document.getElementById(tipo === 'vice' ? 'editPaisViceTitulo' : 'editPaisCampeaoTitulo')?.value || '';
    itens = (banco.clubes || []).filter(c => !pais || c.pais === pais).map(c => ({id:c.id,nome:c.nome,tipo:'clube'}));
  }
  itens = itens.filter(i => i.id != null && i.nome).sort((a,b)=>String(a.nome).localeCompare(String(b.nome)));
  select.innerHTML = `<option value="">${tipo === 'vice' ? 'Selecione o vice' : 'Selecione o campeão'}</option>` + itens.map(i => `<option value="${i.id}" data-tipo="${i.tipo}">${limparTexto(i.nome)}</option>`).join('');
  if ([...select.options].some(o => String(o.value) === String(atual))) select.value = atual;
}

const fpSalvarEdicaoTituloAnterior = salvarEdicaoTitulo;
salvarEdicaoTitulo = function salvarEdicaoTituloCorrigido(event, id) {
  event.preventDefault();
  const banco = carregarBanco();
  const titulo = (banco.titulos || []).find(t => String(t.id) === String(id));
  if (!titulo) return;
  const ano = document.getElementById('editAno')?.value || '';
  const categoria = document.getElementById('editCategoriaTitulo')?.value || 'clube';
  const competicaoId = document.getElementById('editCompeticaoTitulo')?.value || '';
  const campeaoId = document.getElementById('editCampeao')?.value || '';
  const viceId = document.getElementById('editVice')?.value || '';
  if (!ano || !competicaoId || !campeaoId || !viceId) { alert('Preencha ano, competição, campeão e vice.'); return; }
  if (String(campeaoId) === String(viceId)) { alert(categoria === 'selecao' ? 'Campeão e vice não podem ser a mesma seleção.' : 'Campeão e vice não podem ser o mesmo time.'); return; }
  const competicao = (banco.competicoes || []).find(c => String(c.id) === String(competicaoId));
  const campeao = fpBuscarParticipanteEdicaoPorCategoria(banco, campeaoId, categoria);
  const vice = fpBuscarParticipanteEdicaoPorCategoria(banco, viceId, categoria);
  if (!competicao || !campeao || !vice) { alert('Não foi possível localizar os participantes escolhidos.'); return; }
  titulo.ano = ano;
  titulo.competicaoId = competicao.id;
  titulo.competicaoNome = competicao.nome;
  titulo.abrangencia = competicao.abrangencia;
  titulo.campeaoId = campeao.id;
  titulo.campeaoNome = campeao.nome;
  titulo.campeaoTipo = categoria;
  titulo.viceId = vice.id;
  titulo.viceNome = vice.nome;
  titulo.viceTipo = categoria;
  salvarBanco(banco);
  alert('Campeão e vice atualizados com sucesso!');
  mostrarEdicao('titulos');
};
window.salvarEdicaoTitulo = salvarEdicaoTitulo;
window.carregarParticipantesEdicaoTituloSelect = carregarParticipantesEdicaoTituloSelect;
