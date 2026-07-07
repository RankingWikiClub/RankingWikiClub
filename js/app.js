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
  const clubes = banco.clubes.slice().sort((a, b) => a.nome.localeCompare(b.nome));

  for (let i = 1; i <= 5; i++) {
    preencherSelect(
      `rival${i}`,
      clubes,
      `Selecione o Rival ${i}`,
      c => c.id,
      c => `${c.nome} - ${c.pais || ""}`
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
    .sort((a, b) => (a.nome || "").localeCompare(b.nome || "", "pt-BR"));

  if (!clubes.length) {
    lista.innerHTML = `<p class="mensagem-vazia">Nenhum clube faz aniversário hoje.</p>`;
    return;
  }

  lista.innerHTML = clubes.map(clube => {
    const escudo = clube.escudo
      ? `<img src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
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
          <h3>🎂 ${limparTexto(clube.nome)}</h3>
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


function carregarTimesMaisVelhosPorPais() {
  const lista = document.getElementById("listaTimesMaisVelhosPais");
  if (!lista) return;

  const banco = carregarBanco();
  const grupos = new Map();

  (banco.clubes || [])
    .filter(clube => clube && clube.pais && clube.fundacao)
    .forEach(clube => {
      const data = obterDataFundacaoOrdenavel(clube.fundacao);
      if (!data) return;

      const pais = clube.pais || "País não informado";
      const atual = grupos.get(pais);

      if (!atual || data.valor < atual.data.valor || (data.valor === atual.data.valor && (clube.nome || "").localeCompare(atual.clube.nome || "", "pt-BR") < 0)) {
        grupos.set(pais, { clube, data });
      }
    });

  const registros = Array.from(grupos.entries())
    .map(([pais, info]) => ({ pais, ...info }))
    .sort((a, b) => a.pais.localeCompare(b.pais, "pt-BR"));

  if (!registros.length) {
    lista.innerHTML = `<p class="mensagem-vazia">Nenhum clube com data de fundação cadastrada.</p>`;
    return;
  }

  lista.innerHTML = registros.map(({ pais, clube, data }) => {
    const escudo = clube.escudo
      ? `<img src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
      : `<span class="time-velho-fallback">⚽</span>`;

    const bandeira = bandeiraPaisPequenaHTML(pais, clube.bandeira || "");
    const idade = calcularIdadeFundacao(clube.fundacao);
    const idadeTexto = idade !== "" ? ` • ${idade} ano${idade === 1 ? "" : "s"}` : "";

    return `
      <div class="time-velho-card" onclick="abrirDetalhesTime('${clube.id}')">
        <div class="time-velho-escudo">${escudo}</div>
        <div class="time-velho-info">
          <h3>${limparTexto(clube.nome)}</h3>
          <p>${bandeira} ${limparTexto(pais)}</p>
          <p>📅 Fundação: ${limparTexto(formatarDataFundacao(clube.fundacao))}${limparTexto(idadeTexto)}</p>
        </div>
      </div>
    `;
  }).join("");
}

function obterDataFundacaoOrdenavel(valor) {
  if (!valor) return null;
  const data = formatarDataFundacao(valor);
  const texto = String(data || "").trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    const [dia, mes, ano] = texto.split("/").map(Number);
    if (!dia || !mes || !ano) return null;
    return { ano, mes, dia, valor: ano * 10000 + mes * 100 + dia };
  }

  const numeros = texto.replace(/\D/g, "");
  if (numeros.length === 4) {
    const ano = Number(numeros);
    if (!ano) return null;
    return { ano, mes: 0, dia: 0, valor: ano * 10000 };
  }

  return null;
}


function configurarPesquisaInicio() {
  const campo = document.getElementById("pesquisaInicio");
  if (!campo) return;
  campo.addEventListener("input", filtrarConteudoInicio);
}

function filtrarConteudoInicio() {
  const campo = document.getElementById("pesquisaInicio");
  const termo = String(campo?.value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const itens = document.querySelectorAll(".aniversario-card, .time-velho-card, .status-card");

  itens.forEach(item => {
    const texto = item.textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    item.style.display = !termo || texto.includes(termo) ? "" : "none";
  });
}
