
document.addEventListener("DOMContentLoaded", () => {
  carregarFiltrosClubes();
  renderizarClubes();

  const filtroPais = document.getElementById("filtroPaisClubes");
  const filtroEstado = document.getElementById("filtroEstadoClubes");

  if (filtroPais) {
    filtroPais.addEventListener("change", () => {
      atualizarFiltroEstadoClubes();
      renderizarClubes();
    });
  }

  if (filtroEstado) {
    filtroEstado.addEventListener("change", renderizarClubes);
  }
});

function carregarFiltrosClubes() {
  const banco = carregarBanco();

  preencherSelect(
    "filtroPaisClubes",
    banco.paises.slice().sort((a, b) => a.nome.localeCompare(b.nome)),
    "Todos os países",
    p => p.nome,
    p => `${p.bandeira || ""} ${p.nome}`
  );

  preencherSelect(
    "filtroEstadoClubes",
    ESTADOS_BRASIL,
    "Todos os estados",
    e => e.nome,
    e => `${e.nome} - ${e.sigla}`
  );

  atualizarFiltroEstadoClubes();
}

function atualizarFiltroEstadoClubes() {
  const pais = document.getElementById("filtroPaisClubes")?.value || "";
  const grupoEstado = document.getElementById("grupoFiltroEstadoClubes");
  const estado = document.getElementById("filtroEstadoClubes");

  if (!grupoEstado || !estado) return;

  if (pais === "Brasil") {
    grupoEstado.classList.remove("oculto");
  } else {
    grupoEstado.classList.add("oculto");
    estado.value = "";
  }
}

function renderizarClubes() {
  const banco = carregarBanco();
  const lista = document.getElementById("listaClubes");
  if (!lista) return;

  const paisFiltro = document.getElementById("filtroPaisClubes")?.value || "";
  const estadoFiltro = document.getElementById("filtroEstadoClubes")?.value || "";

  let clubes = banco.clubes.slice();

  if (paisFiltro) {
    clubes = clubes.filter(clube => clube.pais === paisFiltro);
  }

  if (paisFiltro === "Brasil" && estadoFiltro) {
    clubes = clubes.filter(clube => clube.estado === estadoFiltro);
  }

  clubes.sort((a, b) => a.nome.localeCompare(b.nome));

  if (clubes.length === 0) {
    lista.innerHTML = `<div class="card"><h3>Nenhum clube encontrado</h3><p>Cadastre novos clubes ou altere os filtros.</p></div>`;
    return;
  }

  lista.classList.add("lista-clubes");

  lista.innerHTML = clubes.map(clube => {
    const escudo = clube.escudo
      ? `<img class="escudo-mini" src="${clube.escudo}" alt="Escudo de ${limparTexto(clube.nome)}">`
      : `<div class="escudo-mini-placeholder">⚽</div>`;

    return `
      <div class="clube-linha" onclick="abrirDetalhesTime(\'${clube.id}\')">
        ${escudo}

        <div class="clube-linha-info">
          <h3>${limparTexto(clube.nome)}</h3>
          <p>
            ${bandeiraPaisHTML(clube.pais, clube.bandeira)} ${limparTexto(clube.pais)}
            ${clube.pais === "Brasil" && clube.siglaEstado ? ` • ${limparTexto(clube.siglaEstado)}` : ""}
            ${clube.fundacao ? ` • Fundação: ${limparTexto(clube.fundacao)}` : ""}
          </p>
        </div>
      </div>
    `;
  }).join("");
}

function abrirClube(id) {
  const banco = carregarBanco();
  const clube = banco.clubes.find(c => c.id === id);
  const box = document.getElementById("detalhesClube");
  const titulo = document.getElementById("tituloClube");
  const info = document.getElementById("infoClube");

  const titulos = banco.titulos.filter(t => t.campeaoId === id);
  const vices = banco.titulos.filter(t => t.viceId === id);
  const rivais = (clube.rivais || [])
    .map(rivalId => banco.clubes.find(c => c.id === rivalId))
    .filter(Boolean);

  titulo.textContent = clube.nome;
  info.innerHTML = `
    ${clube.escudo ? `<img src="${clube.escudo}" alt="Escudo">` : ""}
    <p><strong>País:</strong> ${bandeiraPaisHTML(clube.pais, clube.bandeira)} ${limparTexto(clube.pais)}</p>
    ${clube.pais === "Brasil" ? `<p><strong>Estado:</strong> ${limparTexto(clube.estado || "Não informado")} ${clube.siglaEstado ? `(${limparTexto(clube.siglaEstado)})` : ""}</p>` : ""}
    <p><strong>Cidade:</strong> ${limparTexto(clube.cidade || "Não informado")}</p>
    <p><strong>Fundação:</strong> ${limparTexto(formatarDataFundacao(clube.fundacao) || "Não informado")}</p>
    <p><strong>Estádio:</strong> ${limparTexto(clube.estadio || "Não informado")}</p>
    <p><strong>Capacidade:</strong> ${limparTexto(clube.capacidade || "Não informado")}</p>
    <br>
    <p><strong>Rivais:</strong></p>
    ${
      rivais.length
        ? `<ul class="lista-rivais-detalhes">${rivais.map(r => `
                              <li class="rival-detalhe-item" onclick="abrirDetalhesTime('${r.id}')">
                                ${r.escudo ? `<img class="rival-escudo-mini" src="${r.escudo}" alt="Escudo">` : `<span class="rival-escudo-placeholder">⚽</span>`}
                                <span class="rival-nome">${limparTexto(r.nome)}</span>
                              </li>
                            `).join("")}</ul>`
        : `<p>Nenhum rival cadastrado.</p>`
    }
    <br>
    <p><strong>Títulos:</strong> ${titulos.length}</p>
    ${titulos.map(t => `<p>${limparTexto(t.ano)} - ${limparTexto(t.competicaoNome)} (${limparTexto(t.abrangencia)})</p>`).join("")}
    <br>
    <p><strong>Vice-campeonatos:</strong> ${vices.length}</p>
    ${vices.map(t => `<p>${limparTexto(t.ano)} - ${limparTexto(t.competicaoNome)} (${limparTexto(t.abrangencia)})</p>`).join("")}
  `;

  box.style.display = "block";
}
