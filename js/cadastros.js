

const TIPOS_COMPETICAO_CLUBES = [
  ["", "Selecione o tipo da competição"],
  ["Copa Nacional", "Copa Nacional"],
  ["Liga Nacional", "Liga Nacional"],
  ["Campeonato Estadual", "Campeonato Estadual"],
  ["Copa Regional", "Copa Regional"],
  ["Copa Estadual", "Copa Estadual"],
  ["Campeonato Continental", "Campeonato Continental"],
  ["Campeonato Mundial", "Campeonato Mundial"],
  ["Campeonato Interestadual", "Campeonato Interestadual"],
  ["Campeonato Intercontinental", "Campeonato Intercontinental"]
];

const TIPOS_COMPETICAO_SELECOES = [
  ["", "Selecione o tipo da competição"],
  ["Copa Continental de Seleções", "Copa Continental de Seleções"],
  ["Copa das Confederações", "Copa das Confederações"],
  ["Finalíssima", "Finalíssima"],
  ["Olimpíadas", "Olimpíadas"],
  ["Copa do Mundo", "Copa do Mundo"]
];

function atualizarTiposCompeticao() {
  const select = document.getElementById("tipoCompeticao");
  if (!select) return;

  const valorAtual = select.value;
  const categoria = document.getElementById("categoriaCompeticao")?.value || "clube";
  const tipos = categoria === "selecao" ? TIPOS_COMPETICAO_SELECOES : TIPOS_COMPETICAO_CLUBES;

  select.innerHTML = tipos
    .map(([valor, texto]) => `<option value="${valor}">${texto}</option>`)
    .join("");

  if (tipos.some(([valor]) => valor === valorAtual)) {
    select.value = valorAtual;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  if (!form) return;

  mudarTipoCadastro();
  carregarListasTitulo();

  document.getElementById("tipoCadastro")?.addEventListener("change", mudarTipoCadastro);

  document.getElementById("continenteClube")?.addEventListener("change", carregarPaisesClubePorContinente);
  document.getElementById("pais")?.addEventListener("change", () => {
    atualizarEstadoClube();
    carregarRivais();
  });

  for (let i = 1; i <= 5; i++) {
    document.getElementById(`rivalContinente${i}`)?.addEventListener("change", () => carregarPaisesRival(i));
    document.getElementById(`rivalPais${i}`)?.addEventListener("change", () => carregarTimesRival(i));
  }

  document.getElementById("estado")?.addEventListener("change", preencherSiglaClube);

  document.getElementById("continenteSelecao")?.addEventListener("change", carregarPaisesSelecaoPorContinente);
  document.getElementById("paisSelecao")?.addEventListener("change", preencherNomeSelecaoAutomaticamente);

  document.getElementById("categoriaCompeticao")?.addEventListener("change", () => {
    atualizarTiposCompeticao();
    atualizarAbrangenciasCompeticao();
    carregarContinentesCompeticao();
  });
  document.getElementById("abrangencia")?.addEventListener("change", atualizarAbrangenciasCompeticao);
  document.getElementById("paisCompeticao")?.addEventListener("change", carregarCompeticoesDoPais);
  document.getElementById("competicoesPaisExistentes")?.addEventListener("change", preencherNomeComCompeticaoExistente);

  document.getElementById("categoriaTitulo")?.addEventListener("change", () => {
    atualizarAbrangenciasTitulo();
    carregarListasTitulo();
    carregarCompeticoesPorAbrangencia();
  });
  document.getElementById("abrangenciaTitulo")?.addEventListener("change", carregarCompeticoesPorAbrangencia);
  document.getElementById("paisCampeaoTitulo")?.addEventListener("change", () => carregarParticipantesTituloNoSelect("campeao"));
  document.getElementById("paisViceTitulo")?.addEventListener("change", () => carregarParticipantesTituloNoSelect("vice"));

  form.addEventListener("submit", salvarCadastro);
});

function mudarTipoCadastro() {
  const tipo = document.getElementById("tipoCadastro")?.value || "clube";

  mostrarGrupo("grupoNome", false);
  mostrarGrupo("grupoContinenteClube", tipo === "clube");
  mostrarGrupo("grupoPais", tipo === "clube");
  mostrarGrupo("grupoSelecao", tipo === "selecao");
  mostrarGrupo("grupoClube", tipo === "clube");
  mostrarGrupo("grupoCompeticao", tipo === "competicao");
  mostrarGrupo("grupoTitulo", tipo === "titulo");

  carregarPaisesClubePorContinente();
  carregarPaisesSelecaoPorContinente();
  atualizarEstadoClube();
  atualizarTiposCompeticao();
  atualizarAbrangenciasCompeticao();
  carregarListasTitulo();
}

function mostrarGrupo(id, mostrar) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle("oculto", !mostrar);
}

function carregarPaisesClubePorContinente() {
  const tipo = document.getElementById("tipoCadastro")?.value || "";
  const continente = document.getElementById("continenteClube")?.value || "";
  const selectPais = document.getElementById("pais");

  if (!selectPais || tipo !== "clube") return;

  const banco = carregarBanco();
  const paisesBase = banco.paises && banco.paises.length ? banco.paises : PAISES_MUNDO_COMPLETO;

  const paises = paisesBase
    .filter(p => !continente || p.continente === continente)
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome));

  preencherSelect(
    "pais",
    paises,
    continente ? "Selecione o país" : "Selecione primeiro o continente",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );
}

function atualizarEstadoClube() {
  const tipo = document.getElementById("tipoCadastro").value;
  const pais = document.getElementById("pais").value;

  mostrarGrupo("grupoEstadoClube", tipo === "clube" && pais === "Brasil");

  if (pais !== "Brasil") {
    const estado = document.getElementById("estado");
    const sigla = document.getElementById("siglaEstado");
    if (estado) estado.value = "";
    if (sigla) sigla.value = "";
  }
}

function preencherSiglaClube() {
  const estado = buscarEstado(document.getElementById("estado").value);
  document.getElementById("siglaEstado").value = estado.sigla || "";
}

function atualizarAbrangenciasCompeticao() {
  const tipo = document.getElementById("tipoCadastro")?.value || "";
  const categoria = document.getElementById("categoriaCompeticao")?.value || "clube";
  const abrangenciaSelect = document.getElementById("abrangencia");
  const abrangencia = abrangenciaSelect?.value || "";

  if (tipo !== "competicao") {
    mostrarGrupo("grupoAbrangenciaCompeticao", false);
    mostrarGrupo("grupoContinenteCompeticao", false);
    mostrarGrupo("grupoPaisCompeticao", false);
    mostrarGrupo("grupoCompeticoesPaisExistentes", false);
    return;
  }

  const ehSelecao = categoria === "selecao";

  mostrarGrupo("grupoAbrangenciaCompeticao", !ehSelecao);

  if (ehSelecao) {
    if (abrangenciaSelect) abrangenciaSelect.value = "";
    mostrarGrupo("grupoContinenteCompeticao", false);
    mostrarGrupo("grupoPaisCompeticao", false);
    mostrarGrupo("grupoCompeticoesPaisExistentes", false);
    const paisCompeticao = document.getElementById("paisCompeticao");
    const lista = document.getElementById("competicoesPaisExistentes");
    if (paisCompeticao) paisCompeticao.value = "";
    if (lista) lista.innerHTML = `<option value="">Nenhuma competição selecionada</option>`;
    return;
  }

  mostrarGrupo("grupoContinenteCompeticao", abrangencia === "Continental");
  mostrarGrupo("grupoPaisCompeticao", abrangencia === "País");
  mostrarGrupo("grupoCompeticoesPaisExistentes", abrangencia === "País");

  if (abrangencia !== "País") {
    const paisCompeticao = document.getElementById("paisCompeticao");
    const lista = document.getElementById("competicoesPaisExistentes");
    if (paisCompeticao) paisCompeticao.value = "";
    if (lista) lista.innerHTML = `<option value="">Nenhuma competição selecionada</option>`;
  } else {
    carregarCompeticoesDoPais();
  }
}


function carregarContinentesCompeticao() {
  preencherSelect(
    "continenteCompeticao",
    CONTINENTES,
    "Selecione um continente",
    c => c,
    c => c
  );
}

function carregarPaisesSelecaoPorContinente() {
  const tipo = document.getElementById("tipoCadastro")?.value || "";
  const continente = document.getElementById("continenteSelecao")?.value || "";
  const selectPais = document.getElementById("paisSelecao");

  if (!selectPais || tipo !== "selecao") return;

  const banco = carregarBanco();
  const paisesBase = banco.paises && banco.paises.length ? banco.paises : PAISES_MUNDO_COMPLETO;

  const paises = paisesBase
    .filter(p => !continente || p.continente === continente)
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome));

  preencherSelect(
    "paisSelecao",
    paises,
    continente ? "Selecione o país da seleção" : "Selecione primeiro o continente",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );
}

function preencherNomeSelecaoAutomaticamente() {
  const paisNome = document.getElementById("paisSelecao")?.value || "";
  const campoNome = document.getElementById("nome");

  if (campoNome && paisNome) {
    campoNome.value = paisNome;
  }
}

function listarParticipantesTitulo(banco, selectId = "") {
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";

  const clubes = (banco.clubes || []).map(c => ({
    id: c.id,
    nome: c.nome,
    pais: c.pais || "",
    bandeira: c.bandeira || "",
    tipo: "clube"
  }));

  const selecoes = (banco.selecoes || []).map(s => ({
    id: s.id,
    nome: s.nome || s.pais,
    pais: s.pais || s.nome || "",
    bandeira: s.bandeira || "",
    tipo: "selecao"
  }));

  let participantes = [...clubes, ...selecoes]
    .filter(item => item.id && item.nome)
    .filter(item => item.tipo === categoria);

  // Somente na escolha dos clubes campeões/vices: primeiro seleciona o país,
  // depois aparecem apenas os clubes cadastrados daquele país.
  if (categoria === "clube") {
    const paisFiltro = selectId === "vice"
      ? (document.getElementById("paisViceTitulo")?.value || "")
      : (document.getElementById("paisCampeaoTitulo")?.value || "");

    if (paisFiltro) {
      participantes = participantes.filter(item => item.pais === paisFiltro);
    } else {
      participantes = [];
    }
  }

  return participantes.sort((a, b) => a.nome.localeCompare(b.nome));
}

function listarPaisesComClubes(banco) {
  const mapa = new Map();

  (banco.clubes || []).forEach(clube => {
    if (!clube.pais) return;
    const pais = buscarPais(clube.pais);
    mapa.set(clube.pais, {
      nome: clube.pais,
      bandeira: clube.bandeira || pais.bandeira || ""
    });
  });

  return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome));
}

function carregarPaisesTitulo() {
  const banco = carregarBanco();
  const tipoCadastro = document.getElementById("tipoCadastro")?.value || "";
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  // Mostra a escolha de país somente no cadastro de Campeão e Vice de competição.
  // Não interfere nas abrangências/campos de Time, Competição ou Seleção.
  const mostrarPaises = tipoCadastro === "titulo" && categoria === "clube";

  mostrarGrupo("grupoPaisCampeaoTitulo", mostrarPaises);
  mostrarGrupo("grupoPaisViceTitulo", mostrarPaises);

  if (!mostrarPaises) {
    const paisCampeao = document.getElementById("paisCampeaoTitulo");
    const paisVice = document.getElementById("paisViceTitulo");
    if (paisCampeao) paisCampeao.value = "";
    if (paisVice) paisVice.value = "";
    return;
  }

  const paises = listarPaisesComClubes(banco);

  preencherSelect(
    "paisCampeaoTitulo",
    paises,
    "Selecione o país do campeão",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );

  preencherSelect(
    "paisViceTitulo",
    paises,
    "Selecione o país do vice",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );
}

function buscarParticipanteTitulo(banco, id) {
  const clube = (banco.clubes || []).find(c => c.id === id);
  if (clube) return { ...clube, tipo: "clube" };

  const selecao = (banco.selecoes || []).find(s => s.id === id);
  if (selecao) return { ...selecao, nome: selecao.nome || selecao.pais, tipo: "selecao" };

  return null;
}

function atualizarAbrangenciasTitulo() {
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const grupoAbrangencia = document.getElementById("grupoAbrangenciaTitulo");
  const selectAbrangencia = document.getElementById("abrangenciaTitulo");

  if (!grupoAbrangencia || !selectAbrangencia) return;

  const ehSelecao = categoria === "selecao";
  grupoAbrangencia.classList.toggle("oculto", ehSelecao);

  if (ehSelecao) {
    selectAbrangencia.value = "";
    return;
  }

  const valorAtual = selectAbrangencia.value;
  selectAbrangencia.innerHTML = `
    <option value="">Selecione a abrangência</option>
    <option value="Mundial">Mundo</option>
    <option value="Continental">Continente</option>
    <option value="País">País</option>
  `;

  if (["Mundial", "Continental", "País"].includes(valorAtual)) {
    selectAbrangencia.value = valorAtual;
  }
}

function carregarParticipantesTituloNoSelect(selectId) {
  const tipoCadastro = document.getElementById("tipoCadastro")?.value || "";
  const banco = carregarBanco();
  const participantes = tipoCadastro === "titulo" ? listarParticipantesTitulo(banco, selectId) : [];
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const paisSelecionado = selectId === "vice"
    ? (document.getElementById("paisViceTitulo")?.value || "")
    : (document.getElementById("paisCampeaoTitulo")?.value || "");

  let placeholder = selectId === "vice" ? "Selecione o vice" : "Selecione o campeão";

  if (categoria === "clube" && !paisSelecionado) {
    placeholder = selectId === "vice"
      ? "Selecione primeiro o país do vice"
      : "Selecione primeiro o país do campeão";
  }

  preencherSelect(
    selectId,
    participantes,
    placeholder,
    item => item.id,
    item => item.nome
  );
}

function carregarListasTitulo() {
  atualizarAbrangenciasTitulo();
  carregarPaisesTitulo();
  carregarParticipantesTituloNoSelect("campeao");
  carregarParticipantesTituloNoSelect("vice");
  carregarCompeticoesPorAbrangencia();
  carregarRivais();
}

function carregarRivais() {
  const banco = carregarBanco();
  const clubes = (banco.clubes || []).filter(c => c.id && c.nome && c.pais);

  const continentes = [...new Set(clubes
    .map(c => obterContinenteDoPais(c.pais))
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  for (let i = 1; i <= 5; i++) {
    const selectContinente = document.getElementById(`rivalContinente${i}`);
    const valorContinente = selectContinente?.value || "";

    preencherSelect(
      `rivalContinente${i}`,
      continentes,
      `Selecione o continente do Rival ${i}`,
      c => c,
      c => c
    );

    if (valorContinente && continentes.includes(valorContinente)) {
      document.getElementById(`rivalContinente${i}`).value = valorContinente;
    }

    carregarPaisesRival(i, true);
  }
}

function obterContinenteDoPais(nomePais) {
  if (!nomePais) return "";

  const banco = carregarBanco();
  const paisBanco = (banco.paises || []).find(p => p.nome === nomePais);
  if (paisBanco?.continente) return paisBanco.continente;

  const paisBase = (typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : [])
    .find(p => p.nome === nomePais);
  if (paisBase?.continente) return paisBase.continente;

  const paisPadrao = (typeof PAISES_PADRAO !== "undefined" ? PAISES_PADRAO : [])
    .find(p => p.nome === nomePais);

  return paisPadrao?.continente || "";
}

function carregarPaisesRival(indice, preservarSelecao = false) {
  const banco = carregarBanco();
  const continente = document.getElementById(`rivalContinente${indice}`)?.value || "";
  const selectPais = document.getElementById(`rivalPais${indice}`);
  const valorPais = preservarSelecao ? (selectPais?.value || "") : "";

  if (!selectPais) return;

  const paises = [...new Set((banco.clubes || [])
    .filter(c => c.id && c.nome && c.pais)
    .filter(c => !continente || obterContinenteDoPais(c.pais) === continente)
    .map(c => c.pais))]
    .map(nome => {
      const pais = buscarPais(nome);
      return { nome, bandeira: pais.bandeira || "" };
    })
    .sort((a, b) => a.nome.localeCompare(b.nome));

  preencherSelect(
    `rivalPais${indice}`,
    paises,
    continente ? `Selecione o país do Rival ${indice}` : `Selecione primeiro o continente do Rival ${indice}`,
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );

  if (valorPais && paises.some(p => p.nome === valorPais)) {
    selectPais.value = valorPais;
  }

  carregarTimesRival(indice, preservarSelecao);
}

function carregarTimesRival(indice, preservarSelecao = false) {
  const banco = carregarBanco();
  const pais = document.getElementById(`rivalPais${indice}`)?.value || "";
  const selectTime = document.getElementById(`rival${indice}`);
  const valorTime = preservarSelecao ? (selectTime?.value || "") : "";

  if (!selectTime) return;

  const clubes = (banco.clubes || [])
    .filter(c => c.id && c.nome)
    .filter(c => pais && c.pais === pais)
    .sort((a, b) => a.nome.localeCompare(b.nome));

  preencherSelect(
    `rival${indice}`,
    clubes,
    pais ? `Selecione o Rival ${indice}` : `Selecione primeiro o país do Rival ${indice}`,
    c => c.id,
    c => c.nome
  );

  if (valorTime && clubes.some(c => c.id === valorTime)) {
    selectTime.value = valorTime;
  }
}


function carregarCompeticoesDoPais() {
  const banco = carregarBanco();
  const paisSelecionado = document.getElementById("paisCompeticao")?.value || "";
  const categoria = document.getElementById("categoriaCompeticao")?.value || "clube";
  const lista = document.getElementById("competicoesPaisExistentes");

  if (!lista) return;

  lista.innerHTML = `<option value="">Competições cadastradas deste país</option>`;

  if (!paisSelecionado) return;

  const competicoes = banco.competicoes
    .filter(c => (c.categoria || "clube") === categoria)
    .filter(c => c.abrangencia === "País" && (c.pais || c.local) === paisSelecionado)
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (competicoes.length === 0) {
    lista.innerHTML = `<option value="">Nenhuma competição cadastrada neste país</option>`;
    return;
  }

  competicoes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nome;
    lista.appendChild(option);
  });
}

function preencherNomeComCompeticaoExistente() {
  const banco = carregarBanco();
  const id = document.getElementById("competicoesPaisExistentes")?.value || "";
  const nomeCampo = document.getElementById("nomeCompeticao");

  if (!id || !nomeCampo) return;

  const competicao = banco.competicoes.find(c => c.id === id);
  if (competicao) nomeCampo.value = competicao.nome;
}

function carregarCompeticoesPorAbrangencia() {
  const banco = carregarBanco();
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("abrangenciaTitulo")?.value || "";

  atualizarAbrangenciasTitulo();

  let lista = banco.competicoes
    .filter(c => (c.categoria || "clube") === categoria);

  if (categoria === "clube") {
    lista = lista.filter(c => !abrangencia || c.abrangencia === abrangencia);
  }

  lista = lista.sort((a, b) => a.nome.localeCompare(b.nome));

  preencherSelect(
    "competicaoTitulo",
    lista,
    categoria === "selecao" ? "Selecione a competição de seleções" : "Selecione a competição",
    c => c.id,
    c => `${c.nome}`
  );
}

function salvarCadastro(e) {
  e.preventDefault();

  const tipo = document.getElementById("tipoCadastro").value;

  if (tipo === "clube") salvarClube();
  if (tipo === "selecao") salvarSelecao();
  if (tipo === "competicao") salvarCompeticao();
  if (tipo === "titulo") salvarTitulo();
}


function salvarClube() {
  const banco = carregarBanco();
  const nome = document.getElementById("nomeCurto").value.trim();
  const nomeCompleto = document.getElementById("nomeCompleto").value.trim();
  const paisNome = document.getElementById("pais").value;
  const pais = buscarPais(paisNome);

  if (!nome || !nomeCompleto || !paisNome) {
    alert("Preencha o nome curto, o nome completo e o país do time.");
    return;
  }

  lerArquivoImagem("escudo", escudo => {
    banco.clubes.push({
      id: gerarId(),
      nome,
      nomeCompleto,
      pais: paisNome,
      bandeira: pais.bandeira,
      estado: document.getElementById("estado").value,
      siglaEstado: document.getElementById("siglaEstado").value,
      cidade: document.getElementById("cidade").value.trim(),
      fundacao: formatarDataFundacao(document.getElementById("fundacao").value),
      escudo,
      rivais: obterRivaisSelecionados()
    });

    sincronizarRivaisBidirecionais(banco);
    salvarBanco(banco);
    alert("Time cadastrado com sucesso!");
    location.reload();
  });
}

function obterRivaisSelecionados() {
  const rivais = [];

  for (let i = 1; i <= 5; i++) {
    const valor = document.getElementById(`rival${i}`)?.value || "";
    if (valor && !rivais.includes(valor)) rivais.push(valor);
  }

  return rivais;
}

function salvarSelecao() {
  const banco = carregarBanco();
  const continente = document.getElementById("continenteSelecao").value;
  const paisNome = document.getElementById("paisSelecao").value;
  const pais = buscarPaisSelecao(paisNome);

  if (!continente || !paisNome) {
    alert("Selecione o continente e o país da seleção.");
    return;
  }

  const jaExiste = banco.selecoes.some(s => (s.pais || s.nome) === paisNome);

  if (jaExiste) {
    alert("Essa seleção já está cadastrada.");
    return;
  }

  lerArquivoImagem("escudoSelecao", escudo => {
    banco.selecoes.push({
      id: gerarId(),
      nome: paisNome,
      pais: paisNome,
      continente,
      bandeira: pais.bandeira,
      escudo
    });

    salvarBanco(banco);
    alert("Seleção cadastrada com sucesso!");
    location.reload();
  });
}

function salvarCompeticao() {
  const banco = carregarBanco();
  const nome = document.getElementById("nomeCompeticao").value.trim();
  const tipoCompeticao = document.getElementById("tipoCompeticao").value;
  const categoriaCompeticao = document.getElementById("categoriaCompeticao")?.value || "clube";
  const abrangenciaCampo = document.getElementById("abrangencia")?.value || "";
  const abrangencia = categoriaCompeticao === "selecao" ? "Seleções" : abrangenciaCampo;
  const paisNome = document.getElementById("paisCompeticao")?.value || "";

  if (!nome || !tipoCompeticao || (categoriaCompeticao === "clube" && !abrangenciaCampo)) {
    alert(categoriaCompeticao === "selecao"
      ? "Preencha o nome e o tipo da competição."
      : "Preencha o nome, o tipo e a abrangência da competição.");
    return;
  }

  lerArquivoImagem("escudoCompeticao", escudo => {
    const competicao = {
      id: gerarId(),
      nome,
      tipo: tipoCompeticao,
      categoria: categoriaCompeticao,
      abrangencia,
      local: "",
      bandeira: "",
      escudo
    };

    if (categoriaCompeticao === "selecao") {
      competicao.local = "Seleções";
      competicao.bandeira = "🏆";
    }

    if (categoriaCompeticao === "clube" && abrangencia === "Mundial") {
      competicao.local = "Mundial";
      competicao.bandeira = "🌍";
    }

    if (categoriaCompeticao === "clube" && abrangencia === "Continental") {
      const continente = document.getElementById("continenteCompeticao").value;
      if (!continente) {
        alert("Selecione o continente.");
        return;
      }

      competicao.continente = continente;
      competicao.local = continente;
      competicao.bandeira = "🌎";
    }

    if (categoriaCompeticao === "clube" && abrangencia === "País") {
      if (!paisNome) {
        alert("Selecione o país.");
        return;
      }

      const pais = buscarPais(paisNome);
      competicao.pais = paisNome;
      competicao.local = paisNome;
      competicao.bandeira = pais.bandeira;
    }

    banco.competicoes.push(competicao);
    salvarBanco(banco);
    alert("Competição cadastrada com sucesso!");
    location.reload();
  });
}

function salvarTitulo() {
  const banco = carregarBanco();
  const ano = document.getElementById("ano").value;
  const competicaoId = document.getElementById("competicaoTitulo").value;
  const campeaoId = document.getElementById("campeao").value;
  const viceId = document.getElementById("vice").value;

  if (!ano || !competicaoId || !campeaoId || !viceId) {
    alert("Preencha ano, competição, campeão e vice.");
    return;
  }

  if (campeaoId === viceId) {
    alert("Campeão e vice não podem ser o mesmo time/seleção.");
    return;
  }

  const competicao = banco.competicoes.find(c => c.id === competicaoId);
  const campeao = buscarParticipanteTitulo(banco, campeaoId);
  const vice = buscarParticipanteTitulo(banco, viceId);

  if (!competicao || !campeao || !vice) {
    alert("Não foi possível localizar a competição, campeão ou vice selecionado.");
    return;
  }

  const categoriaCompeticaoTitulo = competicao.categoria || "clube";
  if (campeao.tipo !== categoriaCompeticaoTitulo || vice.tipo !== categoriaCompeticaoTitulo) {
    alert("A categoria da competição precisa combinar com campeão e vice.");
    return;
  }

  banco.titulos.push({
    id: gerarId(),
    ano,
    competicaoId,
    competicaoNome: competicao.nome,
    abrangencia: competicao.abrangencia,
    campeaoId,
    campeaoNome: campeao.nome,
    campeaoTipo: campeao.tipo,
    viceId,
    viceNome: vice.nome,
    viceTipo: vice.tipo
  });

  salvarBanco(banco);
  alert("Campeão e vice cadastrados com sucesso!");
  location.reload();
}

function lerArquivoImagem(inputId, callback) {
  const arquivo = document.getElementById(inputId)?.files?.[0];

  if (!arquivo) {
    callback("");
    return;
  }

  const reader = new FileReader();
  reader.onload = ev => callback(ev.target.result);
  reader.readAsDataURL(arquivo);
}








// Máscara corrigida do campo Fundação: DD/MM/AAAA + calendário
document.addEventListener("DOMContentLoaded", iniciarCampoFundacao);

function iniciarCampoFundacao() {
  const campoFundacao = document.getElementById("fundacao");
  const calendarioFundacao = document.getElementById("fundacaoCalendario");

  if (!campoFundacao) return;

  campoFundacao.setAttribute("type", "text");
  campoFundacao.setAttribute("maxlength", "10");
  campoFundacao.setAttribute("placeholder", "DD/MM/AAAA");
  campoFundacao.setAttribute("inputmode", "numeric");
  campoFundacao.setAttribute("autocomplete", "off");

  campoFundacao.addEventListener("input", () => {
    campoFundacao.value = aplicarMascaraData(campoFundacao.value);

    if (calendarioFundacao && dataBrasileiraValida(campoFundacao.value)) {
      calendarioFundacao.value = converterDataBrasilParaISO(campoFundacao.value);
    }
  });

  campoFundacao.addEventListener("paste", () => {
    setTimeout(() => {
      campoFundacao.value = aplicarMascaraData(campoFundacao.value);
    }, 10);
  });

  if (calendarioFundacao) {
    calendarioFundacao.addEventListener("change", () => {
      if (!calendarioFundacao.value) return;
      campoFundacao.value = converterDataISOParaBrasil(calendarioFundacao.value);
    });
  }
}

function aplicarMascaraData(valor) {
  let numeros = String(valor || "").replace(/\D/g, "").slice(0, 8);

  if (numeros.length >= 5) {
    return numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
  }

  if (numeros.length >= 3) {
    return numeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
  }

  return numeros;
}

function dataBrasileiraValida(valor) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(valor);
}

function converterDataISOParaBrasil(valor) {
  const partes = valor.split("-");
  if (partes.length !== 3) return "";
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}

function converterDataBrasilParaISO(valor) {
  const partes = valor.split("/");
  if (partes.length !== 3) return "";
  const [dia, mes, ano] = partes;
  return `${ano}-${mes}-${dia}`;
}
