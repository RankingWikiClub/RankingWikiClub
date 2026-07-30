/* RankingWikiClub — nomes de países e bandeiras compatíveis com desktop */
(function () {
  const normalizar = valor => String(valor || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`´]/g, "'")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim().toLowerCase();

  const aliases = {
    "holanda":"paises baixos", "netherlands":"paises baixos",
    "republica tcheca":"tchequia", "czechia":"tchequia", "czech republic":"tchequia",
    "bielorrussia":"belarus", "belorussia":"belarus",
    "moldova":"moldavia", "republica da moldavia":"moldavia",
    "macedonia":"macedonia do norte", "republica da macedonia do norte":"macedonia do norte",
    "suazilandia":"essuatini", "eswatini":"essuatini",
    "eua":"estados unidos", "usa":"estados unidos", "estados unidos da america":"estados unidos",
    "emirados arabes":"emirados arabes unidos", "uae":"emirados arabes unidos",
    "coreia sul":"coreia do sul", "coreia norte":"coreia do norte",
    "republica da irlanda":"irlanda", "eire":"irlanda",
    "pais de pais de gales":"pais de gales", "pais de pais de pais de gales":"pais de gales", "wales":"pais de gales",
    "turkiye":"turquia", "russia federacao":"russia", "federacao russa":"russia",
    "costa do marfim":"costa do marfim", "cote d ivoire":"costa do marfim",
    "republica democratica do congo":"republica democratica do congo", "rd congo":"republica democratica do congo",
    "congo brazzaville":"congo", "republica do congo":"congo",
    "timor leste":"timor leste", "timor leste republica democratica":"timor leste",
    "caboverde":"cabo verde", "sao tome principe":"sao tome e principe",
    "antigua barbuda":"antigua e barbuda", "trinidad tobago":"trinidad e tobago",
    "bosnia herzegovina":"bosnia e herzegovina", "papua nova guine":"papua nova guine",
    "micronesia":"estados federados da micronesia", "vaticano":"cidade do vaticano"
  };
  const canon = v => aliases[normalizar(v)] || normalizar(v);

  function codigoEmoji(emoji) {
    const cps = Array.from(String(emoji || "")).map(c => c.codePointAt(0));
    const regs = cps.filter(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF);
    if (regs.length === 2) return regs.map(cp => String.fromCharCode(97 + cp - 0x1F1E6)).join("");
    return "";
  }

  const especiais = {
    "inglaterra":"gb-eng", "escocia":"gb-sct", "pais de gales":"gb-wls",
    "irlanda do norte":"gb-nir", "kosovo":"xk"
  };

  function listaPaises() {
    const itens=[];
    if (Array.isArray(window.PAISES_PADRAO)) itens.push(...window.PAISES_PADRAO);
    if (Array.isArray(window.PAISES_MUNDO_COMPLETO)) itens.push(...window.PAISES_MUNDO_COMPLETO);
    if (Array.isArray(window.PAISES_SELECOES)) itens.push(...window.PAISES_SELECOES);
    try { const b=typeof window.carregarBanco === "function" ? window.carregarBanco() : null; if (Array.isArray(b?.paises)) itens.push(...b.paises); } catch (_) {}
    return itens;
  }

  function localizarPais(nome) {
    const chave=canon(nome);
    return listaPaises().find(p => canon(p?.nome) === chave) || null;
  }

  window.rwcNormalizarPais = normalizar;
  window.rwcChavePais = canon;
  window.rwcLocalizarPais = localizarPais;

  window.buscarPais = function(nome) {
    const encontrado=localizarPais(nome);
    return encontrado || { nome:String(nome||"").trim(), bandeira:"", continente:"" };
  };

  function codigoPais(nome, emoji) {
    return especiais[canon(nome)] || codigoEmoji(emoji) || codigoEmoji(localizarPais(nome)?.bandeira);
  }

  function esc(v){ return typeof window.limparTexto === "function" ? window.limparTexto(v) : String(v||"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c])); }

  window.bandeiraPaisHTML = function(nomePais, emoji="", classe="bandeira-img") {
    const pais=localizarPais(nomePais);
    const em=emoji || pais?.bandeira || "";
    const codigo=codigoPais(nomePais, em);
    if (!codigo) return em ? `<span class="bandeira-emoji" aria-label="Bandeira de ${esc(nomePais)}">${em}</span>` : "";
    return `<span class="bandeira-wrapper"><img class="${classe}" src="https://flagcdn.com/w40/${codigo}.png" srcset="https://flagcdn.com/w80/${codigo}.png 2x" loading="lazy" referrerpolicy="no-referrer" alt="Bandeira de ${esc(nomePais)}" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">${em ? `<span class="bandeira-emoji" style="display:none">${em}</span>` : ""}</span>`;
  };
  window.bandeiraPaisPequenaHTML = function(nomePais, emoji="") { return window.bandeiraPaisHTML(nomePais, emoji, "bandeira-img-pequena"); };

  // Corrige nomes antigos carregados na memória sem mudar IDs/FKs.
  window.rwcNomeCanonicoExibicao = function(nome) {
    const achado=localizarPais(nome); return achado?.nome || String(nome||"").replace(/País de (?:País de )+Gales/gi,"País de Gales");
  };
})();
