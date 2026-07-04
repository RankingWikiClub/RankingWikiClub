function inicializarBase() {
  const banco = carregarBanco();

  preencherSelect(
    "pais",
    PAISES_MUNDO_COMPLETO.slice().sort((a, b) => a.nome.localeCompare(b.nome)),
    "Selecione o país",
    p => p.nome,
    p => `${p.nome}`
  );

  preencherSelect(
    "paisCompeticao",
    PAISES_MUNDO_COMPLETO.slice().sort((a, b) => a.nome.localeCompare(b.nome)),
    "Selecione o país da competição",
    p => p.nome,
    p => `${p.nome}`
  );

  preencherSelect(
    "continenteSelecao",
    CONTINENTES,
    "Selecione o continente da seleção",
    c => c,
    c => c
  );

  preencherSelect(
    "paisSelecao",
    [],
    "Selecione primeiro o continente",
    p => p.nome,
    p => p.nome
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
  atualizarStatusInicio();
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
