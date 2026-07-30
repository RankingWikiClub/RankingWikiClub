/* RankingWikiClub — filtro definitivo de competições por abrangência e formulário organizado. */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const texto = v => String(v ?? '').trim();
  const norm = v => texto(v).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const ESTADOS = [
    ['Acre','AC'],['Alagoas','AL'],['Amapá','AP'],['Amazonas','AM'],['Bahia','BA'],['Ceará','CE'],
    ['Distrito Federal','DF'],['Espírito Santo','ES'],['Goiás','GO'],['Maranhão','MA'],['Mato Grosso','MT'],
    ['Mato Grosso do Sul','MS'],['Minas Gerais','MG'],['Pará','PA'],['Paraíba','PB'],['Paraná','PR'],
    ['Pernambuco','PE'],['Piauí','PI'],['Rio de Janeiro','RJ'],['Rio Grande do Norte','RN'],
    ['Rio Grande do Sul','RS'],['Rondônia','RO'],['Roraima','RR'],['Santa Catarina','SC'],['São Paulo','SP'],
    ['Sergipe','SE'],['Tocantins','TO']
  ];
  const estadoPorChave = new Map();
  ESTADOS.forEach(([nome, uf]) => { estadoPorChave.set(norm(nome), {nome,uf}); estadoPorChave.set(norm(uf), {nome,uf}); });

  function banco() {
    try { return typeof carregarBanco === 'function' ? carregarBanco() : {}; }
    catch (_) { return {}; }
  }

  function categoria(comp) {
    const t = norm([comp?.categoria, comp?.categoriaCompeticao, comp?.categoria_competicao, comp?.tipo_entidade, comp?.entidade].join(' '));
    return t.includes('selec') ? 'selecao' : 'clube';
  }

  function escopo(comp) {
    const abrang = norm(comp?.abrangencia);
    const tipo = norm(comp?.tipo || comp?.tipoCompeticao || comp?.tipo_competicao);
    const nivel = norm(comp?.nivel || comp?.nivel_competicao || comp?.escopo);
    const todos = `${abrang} ${tipo} ${nivel}`;
    if (todos.includes('estadual') || comp?.estado || comp?.siglaEstado || comp?.sigla_estado || comp?.uf) return 'Estado';
    if (todos.includes('mundial') || todos.includes('mundo') || todos.includes('intercontinental')) return 'Mundial';
    if (todos.includes('continental') || todos.includes('continente')) return 'Continental';
    if (todos.includes('pais') || todos.includes('nacional') || abrang === 'país') return 'País';
    return '';
  }

  function nomePais(comp) {
    return texto(comp?.pais || comp?.paisNome || comp?.pais_nome || ((escopo(comp)==='País' || escopo(comp)==='Estado') ? comp?.local : ''));
  }

  function estadoDaCompeticao(comp) {
    const direto = texto(comp?.estado || comp?.estadoNome || comp?.estado_nome || comp?.siglaEstado || comp?.sigla_estado || comp?.uf);
    if (direto && estadoPorChave.has(norm(direto))) return estadoPorChave.get(norm(direto));
    const local = texto(comp?.local);
    if (local && estadoPorChave.has(norm(local))) return estadoPorChave.get(norm(local));
    const busca = norm(`${comp?.nome || ''} ${comp?.tipo || ''} ${local}`);
    for (const [nome, uf] of ESTADOS) {
      const n = norm(nome);
      if (busca.includes(n) || new RegExp(`(^|[^a-z])${uf.toLowerCase()}([^a-z]|$)`).test(busca)) return {nome,uf};
    }
    return null;
  }

  function continenteDoPais(pais) {
    if (!pais) return '';
    try {
      const p = typeof buscarPais === 'function' ? buscarPais(pais) : null;
      if (p?.continente) return p.continente;
    } catch (_) {}
    return texto((banco().paises || []).find(p => norm(p.nome) === norm(pais))?.continente);
  }

  function continenteDaCompeticao(comp) {
    return texto(comp?.continente || ((escopo(comp)==='Continental') ? comp?.local : '') || continenteDoPais(nomePais(comp)));
  }

  function criarEstrutura() {
    const grupo = $('grupoTitulo');
    if (!grupo || $('filtroGeograficoCompeticaoTitulo')) return;

    const abrang = $('abrangenciaTitulo');
    if (abrang && ![...abrang.options].some(o => o.value === 'Estado')) {
      const op = document.createElement('option'); op.value = 'Estado'; op.textContent = 'Estado'; abrang.appendChild(op);
    }

    const filtro = document.createElement('div');
    filtro.id = 'filtroGeograficoCompeticaoTitulo';
    filtro.className = 'grupo';
    filtro.innerHTML = `
      <div id="grupoContinenteFiltroTitulo" class="grupo oculto">
        <label>Continente da competição</label>
        <select id="continenteFiltroTitulo"><option value="">Selecione o continente</option></select>
      </div>
      <div id="grupoPaisFiltroTitulo" class="grupo oculto">
        <label>País da competição</label>
        <select id="paisFiltroTitulo"><option value="">Selecione o país</option></select>
      </div>
      <div id="grupoEstadoFiltroTitulo" class="grupo oculto">
        <label>Estado da competição</label>
        <select id="estadoFiltroTitulo"><option value="">Selecione o estado</option></select>
      </div>`;
    $('grupoAbrangenciaTitulo')?.insertAdjacentElement('afterend', filtro);

    const ano = $('ano');
    const competicao = $('competicaoTitulo');
    const labelAno = ano?.previousElementSibling;
    const labelComp = competicao?.previousElementSibling;
    const blocoComp = document.createElement('div');
    blocoComp.id = 'blocoCompeticaoTitulo'; blocoComp.className = 'bloco-finalista bloco-competicao-titulo';
    blocoComp.innerHTML = '<h3>Competição e edição</h3>';
    filtro.insertAdjacentElement('afterend', blocoComp);
    if (labelComp) blocoComp.appendChild(labelComp); if (competicao) blocoComp.appendChild(competicao);
    if (labelAno) blocoComp.appendChild(labelAno); if (ano) blocoComp.appendChild(ano);

    function montarFinalista(tipo) {
      const campeao = tipo === 'campeao';
      const participante = $(campeao ? 'campeao' : 'vice');
      const labelParticipante = participante?.previousElementSibling;
      const grupoCont = $(campeao ? 'grupoContinenteCampeaoTitulo' : 'grupoContinenteViceTitulo');
      const grupoPais = $(campeao ? 'grupoPaisCampeaoTitulo' : 'grupoPaisViceTitulo');
      const bloco = document.createElement('div');
      bloco.id = campeao ? 'blocoCampeaoTitulo' : 'blocoViceTitulo';
      bloco.className = 'bloco-finalista';
      bloco.innerHTML = `<h3>${campeao ? 'Campeão' : 'Vice-campeão'}</h3>`;
      blocoComp.insertAdjacentElement('afterend', bloco);
      if (!campeao) $('blocoCampeaoTitulo')?.insertAdjacentElement('afterend', bloco);
      if (grupoCont) bloco.appendChild(grupoCont);
      if (grupoPais) bloco.appendChild(grupoPais);
      if (labelParticipante) bloco.appendChild(labelParticipante);
      if (participante) bloco.appendChild(participante);
    }
    montarFinalista('campeao');
    montarFinalista('vice');
  }

  function preencher(select, itens, placeholder, valor, valueFn = x=>x, labelFn = x=>x) {
    if (!select) return;
    const anterior = texto(valor || select.value);
    select.innerHTML = `<option value="">${placeholder}</option>`;
    itens.forEach(item => {
      const op = document.createElement('option'); op.value = texto(valueFn(item)); op.textContent = texto(labelFn(item)); select.appendChild(op);
    });
    if (anterior && [...select.options].some(o => o.value === anterior)) select.value = anterior;
  }

  function competicoesBase() {
    const cat = $('categoriaTitulo')?.value || 'clube';
    const scope = $('abrangenciaTitulo')?.value || '';
    return (banco().competicoes || []).filter(c => c?.id && c?.nome && categoria(c) === cat && (!scope || escopo(c) === scope));
  }

  function atualizarFiltrosGeograficos(reset=false) {
    const scope = $('abrangenciaTitulo')?.value || '';
    const compBase = competicoesBase();
    const gCont = $('grupoContinenteFiltroTitulo'), gPais = $('grupoPaisFiltroTitulo'), gEstado = $('grupoEstadoFiltroTitulo');
    gCont?.classList.toggle('oculto', scope !== 'Continental');
    gPais?.classList.toggle('oculto', !['País','Estado'].includes(scope));
    gEstado?.classList.toggle('oculto', scope !== 'Estado');
    if (reset) ['continenteFiltroTitulo','paisFiltroTitulo','estadoFiltroTitulo'].forEach(id => { if ($(id)) $(id).value=''; });

    if (scope === 'Continental') {
      const vals = [...new Set(compBase.map(continenteDaCompeticao).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      preencher($('continenteFiltroTitulo'), vals, 'Selecione o continente');
    }
    if (scope === 'País') {
      const vals = [...new Set(compBase.map(nomePais).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      preencher($('paisFiltroTitulo'), vals, vals.length ? 'Selecione o país' : 'Nenhum país encontrado');
    }
    if (scope === 'Estado') {
      const paises = [...new Set(compBase.map(c=>nomePais(c)||'Brasil').filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      preencher($('paisFiltroTitulo'), paises, 'Selecione o país', $('paisFiltroTitulo')?.value || (paises.includes('Brasil') ? 'Brasil' : ''));
      if (!$('paisFiltroTitulo')?.value && paises.includes('Brasil')) $('paisFiltroTitulo').value='Brasil';
      const estados = [...new Map(compBase.map(estadoDaCompeticao).filter(Boolean).map(e=>[e.uf,e])).values()].sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
      // Inclui estados que possuem clubes, mesmo quando competições antigas não têm o campo estado preenchido.
      (banco().clubes||[]).filter(c=>norm(c.pais)==='brasil').forEach(c=>{
        const e=estadoPorChave.get(norm(c.estado||c.siglaEstado||c.sigla_estado||'')); if(e && !estados.some(x=>x.uf===e.uf)) estados.push(e);
      });
      estados.sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
      preencher($('estadoFiltroTitulo'), estados, 'Selecione o estado', '', e=>e.uf, e=>`${e.nome} (${e.uf})`);
    }
  }

  function atualizarCompeticoes() {
    const scope = $('abrangenciaTitulo')?.value || '';
    const cont = $('continenteFiltroTitulo')?.value || '';
    const pais = $('paisFiltroTitulo')?.value || '';
    const uf = $('estadoFiltroTitulo')?.value || '';
    let lista = competicoesBase();
    if (scope === 'Continental' && cont) lista = lista.filter(c => norm(continenteDaCompeticao(c)) === norm(cont));
    if (scope === 'País' && pais) lista = lista.filter(c => norm(nomePais(c)) === norm(pais));
    if (scope === 'Estado') {
      if (pais) lista = lista.filter(c => norm(nomePais(c)||'Brasil') === norm(pais));
      if (uf) lista = lista.filter(c => estadoDaCompeticao(c)?.uf === uf);
    }
    lista.sort((a,b)=>texto(a.nome).localeCompare(texto(b.nome),'pt-BR'));
    const requisitos = (scope==='Continental'&&!cont)||(scope==='País'&&!pais)||(scope==='Estado'&&(!pais||!uf));
    preencher($('competicaoTitulo'), requisitos ? [] : lista,
      requisitos ? 'Selecione primeiro a localização da competição' : (lista.length ? 'Selecione a competição cadastrada' : 'Nenhuma competição cadastrada para este filtro'),
      '', c=>c.id, c=>c.nome);
    atualizarFinalistas(true);
  }

  function todosPaises() {
    const b=banco(), mapa=new Map();
    (b.paises||[]).forEach(p=>{ if(p?.nome) mapa.set(norm(p.nome),{nome:p.nome,bandeira:p.bandeira||'',continente:p.continente||''}); });
    [...(b.clubes||[]),...(b.selecoes||[])].forEach(p=>{ const n=texto(p.pais||p.nomePais||p.paisNome); if(n&&!mapa.has(norm(n))) mapa.set(norm(n),{nome:n,bandeira:p.bandeira||'',continente:p.continente||continenteDoPais(n)}); });
    return [...mapa.values()];
  }

  function participantes(tipo) {
    const b=banco();
    return tipo==='selecao' ? (b.selecoes||[]) : (b.clubes||[]);
  }
  function nomeParticipante(p,tipo) { return texto(p?.nomeCurto||p?.nome_curto||p?.nome||p?.nomeCompleto||p?.pais); }
  function paisParticipante(p,tipo) { return texto(p?.pais || (tipo==='selecao' ? p?.nomePais||p?.paisNome||p?.nome : '')); }

  function atualizarFinalistas(reset=false) {
    const cat=$('categoriaTitulo')?.value||'clube', scope=$('abrangenciaTitulo')?.value||'';
    const comp=(banco().competicoes||[]).find(c=>String(c.id)===String($('competicaoTitulo')?.value||''));
    const compPais=comp ? nomePais(comp) : '';
    const compEstado=comp ? estadoDaCompeticao(comp) : null;
    const compContinente=comp ? continenteDaCompeticao(comp) : '';

    ['Campeao','Vice'].forEach(suf=>{
      const contSel=$(`continente${suf}Titulo`), paisSel=$(suf==='Campeao'?'paisCampeaoTitulo':'paisViceTitulo');
      const partSel=$(suf==='Campeao'?'campeao':'vice');
      const grupoCont=$(suf==='Campeao'?'grupoContinenteCampeaoTitulo':'grupoContinenteViceTitulo');
      const mostrarCont=['Mundial','Continental'].includes(scope);
      grupoCont?.classList.toggle('oculto', !mostrarCont);
      if(reset){ if(contSel)contSel.value=''; if(paisSel)paisSel.value=''; if(partSel)partSel.value=''; }

      const conts=[...new Set(todosPaises().map(p=>p.continente).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
      preencher(contSel,conts,`Selecione o continente do ${suf==='Campeao'?'campeão':'vice-campeão'}`);
      if(scope==='Continental'&&compContinente&&contSel){contSel.value=compContinente;contSel.disabled=true;} else if(contSel)contSel.disabled=false;

      let contEscolhido=contSel?.value||'';
      let paises=todosPaises();
      if(contEscolhido) paises=paises.filter(p=>norm(p.continente)===norm(contEscolhido));
      if(['País','Estado'].includes(scope)&&compPais) paises=paises.filter(p=>norm(p.nome)===norm(compPais));
      paises.sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));
      preencher(paisSel,paises,`Selecione o país do ${suf==='Campeao'?'campeão':'vice-campeão'}`,'',p=>p.nome,p=>`${p.bandeira||''} ${p.nome}`.trim());
      if(['País','Estado'].includes(scope)&&compPais&&paisSel){paisSel.value=compPais;paisSel.disabled=true;} else if(paisSel)paisSel.disabled=false;

      let itens=participantes(cat), paisEscolhido=paisSel?.value||'';
      if(paisEscolhido) itens=itens.filter(p=>norm(paisParticipante(p,cat))===norm(paisEscolhido));
      if(scope==='Estado'&&compEstado&&cat==='clube') itens=itens.filter(p=>{
        const e=estadoPorChave.get(norm(p.estado||p.siglaEstado||p.sigla_estado||p.uf||'')); return e?.uf===compEstado.uf;
      });
      itens=itens.filter(p=>p?.id&&nomeParticipante(p,cat)).sort((a,b)=>nomeParticipante(a,cat).localeCompare(nomeParticipante(b,cat),'pt-BR'));
      preencher(partSel,itens,paisEscolhido?`Selecione o ${suf==='Campeao'?'campeão':'vice-campeão'}`:'Selecione primeiro o país','',p=>p.id,p=>nomeParticipante(p,cat));
    });
  }

  function ligarEventos() {
    $('categoriaTitulo')?.addEventListener('change',()=>setTimeout(()=>{atualizarFiltrosGeograficos(true);atualizarCompeticoes();},10));
    $('abrangenciaTitulo')?.addEventListener('change',()=>setTimeout(()=>{atualizarFiltrosGeograficos(true);atualizarCompeticoes();},10));
    ['continenteFiltroTitulo','paisFiltroTitulo','estadoFiltroTitulo'].forEach(id=>$(id)?.addEventListener('change',()=>setTimeout(atualizarCompeticoes,10)));
    $('competicaoTitulo')?.addEventListener('change',()=>setTimeout(()=>atualizarFinalistas(true),10));
    ['continenteCampeaoTitulo','continenteViceTitulo'].forEach(id=>$(id)?.addEventListener('change',()=>setTimeout(()=>atualizarFinalistas(false),10)));
    ['paisCampeaoTitulo','paisViceTitulo'].forEach(id=>$(id)?.addEventListener('change',()=>setTimeout(()=>atualizarFinalistas(false),10)));
  }

  function iniciar() {
    criarEstrutura();
    ligarEventos();
    atualizarFiltrosGeograficos(false);
    atualizarCompeticoes();
    // Mantém integrações antigas chamando a nova rotina.
    window.carregarCompeticoesPorAbrangencia = atualizarCompeticoes;
    window.carregarParticipantesTituloNoSelect = function(){ atualizarFinalistas(false); };
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(iniciar,80)); else setTimeout(iniciar,80);
})();
