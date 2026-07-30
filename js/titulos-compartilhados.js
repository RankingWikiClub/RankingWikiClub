/* RankingWikiClub — campos opcionais e separados para campeão/vice compartilhados. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const txt = v => String(v || '').trim();
  const norm = v => txt(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  function banco() { return typeof carregarBanco === 'function' ? carregarBanco() : { clubes: [], competicoes: [], titulos: [] }; }
  function nome(p) { return txt(p?.nomeCurto || p?.nome_curto || p?.nome || p?.pais); }
  function cliente() { return typeof window.clienteSupabase === 'function' ? window.clienteSupabase() : null; }
  function categoriaClubes() { return ($('categoriaTitulo')?.value || 'clube') === 'clube'; }
  function gerar() { return String(typeof gerarId === 'function' ? gerarId() : `${Date.now()}-${Math.random()}`); }

  function payload(t) {
    return { id:String(t.id), ano:String(t.ano||''), competicao_id:String(t.competicaoId||''), competicao_nome:t.competicaoNome||'', abrangencia:t.abrangencia||'', campeao_id:String(t.campeaoId||''), campeao_nome:t.campeaoNome||'', campeao_tipo:t.campeaoTipo||'clube', vice_id:String(t.viceId||''), vice_nome:t.viceNome||'', vice_tipo:t.viceTipo||'clube' };
  }

  function paisesClubes(b) {
    return [...new Set((b.clubes||[]).map(c=>txt(c.pais)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  }
  function preencherPaises(select, valor='') {
    if (!select) return;
    const b = banco();
    select.innerHTML = '<option value="">Selecione o país</option>' + paisesClubes(b).map(p=>`<option value="${p.replace(/"/g,'&quot;')}">${p}</option>`).join('');
    if (valor) select.value = valor;
  }
  function preencherClubes(select, pais, valor='') {
    if (!select) return;
    const itens = (banco().clubes||[]).filter(c=>!pais || txt(c.pais)===txt(pais)).sort((a,b)=>nome(a).localeCompare(nome(b)));
    select.innerHTML = '<option value="">Selecione o clube</option>' + itens.map(c=>`<option value="${String(c.id).replace(/"/g,'&quot;')}">${nome(c)}</option>`).join('');
    if (valor) select.value = String(valor);
  }

  function instalarUI() {
    const grupo = $('grupoTitulo');
    const vice = $('vice');
    if (!grupo || !vice || $('opcoesTitulosDivididos')) return;
    const area = document.createElement('div');
    area.id = 'opcoesTitulosDivididos';
    area.className = 'opcoes-titulos-divididos';
    area.innerHTML = `
      <div class="opcao-titulo-dividido">
        <label class="linha-checkbox"><input type="checkbox" id="usarCampeaoExtra"> Adicionar outro campeão (opcional)</label>
        <div id="campeaoExtraCampos" class="campos-extra-titulo oculto">
          <label>País do outro campeão</label><select id="paisCampeaoExtra"></select>
          <label>Outro campeão</label><select id="campeaoExtra"></select>
        </div>
      </div>
      <div class="opcao-titulo-dividido">
        <label class="linha-checkbox"><input type="checkbox" id="usarViceExtra"> Adicionar outro vice-campeão (opcional)</label>
        <div id="viceExtraCampos" class="campos-extra-titulo oculto">
          <label>País do outro vice-campeão</label><select id="paisViceExtra"></select>
          <label>Outro vice-campeão</label><select id="viceExtra"></select>
        </div>
      </div>
      <small>Marque somente a opção necessária. Os campos aparecem separadamente para títulos ou vice-campeonatos divididos.</small>`;
    vice.insertAdjacentElement('afterend', area);

    const alternar = () => {
      const clubes = categoriaClubes();
      area.classList.toggle('oculto', !clubes);
      $('campeaoExtraCampos').classList.toggle('oculto', !$('usarCampeaoExtra').checked || !clubes);
      $('viceExtraCampos').classList.toggle('oculto', !$('usarViceExtra').checked || !clubes);
      if (!clubes) { $('usarCampeaoExtra').checked=false; $('usarViceExtra').checked=false; }
    };
    preencherPaises($('paisCampeaoExtra'));
    preencherPaises($('paisViceExtra'));
    $('paisCampeaoExtra').addEventListener('change', e=>preencherClubes($('campeaoExtra'), e.target.value));
    $('paisViceExtra').addEventListener('change', e=>preencherClubes($('viceExtra'), e.target.value));
    $('usarCampeaoExtra').addEventListener('change', alternar);
    $('usarViceExtra').addEventListener('change', alternar);
    $('categoriaTitulo')?.addEventListener('change', alternar);
    alternar();
  }

  function instalarSalvamento() {
    const anterior = window.salvarTitulo;
    if (typeof anterior !== 'function' || anterior.__rwcOpcionais) return;
    const salvar = async function () {
      const temCampExtra = categoriaClubes() && !!$('usarCampeaoExtra')?.checked;
      const temViceExtra = categoriaClubes() && !!$('usarViceExtra')?.checked;
      if (!temCampExtra && !temViceExtra) return anterior();

      const b = banco();
      const ano = txt($('ano')?.value), competicaoId = txt($('competicaoTitulo')?.value);
      const campeaoId = txt($('campeao')?.value), viceId = txt($('vice')?.value);
      const campeaoExtraId = temCampExtra ? txt($('campeaoExtra')?.value) : campeaoId;
      const viceExtraId = temViceExtra ? txt($('viceExtra')?.value) : viceId;
      if (!ano || !competicaoId || !campeaoId || !viceId || (temCampExtra && !campeaoExtraId) || (temViceExtra && !viceExtraId)) { alert('Preencha os campos obrigatórios e os campos opcionais que foram marcados.'); return; }
      if (campeaoId===viceId || campeaoExtraId===viceExtraId) { alert('Campeão e vice-campeão não podem ser o mesmo clube.'); return; }
      if (temCampExtra && campeaoExtraId===campeaoId) { alert('Escolha outro clube para o campeão adicional.'); return; }
      if (temViceExtra && viceExtraId===viceId) { alert('Escolha outro clube para o vice-campeão adicional.'); return; }

      const comp=(b.competicoes||[]).find(c=>String(c.id)===competicaoId);
      const clubes=b.clubes||[];
      const cp=clubes.find(c=>String(c.id)===campeaoId), vp=clubes.find(c=>String(c.id)===viceId), ce=clubes.find(c=>String(c.id)===campeaoExtraId), ve=clubes.find(c=>String(c.id)===viceExtraId);
      if (!comp || !cp || !vp || !ce || !ve) { alert('Não foi possível localizar a competição ou um dos clubes.'); return; }
      const grupo=`${comp.id}-${ano}-${Date.now()}`;
      const comum={ano,competicaoId:String(comp.id),competicaoNome:comp.nome||'',abrangencia:comp.abrangencia||'',campeaoTipo:'clube',viceTipo:'clube',tituloCompartilhado:true,grupoTituloCompartilhado:grupo};
      const registros=[
        {...comum,id:gerar(),campeaoId:String(cp.id),campeaoNome:nome(cp),viceId:String(vp.id),viceNome:nome(vp)},
        {...comum,id:gerar(),campeaoId:String(ce.id),campeaoNome:nome(ce),viceId:String(ve.id),viceNome:nome(ve)}
      ];
      try {
        const cli=cliente();
        if (cli) { const {error}=await cli.from('titulos_futpedia').upsert(registros.map(payload),{onConflict:'id'}); if(error) throw error; }
        b.titulos ||= []; b.titulos.push(...registros); salvarBanco(b);
        alert('Campeões e vices cadastrados com os campos opcionais.'); location.reload();
      } catch(e) { console.error(e); alert('Não foi possível salvar os registros: '+(e?.message||e)); }
    };
    salvar.__rwcOpcionais=true;
    window.salvarTitulo=salvar;
    try { salvarTitulo=salvar; } catch(_) {}
  }

  function iniciar(){ instalarUI(); instalarSalvamento(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(iniciar,30)); else setTimeout(iniciar,30);
})();
