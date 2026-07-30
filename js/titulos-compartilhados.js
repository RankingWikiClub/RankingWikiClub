/* RankingWikiClub — títulos compartilhados entre clubes.
   Permite cadastrar mais de um campeão e/ou vice para a mesma edição. */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const norm = v => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  let contador = 0;

  function bancoAtual() { return typeof carregarBanco === 'function' ? carregarBanco() : { clubes: [], competicoes: [] }; }
  function categoriaClubes() { return ($('categoriaTitulo')?.value || 'clube') === 'clube'; }
  function abrangencia() { return $('abrangenciaTitulo')?.value || ''; }
  function competicaoAtual(banco) {
    const id = $('competicaoTitulo')?.value || '';
    return (banco.competicoes || []).find(c => String(c.id) === String(id));
  }
  function continentePais(nomePais) {
    if (!nomePais) return '';
    if (typeof buscarPais === 'function') return buscarPais(nomePais)?.continente || '';
    const b = bancoAtual();
    return (b.paises || []).find(p => norm(p.nome) === norm(nomePais))?.continente || '';
  }
  function continenteCompeticao(c) {
    if (!c) return '';
    return c.continente || (c.abrangencia === 'Continental' ? (c.local || '') : continentePais(c.pais || c.local || ''));
  }
  function paisCompeticao(c) {
    return c?.pais || (c?.abrangencia === 'País' ? (c.local || '') : '');
  }
  function opcoes(select, itens, placeholder, valor = '') {
    if (!select) return;
    select.innerHTML = `<option value="">${placeholder}</option>` + itens.map(i => `<option value="${String(i.valor).replace(/"/g,'&quot;')}">${i.texto}</option>`).join('');
    if (valor && [...select.options].some(o => o.value === valor)) select.value = valor;
  }
  function continentesDisponiveis(clubes) {
    return [...new Set(clubes.map(c => c.continente || continentePais(c.pais)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  }
  function paisesDisponiveis(clubes, continente) {
    return [...new Set(clubes.filter(c => !continente || (c.continente || continentePais(c.pais)) === continente).map(c => c.pais).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  }
  function clubesDisponiveis(clubes, pais) {
    return clubes.filter(c => !pais || c.pais === pais).sort((a,b)=>String(a.nome).localeCompare(String(b.nome)));
  }

  function atualizarLinha(linha) {
    const banco = bancoAtual();
    const clubes = banco.clubes || [];
    const comp = competicaoAtual(banco);
    const abr = abrangencia() || comp?.abrangencia || '';
    const contComp = continenteCompeticao(comp);
    const paisComp = paisCompeticao(comp);

    ['campeao','vice'].forEach(papel => {
      const cont = linha.querySelector(`[data-campo="continente-${papel}"]`);
      const pais = linha.querySelector(`[data-campo="pais-${papel}"]`);
      const time = linha.querySelector(`[data-campo="${papel}"]`);
      const valorCont = cont?.value || '';
      const valorPais = pais?.value || '';
      const valorTime = time?.value || '';

      const mostrarCont = abr === 'Mundial';
      const contFixo = abr === 'Continental' ? contComp : '';
      cont.closest('.titulo-extra-campo').classList.toggle('oculto', !mostrarCont);
      if (mostrarCont) {
        opcoes(cont, continentesDisponiveis(clubes).map(x=>({valor:x,texto:x})), `Continente do ${papel}`, valorCont);
      } else {
        cont.innerHTML = `<option value="${contFixo}">${contFixo}</option>`;
        cont.value = contFixo;
      }

      const continenteEscolhido = mostrarCont ? cont.value : contFixo;
      const paisFixo = abr === 'País' ? paisComp : '';
      if (paisFixo) {
        opcoes(pais, [{valor:paisFixo,texto:paisFixo}], `País do ${papel}`, paisFixo);
        pais.disabled = true;
      } else {
        pais.disabled = false;
        opcoes(pais, paisesDisponiveis(clubes, continenteEscolhido).map(x=>({valor:x,texto:x})), `País do ${papel}`, valorPais);
      }
      opcoes(time, clubesDisponiveis(clubes, pais.value).map(c=>({valor:String(c.id),texto:c.nome})), `Selecione o ${papel}`, valorTime);
    });
  }

  function criarLinha() {
    contador += 1;
    const linha = document.createElement('div');
    linha.className = 'titulo-compartilhado-card';
    linha.dataset.tituloExtra = String(contador);
    linha.innerHTML = `
      <div class="titulo-compartilhado-topo">
        <strong>Outro campeão e vice</strong>
        <button type="button" class="btn-remover-titulo-extra">Remover</button>
      </div>
      <div class="titulo-extra-grid">
        <div class="titulo-extra-campo"><label>Continente do campeão</label><select data-campo="continente-campeao"></select></div>
        <div class="titulo-extra-campo"><label>País do campeão</label><select data-campo="pais-campeao"></select></div>
        <div class="titulo-extra-campo"><label>Campeão compartilhado</label><select data-campo="campeao"></select></div>
        <div class="titulo-extra-campo"><label>Continente do vice</label><select data-campo="continente-vice"></select></div>
        <div class="titulo-extra-campo"><label>País do vice</label><select data-campo="pais-vice"></select></div>
        <div class="titulo-extra-campo"><label>Vice compartilhado</label><select data-campo="vice"></select></div>
      </div>`;
    linha.querySelector('.btn-remover-titulo-extra').addEventListener('click', () => linha.remove());
    linha.querySelectorAll('select[data-campo^="continente-"]').forEach(s => s.addEventListener('change', () => atualizarLinha(linha)));
    linha.querySelectorAll('select[data-campo^="pais-"]').forEach(s => s.addEventListener('change', () => atualizarLinha(linha)));
    $('titulosCompartilhadosLista').appendChild(linha);
    atualizarLinha(linha);
  }

  function atualizarVisibilidade() {
    const area = $('areaTitulosCompartilhados');
    if (!area) return;
    const mostrar = categoriaClubes();
    area.classList.toggle('oculto', !mostrar);
    if (!mostrar) $('titulosCompartilhadosLista').innerHTML = '';
    document.querySelectorAll('[data-titulo-extra]').forEach(atualizarLinha);
  }

  function instalarInterface() {
    const grupo = $('grupoTitulo');
    const vice = $('vice');
    if (!grupo || !vice || $('areaTitulosCompartilhados')) return;
    const area = document.createElement('div');
    area.id = 'areaTitulosCompartilhados';
    area.className = 'area-titulos-compartilhados';
    area.innerHTML = `
      <div id="titulosCompartilhadosLista"></div>
      <button type="button" id="adicionarTituloCompartilhado" class="btn-adicionar-titulo-compartilhado">＋ Adicionar outro campeão e vice</button>
      <small>Use esta opção quando o título ou o vice-campeonato da mesma edição tiver sido compartilhado entre clubes.</small>`;
    vice.insertAdjacentElement('afterend', area);
    $('adicionarTituloCompartilhado').addEventListener('click', criarLinha);
    $('categoriaTitulo')?.addEventListener('change', atualizarVisibilidade);
    $('abrangenciaTitulo')?.addEventListener('change', atualizarVisibilidade);
    $('competicaoTitulo')?.addEventListener('change', atualizarVisibilidade);
    atualizarVisibilidade();
  }

  function instalarSalvamento() {
    const original = window.salvarTitulo;
    if (typeof original !== 'function' || original.__compartilhado) return;
    const novo = function () {
      const linhas = [...document.querySelectorAll('[data-titulo-extra]')];
      if (!categoriaClubes() || !linhas.length) return original();

      const banco = bancoAtual();
      const ano = $('ano')?.value || '';
      const competicaoId = $('competicaoTitulo')?.value || '';
      const pares = [{ campeaoId: $('campeao')?.value || '', viceId: $('vice')?.value || '' }];
      linhas.forEach(l => pares.push({
        campeaoId: l.querySelector('[data-campo="campeao"]')?.value || '',
        viceId: l.querySelector('[data-campo="vice"]')?.value || ''
      }));
      if (!ano || !competicaoId || pares.some(p => !p.campeaoId || !p.viceId)) {
        alert('Preencha o campeão e o vice em todos os campos adicionados.'); return;
      }
      if (pares.some(p => String(p.campeaoId) === String(p.viceId))) {
        alert('O campeão e o vice de cada campo precisam ser clubes diferentes.'); return;
      }
      const campeoes = pares.map(p=>String(p.campeaoId));
      if (new Set(campeoes).size !== campeoes.length) {
        alert('O mesmo clube não pode aparecer mais de uma vez como campeão compartilhado.'); return;
      }
      const comp = (banco.competicoes || []).find(c => String(c.id) === String(competicaoId));
      if (!comp) { alert('Não foi possível localizar a competição.'); return; }
      const registros = [];
      for (const p of pares) {
        const campeao = (banco.clubes || []).find(c => String(c.id) === String(p.campeaoId));
        const vice = (banco.clubes || []).find(c => String(c.id) === String(p.viceId));
        if (!campeao || !vice) { alert('Não foi possível localizar um dos clubes selecionados.'); return; }
        registros.push({
          id: gerarId(), ano, competicaoId: comp.id, competicaoNome: comp.nome,
          abrangencia: comp.abrangencia, campeaoId: campeao.id, campeaoNome: campeao.nome,
          campeaoTipo: 'clube', viceId: vice.id, viceNome: vice.nome, viceTipo: 'clube',
          tituloCompartilhado: true, grupoTituloCompartilhado: `${comp.id}-${ano}`
        });
      }
      banco.titulos = banco.titulos || [];
      banco.titulos.push(...registros);
      salvarBanco(banco);
      alert(`${registros.length} campeão(ões) e vice(s) cadastrados para a mesma edição.`);
      location.reload();
    };
    novo.__compartilhado = true;
    window.salvarTitulo = novo;
    try { salvarTitulo = novo; } catch (_) {}
  }

  function iniciar() { instalarInterface(); instalarSalvamento(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(iniciar, 0));
  else setTimeout(iniciar, 0);
})();
