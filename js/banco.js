
function mostrarEdicao(tipo) {
  const banco = carregarBanco();
  const area = document.getElementById("areaEdicao");
  if (!area) return;

  if (tipo === "clubes") area.innerHTML = tabelaClubes(banco);
  if (tipo === "selecoes") area.innerHTML = tabelaSelecoes(banco);
  if (tipo === "competicoes") area.innerHTML = tabelaCompeticoes(banco);
  if (tipo === "titulos") area.innerHTML = tabelaTitulos(banco);
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
  return tabela(["Seleção", "País", "Ações"], banco.selecoes.map(s => [
    imagemNome(s.escudo, `${bandeiraPaisHTML(s.pais, s.bandeira)} ${s.nome}`, s.bandeira || "🌎"),
    `${bandeiraPaisHTML(s.pais, s.bandeira)} ${s.pais || ""}`,
    botoesEditarExcluir("selecoes", s.id)
  ]));
}

function tabelaCompeticoes(banco) {
  return tabela(["Competição", "Tipo", "Abrangência", "Local", "Ações"], banco.competicoes.map(c => [
    `<span class="link-detalhe" onclick="abrirDetalhesLiga(\'${c.id}\')">${imagemNome(c.escudo, c.nome, "🏆")}</span>`,
    c.tipo || "Não informado",
    c.abrangencia,
    `${c.bandeira || ""} ${c.local || ""}`,
    botoesEditarExcluir("competicoes", c.id)
  ]));
}

function tabelaTitulos(banco) {
  return tabela(["Ano", "Abrangência", "Competição", "Campeão", "Vice", "Ações"], banco.titulos.map(t => [
    t.ano,
    t.abrangencia || "",
    linkLiga(t.competicaoId),
    linkTime(t.campeaoId),
    linkTime(t.viceId),
    botoesEditarExcluir("titulos", t.id)
  ]));
}

function imagemNome(src, nome, fallback) {
  const img = src
    ? `<img class="imagem-mini-tabela" src="${src}" alt="Imagem">`
    : `<span class="imagem-mini-tabela" style="display:inline-flex;align-items:center;justify-content:center;">${fallback}</span>`;
  return `${img}${limparTexto(nome)}`;
}

function tabela(cabecalhos, linhas) {
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
    setTimeout(iniciarMascaraEditFundacao, 50);
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
      <select id="editPais">${opcoesPais}</select>

      <label>Estado</label>
      <select id="editEstado">${opcoesEstado}</select>

      <label>Sigla do Estado</label>
      <input type="text" id="editSiglaEstado" value="${limparTexto(clube.siglaEstado || "")}">

      <label>Cidade</label>
      <input type="text" id="editCidade" value="${limparTexto(clube.cidade || "")}">

      <label>Ano de fundação</label>
      <input type="text" id="editFundacao" placeholder="DD/MM/AAAA" maxlength="10" inputmode="numeric" autocomplete="off" value="${limparTexto(formatarDataFundacao(clube.fundacao) || "")}">

      <label>Estádio</label>
      <input type="text" id="editEstadio" value="${limparTexto(clube.estadio || "")}">

      <label>Capacidade do estádio</label>
      <input type="number" id="editCapacidade" value="${limparTexto(clube.capacidade || "")}">

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
  const opcoesPais = banco.paises.map(p => `<option value="${limparTexto(p.nome)}" ${p.nome === selecao.pais ? "selected" : ""}>${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoSelecao(event, '${selecao.id}')">
      <h2>Editar Seleção</h2>

      ${selecao.escudo ? `<img class="preview-edicao" src="${selecao.escudo}" alt="Escudo atual">` : ""}

      <label>Nome</label>
      <input type="text" id="editNome" value="${limparTexto(selecao.nome)}">

      <label>País</label>
      <select id="editPais">${opcoesPais}</select>

      <label>Cadastrar/Trocar escudo da seleção</label>
      <input type="file" id="editEscudo" accept="image/*">

      <button type="submit">Salvar alterações</button>
      <button type="button" onclick="mostrarEdicao('selecoes')">Cancelar</button>
    </form>
  `;
}

function formularioEditarCompeticao(competicao) {
  return `
    <form class="form-edicao" onsubmit="salvarEdicaoCompeticao(event, '${competicao.id}')">
      <h2>Editar Competição/Liga</h2>

      ${competicao.escudo ? `<img class="preview-edicao" src="${competicao.escudo}" alt="Escudo atual">` : ""}

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

      <label>Abrangência</label>
      <select id="editAbrangencia">
        <option value="Mundial" ${competicao.abrangencia === "Mundial" ? "selected" : ""}>Mundial</option>
        <option value="Continental" ${competicao.abrangencia === "Continental" ? "selected" : ""}>Continental</option>
        <option value="Regional" ${competicao.abrangencia === "Regional" ? "selected" : ""}>Regional</option>
        <option value="País" ${competicao.abrangencia === "País" ? "selected" : ""}>País</option>
        <option value="Estadual" ${competicao.abrangencia === "Estadual" ? "selected" : ""}>Estadual</option>
      </select>

      <label>Local</label>
      <input type="text" id="editLocal" value="${limparTexto(competicao.local || "")}">

      <label>Cadastrar/Trocar escudo da liga/competição</label>
      <input type="file" id="editEscudo" accept="image/*">

      <button type="submit">Salvar alterações</button>
      <button type="button" onclick="mostrarEdicao('competicoes')">Cancelar</button>
    </form>
  `;
}

function formularioEditarTitulo(titulo, banco) {
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
        ${c.id === titulo.competicaoId ? "selected" : ""}
      >
        ${limparTexto(c.nome)}
      </option>
    `).join("");

  const opcoesTimes = banco.clubes
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(c => `
      <option value="${c.id}">
        ${limparTexto(c.nome)} - ${limparTexto(c.bandeira || "")} ${limparTexto(c.pais || "")}
      </option>
    `).join("");

  setTimeout(() => {
    const campeao = document.getElementById("editCampeao");
    const vice = document.getElementById("editVice");

    if (campeao) campeao.value = titulo.campeaoId || "";
    if (vice) vice.value = titulo.viceId || "";

    filtrarCompeticoesEdicaoTitulo();
  }, 50);

  return `
    <form class="form-edicao" onsubmit="salvarEdicaoTitulo(event, '${titulo.id}')">
      <h2>Editar Campeão e Vice</h2>

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

      <label>Time Campeão</label>
      <select id="editCampeao">
        <option value="">Selecione o campeão</option>
        ${opcoesTimes}
      </select>

      <label>Time Vice</label>
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
  const abrangencia = document.getElementById("editAbrangenciaTitulo")?.value || "";
  const competicao = document.getElementById("editCompeticaoTitulo");

  if (!competicao) return;

  let primeiraVisivel = "";

  Array.from(competicao.options).forEach(option => {
    if (!option.value) {
      option.hidden = false;
      return;
    }

    const optionAbrangencia = option.getAttribute("data-abrangencia") || "";
    const mostrar = !abrangencia || optionAbrangencia === abrangencia;

    option.hidden = !mostrar;

    if (mostrar && !primeiraVisivel) primeiraVisivel = option.value;
  });

  const selecionada = competicao.options[competicao.selectedIndex];
  if (selecionada && selecionada.hidden) competicao.value = primeiraVisivel || "";
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
    const estadoNome = document.getElementById("editEstado").value;
    const estadoObj = buscarEstado(estadoNome);

    clube.nome = document.getElementById("editNome").value.trim();
    clube.nomeCompleto = document.getElementById("editNomeCompleto").value.trim() || clube.nome;
    clube.pais = paisNome;
    clube.bandeira = pais.bandeira;
    clube.estado = estadoNome;
    clube.siglaEstado = document.getElementById("editSiglaEstado").value.trim() || estadoObj.sigla || "";
    clube.cidade = document.getElementById("editCidade").value.trim();
    clube.fundacao = formatarDataFundacao(document.getElementById("editFundacao").value);
    clube.estadio = document.getElementById("editEstadio").value.trim();
    clube.capacidade = document.getElementById("editCapacidade").value;

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
    const paisNome = document.getElementById("editPais").value;
    const pais = buscarPais(paisNome);

    selecao.nome = document.getElementById("editNome").value.trim();
    selecao.pais = paisNome;
    selecao.bandeira = pais.bandeira;

    if (novaImagem) selecao.escudo = novaImagem;

    salvarBanco(banco);
    alert("Seleção atualizada com sucesso!");
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
    competicao.tipo = document.getElementById("editTipoCompeticao").value || "Não informado";
    competicao.abrangencia = document.getElementById("editAbrangencia").value;
    competicao.local = document.getElementById("editLocal").value.trim();

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
  const campeao = banco.clubes.find(c => c.id === campeaoId);
  const vice = banco.clubes.find(c => c.id === viceId);

  if (!competicao || !campeao || !vice) {
    alert("Não foi possível encontrar competição, campeão ou vice no banco de dados.");
    return;
  }

  titulo.ano = ano;
  titulo.competicaoId = competicao.id;
  titulo.competicaoNome = competicao.nome;
  titulo.abrangencia = competicao.abrangencia;
  titulo.campeaoId = campeao.id;
  titulo.campeaoNome = campeao.nome;
  titulo.viceId = vice.id;
  titulo.viceNome = vice.nome;

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
