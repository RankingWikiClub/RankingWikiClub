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

function carregarBanco() {
  const salvo = localStorage.getItem("futpedia_v8");
  if (!salvo) {
    const inicial = dadosIniciais();
    localStorage.setItem("futpedia_v8", JSON.stringify(inicial));
    return inicial;
  }

  const banco = JSON.parse(salvo);

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
  salvarBanco(banco);

  normalizarBancoFutpedia(banco);
  salvarBanco(banco);
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


function normalizarCategoriaCompeticao(competicao) {
  if (!competicao) return "clube";

  if (competicao.categoria) return competicao.categoria;

  const nome = (competicao.nome || "").toLowerCase();
  const tipo = (competicao.tipo || "").toLowerCase();

  if (
    nome.includes("copa do mundo") ||
    nome.includes("eurocopa") ||
    nome.includes("copa américa") ||
    nome.includes("copa das nações") ||
    nome.includes("nations league") ||
    tipo.includes("seleção") ||
    tipo.includes("seleções")
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
