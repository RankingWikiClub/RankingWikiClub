/* RankingWikiClub — cadastro de campeões e vices por abrangência geográfica.
   Mundo/Continente: competição > continente de cada finalista > país > clube. */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const norm = valor => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

  function banco() {
    try { return typeof carregarBanco === 'function' ? carregarBanco() : {}; }
    catch (_) { return {}; }
  }

  function categoria(comp) {
    const texto = norm([comp?.categoria, comp?.categoria_competicao, comp?.tipo_entidade, comp?.tipo, comp?.abrangencia].join(' '));
    return texto.includes('selec') ? 'selecao' : 'clube';
  }

  function paisDaCompeticao(comp) {
    const a = norm(comp?.abrangencia);
    return comp?.pais || ((a === 'pais' || a === 'nacional') ? (comp?.local || '') : '');
  }

  function continenteDoPais(nomePais) {
    if (!nomePais) return '';
    try {
      const p = typeof buscarPais === 'function' ? buscarPais(nomePais) : null;
      if (p?.continente) return p.continente;
    } catch (_) {}
    const b = banco();
    return (b.paises || []).find(p => norm(p.nome) === norm(nomePais))?.continente || '';
  }

  function continenteDaCompeticao(comp) {
    if (comp?.continente) return comp.continente;
    const pais = paisDaCompeticao(comp);
    if (pais) return continenteDoPais(pais);
    const a = norm(comp?.abrangencia);
    return (a === 'continental' || a === 'continente') ? (comp?.local || '') : '';
  }

  function nivel(comp) {
    const vals = [comp?.abrangencia, comp?.nivel, comp?.nivel_competicao, comp?.escopo, comp?.local, comp?.tipo, comp?.nome].map(norm);
    if (vals.some(v => v === 'mundo' || v === 'mundial' || v.includes('mundial') || v.includes('intercontinental'))) return 'Mundial';
    if (vals.some(v => v === 'continente' || v === 'continental' || v.includes('continental'))) return 'Continental';
    if (vals.some(v => v === 'pais' || v === 'nacional' || v.includes('nacional'))) return 'País';
    return '';
  }

  function fluxoAtivo() {
    return ($('tipoCadastro')?.value || '') === 'titulo' &&
      ($('categoriaTitulo')?.value || 'clube') === 'clube' &&
      ['Mundial', 'Continental'].includes($('abrangenciaTitulo')?.value || '');
  }

  function preencher(select, itens, placeholder, valor, valueFn, labelFn) {
    if (!select) return;
    select.innerHTML = '';
    const inicial = document.createElement('option');
    inicial.value = '';
    inicial.textContent = placeholder;
    select.appendChild(inicial);
    itens.forEach(item => {
      const op = document.createElement('option');
      op.value = String(valueFn(item) || '');
      op.textContent = labelFn(item);
      select.appendChild(op);
    });
    if (valor && [...select.options].some(o => o.value === String(valor))) select.value = String(valor);
  }

  function continentesDisponiveis() {
    const b = banco();
    const mapa = new Map();
    (b.paises || []).forEach(p => { if (p?.continente) mapa.set(norm(p.continente), p.continente); });
    (b.clubes || []).forEach(c => {
      const continente = c?.continente || continenteDoPais(c?.pais);
      if (continente) mapa.set(norm(continente), continente);
    });
    return [...mapa.values()].sort((a, z) => a.localeCompare(z, 'pt-BR'));
  }

  function competicaoAtual() {
    const id = $('competicaoTitulo')?.value || '';
    return (banco().competicoes || []).find(c => String(c.id) === String(id));
  }

  function preencherCompeticoes() {
    if (!fluxoAtivo()) return;
    const atual = $('competicaoTitulo')?.value || '';
    const abrangencia = $('abrangenciaTitulo')?.value || '';
    const itens = (banco().competicoes || [])
      .filter(c => c?.id && c?.nome && categoria(c) === 'clube' && nivel(c) === abrangencia)
      .sort((a, z) => String(a.nome).localeCompare(String(z.nome), 'pt-BR'));
    preencher($('competicaoTitulo'), itens,
      itens.length ? `Selecione a competição ${abrangencia === 'Mundial' ? 'mundial' : 'continental'}` : `Nenhuma competição ${abrangencia.toLowerCase()} cadastrada`,
      atual, c => c.id, c => c.nome);
  }

  function preencherContinentes() {
    if (!fluxoAtivo()) return;
    const abrangencia = $('abrangenciaTitulo')?.value || '';
    const comp = competicaoAtual();
    const continenteFixo = abrangencia === 'Continental' ? continenteDaCompeticao(comp) : '';
    const itens = continentesDisponiveis();

    ['Campeao', 'Vice'].forEach(sufixo => {
      const select = $(`continente${sufixo}Titulo`);
      const atual = continenteFixo || select?.value || '';
      preencher(select, itens, `Selecione o continente do ${sufixo === 'Campeao' ? 'campeão' : 'vice'}`, atual, x => x, x => x);
      if (continenteFixo) {
        select.value = continenteFixo;
        select.disabled = true;
        select.title = 'Continente definido pela competição selecionada';
      } else {
        select.disabled = false;
        select.title = '';
      }
    });
  }

  function paisesDoContinente(continente) {
    if (!continente) return [];
    const b = banco();
    const mapa = new Map();
    (b.clubes || []).forEach(c => {
      if (!c?.pais) return;
      const cont = c?.continente || continenteDoPais(c.pais);
      if (norm(cont) !== norm(continente)) return;
      let bandeira = c.bandeira || '';
      try { if (!bandeira && typeof buscarPais === 'function') bandeira = buscarPais(c.pais)?.bandeira || ''; } catch (_) {}
      mapa.set(norm(c.pais), { nome: c.pais, bandeira });
    });
    return [...mapa.values()].sort((a, z) => a.nome.localeCompare(z.nome, 'pt-BR'));
  }

  function preencherPaises(tipo) {
    const ehVice = tipo === 'vice';
    const suf = ehVice ? 'Vice' : 'Campeao';
    const continente = $(`continente${suf}Titulo`)?.value || '';
    const select = $(ehVice ? 'paisViceTitulo' : 'paisCampeaoTitulo');
    const atual = select?.value || '';
    const itens = paisesDoContinente(continente);
    preencher(select, itens,
      continente ? (itens.length ? `Selecione o país do ${ehVice ? 'vice' : 'campeão'}` : 'Nenhum país com clubes neste continente') : `Selecione primeiro o continente do ${ehVice ? 'vice' : 'campeão'}`,
      atual, p => p.nome, p => `${p.bandeira || ''} ${p.nome}`.trim());
  }

  function nomeClube(c) {
    const nome = c?.nome || c?.nomeCurto || c?.nome_curto || c?.nomeCompleto || '';
    const uf = c?.siglaEstado || c?.sigla_estado || '';
    return uf ? `${nome} — ${uf}` : nome;
  }

  function preencherClubes(tipo) {
    const ehVice = tipo === 'vice';
    const pais = $(ehVice ? 'paisViceTitulo' : 'paisCampeaoTitulo')?.value || '';
    const select = $(ehVice ? 'vice' : 'campeao');
    const atual = select?.value || '';
    const itens = (banco().clubes || [])
      .filter(c => c?.id && nomeClube(c) && pais && norm(c.pais) === norm(pais))
      .sort((a, z) => nomeClube(a).localeCompare(nomeClube(z), 'pt-BR'));
    preencher(select, itens,
      pais ? (itens.length ? `Selecione o ${ehVice ? 'vice-campeão' : 'campeão'}` : 'Nenhum clube cadastrado neste país') : `Selecione primeiro o país do ${ehVice ? 'vice' : 'campeão'}`,
      atual, c => c.id, nomeClube);
  }

  function mostrarCampos() {
    const mostrar = fluxoAtivo();
    ['grupoContinenteCampeaoTitulo', 'grupoContinenteViceTitulo'].forEach(id => {
      const el = $(id);
      if (el) el.classList.toggle('oculto', !mostrar);
    });
  }

  function atualizarTudo(reset = false) {
    mostrarCampos();
    if (!fluxoAtivo()) return false;
    if (reset) {
      ['continenteCampeaoTitulo','continenteViceTitulo','paisCampeaoTitulo','paisViceTitulo','campeao','vice'].forEach(id => { if ($(id)) $(id).value = ''; });
    }
    preencherCompeticoes();
    preencherContinentes();
    preencherPaises('campeao');
    preencherPaises('vice');
    preencherClubes('campeao');
    preencherClubes('vice');
    return true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('tipoCadastro')?.addEventListener('change', () => setTimeout(() => atualizarTudo(true), 0));
    $('categoriaTitulo')?.addEventListener('change', () => setTimeout(() => atualizarTudo(true), 0));
    $('abrangenciaTitulo')?.addEventListener('change', () => setTimeout(() => atualizarTudo(true), 0));
    $('competicaoTitulo')?.addEventListener('change', () => setTimeout(() => {
      if (!fluxoAtivo()) return;
      preencherContinentes();
      preencherPaises('campeao'); preencherPaises('vice');
      preencherClubes('campeao'); preencherClubes('vice');
    }, 0));
    $('continenteCampeaoTitulo')?.addEventListener('change', () => { preencherPaises('campeao'); preencherClubes('campeao'); });
    $('continenteViceTitulo')?.addEventListener('change', () => { preencherPaises('vice'); preencherClubes('vice'); });
    $('paisCampeaoTitulo')?.addEventListener('change', () => { if (fluxoAtivo()) preencherClubes('campeao'); });
    $('paisViceTitulo')?.addEventListener('change', () => { if (fluxoAtivo()) preencherClubes('vice'); });
    setTimeout(() => atualizarTudo(false), 0);
  });

  const originalCompeticoes = window.carregarCompeticoesPorAbrangencia;
  window.carregarCompeticoesPorAbrangencia = function () {
    if (atualizarTudo(false)) return;
    return typeof originalCompeticoes === 'function' ? originalCompeticoes.apply(this, arguments) : undefined;
  };

  const originalParticipantes = window.carregarParticipantesTituloNoSelect;
  window.carregarParticipantesTituloNoSelect = function (tipo) {
    if (fluxoAtivo()) return preencherClubes(tipo === 'vice' ? 'vice' : 'campeao');
    return typeof originalParticipantes === 'function' ? originalParticipantes.apply(this, arguments) : undefined;
  };
})();
