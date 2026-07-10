
document.addEventListener("DOMContentLoaded", () => {
  carregarFiltroContinenteSelecoes();
  renderizarSelecoes();

  const filtro = document.getElementById("filtroContinenteSelecao");
  if (filtro) filtro.addEventListener("change", renderizarSelecoes);
});

function carregarFiltroContinenteSelecoes() {
  const filtro = document.getElementById("filtroContinenteSelecao");
  if (!filtro) return;

  filtro.innerHTML = `<option value="">Todos os continentes</option>`;

  CONTINENTES.forEach(continente => {
    const option = document.createElement("option");
    option.value = continente;
    option.textContent = continente;
    filtro.appendChild(option);
  });
}

function renderizarSelecoes() {
  const banco = carregarBanco();
  const lista = document.getElementById("listaSelecoes");
  if (!lista) return;

  const filtro = document.getElementById("filtroContinenteSelecao")?.value || "";
  const termoPesquisa = normalizarTextoBusca(document.getElementById("pesquisaSelecoes")?.value || "");

  const selecoes = removerSelecoesDuplicadas(banco.selecoes)
    .filter(s => {
      if (filtro && s.continente !== filtro) return false;
      if (!termoPesquisa) return true;
      return normalizarTextoBusca([s.nome, s.pais, s.continente].join(" ")).includes(termoPesquisa);
    })
    .sort((a, b) => (a.continente || "").localeCompare(b.continente || "") || (a.pais || a.nome).localeCompare(b.pais || b.nome));

  if (selecoes.length === 0) {
    lista.innerHTML = `
      <div class="card">
        <h3>Nenhuma seleção encontrada</h3>
        <p>Cadastre seleções na página Cadastros ou altere o filtro.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = selecoes.map(s => {
    const nomePais = s.pais || s.nome || "País não informado";
    const bandeira = typeof bandeiraPaisHTML === "function"
      ? bandeiraPaisHTML(nomePais, s.bandeira || "")
      : (s.bandeira || "");

    return `
      <div class="selecao-lista-item" onclick="abrirDetalhesSelecao('${s.id}')">
        ${
          typeof fpHtmlLogo === "function"
            ? fpHtmlLogo(s, "selecao", nomePais)
            : (s.escudo ? `<img class="selecao-lista-escudo" src="${s.escudo}" alt="Escudo de ${limparTexto(nomePais)}">` : `<span class="selecao-lista-placeholder">⚽</span>`)
        }
        <div>
          <strong>${bandeira} ${limparTexto(nomePais)}</strong>
          <span>${limparTexto(s.continente || "Sem continente")}</span>
        </div>
      </div>
    `;
  }).join("");
}

function removerSelecoesDuplicadas(selecoes) {
  const mapa = new Map();

  selecoes.forEach(selecao => {
    const chave = (selecao.pais || selecao.nome || "").trim().toLowerCase();
    if (!chave) return;

    if (!mapa.has(chave)) {
      const pais = typeof buscarPaisSelecao === "function"
        ? buscarPaisSelecao(selecao.pais || selecao.nome)
        : {};
      mapa.set(chave, {
        ...selecao,
        continente: selecao.continente || pais.continente || "",
        bandeira: selecao.bandeira || pais.bandeira || ""
      });
    }
  });

  return Array.from(mapa.values());
}


/* Pesquisa principal da página Seleções */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("pesquisaSelecoes")?.addEventListener("input", renderizarSelecoes);
});
