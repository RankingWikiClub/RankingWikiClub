
document.addEventListener("DOMContentLoaded", renderizarCompeticoes);

function renderizarCompeticoes() {
  const banco = carregarBanco();
  const lista = document.getElementById("listaCompeticoes");
  if (!lista) return;

  lista.classList.add("lista-competicoes");

  const competicoes = banco.competicoes
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (competicoes.length === 0) {
    lista.innerHTML = `
      <div class="card">
        <h3>Nenhuma competição cadastrada</h3>
        <p>Cadastre competições na página Cadastros.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = competicoes.map(c => {
    const escudo = c.escudo
      ? `<img class="escudo-competicao-mini" src="${c.escudo}" alt="Escudo de ${limparTexto(c.nome)}">`
      : `<div class="escudo-competicao-placeholder">🏆</div>`;

    return `
      <div class="competicao-linha" onclick="abrirDetalhesLiga('${c.id}')">
        ${escudo}

        <div class="competicao-linha-info">
          <h3>${limparTexto(c.nome)}</h3>
          <p>
            ${limparTexto(c.bandeira || "")} ${limparTexto(c.local || "Local não informado")}
            ${c.tipo ? ` • ${limparTexto(c.tipo)}` : ""}${c.abrangencia ? ` • ${limparTexto(c.abrangencia)}` : ""}
          </p>
        </div>
      </div>
    `;
  }).join("");
}

function abrirCompeticao(id) {
  abrirDetalhesLiga(id);
}

function contarRanking(nomes) {
  const mapa = {};
  nomes.forEach(nome => mapa[nome] = (mapa[nome] || 0) + 1);
  return Object.entries(mapa)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
}
