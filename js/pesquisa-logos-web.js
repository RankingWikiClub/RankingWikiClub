(function () {
  "use strict";

  const configuracoes = {
    escudo: { titulo: "Pesquisar escudo do time", tipo: "clube", nomeIds: ["termoLogoClube", "nomeCompleto", "nomeCurto", "nome"] },
    escudoSelecao: { titulo: "Pesquisar escudo da seleção", tipo: "selecao", nomeIds: ["termoLogoSelecao", "nomeSelecao", "paisSelecao", "nome"] },
    escudoCompeticao: { titulo: "Pesquisar logo da competição", tipo: "competicao", nomeIds: ["termoLogoCompeticao", "nomeCompeticao", "nome"] },
    editEscudo: { titulo: "Pesquisar logo na web", tipo: "auto", nomeIds: ["editTermoLogoSelecao", "editTermoLogoClube", "editTermoLogoCompeticao", "editNomeSelecao", "editNomeCompleto", "editNome", "editNomeCompeticao", "editPaisSelecao", "editPais"] }
  };

  function textoSeguro(valor) {
    return String(valor || "").replace(/[&<>'"]/g, caractere => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[caractere]);
  }

  function valorCampo(id) {
    const campo = document.getElementById(id);
    return campo?.value?.trim?.() || "";
  }

  function nomeAtual(input, config) {
    // Os termos manuais têm prioridade e permitem pesquisar por sigla,
    // nome oficial, nome internacional, patrocinador ou denominação histórica.
    const camposManuais = {
      escudo: "termoLogoClube",
      escudoSelecao: "termoLogoSelecao",
      escudoCompeticao: "termoLogoCompeticao"
    };
    const termoManual = valorCampo(camposManuais[input.id]);
    if (termoManual) return termoManual;

    // Sem termo manual, o nome completo do clube é a consulta principal.
    if (config.tipo === "clube" || (config.tipo === "auto" && document.getElementById("editNomeCompleto"))) {
      const completo = valorCampo(input.id === "escudo" ? "nomeCompleto" : "editNomeCompleto");
      if (completo) return completo;
    }

    for (const id of config.nomeIds || []) {
      const valor = valorCampo(id);
      if (valor) return valor;
    }
    return "";
  }

  function tipoReal(input, config) {
    if (config.tipo !== "auto") return config.tipo;
    if (document.getElementById("editNomeCompleto")) return "clube";
    const formulario = input.closest("form");
    const titulo = formulario?.querySelector("h2")?.textContent?.toLowerCase?.() || "";
    if (titulo.includes("seleção") || titulo.includes("selecao")) return "selecao";
    if (titulo.includes("competição") || titulo.includes("competicao")) return "competicao";
    return "clube";
  }

  function termosPesquisa(nome, tipo) {
    const n = nome.trim();
    // A consulta principal exibida ao usuário sempre usa o nome completo + "logo".
    if (tipo === "competicao") return [
      `${n} logo`,
      `${n} logotipo oficial`,
      `${n} competition logo`,
      `${n} tournament logo`,
      `${n} trophy logo`,
      `${n} emblem`,
      `${n} brand`
    ];
    if (tipo === "selecao") return [
      `${n} logo`,
      `${n} federação de futebol`,
      `${n} football federation logo`,
      `${n} national football team crest`,
      `${n} escudo`
    ];
    return [
      `${n} logo`,
      `${n} escudo oficial`,
      `${n} brasão`,
      `${n} football club logo`,
      `${n} football club crest`,
      `${n} soccer club badge`,
      `${n} emblem`
    ];
  }

  function normalizarTexto(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function pontuarResultado(item, nome) {
    const titulo = normalizarTexto(item?.titulo);
    const palavrasLogo = ["logo", "crest", "badge", "emblem", "escudo", "brasao", "coat of arms", "symbol", "insignia"];
    const ignoradas = new Set(["club", "clube", "futebol", "football", "fc", "sc", "de", "do", "da", "dos", "das"]);
    const tokensNome = normalizarTexto(nome)
      .split(/[^a-z0-9]+/)
      .filter(token => token.length >= 3 && !ignoradas.has(token));

    let pontos = 0;
    if (palavrasLogo.some(palavra => titulo.includes(palavra))) pontos += 8;
    for (const token of tokensNome) {
      if (titulo.includes(token)) pontos += 3;
    }
    if (/player|jogador|stadium|estadio|match|partida|team photo|squad|uniform|kit|camisa/.test(titulo)) pontos -= 12;
    return pontos;
  }

  async function pesquisarCommons(termo, limite = 12) {
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("generator", "search");
    url.searchParams.set("gsrsearch", termo);
    url.searchParams.set("gsrnamespace", "6");
    url.searchParams.set("gsrlimit", String(limite));
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url|mime");
    url.searchParams.set("iiurlwidth", "280");
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*");
    const resposta = await fetch(url.toString());
    if (!resposta.ok) return [];
    const dados = await resposta.json();
    return Object.values(dados?.query?.pages || {}).map(pagina => {
      const info = pagina?.imageinfo?.[0] || {};
      if (!String(info.mime || "").startsWith("image/")) return null;
      return {
        titulo: String(pagina.title || "").replace(/^File:/i, ""),
        miniatura: info.thumburl || info.url || "",
        url: info.url || info.thumburl || ""
      };
    }).filter(item => item?.url);
  }

  async function pesquisarWikipedia(nome, idioma) {
    const busca = new URL(`https://${idioma}.wikipedia.org/w/api.php`);
    busca.searchParams.set("action", "query");
    busca.searchParams.set("list", "search");
    busca.searchParams.set("srsearch", nome);
    busca.searchParams.set("srlimit", "5");
    busca.searchParams.set("format", "json");
    busca.searchParams.set("origin", "*");

    const respostaBusca = await fetch(busca.toString());
    if (!respostaBusca.ok) return [];
    const dadosBusca = await respostaBusca.json();
    const titulos = (dadosBusca?.query?.search || []).map(item => item.title).filter(Boolean);
    if (!titulos.length) return [];

    const imagens = new URL(`https://${idioma}.wikipedia.org/w/api.php`);
    imagens.searchParams.set("action", "query");
    imagens.searchParams.set("titles", titulos.join("|"));
    imagens.searchParams.set("prop", "pageimages");
    imagens.searchParams.set("piprop", "thumbnail|original|name");
    imagens.searchParams.set("pithumbsize", "320");
    imagens.searchParams.set("format", "json");
    imagens.searchParams.set("origin", "*");

    const respostaImagens = await fetch(imagens.toString());
    if (!respostaImagens.ok) return [];
    const dados = await respostaImagens.json();
    return Object.values(dados?.query?.pages || {}).map(pagina => {
      const urlImagem = pagina?.original?.source || pagina?.thumbnail?.source || "";
      return urlImagem ? {
        titulo: pagina?.pageimage || pagina.title || nome,
        miniatura: pagina?.thumbnail?.source || urlImagem,
        url: urlImagem,
        origem: `Wikipédia ${idioma.toUpperCase()}`
      } : null;
    }).filter(Boolean);
  }

  async function pesquisarOpenverse(termo, limite = 20) {
    const url = new URL("https://api.openverse.org/v1/images/");
    url.searchParams.set("q", termo);
    url.searchParams.set("page_size", String(Math.min(limite, 20)));
    url.searchParams.set("mature", "false");

    const resposta = await fetch(url.toString(), {
      headers: { "Accept": "application/json" }
    });
    if (!resposta.ok) return [];
    const dados = await resposta.json();
    return (dados?.results || []).map(item => ({
      titulo: item.title || item.creator || termo,
      miniatura: item.thumbnail || item.url || "",
      url: item.url || item.thumbnail || "",
      origem: item.source ? `Openverse · ${item.source}` : "Openverse"
    })).filter(item => item.url);
  }

  function removerDuplicadas(itens) {
    const vistos = new Set();
    return itens.filter(item => {
      const chave = item.url.split("?")[0];
      if (!chave || vistos.has(chave)) return false;
      vistos.add(chave);
      return true;
    });
  }

  async function buscarImagens(nome, tipo) {
    const nomeLimpo = nome.trim();
    const jaTemPalavraDeLogo = /\b(logo|crest|badge|emblem|escudo|bras[aã]o|insignia)\b/i.test(nomeLimpo);
    const termoExato = jaTemPalavraDeLogo ? nomeLimpo : `${nomeLimpo} logo`;
    const termos = [termoExato, ...termosPesquisa(nomeLimpo, tipo).filter(t => t !== termoExato)];
    let resultados = [];

    // Primeiro consulta o termo solicitado literalmente: "nome completo + logo".
    for (const termo of termos) {
      try {
        const encontrados = await pesquisarCommons(termo, 24);
        resultados.push(...encontrados);
      } catch (erro) {
        console.warn("Falha no Wikimedia Commons:", erro);
      }
      resultados = removerDuplicadas(resultados);
      if (resultados.length >= 12) break;
    }

    // Openverse amplia a pesquisa para acervos Creative Commons de várias fontes.
    // É consultado separadamente do Wikimedia Commons e da Wikipédia.
    const respostasOpenverse = await Promise.allSettled(
      termos.slice(0, 3).map(termo => pesquisarOpenverse(termo, 20))
    );
    for (const resposta of respostasOpenverse) {
      if (resposta.status === "fulfilled") resultados.push(...resposta.value);
    }

    // A página principal na Wikipédia costuma fornecer o escudo mesmo quando
    // o arquivo não contém a palavra "logo" no nome.
    const consultasWiki = tipo === "selecao"
      ? [nome.trim(), `${nome.trim()} football federation`, `${nome.trim()} national team`]
      : [nome.trim(), `${nome.trim()} futebol`, `${nome.trim()} football club`];
    const promessas = [];
    for (const consulta of consultasWiki) {
      promessas.push(pesquisarWikipedia(consulta, "pt"));
      promessas.push(pesquisarWikipedia(consulta, "en"));
    }
    const respostasWiki = await Promise.allSettled(promessas);
    for (const resposta of respostasWiki) {
      if (resposta.status === "fulfilled") resultados.push(...resposta.value);
    }

    resultados = removerDuplicadas(resultados);
    resultados.sort((a, b) => pontuarResultado(b, nome) - pontuarResultado(a, nome));

    // Não elimina todos os resultados por causa do nome do arquivo. Mantém os
    // mais relevantes, pois muitos escudos válidos têm nomes abreviados.
    const positivos = resultados.filter(item => pontuarResultado(item, nome) > 0);
    return (positivos.length ? positivos : resultados).slice(0, 12);
  }

  function selecionarLogo(input, url, painel) {
    input.dataset.webLogoUrl = url;
    input.value = "";
    painel.querySelectorAll(".fp-logo-web-item").forEach(item => item.classList.remove("selecionado"));
    painel.querySelector(`[data-logo-url="${CSS.escape(url)}"]`)?.classList.add("selecionado");
    painel.querySelector(".fp-logo-web-preview").innerHTML = `<img src="${textoSeguro(url)}" alt="Logo selecionada"><span>Logo selecionada para salvar</span>`;
  }

  async function executarPesquisa(input, painel, config) {
    const nome = nomeAtual(input, config);
    const resultados = painel.querySelector(".fp-logo-web-resultados");
    const status = painel.querySelector(".fp-logo-web-status");
    const links = painel.querySelector(".fp-logo-web-links");
    if (!nome || nome.length < 2) {
      status.textContent = "Digite o nome da entidade ou o termo do logo para carregar sugestões.";
      resultados.innerHTML = "";
      links.innerHTML = "";
      return;
    }
    const tipo = tipoReal(input, config);
    const termoLink = /\b(logo|crest|badge|emblem|escudo|bras[aã]o|insignia)\b/i.test(nome)
      ? nome
      : `${nome} logo`;
    const codificado = encodeURIComponent(termoLink);
    links.innerHTML = `<a href="https://www.google.com/search?tbm=isch&q=${codificado}" target="_blank" rel="noopener noreferrer">Google Imagens</a><a href="https://www.bing.com/images/search?q=${codificado}" target="_blank" rel="noopener noreferrer">Bing Imagens</a><a href="https://duckduckgo.com/?q=${codificado}&iax=images&ia=images" target="_blank" rel="noopener noreferrer">DuckDuckGo</a><a href="https://yandex.com/images/search?text=${codificado}" target="_blank" rel="noopener noreferrer">Yandex Imagens</a><a href="https://www.ecosia.org/images?q=${codificado}" target="_blank" rel="noopener noreferrer">Ecosia Imagens</a><a href="https://www.flickr.com/search/?text=${codificado}" target="_blank" rel="noopener noreferrer">Flickr</a><a href="https://www.behance.net/search/projects?search=${codificado}" target="_blank" rel="noopener noreferrer">Behance</a>`;
    status.textContent = `Pesquisando por “${termoLink}”...`;
    resultados.innerHTML = "";
    try {
      const imagens = await buscarImagens(nome, tipo);
      if (!imagens.length) {
        status.textContent = `Nenhum logo ou escudo encontrado para “${termoLink}”. Use os atalhos externos.`;
        return;
      }
      status.textContent = `${imagens.length} logos ou escudos encontrados para “${termoLink}”. Clique em uma imagem para selecionar.`;
      resultados.innerHTML = imagens.map(item => `<button type="button" class="fp-logo-web-item" data-logo-url="${textoSeguro(item.url)}" title="${textoSeguro(item.titulo)}"><img src="${textoSeguro(item.miniatura)}" alt="${textoSeguro(item.titulo)}" loading="lazy"><span>${textoSeguro(item.titulo)}</span></button>`).join("");
      resultados.querySelectorAll(".fp-logo-web-item").forEach(botao => botao.addEventListener("click", () => selecionarLogo(input, botao.dataset.logoUrl, painel)));
    } catch (erro) {
      console.error("Erro na pesquisa de logos:", erro);
      status.textContent = "A pesquisa automática não respondeu. Use os atalhos de Google, Bing, DuckDuckGo, Yandex, Ecosia, Flickr ou Behance.";
    }
  }

  function criarPainel(input) {
    if (!input || input.dataset.logoWebAtivado === "1") return;
    const config = configuracoes[input.id];
    if (!config) return;
    input.dataset.logoWebAtivado = "1";
    const painel = document.createElement("section");
    painel.className = "fp-logo-web";
    painel.innerHTML = `<div class="fp-logo-web-cabecalho"><strong>${textoSeguro(config.titulo)}</strong><button type="button" class="fp-logo-web-pesquisar">Pesquisar agora</button></div><p class="fp-logo-web-status">Digite o nome da entidade ou um termo personalizado para carregar sugestões automaticamente.</p><div class="fp-logo-web-links"></div><div class="fp-logo-web-preview"></div><div class="fp-logo-web-resultados"></div><small>O envio manual de arquivo continua disponível e tem prioridade.</small>`;
    input.insertAdjacentElement("afterend", painel);
    painel.querySelector(".fp-logo-web-pesquisar").addEventListener("click", () => executarPesquisa(input, painel, config));
    let temporizador;
    const observar = () => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => executarPesquisa(input, painel, config), 650);
    };
    for (const id of config.nomeIds || []) {
      const campo = document.getElementById(id);
      campo?.addEventListener("input", observar);
      campo?.addEventListener("change", observar);
    }
    input.addEventListener("change", () => {
      if (input.files?.[0]) {
        delete input.dataset.webLogoUrl;
        painel.querySelector(".fp-logo-web-preview").innerHTML = "<span>Arquivo local selecionado. Ele terá prioridade sobre a logo da web.</span>";
      }
    });
    if (nomeAtual(input, config)) observar();
  }

  function ativar() {
    Object.keys(configuracoes).forEach(id => criarPainel(document.getElementById(id)));
  }
  document.addEventListener("DOMContentLoaded", ativar);
  new MutationObserver(ativar).observe(document.documentElement, { childList: true, subtree: true });
  window.fpAtivarPesquisaLogosWeb = ativar;
})();
