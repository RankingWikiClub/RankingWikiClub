
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
  return tabela(["Time", "País", "Estado", "Fundação", "Rivais", "Ações"], banco.clubes.map(c => [
    `<span class="link-detalhe" onclick="abrirDetalhesTime(\'${c.id}\')">${imagemNome(c.escudo, c.nome, "⚽")}</span>`,
    `${bandeiraPaisHTML(c.pais, c.bandeira)} ${c.pais || ""}`,
    c.siglaEstado || "",
    formatarDataFundacao(c.fundacao) || "",
    (c.rivais || []).map(id => {
      const rival = banco.clubes.find(clube => clube.id === id);
      return rival ? rival.nome : "";
    }).filter(Boolean).join(", "),
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
    }, 50);
  }
  if (tipo === "selecoes") area.innerHTML = formularioEditarSelecao(item, banco);
  if (tipo === "competicoes") area.innerHTML = formularioEditarCompeticao(item);
  if (tipo === "titulos") area.innerHTML = formularioEditarTitulo(item, banco);
}

function formularioEditarClube(clube, banco) {
  const opcoesPais = banco.paises.map(p => `
    <option value="${limparTexto(p.nome)}" ${p.nome === clube.pais ? "selected" : ""}>
      ${p.bandeira || ""} ${limparTexto(p.nome)}
    </option>
  `).join("");

  const opcoesEstado = ESTADOS_BRASIL.map(e => `
    <option value="${limparTexto(e.nome)}" ${e.nome === clube.estado ? "selected" : ""}>
      ${limparTexto(e.nome)} - ${e.sigla}
    </option>
  `).join("");

  function opcoesRivais(valorAtual) {
    return banco.clubes
      .filter(c => c.id !== clube.id)
      .map(c => `
        <option value="${c.id}" ${c.id === valorAtual ? "selected" : ""}>
          ${limparTexto(c.nome)} - ${bandeiraPaisPequenaHTML(c.pais, c.bandeira)} ${limparTexto(c.pais || "")}
        </option>
      `).join("");
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
      <input type="text" id="editNome" value="${limparTexto(clube.nome)}">

      <label>Nome completo do time</label>
      <input type="text" id="editNomeCompleto" value="${limparTexto(clube.nomeCompleto || clube.nome)}">

      <label>País</label>
      <select id="editPais" onchange="atualizarEstadoEdicaoClube()">${opcoesPais}</select>

      <div id="grupoEditEstadoClube" class="grupo">
        <label>Estado</label>
        <select id="editEstado" onchange="preencherSiglaEdicaoClube()">${opcoesEstado}</select>
      </div>

      <div id="grupoEditSiglaEstadoClube" class="grupo">
        <label>Sigla do Estado</label>
        <input type="text" id="editSiglaEstado" value="${limparTexto(clube.siglaEstado || "")}" readonly>
      </div>

      <label>Cidade</label>
      <input type="text" id="editCidade" value="${limparTexto(clube.cidade || "")}">

      <label>Ano de fundação</label>
      <input type="text" id="editFundacao" placeholder="DD/MM/AAAA" maxlength="10" inputmode="numeric" autocomplete="off" value="${limparTexto(formatarDataFundacao(clube.fundacao) || "")}">


      <label>Rival 1</label>
      <select id="editRival1"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[0] || "")}</select>

      <label>Rival 2</label>
      <select id="editRival2"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[1] || "")}</select>

      <label>Rival 3</label>
      <select id="editRival3"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[2] || "")}</select>

      <label>Rival 4</label>
      <select id="editRival4"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[3] || "")}</select>

      <label>Rival 5</label>
      <select id="editRival5"><option value="">Sem rival</option>${opcoesRivais(rivaisAtuais[4] || "")}</select>

      <button type="submit">Salvar alterações do time</button>
      <button type="button" onclick="mostrarEdicao('clubes')">Cancelar</button>
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

      <button type="submit">Salvar escudo</button>
      <button type="button" onclick="mostrarEdicao('selecoes')">Cancelar</button>
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
      <select id="editCategoriaCompeticao">
        <option value="clube" ${categoriaAtual === "clube" ? "selected" : ""}>Competição de clubes</option>
        <option value="selecao" ${categoriaAtual === "selecao" ? "selected" : ""}>Competição de seleções</option>
      </select>

      <label>Abrangência da competição</label>
      <select id="editAbrangencia" onchange="atualizarCamposAbrangenciaEdicaoCompeticao()">
        ${opcoesAbrangenciaEdicao(competicao.abrangencia)}
      </select>

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

      <button type="submit">Salvar alterações</button>
      <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
    </form>
  `;
}

function atualizarCamposAbrangenciaEdicaoCompeticao() {
  const abrangencia = document.getElementById("editAbrangencia")?.value || "";
  const grupoContinente = document.getElementById("grupoEditContinenteCompeticao");
  const grupoPais = document.getElementById("grupoEditPaisCompeticao");

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
    alert("Time atualizado com sucesso!");
    mostrarEdicao("clubes");
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
    competicao.abrangencia = document.getElementById("editAbrangencia").value;

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
  const titulo = banco.titulos.find(t => t.id === id);
  if (!titulo) return;

  const ano = document.getElementById("editAno").value;
  const categoria = document.getElementById("editCategoriaTitulo")?.value || "clube";
  const competicaoId = document.getElementById("editCompeticaoTitulo").value;
  const campeaoId = document.getElementById("editCampeao").value;
  const viceId = document.getElementById("editVice").value;

  if (!ano || !competicaoId || !campeaoId || !viceId) {
    alert("Preencha ano, competição, campeão e vice.");
    return;
  }

  if (campeaoId === viceId) {
    alert("Campeão e vice não podem ser o mesmo time.");
    return;
  }

  const competicao = banco.competicoes.find(c => c.id === competicaoId);
  const campeao = buscarParticipanteEdicaoTitulo(banco, campeaoId);
  const vice = buscarParticipanteEdicaoTitulo(banco, viceId);

  if (!competicao || !campeao || !vice) {
    alert("Não foi possível encontrar competição, campeão ou vice no banco de dados.");
    return;
  }

  const categoriaCompeticao = competicao.categoria || normalizarCategoriaCompeticao(competicao) || "clube";
  if (categoriaCompeticao !== categoria || campeao.tipo !== categoria || vice.tipo !== categoria) {
    alert("A categoria da competição precisa combinar com campeão e vice.");
    return;
  }

  titulo.ano = ano;
  titulo.competicaoId = competicao.id;
  titulo.competicaoNome = competicao.nome;
  titulo.abrangencia = competicao.abrangencia;
  titulo.campeaoId = campeao.id;
  titulo.campeaoNome = campeao.nome;
  titulo.campeaoTipo = campeao.tipo;
  titulo.viceId = vice.id;
  titulo.viceNome = vice.nome;
  titulo.viceTipo = vice.tipo;

  salvarBanco(banco);
  alert("Campeão e vice atualizados com sucesso!");
  mostrarEdicao("titulos");
}

function excluirRegistro(tipo, id) {
  if (!confirm("Deseja excluir este registro?")) return;

  const banco = carregarBanco();
  banco[tipo] = banco[tipo].filter(item => item.id !== id);

  if (tipo === "competicoes") banco.titulos = banco.titulos.filter(t => t.competicaoId !== id);

  if (tipo === "clubes") {
    banco.titulos = banco.titulos.filter(t => t.campeaoId !== id && t.viceId !== id);
    banco.clubes.forEach(clube => {
      clube.rivais = (clube.rivais || []).filter(rivalId => rivalId !== id);
    });
  }

  salvarBanco(banco);
  alert("Registro excluído com sucesso.");
  location.reload();
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
  } else {
    preencherSiglaEdicaoClube();
  }
}

function preencherSiglaEdicaoClube() {
  const estadoNome = document.getElementById("editEstado")?.value || "";
  const sigla = document.getElementById("editSiglaEstado");
  const estado = buscarEstado(estadoNome);

  if (sigla) sigla.value = estado.sigla || "";
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
      <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
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
      <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
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
  return c?.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : "clube") || "clube";
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
      <button type="submit">Salvar alterações</button><button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
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
function fpFinalCat(c){ return c?.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : "clube") || "clube"; }
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
