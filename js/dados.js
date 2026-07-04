const PAISES_PADRAO = [
  { nome: "Argentina", bandeira: "🇦🇷" },
  { nome: "Bolívia", bandeira: "🇧🇴" },
  { nome: "Brasil", bandeira: "🇧🇷" },
  { nome: "Chile", bandeira: "🇨🇱" },
  { nome: "Colômbia", bandeira: "🇨🇴" },
  { nome: "Equador", bandeira: "🇪🇨" },
  { nome: "Paraguai", bandeira: "🇵🇾" },
  { nome: "Peru", bandeira: "🇵🇪" },
  { nome: "Uruguai", bandeira: "🇺🇾" },
  { nome: "Venezuela", bandeira: "🇻🇪" },
  { nome: "México", bandeira: "🇲🇽" },
  { nome: "Estados Unidos", bandeira: "🇺🇸" },
  { nome: "Canadá", bandeira: "🇨🇦" },
  { nome: "Inglaterra", bandeira: "🏴" },
  { nome: "Espanha", bandeira: "🇪🇸" },
  { nome: "França", bandeira: "🇫🇷" },
  { nome: "Itália", bandeira: "🇮🇹" },
  { nome: "Alemanha", bandeira: "🇩🇪" },
  { nome: "Portugal", bandeira: "🇵🇹" },
  { nome: "Holanda", bandeira: "🇳🇱" },
  { nome: "Bélgica", bandeira: "🇧🇪" },
  { nome: "Croácia", bandeira: "🇭🇷" },
  { nome: "Japão", bandeira: "🇯🇵" },
  { nome: "Coreia do Sul", bandeira: "🇰🇷" },
  { nome: "Arábia Saudita", bandeira: "🇸🇦" },
  { nome: "Egito", bandeira: "🇪🇬" },
  { nome: "Marrocos", bandeira: "🇲🇦" },
  { nome: "Gana", bandeira: "🇬🇭" },
  { nome: "África do Sul", bandeira: "🇿🇦" }
];

const ESTADOS_BRASIL = [
  { nome: "Acre", sigla: "AC" }, { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" }, { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" }, { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" }, { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" }, { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" }, { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" }, { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" }, { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" }, { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" }, { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" }, { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" }, { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" }, { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" }
];

const CONTINENTES = [
  "América do Sul", "América do Norte", "América Central", "Caribe",
  "Europa", "África", "Ásia", "Oceania"
];

const REGIOES = [
  "América do Sul", "América do Norte", "América Central", "Caribe",
  "Europa Ocidental", "Europa Oriental", "Norte da África",
  "África Subsaariana", "Oriente Médio", "Sudeste Asiático"
];

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function dadosIniciais() {
  return {
    paises: PAISES_PADRAO,
    clubes: [
      {
        id: gerarId(),
        nome: "Corinthians",
        nomeCompleto: "Sport Club Corinthians Paulista",
        pais: "Brasil",
        bandeira: "🇧🇷",
        estado: "São Paulo",
        siglaEstado: "SP",
        cidade: "São Paulo",
        fundacao: "1910",
        estadio: "Neo Química Arena",
        capacidade: "49205",
        escudo: "",
        rivais: []
      },
      {
        id: gerarId(),
        nome: "Flamengo",
        nomeCompleto: "Clube de Regatas do Flamengo",
        pais: "Brasil",
        bandeira: "🇧🇷",
        estado: "Rio de Janeiro",
        siglaEstado: "RJ",
        cidade: "Rio de Janeiro",
        fundacao: "1895",
        estadio: "Maracanã",
        capacidade: "78838",
        escudo: "",
        rivais: []
      }
    ],
    selecoes: [
      { id: gerarId(), nome: "Brasil", pais: "Brasil", bandeira: "🇧🇷" },
      { id: gerarId(), nome: "Argentina", pais: "Argentina", bandeira: "🇦🇷" }
    ],
    competicoes: [
      {
        id: gerarId(),
        nome: "Copa do Mundo FIFA",
        tipo: "Copa",
        abrangencia: "Mundial",
        local: "Mundial",
        bandeira: "🌍"
      },
      {
        id: gerarId(),
        nome: "Libertadores",
        tipo: "Copa Continental",
        abrangencia: "Continental",
        continente: "América do Sul",
        local: "América do Sul",
        bandeira: "🌎"
      },
      {
        id: gerarId(),
        nome: "Brasileirão",
        tipo: "Liga",
        abrangencia: "País",
        pais: "Brasil",
        local: "Brasil",
        bandeira: "🇧🇷"
      },
      {
        id: gerarId(),
        nome: "Paulistão",
        tipo: "Estadual",
        abrangencia: "Estadual",
        pais: "Brasil",
        estado: "São Paulo",
        local: "São Paulo",
        bandeira: "🇧🇷"
      }
    ],
    titulos: []
  };
}

function carregarBanco() {
  const salvo = localStorage.getItem("futpedia_v8");
  if (!salvo) {
    const inicial = dadosIniciais();
    localStorage.setItem("futpedia_v8", JSON.stringify(inicial));
    return inicial;
  }

  const banco = JSON.parse(salvo);

  banco.paises ||= PAISES_PADRAO;
  banco.clubes ||= [];
  banco.selecoes ||= [];
  banco.competicoes ||= [];
  banco.titulos ||= [];

  banco.clubes.forEach(clube => {
    clube.rivais ||= [];
    clube.escudo ||= "";
    clube.nomeCompleto ||= clube.nome;
    clube.fundacao = formatarDataFundacao(clube.fundacao);
  });

  banco.selecoes.forEach(selecao => {
    selecao.escudo ||= "";
  });

  banco.competicoes.forEach(competicao => {
    competicao.escudo ||= "";
    competicao.tipo ||= "Não informado";
  });

  return banco;
}

function salvarBanco(banco) {
  localStorage.setItem("futpedia_v8", JSON.stringify(banco));
}

function limparTexto(valor) {
  return String(valor || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

function buscarPais(nome) {
  return PAISES_PADRAO.find(p => p.nome === nome) || { nome, bandeira: "" };
}

function buscarEstado(nome) {
  return ESTADOS_BRASIL.find(e => e.nome === nome) || { nome, sigla: "" };
}

function preencherSelect(id, itens, placeholder, getValue, getText) {
  const select = document.getElementById(id);
  if (!select) return;

  select.innerHTML = `<option value="">${placeholder}</option>`;

  itens.forEach(item => {
    const option = document.createElement("option");
    option.value = getValue(item);
    option.textContent = getText(item);
    select.appendChild(option);
  });
}


const CODIGOS_PAISES = {
  "Argentina": "ar",
  "Bolívia": "bo",
  "Brasil": "br",
  "Chile": "cl",
  "Colômbia": "co",
  "Equador": "ec",
  "Paraguai": "py",
  "Peru": "pe",
  "Uruguai": "uy",
  "Venezuela": "ve",
  "México": "mx",
  "Estados Unidos": "us",
  "Canadá": "ca",
  "Inglaterra": "gb-eng",
  "Espanha": "es",
  "França": "fr",
  "Itália": "it",
  "Alemanha": "de",
  "Portugal": "pt",
  "Holanda": "nl",
  "Bélgica": "be",
  "Croácia": "hr",
  "Japão": "jp",
  "Coreia do Sul": "kr",
  "Arábia Saudita": "sa",
  "Egito": "eg",
  "Marrocos": "ma",
  "Gana": "gh",
  "África do Sul": "za"
};

function bandeiraPaisHTML(nomePais, emoji = "", classe = "bandeira-img") {
  const codigo = CODIGOS_PAISES[nomePais];

  if (!codigo) {
    return emoji ? `<span>${emoji}</span>` : "";
  }

  return `<img class="${classe}" src="https://flagcdn.com/w40/${codigo}.png" alt="Bandeira de ${limparTexto(nomePais)}">`;
}

function bandeiraPaisPequenaHTML(nomePais, emoji = "") {
  return bandeiraPaisHTML(nomePais, emoji, "bandeira-img-pequena");
}


function formatarDataFundacao(valor) {
  if (!valor) return "";

  let texto = String(valor).trim();

  // Se já estiver no formato DD/MM/AAAA
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
    return texto;
  }

  // Se vier no formato AAAA-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [ano, mes, dia] = texto.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  // Se vier apenas com números, exemplo: 01091910
  let numeros = texto.replace(/\D/g, "");

  if (numeros.length === 8) {
    const dia = numeros.slice(0, 2);
    const mes = numeros.slice(2, 4);
    const ano = numeros.slice(4, 8);
    return `${dia}/${mes}/${ano}`;
  }

  // Se for apenas ano, exemplo: 1910
  if (numeros.length === 4) {
    return numeros;
  }

  return texto;
}


function calcularIdadeFundacao(valor) {
  if (!valor) return "";

  const dataFormatada = formatarDataFundacao(valor);
  const partes = dataFormatada.split("/");

  if (partes.length !== 3) return "";

  const dia = Number(partes[0]);
  const mes = Number(partes[1]);
  const ano = Number(partes[2]);

  if (!dia || !mes || !ano) return "";

  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;

  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();

  if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
    idade--;
  }

  if (idade < 0 || !Number.isFinite(idade)) return "";

  return idade;
}

function textoIdadeFundacao(valor) {
  const idade = calcularIdadeFundacao(valor);

  if (idade === "") return "Não informado";

  return `${idade} ano${idade === 1 ? "" : "s"}`;
}
