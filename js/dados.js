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
  { nome: "Bielorrússia", continente: "Europa", bandeira: "🇧🇾" },
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
  { nome: "Holanda", continente: "Europa", bandeira: "🇳🇱" },
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
  { nome: "Myanmar", continente: "Ásia", bandeira: "🇲🇲" },
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
  { nome: "República Tcheca", continente: "Europa", bandeira: "🇨🇿" },
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
let FUTPEDIA_BANCO_MEMORIA = null;
let FUTPEDIA_SINCRONIZANDO = false;
let FUTPEDIA_SALVANDO_NUVEM = false;

function prepararBancoFutpedia(banco) {
  banco ||= dadosIniciais();
  banco.paises = (banco.paises && banco.paises.length ? banco.paises : PAISES_MUNDO_COMPLETO);
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
    clube.nomeCompleto ||= clube.nomeCompleto || clube.nome_completo || clube.nome;
    clube.nome ||= clube.nome_curto || clube.nome || clube.nomeCompleto || clube.nome_completo || "";
    clube.fundacao = formatarDataFundacao(clube.fundacao);
  });

  banco.selecoes.forEach(selecao => {
    selecao.escudo ||= "";
    const paisSelecao = buscarPaisSelecao(selecao.pais || selecao.nome);
    selecao.continente ||= paisSelecao.continente || "";
    selecao.bandeira ||= paisSelecao.bandeira || "";
    selecao.nome ||= selecao.pais;
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
  try { return JSON.parse(salvo); }
  catch (erro) { console.warn("Não foi possível ler o banco local do FutPédia.", erro); return null; }
}

function gravarCacheLocalFutpedia(banco) {
  const preparado = prepararBancoFutpedia(banco);
  FUTPEDIA_BANCO_MEMORIA = preparado;
  try { localStorage.setItem(FUTPEDIA_STORAGE_KEY, JSON.stringify(preparado)); } catch (e) {}
  return preparado;
}

function carregarBanco() {
  if (FUTPEDIA_BANCO_MEMORIA) return prepararBancoFutpedia(FUTPEDIA_BANCO_MEMORIA);
  const bancoLocal = carregarBancoLocalBruto();
  const inicial = prepararBancoFutpedia(bancoLocal || dadosIniciais());
  FUTPEDIA_BANCO_MEMORIA = inicial;
  return inicial;
}

function quantidadeRegistrosFutpedia(banco) {
  if (!banco) return 0;
  return (banco.clubes || []).length + (banco.selecoes || []).length +
    (banco.competicoes || []).length + (banco.titulos || []).length;
}

function salvarBanco(banco) {
  const preparado = gravarCacheLocalFutpedia(banco);
  clearTimeout(FUTPEDIA_SALVAMENTO_TIMER);
  FUTPEDIA_SALVAMENTO_TIMER = setTimeout(() => salvarBancoNaNuvem(preparado), 150);
}

async function salvarBancoNaNuvem(banco = carregarBanco()) {
  const supabase = typeof clienteSupabase === "function" ? clienteSupabase() : null;
  if (!supabase || FUTPEDIA_SALVANDO_NUVEM) return false;
  FUTPEDIA_SALVANDO_NUVEM = true;
  try {
    const { data: sessao } = await supabase.auth.getSession();
    if (!sessao?.session) {
      console.warn("Faça login para salvar os dados do FutPédia no Supabase.");
      return false;
    }
    const preparado = prepararBancoFutpedia(banco);
    const { error } = await supabase.from("futpedia_dados").upsert({
      id: 1,
      dados: preparado,
      atualizado_em: new Date().toISOString()
    }, { onConflict: "id" });
    if (error) {
      console.warn("Não foi possível salvar no Supabase.", error.message || error);
      return false;
    }
    return true;
  } catch (erro) {
    console.warn("Erro ao salvar dados do FutPédia no Supabase.", erro);
    return false;
  } finally {
    FUTPEDIA_SALVANDO_NUVEM = false;
  }
}

async function carregarBancoRelacionalSupabase() {
  const supabase = typeof clienteSupabase === "function" ? clienteSupabase() : null;
  if (!supabase) return null;
  try {
    const [timesRes, selecoesRes, competicoesRes, edicoesRes, paisesRes] = await Promise.all([
      supabase.from("times").select("*"),
      supabase.from("selecoes").select("*"),
      supabase.from("competicoes").select("*"),
      supabase.from("edicoes").select("*"),
      supabase.from("paises").select("*")
    ]);

    const paisesBanco = (paisesRes.data || []).map(p => {
      const info = buscarPaisSelecao(p.nome || p.pais || "");
      return { id: String(p.id), nome: p.nome || p.pais || "", continente: p.continente || info.continente || "", bandeira: p.bandeira || info.bandeira || "" };
    }).filter(p => p.nome);

    const paisPorId = new Map(paisesBanco.map(p => [String(p.id), p]));

    const clubes = (timesRes.data || []).map(t => {
      const pais = paisPorId.get(String(t.pais_id || t.paisId || "")) || buscarPaisSelecao(t.pais || t.pais_nome || "");
      return {
        id: String(t.id),
        nome: t.nome_curto || t.nome || "",
        nomeCompleto: t.nome || t.nome_completo || t.nome_curto || "",
        apelido: t.apelido || "",
        pais: t.pais || t.pais_nome || pais.nome || "",
        bandeira: t.bandeira || pais.bandeira || "",
        estado: t.estado || t.estado_nome || "",
        siglaEstado: t.sigla_estado || t.uf || "",
        cidade: t.cidade || "",
        fundacao: t.fundacao || t.data_fundacao || "",
        escudo: t.escudo || t.logo || t.imagem || "",
        rivais: []
      };
    });

    const selecoes = (selecoesRes.data || []).map(s => {
      const pais = paisPorId.get(String(s.pais_id || s.paisId || "")) || buscarPaisSelecao(s.pais || s.nome || "");
      return {
        id: String(s.id),
        nome: s.nome || s.pais || pais.nome || "",
        pais: s.pais || s.nome || pais.nome || "",
        continente: s.continente || pais.continente || "",
        bandeira: s.bandeira || pais.bandeira || "",
        escudo: s.escudo || s.logo || s.imagem || ""
      };
    });

    const competicoes = (competicoesRes.data || []).map(c => {
      const pais = paisPorId.get(String(c.pais_id || c.paisId || "")) || buscarPaisSelecao(c.pais || c.local || "");
      return {
        id: String(c.id),
        nome: c.nome || "",
        tipo: c.tipo || c.tipo_competicao || "Não informado",
        categoria: c.categoria || (String(c.tipo_categoria || "").includes("sele") ? "selecao" : "clube"),
        abrangencia: c.abrangencia || c.nivel || "",
        local: c.local || c.continente || c.pais || pais.nome || "",
        continente: c.continente || "",
        pais: c.pais || pais.nome || "",
        bandeira: c.bandeira || pais.bandeira || (c.abrangencia === "Mundial" ? "🌍" : ""),
        escudo: c.escudo || c.logo || c.imagem || ""
      };
    });

    const titulos = (edicoesRes.data || []).map(e => {
      const comp = competicoes.find(c => String(c.id) === String(e.competicao_id || e.competicaoId));
      return {
        id: String(e.id),
        ano: e.ano || e.temporada || "",
        competicaoId: String(e.competicao_id || e.competicaoId || ""),
        competicaoNome: e.competicao_nome || comp?.nome || "",
        abrangencia: e.abrangencia || comp?.abrangencia || "",
        campeaoId: String(e.campeao_id || e.campeaoId || ""),
        campeaoNome: e.campeao_nome || "",
        campeaoTipo: e.campeao_tipo || comp?.categoria || "clube",
        viceId: String(e.vice_id || e.viceId || ""),
        viceNome: e.vice_nome || "",
        viceTipo: e.vice_tipo || comp?.categoria || "clube"
      };
    });

    if ([timesRes, selecoesRes, competicoesRes, edicoesRes].some(r => r.error)) {
      console.warn("Algumas tabelas do Supabase não puderam ser carregadas.", timesRes.error, selecoesRes.error, competicoesRes.error, edicoesRes.error);
    }

    return prepararBancoFutpedia({
      paises: paisesBanco.length ? paisesBanco : PAISES_MUNDO_COMPLETO,
      clubes,
      selecoes,
      competicoes,
      titulos
    });
  } catch (erro) {
    console.warn("Erro ao carregar tabelas relacionais do Supabase.", erro);
    return null;
  }
}

async function carregarBancoDaNuvem() {
  const supabase = typeof clienteSupabase === "function" ? clienteSupabase() : null;
  if (!supabase || FUTPEDIA_CARREGOU_NUVEM || FUTPEDIA_SINCRONIZANDO) return;
  FUTPEDIA_SINCRONIZANDO = true;

  try {
    let bancoNuvem = null;

    const { data, error } = await supabase.from("futpedia_dados").select("dados, atualizado_em").eq("id", 1).maybeSingle();
    if (!error && data?.dados && quantidadeRegistrosFutpedia(data.dados) > 0) {
      bancoNuvem = prepararBancoFutpedia(data.dados);
    }

    if (!bancoNuvem) {
      bancoNuvem = await carregarBancoRelacionalSupabase();
    }

    const local = prepararBancoFutpedia(carregarBancoLocalBruto() || dadosIniciais());
    const qtdLocal = quantidadeRegistrosFutpedia(local);
    const qtdNuvem = quantidadeRegistrosFutpedia(bancoNuvem);

    // Primeira migração: se o computador tem mais dados locais que o Supabase, envie para a nuvem.
    // Depois disso, todos os dispositivos passam a carregar o mesmo banco central.
    if (qtdLocal > qtdNuvem && qtdLocal > 0) {
      gravarCacheLocalFutpedia(local);
      await salvarBancoNaNuvem(local);
    } else if (bancoNuvem && qtdNuvem > 0) {
      gravarCacheLocalFutpedia(bancoNuvem);
    }

    FUTPEDIA_CARREGOU_NUVEM = true;
    atualizarTelasAposSincronizacao();
  } catch (erro) {
    console.warn("Erro ao carregar dados do FutPédia no Supabase.", erro);
  } finally {
    FUTPEDIA_SINCRONIZANDO = false;
  }
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
    window.dispatchEvent(new CustomEvent("futpediaBancoSincronizado"));
  } catch (erro) {
    console.warn("Dados sincronizados, mas a tela não pôde ser atualizada automaticamente.", erro);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", carregarBancoDaNuvem);
} else {
  carregarBancoDaNuvem();
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
