
document.addEventListener("DOMContentLoaded", () => {
  const banco = carregarBanco();
  const lista = document.getElementById("listaSelecoes");
  if (!lista) return;

  const selecoesUnicas = removerSelecoesDuplicadas(banco.selecoes)
    .sort((a, b) => (a.pais || a.nome).localeCompare(b.pais || b.nome));

  if (selecoesUnicas.length === 0) {
    lista.innerHTML = `
      <div class="card">
        <h3>Nenhuma seleção cadastrada</h3>
        <p>Cadastre seleções na página Cadastros.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = selecoesUnicas.map(s => {
    const nomePais = s.pais || s.nome || "País não informado";
    const bandeira = typeof bandeiraPaisHTML === "function"
      ? bandeiraPaisHTML(nomePais, s.bandeira || "")
      : (s.bandeira || "");

    return `
      <div class="card selecao-card">
        <h3 class="selecao-nome-pais">
          ${bandeira}
          <span>${limparTexto(nomePais)}</span>
        </h3>
      </div>
    `;
  }).join("");
});

function removerSelecoesDuplicadas(selecoes) {
  const mapa = new Map();

  selecoes.forEach(selecao => {
    const chave = (selecao.pais || selecao.nome || "").trim().toLowerCase();
    if (!chave) return;

    if (!mapa.has(chave)) {
      mapa.set(chave, selecao);
    }
  });

  return Array.from(mapa.values());
}
