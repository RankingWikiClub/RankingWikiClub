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
  { nome: "Países Baixos", bandeira: "🇳🇱" },
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


const PAISES_MUNDO_COMPLETO = [
  { nome: "Afeganistão", continente: "Ásia", bandeira: "🇦🇫" },
  { nome: "África do Sul", continente: "África", bandeira: "🇿🇦" },
  { nome: "Albânia", continente: "Europa", bandeira: "🇦🇱" },
  { nome: "Alemanha", continente: "Europa", bandeira: "🇩🇪" },
  { nome: "Andorra", continente: "Europa", bandeira: "🇦🇩" },
  { nome: "Angola", continente: "África", bandeira: "🇦🇴" },
  { nome: "Antígua e Barbuda", continente: "Caribe", bandeira: "🇦🇬" },
  { nome: "Arábia Saudita", continente: "Ásia", bandeira: "🇸🇦" },
  { nome: "Argélia", continente: "África", bandeira: "🇩🇿" },
  { nome: "Argentina", continente: "América do Sul", bandeira: "🇦🇷" },
  { nome: "Armênia", continente: "Europa", bandeira: "🇦🇲" },
  { nome: "Austrália", continente: "Oceania", bandeira: "🇦🇺" },
  { nome: "Áustria", continente: "Europa", bandeira: "🇦🇹" },
  { nome: "Azerbaijão", continente: "Europa", bandeira: "🇦🇿" },
  { nome: "Bahamas", continente: "Caribe", bandeira: "🇧🇸" },
  { nome: "Bahrein", continente: "Ásia", bandeira: "🇧🇭" },
  { nome: "Bangladesh", continente: "Ásia", bandeira: "🇧🇩" },
  { nome: "Barbados", continente: "Caribe", bandeira: "🇧🇧" },
  { nome: "Bélgica", continente: "Europa", bandeira: "🇧🇪" },
  { nome: "Belize", continente: "América Central", bandeira: "🇧🇿" },
  { nome: "Benin", continente: "África", bandeira: "🇧🇯" },
  { nome: "Belarus", continente: "Europa", bandeira: "🇧🇾" },
  { nome: "Bolívia", continente: "América do Sul", bandeira: "🇧🇴" },
  { nome: "Bósnia e Herzegovina", continente: "Europa", bandeira: "🇧🇦" },
  { nome: "Botsuana", continente: "África", bandeira: "🇧🇼" },
  { nome: "Brasil", continente: "América do Sul", bandeira: "🇧🇷" },
  { nome: "Brunei", continente: "Ásia", bandeira: "🇧🇳" },
  { nome: "Bulgária", continente: "Europa", bandeira: "🇧🇬" },
  { nome: "Burkina Faso", continente: "África", bandeira: "🇧🇫" },
  { nome: "Burundi", continente: "África", bandeira: "🇧🇮" },
  { nome: "Butão", continente: "Ásia", bandeira: "🇧🇹" },
  { nome: "Cabo Verde", continente: "África", bandeira: "🇨🇻" },
  { nome: "Camarões", continente: "África", bandeira: "🇨🇲" },
  { nome: "Camboja", continente: "Ásia", bandeira: "🇰🇭" },
  { nome: "Canadá", continente: "América do Norte", bandeira: "🇨🇦" },
  { nome: "Catar", continente: "Ásia", bandeira: "🇶🇦" },
  { nome: "Cazaquistão", continente: "Ásia", bandeira: "🇰🇿" },
  { nome: "Chade", continente: "África", bandeira: "🇹🇩" },
  { nome: "Chile", continente: "América do Sul", bandeira: "🇨🇱" },
  { nome: "China", continente: "Ásia", bandeira: "🇨🇳" },
  { nome: "Chipre", continente: "Europa", bandeira: "🇨🇾" },
  { nome: "Colômbia", continente: "América do Sul", bandeira: "🇨🇴" },
  { nome: "Comores", continente: "África", bandeira: "🇰🇲" },
  { nome: "Congo", continente: "África", bandeira: "🇨🇬" },
  { nome: "Coreia do Norte", continente: "Ásia", bandeira: "🇰🇵" },
  { nome: "Coreia do Sul", continente: "Ásia", bandeira: "🇰🇷" },
  { nome: "Costa do Marfim", continente: "África", bandeira: "🇨🇮" },
  { nome: "Costa Rica", continente: "América Central", bandeira: "🇨🇷" },
  { nome: "Croácia", continente: "Europa", bandeira: "🇭🇷" },
  { nome: "Cuba", continente: "Caribe", bandeira: "🇨🇺" },
  { nome: "Curaçao", continente: "Caribe", bandeira: "🇨🇼" },
  { nome: "Dinamarca", continente: "Europa", bandeira: "🇩🇰" },
  { nome: "Djibuti", continente: "África", bandeira: "🇩🇯" },
  { nome: "Dominica", continente: "Caribe", bandeira: "🇩🇲" },
  { nome: "Egito", continente: "África", bandeira: "🇪🇬" },
  { nome: "El Salvador", continente: "América Central", bandeira: "🇸🇻" },
  { nome: "Emirados Árabes Unidos", continente: "Ásia", bandeira: "🇦🇪" },
  { nome: "Equador", continente: "América do Sul", bandeira: "🇪🇨" },
  { nome: "Eritreia", continente: "África", bandeira: "🇪🇷" },
  { nome: "Escócia", continente: "Europa", bandeira: "🏴" },
  { nome: "Eslováquia", continente: "Europa", bandeira: "🇸🇰" },
  { nome: "Eslovênia", continente: "Europa", bandeira: "🇸🇮" },
  { nome: "Espanha", continente: "Europa", bandeira: "🇪🇸" },
  { nome: "Estados Unidos", continente: "América do Norte", bandeira: "🇺🇸" },
  { nome: "Estônia", continente: "Europa", bandeira: "🇪🇪" },
  { nome: "Etiópia", continente: "África", bandeira: "🇪🇹" },
  { nome: "Fiji", continente: "Oceania", bandeira: "🇫🇯" },
  { nome: "Filipinas", continente: "Ásia", bandeira: "🇵🇭" },
  { nome: "Finlândia", continente: "Europa", bandeira: "🇫🇮" },
  { nome: "França", continente: "Europa", bandeira: "🇫🇷" },
  { nome: "Gabão", continente: "África", bandeira: "🇬🇦" },
  { nome: "Gâmbia", continente: "África", bandeira: "🇬🇲" },
  { nome: "Gana", continente: "África", bandeira: "🇬🇭" },
  { nome: "Geórgia", continente: "Europa", bandeira: "🇬🇪" },
  { nome: "Granada", continente: "Caribe", bandeira: "🇬🇩" },
  { nome: "Grécia", continente: "Europa", bandeira: "🇬🇷" },
  { nome: "Guatemala", continente: "América Central", bandeira: "🇬🇹" },
  { nome: "Guiana", continente: "América do Sul", bandeira: "🇬🇾" },
  { nome: "Guiné", continente: "África", bandeira: "🇬🇳" },
  { nome: "Guiné Equatorial", continente: "África", bandeira: "🇬🇶" },
  { nome: "Guiné-Bissau", continente: "África", bandeira: "🇬🇼" },
  { nome: "Haiti", continente: "Caribe", bandeira: "🇭🇹" },
  { nome: "Países Baixos", continente: "Europa", bandeira: "🇳🇱" },
  { nome: "Honduras", continente: "América Central", bandeira: "🇭🇳" },
  { nome: "Hungria", continente: "Europa", bandeira: "🇭🇺" },
  { nome: "Iêmen", continente: "Ásia", bandeira: "🇾🇪" },
  { nome: "Ilhas Salomão", continente: "Oceania", bandeira: "🇸🇧" },
  { nome: "Índia", continente: "Ásia", bandeira: "🇮🇳" },
  { nome: "Indonésia", continente: "Ásia", bandeira: "🇮🇩" },
  { nome: "Inglaterra", continente: "Europa", bandeira: "🏴" },
  { nome: "Irã", continente: "Ásia", bandeira: "🇮🇷" },
  { nome: "Iraque", continente: "Ásia", bandeira: "🇮🇶" },
  { nome: "Irlanda", continente: "Europa", bandeira: "🇮🇪" },
  { nome: "Irlanda do Norte", continente: "Europa", bandeira: "🇬🇧" },
  { nome: "Islândia", continente: "Europa", bandeira: "🇮🇸" },
  { nome: "Israel", continente: "Ásia", bandeira: "🇮🇱" },
  { nome: "Itália", continente: "Europa", bandeira: "🇮🇹" },
  { nome: "Jamaica", continente: "Caribe", bandeira: "🇯🇲" },
  { nome: "Japão", continente: "Ásia", bandeira: "🇯🇵" },
  { nome: "Jordânia", continente: "Ásia", bandeira: "🇯🇴" },
  { nome: "Kosovo", continente: "Europa", bandeira: "🇽🇰" },
  { nome: "Kuwait", continente: "Ásia", bandeira: "🇰🇼" },
  { nome: "Laos", continente: "Ásia", bandeira: "🇱🇦" },
  { nome: "Lesoto", continente: "África", bandeira: "🇱🇸" },
  { nome: "Letônia", continente: "Europa", bandeira: "🇱🇻" },
  { nome: "Líbano", continente: "Ásia", bandeira: "🇱🇧" },
  { nome: "Libéria", continente: "África", bandeira: "🇱🇷" },
  { nome: "Líbia", continente: "África", bandeira: "🇱🇾" },
  { nome: "Liechtenstein", continente: "Europa", bandeira: "🇱🇮" },
  { nome: "Lituânia", continente: "Europa", bandeira: "🇱🇹" },
  { nome: "Luxemburgo", continente: "Europa", bandeira: "🇱🇺" },
  { nome: "Madagascar", continente: "África", bandeira: "🇲🇬" },
  { nome: "Malásia", continente: "Ásia", bandeira: "🇲🇾" },
  { nome: "Malawi", continente: "África", bandeira: "🇲🇼" },
  { nome: "Maldivas", continente: "Ásia", bandeira: "🇲🇻" },
  { nome: "Mali", continente: "África", bandeira: "🇲🇱" },
  { nome: "Malta", continente: "Europa", bandeira: "🇲🇹" },
  { nome: "Marrocos", continente: "África", bandeira: "🇲🇦" },
  { nome: "Maurício", continente: "África", bandeira: "🇲🇺" },
  { nome: "Mauritânia", continente: "África", bandeira: "🇲🇷" },
  { nome: "México", continente: "América do Norte", bandeira: "🇲🇽" },
  { nome: "Moçambique", continente: "África", bandeira: "🇲🇿" },
  { nome: "Moldávia", continente: "Europa", bandeira: "🇲🇩" },
  { nome: "Mongólia", continente: "Ásia", bandeira: "🇲🇳" },
  { nome: "Montenegro", continente: "Europa", bandeira: "🇲🇪" },
  { nome: "Mianmar", continente: "Ásia", bandeira: "🇲🇲" },
  { nome: "Namíbia", continente: "África", bandeira: "🇳🇦" },
  { nome: "Nauru", continente: "Oceania", bandeira: "🇳🇷" },
  { nome: "Nepal", continente: "Ásia", bandeira: "🇳🇵" },
  { nome: "Nicarágua", continente: "América Central", bandeira: "🇳🇮" },
  { nome: "Níger", continente: "África", bandeira: "🇳🇪" },
  { nome: "Nigéria", continente: "África", bandeira: "🇳🇬" },
  { nome: "Noruega", continente: "Europa", bandeira: "🇳🇴" },
  { nome: "Nova Zelândia", continente: "Oceania", bandeira: "🇳🇿" },
  { nome: "Omã", continente: "Ásia", bandeira: "🇴🇲" },
  { nome: "País de Gales", continente: "Europa", bandeira: "🏴" },
  { nome: "Paquistão", continente: "Ásia", bandeira: "🇵🇰" },
  { nome: "Palau", continente: "Oceania", bandeira: "🇵🇼" },
  { nome: "Palestina", continente: "Ásia", bandeira: "🇵🇸" },
  { nome: "Panamá", continente: "América Central", bandeira: "🇵🇦" },
  { nome: "Papua-Nova Guiné", continente: "Oceania", bandeira: "🇵🇬" },
  { nome: "Paraguai", continente: "América do Sul", bandeira: "🇵🇾" },
  { nome: "Peru", continente: "América do Sul", bandeira: "🇵🇪" },
  { nome: "Polônia", continente: "Europa", bandeira: "🇵🇱" },
  { nome: "Porto Rico", continente: "Caribe", bandeira: "🇵🇷" },
  { nome: "Portugal", continente: "Europa", bandeira: "🇵🇹" },
  { nome: "Quênia", continente: "África", bandeira: "🇰🇪" },
  { nome: "Quirguistão", continente: "Ásia", bandeira: "🇰🇬" },
  { nome: "República Centro-Africana", continente: "África", bandeira: "🇨🇫" },
  { nome: "República Democrática do Congo", continente: "África", bandeira: "🇨🇩" },
  { nome: "República Dominicana", continente: "Caribe", bandeira: "🇩🇴" },
  { nome: "Tchéquia", continente: "Europa", bandeira: "🇨🇿" },
  { nome: "Romênia", continente: "Europa", bandeira: "🇷🇴" },
  { nome: "Ruanda", continente: "África", bandeira: "🇷🇼" },
  { nome: "Rússia", continente: "Europa", bandeira: "🇷🇺" },
  { nome: "Samoa", continente: "Oceania", bandeira: "🇼🇸" },
  { nome: "San Marino", continente: "Europa", bandeira: "🇸🇲" },
  { nome: "Santa Lúcia", continente: "Caribe", bandeira: "🇱🇨" },
  { nome: "São Cristóvão e Névis", continente: "Caribe", bandeira: "🇰🇳" },
  { nome: "São Tomé e Príncipe", continente: "África", bandeira: "🇸🇹" },
  { nome: "São Vicente e Granadinas", continente: "Caribe", bandeira: "🇻🇨" },
  { nome: "Senegal", continente: "África", bandeira: "🇸🇳" },
  { nome: "Serra Leoa", continente: "África", bandeira: "🇸🇱" },
  { nome: "Sérvia", continente: "Europa", bandeira: "🇷🇸" },
  { nome: "Seychelles", continente: "África", bandeira: "🇸🇨" },
  { nome: "Singapura", continente: "Ásia", bandeira: "🇸🇬" },
  { nome: "Síria", continente: "Ásia", bandeira: "🇸🇾" },
  { nome: "Somália", continente: "África", bandeira: "🇸🇴" },
  { nome: "Sri Lanka", continente: "Ásia", bandeira: "🇱🇰" },
  { nome: "Suécia", continente: "Europa", bandeira: "🇸🇪" },
  { nome: "Suíça", continente: "Europa", bandeira: "🇨🇭" },
  { nome: "Suriname", continente: "América do Sul", bandeira: "🇸🇷" },
  { nome: "Tailândia", continente: "Ásia", bandeira: "🇹🇭" },
  { nome: "Taiwan", continente: "Ásia", bandeira: "🇹🇼" },
  { nome: "Tanzânia", continente: "África", bandeira: "🇹🇿" },
  { nome: "Togo", continente: "África", bandeira: "🇹🇬" },
  { nome: "Tonga", continente: "Oceania", bandeira: "🇹🇴" },
  { nome: "Trinidad e Tobago", continente: "Caribe", bandeira: "🇹🇹" },
  { nome: "Tunísia", continente: "África", bandeira: "🇹🇳" },
  { nome: "Turcomenistão", continente: "Ásia", bandeira: "🇹🇲" },
  { nome: "Turquia", continente: "Europa", bandeira: "🇹🇷" },
  { nome: "Tuvalu", continente: "Oceania", bandeira: "🇹🇻" },
  { nome: "Ucrânia", continente: "Europa", bandeira: "🇺🇦" },
  { nome: "Uganda", continente: "África", bandeira: "🇺🇬" },
  { nome: "Uruguai", continente: "América do Sul", bandeira: "🇺🇾" },
  { nome: "Uzbequistão", continente: "Ásia", bandeira: "🇺🇿" },
  { nome: "Vanuatu", continente: "Oceania", bandeira: "🇻🇺" },
  { nome: "Venezuela", continente: "América do Sul", bandeira: "🇻🇪" },
  { nome: "Vietnã", continente: "Ásia", bandeira: "🇻🇳" },
  { nome: "Zâmbia", continente: "África", bandeira: "🇿🇲" },
  { nome: "Zimbábue", continente: "África", bandeira: "🇿🇼" }
];

const PAISES_SELECOES = PAISES_MUNDO_COMPLETO;

function buscarPaisSelecao(nome) {
  return PAISES_SELECOES.find(p => p.nome === nome) || buscarPais(nome);
}


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
    paises: PAISES_MUNDO_COMPLETO,
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

const FUTPEDIA_STORAGE_KEY = "futpedia_v8";
let FUTPEDIA_SALVAMENTO_TIMER = null;
let FUTPEDIA_CARREGOU_NUVEM = false;

function prepararBancoFutpedia(banco) {
  banco ||= dadosIniciais();
  banco.paises = PAISES_MUNDO_COMPLETO;
  banco.clubes ||= [];
  banco.selecoes ||= [];
  banco.competicoes ||= [];
  banco.titulos ||= [];

  banco.titulos.forEach(titulo => {
    titulo.campeaoTipo ||= "clube";
    titulo.viceTipo ||= "clube";
  });

  banco.clubes.forEach(clube => {
    clube.rivais ||= [];
    clube.escudo ||= "";
    clube.nomeCompleto ||= clube.nome;
    clube.fundacao = formatarDataFundacao(clube.fundacao);
  });

  banco.selecoes.forEach(selecao => {
    selecao.escudo ||= "";
    const paisSelecao = buscarPaisSelecao(selecao.pais || selecao.nome);
    selecao.continente ||= paisSelecao.continente || "";
    selecao.bandeira ||= paisSelecao.bandeira || "";
    selecao.estadio ||= "";
    selecao.capacidade ||= "";
  });

  banco.competicoes.forEach(competicao => {
    competicao.escudo ||= "";
    competicao.tipo ||= "Não informado";
    competicao.categoria ||= "clube";
  });

  sincronizarRivaisBidirecionais(banco);
  normalizarBancoFutpedia(banco);
  return banco;
}

function carregarBancoLocalBruto() {
  const salvo = localStorage.getItem(FUTPEDIA_STORAGE_KEY);
  if (!salvo) return null;
  try {
    return JSON.parse(salvo);
  } catch (erro) {
    console.warn("Não foi possível ler o banco local do RankingWikiClub.", erro);
    return null;
  }
}

/* Cache em memória: evita reler, converter e normalizar todo o localStorage
   a cada linha de campeão/vice exibida nas telas de detalhes. */
let FUTPEDIA_BANCO_CACHE = null;
let FUTPEDIA_BANCO_CACHE_TEXTO = null;

function invalidarCacheBancoFutpedia() {
  FUTPEDIA_BANCO_CACHE = null;
  FUTPEDIA_BANCO_CACHE_TEXTO = null;
}

function carregarBanco() {
  const salvo = localStorage.getItem(FUTPEDIA_STORAGE_KEY);

  if (FUTPEDIA_BANCO_CACHE && salvo === FUTPEDIA_BANCO_CACHE_TEXTO) {
    return FUTPEDIA_BANCO_CACHE;
  }

  if (!salvo) {
    const inicial = prepararBancoFutpedia(dadosIniciais());
    const textoInicial = JSON.stringify(inicial);
    localStorage.setItem(FUTPEDIA_STORAGE_KEY, textoInicial);
    FUTPEDIA_BANCO_CACHE = inicial;
    FUTPEDIA_BANCO_CACHE_TEXTO = textoInicial;
    return inicial;
  }

  try {
    const preparado = prepararBancoFutpedia(JSON.parse(salvo));
    FUTPEDIA_BANCO_CACHE = preparado;
    FUTPEDIA_BANCO_CACHE_TEXTO = salvo;
    return preparado;
  } catch (erro) {
    console.warn("Não foi possível ler o banco local do RankingWikiClub.", erro);
    const inicial = prepararBancoFutpedia(dadosIniciais());
    const textoInicial = JSON.stringify(inicial);
    localStorage.setItem(FUTPEDIA_STORAGE_KEY, textoInicial);
    FUTPEDIA_BANCO_CACHE = inicial;
    FUTPEDIA_BANCO_CACHE_TEXTO = textoInicial;
    return inicial;
  }
}

function quantidadeRegistrosFutpedia(banco) {
  if (!banco) return 0;
  return (banco.clubes || []).length +
    (banco.selecoes || []).length +
    (banco.competicoes || []).length +
    (banco.titulos || []).length;
}

function salvarBanco(banco) {
  const preparado = prepararBancoFutpedia(banco);

  // Marca a última alteração local. Isso evita que, ao atualizar a página,
  // dados antigos do Supabase sobrescrevam uma edição feita agora.
  preparado.atualizadoLocalEm = new Date().toISOString();

  const textoPreparado = JSON.stringify(preparado);
  localStorage.setItem(FUTPEDIA_STORAGE_KEY, textoPreparado);
  FUTPEDIA_BANCO_CACHE = preparado;
  FUTPEDIA_BANCO_CACHE_TEXTO = textoPreparado;

  clearTimeout(FUTPEDIA_SALVAMENTO_TIMER);
  FUTPEDIA_SALVAMENTO_TIMER = setTimeout(() => {
    salvarBancoNaNuvem(preparado);
  }, 150);
}

async function salvarBancoNaNuvem(banco = carregarBanco()) {
  // O RankingWikiClub usa tabelas relacionais do Supabase.
  // A tabela antiga public.futpedia_dados não é mais utilizada.
  return false;
}

async function carregarBancoDaNuvem() {
  // O carregamento é feito diretamente pelas tabelas relacionais.
  // Mantida apenas por compatibilidade com chamadas antigas.
  return false;
}

function atualizarTelasAposSincronizacao() {
  try {
    if (typeof atualizarStatusInicio === "function") atualizarStatusInicio();
    if (typeof carregarAniversariantesHoje === "function") carregarAniversariantesHoje();
    if (typeof carregarTimesMaisVelhosPorPais === "function") carregarTimesMaisVelhosPorPais();
    if (typeof renderizarClubes === "function") renderizarClubes();
    if (typeof renderizarSelecoes === "function") renderizarSelecoes();
    if (typeof renderizarCompeticoes === "function") renderizarCompeticoes();
    if (typeof carregarEstatisticas === "function") carregarEstatisticas();
    if (typeof renderizarEstatisticas === "function") renderizarEstatisticas();
    if (typeof mostrarEdicao === "function") {
      const ativo = document.querySelector(".edicoes-botoes .ativo")?.dataset?.tipo;
      if (ativo) mostrarEdicao(ativo);
    }
    window.dispatchEvent(new CustomEvent("futpediaBancoSincronizado"));
  } catch (erro) {
    console.warn("Dados sincronizados, mas a tela não pôde ser atualizada automaticamente.", erro);
  }
}



// Carrega dados diretamente das tabelas relacionais do Supabase
// Tabelas usadas: public.times, public.competicoes, public.selecoes, public.paises e public.continentes.
// Isso faz o site enxergar os clubes/seleções/competições importados via SQL Editor.

/* ===== Paginação Supabase: carrega tabelas com mais de 1.000 registros ===== */
async function fpBuscarTodasAsLinhasSupabase(supabase, tabela, colunas = "*", ordenarPor = "id") {
  const tamanhoPagina = 1000;
  const todas = [];
  let inicio = 0;

  while (true) {
    let consulta = supabase
      .from(tabela)
      .select(colunas)
      .range(inicio, inicio + tamanhoPagina - 1);

    if (ordenarPor) {
      consulta = consulta.order(ordenarPor, { ascending: true });
    }

    const { data, error } = await consulta;

    if (error) {
      return { data: todas, error };
    }

    const pagina = data || [];
    todas.push(...pagina);

    if (pagina.length < tamanhoPagina) {
      break;
    }

    inicio += tamanhoPagina;
  }

  return { data: todas, error: null };
}


/* ===== Normalização de nomes de países usados pelo site ===== */
function fpNomePaisCanonico(valor) {
  const original = String(valor || "").trim();
  const normalizado = original
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const aliases = {
    puertorico: "Porto Rico",
    portorico: "Porto Rico",
    Curaçao: "Curaçao",
    curazao: "Curaçao",
    barbados: "Barbados"
  };

  return aliases[normalizado] || original;
}

async function carregarDadosRelacionaisSupabase() {
  const supabase = typeof clienteSupabase === "function" ? clienteSupabase() : null;
  if (!supabase) return false;

  try {
    const [paisesResp, continentesResp, clubesResp, competicoesResp, selecoesResp, rivaisResp, titulosResp] = await Promise.all([
      supabase.from("paises").select("id,nome,sigla,continente_id"),
      supabase.from("continentes").select("id,nome"),
      fpBuscarTodasAsLinhasSupabase(supabase, "times", "*", "nome_curto"),
      fpBuscarTodasAsLinhasSupabase(supabase, "competicoes", "*", "nome"),
      fpBuscarTodasAsLinhasSupabase(supabase, "selecoes", "*", "nome"),
      fpBuscarTodasAsLinhasSupabase(supabase, "time_rivais", "time_id,rival_id", "time_id"),
      fpBuscarTodasAsLinhasSupabase(supabase, "titulos_futpedia", "*", "ano")
    ]);

    const erros = [paisesResp, continentesResp, clubesResp, competicoesResp, selecoesResp]
      .map(r => r.error)
      .filter(Boolean);

    if (rivaisResp?.error) {
      console.warn("Tabela time_rivais ainda não disponível. Execute sql_time_rivais_futpedia.sql para salvar rivais no Supabase.", rivaisResp.error.message || rivaisResp.error);
    }

    if (erros.length) {
      console.warn("Erro ao carregar tabelas relacionais do Supabase:", erros.map(e => e.message || e));
      return false;
    }

    const paises = paisesResp.data || [];
    const continentes = continentesResp.data || [];
    const clubesSql = clubesResp.data || [];
    const competicoesSql = competicoesResp.data || [];
    const selecoesSql = selecoesResp.data || [];
    const rivaisSql = rivaisResp && !rivaisResp.error ? (rivaisResp.data || []) : [];
    const titulosSql = titulosResp && !titulosResp.error ? (titulosResp.data || []) : [];
    if (titulosResp?.error) {
      console.warn("Tabela titulos_futpedia ainda não disponível. Execute sql_criar_titulos_futpedia_definitivo.sql.", titulosResp.error.message || titulosResp.error);
    }

    const mapaContinentes = new Map(continentes.map(c => [String(c.id), c]));
    const mapaPaises = new Map(paises.map(p => [String(p.id), {
      ...p,
      continente: mapaContinentes.get(String(p.continente_id))?.nome || ""
    }]));

    function bandeiraPorSigla(sigla) {
      const codigo = String(sigla || "").slice(0, 2).toUpperCase();
      if (codigo.length !== 2) return "";
      return codigo.replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
    }

    function categoriaCompeticao(valor) {
      valor = String(valor || "").toLowerCase();
      if (valor.includes("selec")) return "selecao";
      return "clube";
    }

    function abrangenciaSite(valor) {
      valor = String(valor || "").toLowerCase();
      if (valor === "mundo" || valor === "mundial") return "Mundial";
      if (valor === "continente" || valor === "continental") return "Continental";
      if (valor === "pais" || valor === "país" || valor === "nacional") return "País";
      return valor || "";
    }

    function tipoCompeticaoSite(item) {
      const nome = String(item.nome || "").toLowerCase();
      const nivel = String(item.nivel || "").toLowerCase();
      if (nome.includes("campeonato") || nome.includes("liga") || nome.includes("league") || nome.includes("serie") || nome.includes("série")) return "Liga";
      if (nivel.includes("estadual")) return "Estadual";
      if (nivel.includes("continental")) return "Copa Continental";
      return "Copa";
    }

    const bancoAtual = carregarBancoLocalBruto() || dadosIniciais();
    const banco = prepararBancoFutpedia(bancoAtual);

    banco.clubes = clubesSql.map(t => {
      const pais = mapaPaises.get(String(t.pais_id)) || {};
      return {
        id: String(t.id),
        // Nas listas e páginas gerais o RankingWikiClub Estados Unidos o nome curto.
        // O nome completo fica salvo separadamente e aparece apenas na página de detalhes.
        nome: t.nome_curto || t.nome || "",
        nomeCompleto: t.nome || t.nome_curto || "",
        nomeCurto: t.nome_curto || t.nome || "",
        apelido: t.apelido || "",
        pais: fpNomePaisCanonico(pais.nome || ""),
        continente: pais.continente || "",
        bandeira: bandeiraPorSigla(pais.sigla),
        estado: buscarEstado(t.estado || "").nome || t.estado || "",
        siglaEstado: buscarEstado(t.estado || "").sigla || t.estado || "",
        cidade: t.cidade || "",
        fundacao: t.fundacao || "",
        estadio: t.estadio || "",
        capacidade: t.capacidade_estadio || "",
        escudo: t.escudo_url || "",
        cores: t.cores || "",
        siteOficial: t.site_oficial || "",
        rivais: []
      };
    });

    const mapaClubesPorId = new Map(banco.clubes.map(c => [String(c.id), c]));
    banco.clubes.forEach(c => c.rivais = []);

    rivaisSql.forEach(r => {
      const timeId = String(r.time_id || "");
      const rivalId = String(r.rival_id || "");
      const time = mapaClubesPorId.get(timeId);
      const rival = mapaClubesPorId.get(rivalId);
      if (time && rival && timeId !== rivalId) {
        if (!time.rivais.includes(rivalId)) time.rivais.push(rivalId);
        if (!rival.rivais.includes(timeId)) rival.rivais.push(timeId);
      }
    });

    banco.clubes.forEach(c => {
      c.rivais = (c.rivais || []).filter((id, idx, arr) => id && arr.indexOf(id) === idx);
      c.rivais.sort((a, b) => {
        const ca = mapaClubesPorId.get(String(a));
        const cb = mapaClubesPorId.get(String(b));
        const na = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(ca) : (ca?.nome || "");
        const nb = typeof fpNomeCurtoTime === "function" ? fpNomeCurtoTime(cb) : (cb?.nome || "");
        return na.localeCompare(nb, "pt-BR", { sensitivity: "base" });
      });
    });

    banco.selecoes = selecoesSql.map(s => {
      const pais = mapaPaises.get(String(s.pais_id)) || {};
      return {
        id: String(s.id),
        nome: s.nome || fpNomePaisCanonico(pais.nome || "") || "",
        pais: fpNomePaisCanonico(pais.nome || s.nome || ""),
        continente: pais.continente || "",
        bandeira: bandeiraPorSigla(pais.sigla || s.codigo_fifa),
        escudo: s.escudo_url || "",
        codigoFifa: s.codigo_fifa || "",
        estadio: s.estadio_principal || "",
        capacidade: ""
      };
    });

    banco.competicoes = competicoesSql.map(c => {
      const pais = mapaPaises.get(String(c.pais_id)) || {};
      const continente = mapaContinentes.get(String(c.continente_id)) || {};
      const categoria = categoriaCompeticao(c.tipo);
      const abrangencia = abrangenciaSite(c.abrangencia);
      return {
        id: String(c.id),
        nome: c.nome || "",
        sigla: c.sigla || "",
        categoria,
        tipo: tipoCompeticaoSite(c),
        abrangencia,
        continente: continente.nome || pais.continente || "",
        pais: fpNomePaisCanonico(pais.nome || ""),
        local: pais.nome || continente.nome || (abrangencia === "Mundial" ? "Mundial" : ""),
        bandeira: pais.sigla ? bandeiraPorSigla(pais.sigla) : (abrangencia === "Mundial" ? "🌍" : ""),
        escudo: c.logo_url || "",
        descricao: c.descricao || "",
        organizador: c.organizador || "",
        primeiraEdicao: c.primeira_edicao || "",
        periodicidade: c.periodicidade || "",
        status: c.status || "Ativa"
      };
    });


    banco.titulos = titulosSql.map(t => ({
      id: String(t.id),
      ano: String(t.ano || ""),
      competicaoId: String(t.competicao_id || ""),
      competicaoNome: t.competicao_nome || "",
      abrangencia: t.abrangencia || "",
      campeaoId: String(t.campeao_id || ""),
      campeaoNome: t.campeao_nome || "",
      campeaoTipo: t.campeao_tipo || "clube",
      viceId: String(t.vice_id || ""),
      viceNome: t.vice_nome || "",
      viceTipo: t.vice_tipo || "clube"
    }));

    localStorage.setItem(FUTPEDIA_STORAGE_KEY, JSON.stringify(prepararBancoFutpedia(banco)));
    atualizarTelasAposSincronizacao();
    console.log("RankingWikiClub: dados carregados das tabelas SQL", {
      clubes: banco.clubes.length,
      selecoes: banco.selecoes.length,
      competicoes: banco.competicoes.length
    });
    return true;
  } catch (erro) {
    console.warn("Erro ao carregar dados relacionais do Supabase.", erro);
    return false;
  }
}

window.carregarDadosRelacionaisSupabase = carregarDadosRelacionaisSupabase;


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", async () => {
    await carregarBancoDaNuvem();
    await carregarDadosRelacionaisSupabase();
  });
} else {
  (async () => {
    await carregarBancoDaNuvem();
    await carregarDadosRelacionaisSupabase();
  })();
}

window.salvarBancoNaNuvem = salvarBancoNaNuvem;
window.carregarBancoDaNuvem = carregarBancoDaNuvem;

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
  const valor = String(nome || "").trim();
  if (!valor) return { nome: "", sigla: "" };

  const normalizado = valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return ESTADOS_BRASIL.find(e =>
    e.nome === valor ||
    e.sigla === valor ||
    e.sigla.toLowerCase() === valor.toLowerCase() ||
    e.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === normalizado
  ) || { nome: valor, sigla: "" };
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
  "Países Baixos": "nl",
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


function limitarRivaisClube(clube) {
  clube.rivais ||= [];
  clube.rivais = clube.rivais
    .filter((id, index, lista) => id && lista.indexOf(id) === index)
    .slice(0, 5);
}

function sincronizarRivaisBidirecionais(banco) {
  if (!banco || !Array.isArray(banco.clubes)) return banco;

  banco.clubes.forEach(limitarRivaisClube);

  banco.clubes.forEach(clube => {
    limitarRivaisClube(clube);

    clube.rivais.forEach(rivalId => {
      const rival = banco.clubes.find(c => c.id === rivalId);
      if (!rival) return;

      limitarRivaisClube(rival);

      if (!rival.rivais.includes(clube.id) && rival.rivais.length < 5) {
        rival.rivais.push(clube.id);
      }
    });
  });

  banco.clubes.forEach(limitarRivaisClube);

  return banco;
}


function normalizarTextoCategoriaFutpedia(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizarCategoriaCompeticao(competicao) {
  if (!competicao) return "clube";

  const categoria = normalizarTextoCategoriaFutpedia(competicao.categoria);
  const tipo = normalizarTextoCategoriaFutpedia(competicao.tipo);
  const nome = normalizarTextoCategoriaFutpedia(competicao.nome);
  const descricao = normalizarTextoCategoriaFutpedia(competicao.descricao);

  const texto = `${categoria} ${tipo} ${nome} ${descricao}`;

  // Aceita variações como:
  // "Campeonato de seleções", "Seleções", "selecoes", "selecao", etc.
  if (
    texto.includes("selecao") ||
    texto.includes("selecoes") ||
    texto.includes("campeonato de selecoes") ||
    texto.includes("copa do mundo") ||
    texto.includes("eurocopa") ||
    texto.includes("copa america") ||
    texto.includes("copa das nacoes") ||
    texto.includes("nations league")
  ) {
    return "selecao";
  }

  return "clube";
}

function normalizarBancoFutpedia(banco) {
  banco.paises = PAISES_MUNDO_COMPLETO || banco.paises || [];
  banco.clubes ||= [];
  banco.selecoes ||= [];
  banco.competicoes ||= [];
  banco.titulos ||= [];

  banco.competicoes.forEach(c => {
    c.categoria = normalizarCategoriaCompeticao(c);
    c.escudo ||= "";
    c.tipo ||= "Não informado";
  });

  banco.selecoes.forEach(s => {
    const pais = buscarPaisSelecao(s.pais || s.nome);
    s.nome ||= s.pais || "";
    s.pais ||= s.nome || "";
    s.continente ||= pais.continente || "";
    s.bandeira ||= pais.bandeira || "";
    s.estadio ||= "";
    s.capacidade ||= "";
    s.escudo ||= "";
  });

  banco.titulos.forEach(t => {
    const campeaoClube = banco.clubes.find(c => c.id === t.campeaoId);
    const campeaoSelecao = banco.selecoes.find(s => s.id === t.campeaoId);
    const viceClube = banco.clubes.find(c => c.id === t.viceId);
    const viceSelecao = banco.selecoes.find(s => s.id === t.viceId);

    t.campeaoTipo ||= campeaoSelecao ? "selecao" : "clube";
    t.viceTipo ||= viceSelecao ? "selecao" : "clube";

    if (campeaoClube) t.campeaoNome = campeaoClube.nome;
    if (campeaoSelecao) t.campeaoNome = campeaoSelecao.nome || campeaoSelecao.pais;
    if (viceClube) t.viceNome = viceClube.nome;
    if (viceSelecao) t.viceNome = viceSelecao.nome || viceSelecao.pais;
  });

  return banco;
}


/* ===== Helpers globais de exibição com nome curto e logos ===== */
function fpNomeCurtoTime(item) {
  return String(
    item?.nomeCurto ||
    item?.nome_curto ||
    item?.nome_curto_time ||
    item?.nome ||
    item?.nomeCompleto ||
    item?.nome_completo ||
    "Sem nome"
  ).trim();
}

function fpNomeCompletoTime(item) {
  return String(
    item?.nomeCompleto ||
    item?.nome_completo ||
    item?.nome ||
    item?.nomeCurto ||
    item?.nome_curto ||
    "Sem nome"
  ).trim();
}

function fpLogoEntidade(item) {
  return String(
    item?.escudo ||
    item?.escudo_url ||
    item?.logo ||
    item?.logo_url ||
    item?.imagem ||
    ""
  ).trim();
}

function fpTextoSeguro(valor) {
  if (typeof limparTexto === "function") return limparTexto(valor);
  const div = document.createElement("div");
  div.textContent = String(valor ?? "");
  return div.innerHTML;
}

function fpHtmlLogo(item, tipo = "time", alt = "") {
  const url = fpLogoEntidade(item);
  const classe = `fp-logo-lista fp-logo-${tipo}`;
  const textoAlt = fpTextoSeguro(alt || fpNomeCurtoTime(item) || item?.nome || tipo);

  if (url) {
    return `<img class="${classe}" src="${fpTextoSeguro(url)}" alt="${textoAlt}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'fp-logo-placeholder',textContent:'${tipo === "competicao" ? "🏆" : "⚽"}'}))">`;
  }

  return `<span class="fp-logo-placeholder">${tipo === "competicao" ? "🏆" : "⚽"}</span>`;
}

function fpOrdenarPorNomeCurto(lista) {
  return (lista || []).slice().sort((a, b) =>
    fpNomeCurtoTime(a).localeCompare(fpNomeCurtoTime(b), "pt-BR", { sensitivity: "base" })
  );
}

function fpAtualizarPreviewRival(select) {
  if (!select) return;

  let box = document.getElementById(`${select.id}Preview`);
  if (!box) {
    box = document.createElement("div");
    box.id = `${select.id}Preview`;
    box.className = "rival-preview";
    select.insertAdjacentElement("afterend", box);
  }

  const option = select.options[select.selectedIndex];
  const logo = option?.dataset?.logo || "";
  const nome = option?.textContent || "";

  if (!select.value) {
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  box.style.display = "flex";
  box.innerHTML = `
    ${logo ? `<img src="${fpTextoSeguro(logo)}" alt="Escudo de ${fpTextoSeguro(nome)}" loading="lazy">` : `<span>⚽</span>`}
    <strong>${fpTextoSeguro(nome)}</strong>
  `;
}

function fpPreencherSelectTimesComLogo(selectId, times, placeholder = "Selecione o time", valorAtual = "") {
  const select = document.getElementById(selectId);
  if (!select) return;

  const lista = fpOrdenarPorNomeCurto(times);
  select.innerHTML = `<option value="">${fpTextoSeguro(placeholder)}</option>`;

  lista.forEach(time => {
    const option = document.createElement("option");
    option.value = String(time.id || "");
    option.textContent = fpNomeCurtoTime(time);
    option.dataset.logo = fpLogoEntidade(time);
    option.dataset.nomeCompleto = fpNomeCompletoTime(time);
    select.appendChild(option);
  });

  if (valorAtual && lista.some(t => String(t.id) === String(valorAtual))) {
    select.value = String(valorAtual);
  }

  if (!select.dataset.fpLogoPreview) {
    select.dataset.fpLogoPreview = "1";
    select.addEventListener("change", () => fpAtualizarPreviewRival(select));
  }

  fpAtualizarPreviewRival(select);
}

// Padronização global de nomes de países em português.
(function(){
  if(typeof window==='undefined') return;
  const original=window.carregarBanco;
  if(typeof original==='function' && !original.__paisesPt){
    const fn=function(...args){
      const banco=original.apply(this,args);
      return typeof window.aplicarNomesPaisesPortuguesNoBanco==='function'
        ? window.aplicarNomesPaisesPortuguesNoBanco(banco)
        : banco;
    };
    fn.__paisesPt=true;
    window.carregarBanco=fn;
  }
})();


window.addEventListener("storage", event => {
  if (event.key === FUTPEDIA_STORAGE_KEY) invalidarCacheBancoFutpedia();
});
window.invalidarCacheBancoFutpedia = invalidarCacheBancoFutpedia;
