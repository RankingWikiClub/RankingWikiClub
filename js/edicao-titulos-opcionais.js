/* RankingWikiClub — edição de campeão/vice compartilhados com caixas opcionais separadas. */
(function(){
'use strict';
const $=id=>document.getElementById(id), txt=v=>String(v||'').trim();
const banco=()=>typeof carregarBanco==='function'?carregarBanco():{clubes:[],titulos:[],competicoes:[]};
const nome=p=>txt(p?.nomeCurto||p?.nome_curto||p?.nome||p?.pais);
const cliente=()=>typeof window.clienteSupabase==='function'?window.clienteSupabase():null;
const payload=t=>({id:String(t.id),ano:String(t.ano||''),competicao_id:String(t.competicaoId||''),competicao_nome:t.competicaoNome||'',abrangencia:t.abrangencia||'',campeao_id:String(t.campeaoId||''),campeao_nome:t.campeaoNome||'',campeao_tipo:t.campeaoTipo||'clube',vice_id:String(t.viceId||''),vice_nome:t.viceNome||'',vice_tipo:t.viceTipo||'clube'});
const gerar=()=>String(typeof gerarId==='function'?gerarId():`${Date.now()}-${Math.random()}`);
function paises(b){return [...new Set((b.clubes||[]).map(c=>txt(c.pais)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));}
function fillPais(s,val=''){if(!s)return;const b=banco();s.innerHTML='<option value="">Selecione o país</option>'+paises(b).map(p=>`<option value="${p.replace(/"/g,'&quot;')}">${p}</option>`).join('');if(val)s.value=val;}
function fillClube(s,pais,val=''){if(!s)return;const itens=(banco().clubes||[]).filter(c=>!pais||txt(c.pais)===txt(pais)).sort((a,b)=>nome(a).localeCompare(nome(b)));s.innerHTML='<option value="">Selecione o clube</option>'+itens.map(c=>`<option value="${c.id}">${nome(c)}</option>`).join('');if(val)s.value=String(val);}
function tituloIdForm(form){const m=(form.getAttribute('onsubmit')||'').match(/salvarEdicaoTitulo\(event,\s*'([^']+)'/);return m?.[1]||'';}
function companheiro(b,t){
 const grupo=t.grupoTituloCompartilhado;
 return (b.titulos||[]).find(x=>String(x.id)!==String(t.id) && ((grupo&&x.grupoTituloCompartilhado===grupo)||(!grupo&&String(x.ano)===String(t.ano)&&String(x.competicaoId)===String(t.competicaoId)&&(x.campeaoTipo||'clube')==='clube')))||null;
}
function instalar(form){
 if(form.dataset.opcionaisInstaladas==='1')return;
 const cat=$('editCategoriaTitulo'), vice=$('editVice'); if(!cat||!vice)return;
 form.dataset.opcionaisInstaladas='1'; const id=tituloIdForm(form), b=banco(), t=(b.titulos||[]).find(x=>String(x.id)===String(id)); if(!t)return;
 const extra=companheiro(b,t); const campDif=extra&&String(extra.campeaoId)!==String(t.campeaoId), viceDif=extra&&String(extra.viceId)!==String(t.viceId);
 const area=document.createElement('div'); area.id='editOpcoesTitulosDivididos'; area.className='opcoes-titulos-divididos'; area.innerHTML=`
 <div class="opcao-titulo-dividido"><label class="linha-checkbox"><input type="checkbox" id="editUsarCampeaoExtra" ${campDif?'checked':''}> Adicionar/editar outro campeão (opcional)</label><div id="editCampeaoExtraCampos" class="campos-extra-titulo ${campDif?'':'oculto'}"><label>País do outro campeão</label><select id="editPaisCampeaoExtra"></select><label>Outro campeão</label><select id="editCampeaoExtra"></select></div></div>
 <div class="opcao-titulo-dividido"><label class="linha-checkbox"><input type="checkbox" id="editUsarViceExtra" ${viceDif?'checked':''}> Adicionar/editar outro vice-campeão (opcional)</label><div id="editViceExtraCampos" class="campos-extra-titulo ${viceDif?'':'oculto'}"><label>País do outro vice</label><select id="editPaisViceExtra"></select><label>Outro vice-campeão</label><select id="editViceExtra"></select></div></div>
 <small>Desmarque uma opção para remover somente aquele campo adicional ao salvar.</small>`;
 vice.insertAdjacentElement('afterend',area);
 const ec=extra?(b.clubes||[]).find(c=>String(c.id)===String(extra.campeaoId)):null, ev=extra?(b.clubes||[]).find(c=>String(c.id)===String(extra.viceId)):null;
 fillPais($('editPaisCampeaoExtra'),ec?.pais||'');fillPais($('editPaisViceExtra'),ev?.pais||'');fillClube($('editCampeaoExtra'),ec?.pais||'',campDif?extra.campeaoId:'');fillClube($('editViceExtra'),ev?.pais||'',viceDif?extra.viceId:'');
 $('editPaisCampeaoExtra').onchange=e=>fillClube($('editCampeaoExtra'),e.target.value);$('editPaisViceExtra').onchange=e=>fillClube($('editViceExtra'),e.target.value);
 const toggle=()=>{const clube=cat.value==='clube';area.classList.toggle('oculto',!clube);$('editCampeaoExtraCampos').classList.toggle('oculto',!clube||!$('editUsarCampeaoExtra').checked);$('editViceExtraCampos').classList.toggle('oculto',!clube||!$('editUsarViceExtra').checked);};
 $('editUsarCampeaoExtra').onchange=toggle;$('editUsarViceExtra').onchange=toggle;cat.addEventListener('change',toggle);toggle();
 form.dataset.tituloBaseId=id; form.dataset.tituloExtraId=extra?.id||'';
}
async function salvar(event,id){
 event.preventDefault(); const b=banco(), t=(b.titulos||[]).find(x=>String(x.id)===String(id)); if(!t)return alert('Registro não encontrado.');
 const categoria=$('editCategoriaTitulo')?.value||'clube'; const ano=txt($('editAno')?.value), compId=txt($('editCompeticaoTitulo')?.value), campId=txt($('editCampeao')?.value), viceId=txt($('editVice')?.value);
 if(!ano||!compId||!campId||!viceId)return alert('Preencha ano, competição, campeão e vice.'); if(campId===viceId)return alert('Campeão e vice não podem ser o mesmo participante.');
 const comp=(b.competicoes||[]).find(c=>String(c.id)===compId), lista=categoria==='selecao'?(b.selecoes||[]):(b.clubes||[]), cp=lista.find(x=>String(x.id)===campId), vp=lista.find(x=>String(x.id)===viceId); if(!comp||!cp||!vp)return alert('Não foi possível localizar os dados selecionados.');
 Object.assign(t,{ano,competicaoId:String(comp.id),competicaoNome:comp.nome||'',abrangencia:comp.abrangencia||'',campeaoId:String(cp.id),campeaoNome:nome(cp),campeaoTipo:categoria,viceId:String(vp.id),viceNome:nome(vp),viceTipo:categoria});
 let extra=companheiro(b,t); const usarC=categoria==='clube'&&!!$('editUsarCampeaoExtra')?.checked, usarV=categoria==='clube'&&!!$('editUsarViceExtra')?.checked;
 const salvarRows=[t], excluirIds=[];
 if(usarC||usarV){const ceId=usarC?txt($('editCampeaoExtra')?.value):campId, veId=usarV?txt($('editViceExtra')?.value):viceId; if((usarC&&!ceId)||(usarV&&!veId))return alert('Preencha os campos opcionais marcados.'); if(ceId===veId)return alert('O campeão e o vice adicionais não podem ser o mesmo clube.'); if(usarC&&ceId===campId)return alert('Escolha outro campeão.'); if(usarV&&veId===viceId)return alert('Escolha outro vice-campeão.'); const ce=(b.clubes||[]).find(x=>String(x.id)===ceId),ve=(b.clubes||[]).find(x=>String(x.id)===veId);if(!ce||!ve)return alert('Não foi possível localizar os clubes adicionais.'); const grupo=t.grupoTituloCompartilhado||`${comp.id}-${ano}-${Date.now()}`;t.tituloCompartilhado=true;t.grupoTituloCompartilhado=grupo;if(!extra){extra={id:gerar()};b.titulos.push(extra);}Object.assign(extra,{ano,competicaoId:String(comp.id),competicaoNome:comp.nome||'',abrangencia:comp.abrangencia||'',campeaoId:String(ce.id),campeaoNome:nome(ce),campeaoTipo:'clube',viceId:String(ve.id),viceNome:nome(ve),viceTipo:'clube',tituloCompartilhado:true,grupoTituloCompartilhado:grupo});salvarRows.push(extra);
 } else if(extra){excluirIds.push(String(extra.id));b.titulos=b.titulos.filter(x=>String(x.id)!==String(extra.id));delete t.tituloCompartilhado;delete t.grupoTituloCompartilhado;}
 try{const cli=cliente();if(cli){let r=await cli.from('titulos_futpedia').upsert(salvarRows.map(payload),{onConflict:'id'});if(r.error)throw r.error;if(excluirIds.length){r=await cli.from('titulos_futpedia').delete().in('id',excluirIds);if(r.error)throw r.error;}}salvarBanco(b);alert('Campeão e vice atualizados.');if(typeof mostrarEdicao==='function')mostrarEdicao('titulos');}catch(e){console.error(e);alert('Não foi possível salvar: '+(e?.message||e));}
}
const observer=new MutationObserver(()=>{const form=document.querySelector('form.form-edicao[onsubmit*="salvarEdicaoTitulo"]');if(form)instalar(form);});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.salvarEdicaoTitulo=salvar;try{salvarEdicaoTitulo=salvar;}catch(_){}
setTimeout(()=>{const f=document.querySelector('form.form-edicao[onsubmit*="salvarEdicaoTitulo"]');if(f)instalar(f);},100);
})();
