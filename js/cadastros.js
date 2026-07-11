

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

  document.getElementById("estado")?.addEventListener("change", () => {
    preencherSiglaClube();
    carregarRivais();
  });

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
  document.getElementById("abrangenciaTitulo")?.addEventListener("change", () => {
    carregarCompeticoesPorAbrangencia();
    sincronizarPaisCampeaoEVicePorAbrangencia("campeao");
  });
  document.getElementById("competicaoTitulo")?.addEventListener("change", () => {
    aplicarPaisDaCompeticaoTitulo();
    carregarParticipantesTituloNoSelect("campeao");
    carregarParticipantesTituloNoSelect("vice");
  });
  document.getElementById("paisCampeaoTitulo")?.addEventListener("change", () => {
    sincronizarPaisCampeaoEVicePorAbrangencia("campeao");
    carregarParticipantesTituloNoSelect("campeao");
    carregarParticipantesTituloNoSelect("vice");
  });
  document.getElementById("paisViceTitulo")?.addEventListener("change", () => {
    sincronizarPaisCampeaoEVicePorAbrangencia("vice");
    carregarParticipantesTituloNoSelect("campeao");
    carregarParticipantesTituloNoSelect("vice");
  });

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
    estado: c.estado || "",
    siglaEstado: c.siglaEstado || "",
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
    "Selecione o país",
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

function obterSiglaEstadoClube(clube) {
  if (!clube) return "";
  return clube.siglaEstado || buscarEstado(clube.estado || "").sigla || "";
}

function formatarNomeClubeComEstado(clube) {
  const sigla = obterSiglaEstadoClube(clube);
  return sigla ? `${clube.nome} — ${sigla}` : clube.nome;
}

function sincronizarPaisCampeaoEVicePorAbrangencia(origem = "campeao") {
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("abrangenciaTitulo")?.value || "";
  if (categoria !== "clube" || abrangencia !== "País") return;

  const paisCampeao = document.getElementById("paisCampeaoTitulo");
  const paisVice = document.getElementById("paisViceTitulo");
  if (!paisCampeao || !paisVice) return;

  if (origem === "vice" && paisVice.value) {
    paisCampeao.value = paisVice.value;
  } else if (paisCampeao.value) {
    paisVice.value = paisCampeao.value;
  }
}

function aplicarPaisDaCompeticaoTitulo() {
  const banco = carregarBanco();
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const competicaoId = document.getElementById("competicaoTitulo")?.value || "";
  const paisCampeao = document.getElementById("paisCampeaoTitulo");
  const paisVice = document.getElementById("paisViceTitulo");

  if (categoria !== "clube" || !competicaoId || !paisCampeao || !paisVice) return;

  const competicao = (banco.competicoes || []).find(c => c.id === competicaoId);
  const paisCompeticao = competicao?.abrangencia === "País" ? (competicao.pais || competicao.local || "") : "";

  if (paisCompeticao) {
    paisCampeao.value = paisCompeticao;
    paisVice.value = paisCompeticao;
  }
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
      : "Selecione primeiro o país";
  }

  preencherSelect(
    selectId,
    participantes,
    placeholder,
    item => item.id,
    item => {
      // No cadastro de campeões/vices, os times brasileiros devem exibir
      // somente o nome do time e a sigla do estado ao lado.
      // Exemplo: Corinthians — SP
      if (categoria === "clube") {
        return formatarNomeClubeComEstado(item);
      }
      return item.nome;
    }
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

function fpNormalizarLocalRival(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function fpEstadoDoClubeRival(clube) {
  return fpNormalizarLocalRival(clube?.siglaEstado || clube?.sigla_estado || clube?.estado || "");
}

function carregarRivais() {
  const banco = carregarBanco();
  const paisSelecionado = document.getElementById("pais")?.value || "";
  const estadoSelecionado = document.getElementById("siglaEstado")?.value || document.getElementById("estado")?.value || "";
  const paisNormalizado = fpNormalizarLocalRival(paisSelecionado);
  const estadoNormalizado = fpNormalizarLocalRival(estadoSelecionado);
  const brasil = paisNormalizado === "brasil";

  const clubesElegiveis = (banco.clubes || [])
    .filter(c => c.id && (c.nome || c.nome_curto || c.nomeCurto))
    .filter(c => fpNormalizarLocalRival(c.pais) === paisNormalizado)
    .filter(c => !brasil || !estadoNormalizado || fpEstadoDoClubeRival(c) === estadoNormalizado);

  for (let i = 1; i <= 5; i++) {
    const selectTime = document.getElementById(`rival${i}`);
    if (!selectTime) continue;

    const valorAtual = selectTime.value || "";
    let placeholder = paisSelecionado
      ? (brasil && !estadoNormalizado ? "Selecione primeiro o estado do time" : `Selecione o Rival ${i}`)
      : "Selecione primeiro o país do time";

    if (paisSelecionado && (!brasil || estadoNormalizado) && clubesElegiveis.length === 0) {
      placeholder = brasil ? "Nenhum time cadastrado neste estado" : "Nenhum time cadastrado neste país";
    }

    fpPreencherSelectTimesComLogo(`rival${i}`, clubesElegiveis, placeholder, valorAtual);
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
    .filter(c => c.id && (c.nome || c.nome_curto || c.nomeCurto))
    .filter(c => pais && c.pais === pais);

  fpPreencherSelectTimesComLogo(
    `rival${indice}`,
    clubes,
    pais ? `Selecione o Rival ${indice}` : `Selecione primeiro o país do Rival ${indice}`,
    valorTime
  );
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
    .filter(c => categoriaCompeticaoCadastro(c) === categoria);

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

  aplicarPaisDaCompeticaoTitulo();
  carregarParticipantesTituloNoSelect("campeao");
  carregarParticipantesTituloNoSelect("vice");
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
  const viceId = document.getElementById("vice").value || "";
  const categoriaFormulario = document.getElementById("categoriaTitulo")?.value || "clube";

  if (!ano || !competicaoId || !campeaoId || !viceId) {
    alert("Preencha ano, competição, campeão e vice.");
    return;
  }

  if (campeaoId === viceId) {
    alert(categoriaFormulario === "selecao" ? "Campeão e vice não podem ser a mesma seleção." : "Campeão e vice não podem ser o mesmo time.");
    return;
  }

  const competicao = banco.competicoes.find(c => String(c.id) === String(competicaoId));
  const campeao = buscarParticipanteTitulo(banco, campeaoId);
  const vice = buscarParticipanteTitulo(banco, viceId);

  if (!competicao || !campeao || !vice) {
    alert("Não foi possível localizar a competição, campeão ou vice selecionado.");
    return;
  }

  const categoriaCompeticaoTitulo = categoriaCompeticaoCadastro(competicao);

  if (categoriaFormulario === "clube") {
    if (categoriaCompeticaoTitulo !== "clube" || campeao.tipo !== "clube" || vice.tipo !== "clube") {
      alert("A categoria da competição precisa combinar com campeão e vice de clubes.");
      return;
    }
  }
  // Para competições de seleções, mantém campeão e vice, mas não bloqueia por conflito de combinação.
  // Isso evita erro quando a competição ou seleção veio do Supabase com categoria/tipo diferente.

  banco.titulos.push({
    id: gerarId(),
    ano,
    competicaoId,
    competicaoNome: competicao.nome,
    abrangencia: competicao.abrangencia,
    campeaoId,
    campeaoNome: campeao.nome,
    campeaoTipo: categoriaFormulario === "selecao" ? "selecao" : campeao.tipo,
    viceId: vice.id,
    viceNome: vice.nome,
    viceTipo: categoriaFormulario === "selecao" ? "selecao" : vice.tipo
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

/* ===== FutPedia Storage + SQL direto nos cadastros ===== */
function fpCadastroCliente() {
  return typeof clienteSupabase === "function" ? clienteSupabase() : null;
}

function fpCadastroNormalizarData(valor) {
  const v = String(valor || "").trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return v;
}

async function fpCadastroBuscarId(tabela, campo, valor) {
  const supabase = fpCadastroCliente();
  if (!supabase || !valor) return null;
  const { data, error } = await supabase
    .from(tabela)
    .select("id")
    .eq(campo, valor)
    .maybeSingle();
  if (error) {
    console.warn(`Não foi possível buscar ${tabela}.${campo}`, error.message || error);
    return null;
  }
  return data?.id || null;
}

async function fpCadastroInserirOuAtualizarTime(dados) {
  const supabase = fpCadastroCliente();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("fp_salvar_time", {
    p_id: null,
    p_pais_nome: dados.pais || null,
    p_nome_curto: dados.nomeCurto || dados.nomeCompleto || null,
    p_nome: dados.nomeCompleto || dados.nomeCurto || null,
    p_fundacao: dados.fundacao || null,
    p_estado: dados.estado || null,
    p_cidade: dados.cidade || null,
    p_escudo_url: dados.escudo || null
  });

  if (error) {
    console.error("Erro RPC fp_salvar_time:", error);
    throw new Error(error.message || "Erro ao salvar time no Supabase.");
  }
  return data || null;
}

async function fpCadastroInserirOuAtualizarSelecao(dados) {
  const supabase = fpCadastroCliente();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("fp_salvar_selecao", {
    p_id: null,
    p_pais_nome: dados.pais || dados.nome || null,
    p_nome: dados.nome || dados.pais || null,
    p_escudo_url: dados.escudo || null
  });

  if (error) {
    console.error("Erro RPC fp_salvar_selecao:", error);
    throw new Error(error.message || "Erro ao salvar seleção no Supabase.");
  }
  return data || null;
}

function fpCadastroAbrangenciaSql(valor) {
  const v = String(valor || "").toLowerCase();
  if (v.includes("mund")) return "mundo";
  if (v.includes("continent")) return "continente";
  if (v.includes("país") || v.includes("pais")) return "pais";
  if (v.includes("sele")) return "continente";
  return v || null;
}

async function fpCadastroInserirOuAtualizarCompeticao(dados) {
  const supabase = fpCadastroCliente();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("fp_salvar_competicao", {
    p_id: null,
    p_nome: dados.nome || null,
    p_tipo: dados.categoria === "selecao" ? "selecoes" : "clubes",
    p_abrangencia: fpCadastroAbrangenciaSql(dados.abrangencia),
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
    throw new Error(error.message || "Erro ao salvar competição no Supabase.");
  }
  return data || null;
}


async function fpCadastroAtualizarEscudoTimeDiretoFinal(timeId, escudoUrl) {
  const supabase = fpCadastroCliente();
  if (!supabase || !timeId || !escudoUrl) return true;

  const { error } = await supabase
    .from("times")
    .update({ escudo_url: escudoUrl })
    .eq("id", Number(timeId));

  if (error) throw error;
  return true;
}

async function fpCadastroAtualizarEscudoSelecaoDiretoFinal(selecaoId, escudoUrl) {
  const supabase = fpCadastroCliente();
  if (!supabase || !selecaoId || !escudoUrl) return true;

  const { error } = await supabase
    .from("selecoes")
    .update({ escudo_url: escudoUrl })
    .eq("id", Number(selecaoId));

  if (error) throw error;
  return true;
}

async function fpCadastroAtualizarLogoCompeticaoDiretoFinal(competicaoId, logoUrl) {
  const supabase = fpCadastroCliente();
  if (!supabase || !competicaoId || !logoUrl) return true;

  const { error } = await supabase
    .from("competicoes")
    .update({ logo_url: logoUrl })
    .eq("id", Number(competicaoId));

  if (error) throw error;
  return true;
}

salvarClube = async function salvarClube() {
  const banco = carregarBanco();
  const nome = document.getElementById("nomeCurto").value.trim();
  const nomeCompleto = document.getElementById("nomeCompleto").value.trim();
  const paisNome = document.getElementById("pais").value;
  const pais = buscarPais(paisNome);

  if (!nome || !nomeCompleto || !paisNome) {
    alert("Preencha o nome curto, o nome completo e o país do time.");
    return;
  }

  try {
    const escudoUrl = await fpUploadImagemInput("escudo", "escudos-times", nomeCompleto || nome);
    const dados = {
      nomeCurto: nome,
      nomeCompleto,
      pais: paisNome,
      estado: document.getElementById("estado").value,
      siglaEstado: document.getElementById("siglaEstado").value,
      cidade: document.getElementById("cidade").value.trim(),
      fundacao: document.getElementById("fundacao").value,
      escudo: escudoUrl,
      rivais: obterRivaisSelecionados()
    };

    const idSql = await fpCadastroInserirOuAtualizarTime(dados);
    if (idSql && escudoUrl) await fpCadastroAtualizarEscudoTimeDiretoFinal(idSql, escudoUrl);
    banco.clubes.push({
      id: idSql ? String(idSql) : gerarId(),
      nome: nomeCompleto,
      nomeCompleto,
      nomeCurto: nome,
      pais: paisNome,
      bandeira: pais.bandeira,
      estado: dados.estado,
      siglaEstado: dados.siglaEstado,
      cidade: dados.cidade,
      fundacao: fpCadastroNormalizarData(dados.fundacao) || "",
      escudo: escudoUrl,
      rivais: dados.rivais
    });

    sincronizarRivaisBidirecionais(banco);
    salvarBanco(banco);
    if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();
    alert("Time cadastrado com sucesso!");
    location.reload();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível cadastrar o time: " + (erro.message || erro));
  }
};

salvarSelecao = async function salvarSelecao() {
  const banco = carregarBanco();
  const continente = document.getElementById("continenteSelecao").value;
  const paisNome = document.getElementById("paisSelecao").value;
  const pais = buscarPaisSelecao(paisNome);

  if (!continente || !paisNome) {
    alert("Selecione o continente e o país da seleção.");
    return;
  }

  try {
    const escudoUrl = await fpUploadImagemInput("escudoSelecao", "escudos-selecoes", paisNome);
    const idSql = await fpCadastroInserirOuAtualizarSelecao({ nome: paisNome, pais: paisNome, escudo: escudoUrl });

    const existenteLocal = banco.selecoes.find(s => String(s.id) === String(idSql) || (s.pais || s.nome) === paisNome);
    if (existenteLocal) {
      existenteLocal.escudo = escudoUrl || existenteLocal.escudo || "";
      existenteLocal.nome = paisNome;
      existenteLocal.pais = paisNome;
      existenteLocal.continente = continente;
    } else {
      banco.selecoes.push({
        id: idSql ? String(idSql) : gerarId(),
        nome: paisNome,
        pais: paisNome,
        continente,
        bandeira: pais.bandeira,
        escudo: escudoUrl
      });
    }

    salvarBanco(banco);
    if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();
    alert("Seleção cadastrada com sucesso!");
    location.reload();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível cadastrar a seleção: " + (erro.message || erro));
  }
};

salvarCompeticao = async function salvarCompeticao() {
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

  try {
    const escudoUrl = await fpUploadImagemInput("escudoCompeticao", "logos-competicoes", nome);
    const competicao = {
      id: gerarId(),
      nome,
      tipo: tipoCompeticao,
      categoria: categoriaCompeticao,
      abrangencia,
      local: "",
      bandeira: "",
      escudo: escudoUrl
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

    const idSql = await fpCadastroInserirOuAtualizarCompeticao({
      ...competicao,
      escudo: escudoUrl,
      organizador: "",
      sigla: "",
      descricao: ""
    });
    if (idSql) competicao.id = String(idSql);

    banco.competicoes.push(competicao);
    salvarBanco(banco);
    if (typeof carregarDadosRelacionaisSupabase === "function") await carregarDadosRelacionaisSupabase();
    alert("Competição cadastrada com sucesso!");
    location.reload();
  } catch (erro) {
    console.error(erro);
    alert("Não foi possível cadastrar a competição: " + (erro.message || erro));
  }
};


// Corrige variações de categoria vindas do Supabase, como "Campeonato de seleções".
function categoriaCompeticaoCadastro(competicao) {
  if (typeof normalizarCategoriaCompeticao === "function") {
    return normalizarCategoriaCompeticao(competicao);
  }
  const texto = String(`${competicao?.categoria || ""} ${competicao?.tipo || ""} ${competicao?.nome || ""}`)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return texto.includes("selec") || texto.includes("copa do mundo") ? "selecao" : "clube";
}


function atualizarCamposTituloSelecao() {
  const grupoPaisVice = document.getElementById("grupoPaisViceTitulo");
  const selectVice = document.getElementById("vice");
  const labelVice = selectVice ? Array.from(document.querySelectorAll("label")).find(l => l.htmlFor === "vice" || l.nextElementSibling === selectVice) : null;

  if (grupoPaisVice) grupoPaisVice.style.display = "";
  if (labelVice) labelVice.style.display = "";
  if (selectVice) selectVice.style.display = "";
}
document.addEventListener("change",(e)=>{
  if(e.target && e.target.id === "categoriaTitulo"){
    atualizarCamposTituloSelecao();
    if (typeof carregarListasTitulo === "function") carregarListasTitulo();
  }
});
document.addEventListener("DOMContentLoaded", atualizarCamposTituloSelecao);


/* ===== CORREÇÃO FINAL: campeão/vice de seleções nunca usa clubes ===== */
function fpBuscarParticipantePorCategoria(banco, id, categoria) {
  const chave = String(id || '');
  if (categoria === 'selecao') {
    const s = (banco.selecoes || []).find(item => String(item.id) === chave);
    return s ? { ...s, nome: s.nome || s.pais, pais: s.pais || s.nome || '', tipo: 'selecao' } : null;
  }
  const c = (banco.clubes || []).find(item => String(item.id) === chave);
  return c ? { ...c, tipo: 'clube' } : null;
}

function listarParticipantesTitulo(banco, selectId = '') {
  const categoria = document.getElementById('categoriaTitulo')?.value || 'clube';
  let participantes = categoria === 'selecao'
    ? (banco.selecoes || []).map(s => ({
        id: s.id,
        nome: s.nome || s.pais,
        pais: s.pais || s.nome || '',
        bandeira: s.bandeira || '',
        tipo: 'selecao'
      }))
    : (banco.clubes || []).map(c => ({
        id: c.id,
        nome: c.nome,
        pais: c.pais || '',
        bandeira: c.bandeira || '',
        estado: c.estado || '',
        siglaEstado: c.siglaEstado || '',
        tipo: 'clube'
      }));

  participantes = participantes.filter(p => p.id != null && p.nome);
  if (categoria === 'clube') {
    const pais = selectId === 'vice'
      ? (document.getElementById('paisViceTitulo')?.value || '')
      : (document.getElementById('paisCampeaoTitulo')?.value || '');
    participantes = pais ? participantes.filter(p => p.pais === pais) : [];
  }
  return participantes.sort((a,b) => String(a.nome).localeCompare(String(b.nome)));
}

function buscarParticipanteTitulo(banco, id) {
  const categoria = document.getElementById('categoriaTitulo')?.value || 'clube';
  return fpBuscarParticipantePorCategoria(banco, id, categoria);
}

const fpSalvarTituloOriginal = salvarTitulo;
salvarTitulo = function salvarTituloCorrigido() {
  const banco = carregarBanco();
  const ano = document.getElementById('ano')?.value || '';
  const competicaoId = document.getElementById('competicaoTitulo')?.value || '';
  const campeaoId = document.getElementById('campeao')?.value || '';
  const viceId = document.getElementById('vice')?.value || '';
  const categoria = document.getElementById('categoriaTitulo')?.value || 'clube';

  if (!ano || !competicaoId || !campeaoId || !viceId) {
    alert('Preencha ano, competição, campeão e vice.');
    return;
  }
  if (String(campeaoId) === String(viceId)) {
    alert(categoria === 'selecao' ? 'Campeão e vice não podem ser a mesma seleção.' : 'Campeão e vice não podem ser o mesmo time.');
    return;
  }

  const competicao = (banco.competicoes || []).find(c => String(c.id) === String(competicaoId));
  const campeao = fpBuscarParticipantePorCategoria(banco, campeaoId, categoria);
  const vice = fpBuscarParticipantePorCategoria(banco, viceId, categoria);
  if (!competicao || !campeao || !vice) {
    alert(categoria === 'selecao'
      ? 'Não foi possível localizar as seleções escolhidas. Atualize a página e selecione novamente.'
      : 'Não foi possível localizar os clubes escolhidos.');
    return;
  }

  banco.titulos.push({
    id: gerarId(),
    ano,
    competicaoId: competicao.id,
    competicaoNome: competicao.nome,
    abrangencia: competicao.abrangencia,
    campeaoId: campeao.id,
    campeaoNome: campeao.nome,
    campeaoTipo: categoria,
    viceId: vice.id,
    viceNome: vice.nome,
    viceTipo: categoria
  });
  salvarBanco(banco);
  alert('Campeão e vice cadastrados com sucesso!');
  location.reload();
};
window.salvarTitulo = salvarTitulo;
window.listarParticipantesTitulo = listarParticipantesTitulo;
window.buscarParticipanteTitulo = buscarParticipanteTitulo;

/* ===== CORREÇÃO FINAL: ocultar país em campeão/vice de abrangência Continental ===== */
function fpNormalizarTextoTitulo(valor) {
  return String(valor || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function fpContinenteDaCompeticaoTitulo(competicao) {
  if (!competicao) return "";
  if (competicao.continente) return competicao.continente;
  if (competicao.abrangencia === "Continental") return competicao.local || "";
  if (competicao.pais || competicao.local) {
    const pais = typeof buscarPais === "function" ? buscarPais(competicao.pais || competicao.local) : null;
    return pais?.continente || "";
  }
  return "";
}

function atualizarCamposPaisTituloPorAbrangencia() {
  const tipoCadastro = document.getElementById("tipoCadastro")?.value || "";
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("abrangenciaTitulo")?.value || "";
  const mostrarPais = tipoCadastro === "titulo" && categoria === "clube" && abrangencia === "País";

  mostrarGrupo("grupoPaisCampeaoTitulo", mostrarPais);
  mostrarGrupo("grupoPaisViceTitulo", mostrarPais);

  if (!mostrarPais) {
    const paisCampeao = document.getElementById("paisCampeaoTitulo");
    const paisVice = document.getElementById("paisViceTitulo");
    if (paisCampeao) paisCampeao.value = "";
    if (paisVice) paisVice.value = "";
  }
}

carregarPaisesTitulo = function carregarPaisesTituloCorrigido() {
  const banco = carregarBanco();
  const tipoCadastro = document.getElementById("tipoCadastro")?.value || "";
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("abrangenciaTitulo")?.value || "";
  const mostrarPais = tipoCadastro === "titulo" && categoria === "clube" && abrangencia === "País";

  mostrarGrupo("grupoPaisCampeaoTitulo", mostrarPais);
  mostrarGrupo("grupoPaisViceTitulo", mostrarPais);

  if (!mostrarPais) {
    const paisCampeao = document.getElementById("paisCampeaoTitulo");
    const paisVice = document.getElementById("paisViceTitulo");
    if (paisCampeao) paisCampeao.value = "";
    if (paisVice) paisVice.value = "";
    return;
  }

  const paises = listarPaisesComClubes(banco);
  preencherSelect("paisCampeaoTitulo", paises, "Selecione o país", p => p.nome, p => `${p.bandeira || ""} ${p.nome}`);
  preencherSelect("paisViceTitulo", paises, "Selecione o país do vice", p => p.nome, p => `${p.bandeira || ""} ${p.nome}`);
};

listarParticipantesTitulo = function listarParticipantesTituloCorrigido(banco, selectId = "") {
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("abrangenciaTitulo")?.value || "";

  if (categoria === "selecao") {
    return (banco.selecoes || [])
      .map(s => ({
        id: s.id,
        nome: s.nome || s.pais,
        pais: s.pais || s.nome || "",
        bandeira: s.bandeira || "",
        tipo: "selecao"
      }))
      .filter(p => p.id != null && p.nome)
      .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
  }

  let participantes = (banco.clubes || [])
    .map(c => ({
      id: c.id,
      nome: c.nome,
      pais: c.pais || "",
      bandeira: c.bandeira || "",
      estado: c.estado || "",
      siglaEstado: c.siglaEstado || "",
      tipo: "clube"
    }))
    .filter(p => p.id != null && p.nome);

  if (abrangencia === "País") {
    const pais = selectId === "vice"
      ? (document.getElementById("paisViceTitulo")?.value || "")
      : (document.getElementById("paisCampeaoTitulo")?.value || "");
    participantes = pais ? participantes.filter(p => p.pais === pais) : [];
  } else if (abrangencia === "Continental") {
    const competicaoId = document.getElementById("competicaoTitulo")?.value || "";
    const competicao = (banco.competicoes || []).find(c => String(c.id) === String(competicaoId));
    const continente = fpContinenteDaCompeticaoTitulo(competicao);
    if (continente) {
      const continenteNormalizado = fpNormalizarTextoTitulo(continente);
      participantes = participantes.filter(p => {
        const pais = typeof buscarPais === "function" ? buscarPais(p.pais) : null;
        return fpNormalizarTextoTitulo(pais?.continente) === continenteNormalizado;
      });
    }
  }

  return participantes.sort((a, b) => String(a.nome).localeCompare(String(b.nome), "pt-BR"));
};

const fpCarregarParticipantesTituloNoSelectAnterior = carregarParticipantesTituloNoSelect;
carregarParticipantesTituloNoSelect = function carregarParticipantesTituloNoSelectCorrigido(selectId) {
  const tipoCadastro = document.getElementById("tipoCadastro")?.value || "";
  const banco = carregarBanco();
  const categoria = document.getElementById("categoriaTitulo")?.value || "clube";
  const abrangencia = document.getElementById("abrangenciaTitulo")?.value || "";
  const participantes = tipoCadastro === "titulo" ? listarParticipantesTitulo(banco, selectId) : [];

  let placeholder = selectId === "vice" ? "Selecione o vice" : "Selecione o campeão";
  if (categoria === "clube" && abrangencia === "País") {
    const paisSelecionado = selectId === "vice"
      ? (document.getElementById("paisViceTitulo")?.value || "")
      : (document.getElementById("paisCampeaoTitulo")?.value || "");
    if (!paisSelecionado) {
      placeholder = selectId === "vice" ? "Selecione primeiro o país do vice" : "Selecione primeiro o país";
    }
  }

  preencherSelect(
    selectId,
    participantes,
    placeholder,
    item => item.id,
    item => categoria === "clube" ? formatarNomeClubeComEstado(item) : `${item.bandeira || ""} ${item.nome}`
  );
};

function fpAtualizarTituloAposMudancaAbrangencia() {
  atualizarCamposPaisTituloPorAbrangencia();
  carregarPaisesTitulo();
  carregarCompeticoesPorAbrangencia();
  carregarParticipantesTituloNoSelect("campeao");
  carregarParticipantesTituloNoSelect("vice");
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarCamposPaisTituloPorAbrangencia();

  const abrangencia = document.getElementById("abrangenciaTitulo");
  if (abrangencia && !abrangencia.dataset.fpPaisContinentalCorrigido) {
    abrangencia.dataset.fpPaisContinentalCorrigido = "1";
    abrangencia.addEventListener("change", fpAtualizarTituloAposMudancaAbrangencia);
  }

  const competicao = document.getElementById("competicaoTitulo");
  if (competicao && !competicao.dataset.fpContinenteParticipantesCorrigido) {
    competicao.dataset.fpContinenteParticipantesCorrigido = "1";
    competicao.addEventListener("change", () => {
      carregarParticipantesTituloNoSelect("campeao");
      carregarParticipantesTituloNoSelect("vice");
    });
  }
});

window.atualizarCamposPaisTituloPorAbrangencia = atualizarCamposPaisTituloPorAbrangencia;
window.carregarPaisesTitulo = carregarPaisesTitulo;
window.listarParticipantesTitulo = listarParticipantesTitulo;
window.carregarParticipantesTituloNoSelect = carregarParticipantesTituloNoSelect;
