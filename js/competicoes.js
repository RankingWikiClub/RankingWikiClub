
document.addEventListener("DOMContentLoaded", () => {
  renderizarCompeticoes();
  document.getElementById("filtroCategoriaCompeticoes")?.addEventListener("change", renderizarCompeticoes);
});

function renderizarCompeticoes() {
  const banco = carregarBanco();
  const lista = document.getElementById("listaCompeticoes");
  if (!lista) return;

  lista.classList.add("lista-competicoes");

  const categoria = document.getElementById("filtroCategoriaCompeticoes")?.value || "";

  const competicoes = banco.competicoes
    .filter(c => !categoria || (c.categoria || "clube") === categoria)
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome));

  if (competicoes.length === 0) {
    lista.innerHTML = `
      <div class="card">
        <h3>Nenhuma competição cadastrada</h3>
        <p>Cadastre competições na página Inserir.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = competicoes.map(c => {
    const escudo = c.escudo
      ? `<img class="escudo-competicao-mini" src="${c.escudo}" alt="Escudo de ${limparTexto(c.nome)}">`
      : `<div class="escudo-competicao-placeholder">🏆</div>`;

    return `
      <div class="competicao-linha" onclick="abrirDetalhesLiga('${c.id}')">
        ${escudo}

        <div class="competicao-linha-info">
          <h3>${limparTexto(c.nome)}</h3>
          <p>
            ${limparTexto(c.bandeira || "")} ${limparTexto(c.local || "Local não informado")}
            • ${limparTexto((c.categoria || "clube") === "selecao" ? "Seleções" : "Clubes")}
            ${c.tipo ? ` • ${limparTexto(c.tipo)}` : ""}${c.abrangencia ? ` • ${limparTexto(c.abrangencia)}` : ""}
          </p>
        </div>
      </div>
    `;
  }).join("");
}

function abrirCompeticao(id) {
  abrirDetalhesLiga(id);
}

function contarRanking(nomes) {
  const mapa = {};
  nomes.forEach(nome => mapa[nome] = (mapa[nome] || 0) + 1);
  return Object.entries(mapa)
    .map(([nome, total]) => ({ nome, total }))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome));
}

/* ===== Fluxo solicitado: Competições Clubes/Seleções ===== */
function fpCompCategoria(c){ return c?.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : "clube") || "clube"; }
function fpCompTexto(v){ return String(v || "").trim().toLowerCase(); }
function fpCompEhMundo(c){ const a=fpCompTexto(c.abrangencia), t=fpCompTexto(c.tipo), l=fpCompTexto(c.local); return a==="mundial" || a==="mundo" || t.includes("mund") || l==="mundial" || l==="mundo"; }
function fpCompPais(c){ return c?.pais || ((c?.abrangencia === "País" || c?.abrangencia === "Pais") ? c.local : "") || ""; }
function fpCompContinente(c){ const p=fpCompPais(c); if (c?.continente) return c.continente; if (p && typeof buscarPaisSelecao === "function") return buscarPaisSelecao(p).continente || ""; return c?.abrangencia === "Continental" ? (c.local || "") : ""; }
function fpCompPaisesComContinente(){ const banco=carregarBanco(); const mapa=new Map(); [...(typeof PAISES_MUNDO_COMPLETO!=="undefined"?PAISES_MUNDO_COMPLETO:[]), ...(banco.paises||[])].forEach(p=>{ if(p&&p.nome) mapa.set(p.nome,{nome:p.nome, continente:p.continente || (buscarPaisSelecao(p.nome)?.continente || ""), bandeira:p.bandeira||""}); }); return Array.from(mapa.values()).sort((a,b)=>a.nome.localeCompare(b.nome)); }
function fpCompCarregarContinentes(){ const s=document.getElementById("filtroContinenteCompeticoes"); if(!s)return; const atual=s.value; const lista=(typeof CONTINENTES!=="undefined"?CONTINENTES:[]); s.innerHTML=`<option value="">Selecione um continente</option>`+lista.map(c=>`<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join(""); if(lista.includes(atual)) s.value=atual; }
function fpCompCarregarPaises(){ const cont=document.getElementById("filtroContinenteCompeticoes")?.value||""; const s=document.getElementById("filtroPaisCompeticoes"); if(!s)return; const atual=s.value; const paises=fpCompPaisesComContinente().filter(p=>!cont||p.continente===cont); s.innerHTML=`<option value="">Selecione um país</option>`+paises.map(p=>`<option value="${limparTexto(p.nome)}">${p.bandeira||""} ${limparTexto(p.nome)}</option>`).join(""); if(paises.some(p=>p.nome===atual)) s.value=atual; }
function fpCompAtualizarFiltros(){ const cat=document.getElementById("filtroCategoriaCompeticoes")?.value||"clube"; const abr=document.getElementById("filtroAbrangenciaCompeticoes")?.value||"Mundial"; const gAbr=document.getElementById("grupoAbrangenciaCompeticoes"), gC=document.getElementById("grupoContinenteCompeticoes"), gP=document.getElementById("grupoPaisCompeticoes"); const clubes=cat==="clube"; if(gAbr) gAbr.classList.toggle("oculto", !clubes); if(gC) gC.classList.toggle("oculto", !(clubes && abr==="Continental")); if(gP) gP.classList.toggle("oculto", !(clubes && abr==="Continental")); if(clubes && abr==="Continental") fpCompCarregarPaises(); }
renderizarCompeticoes = function(){
  const banco=carregarBanco(); const lista=document.getElementById("listaCompeticoes"); if(!lista)return; lista.classList.add("lista-competicoes");
  const cat=document.getElementById("filtroCategoriaCompeticoes")?.value||"clube"; const abr=document.getElementById("filtroAbrangenciaCompeticoes")?.value||"Mundial"; const cont=document.getElementById("filtroContinenteCompeticoes")?.value||""; const pais=document.getElementById("filtroPaisCompeticoes")?.value||"";
  let competicoes=(banco.competicoes||[]).filter(c=>fpCompCategoria(c)===cat);
  if(cat==="clube"){
    if(abr==="Mundial") competicoes=competicoes.filter(fpCompEhMundo);
    else competicoes=competicoes.filter(c=>{ const pc=fpCompPais(c); const cc=fpCompContinente(c); return pc && (!cont || cc===cont) && (!pais || pc===pais); });
  }
  competicoes=competicoes.slice().sort((a,b)=>a.nome.localeCompare(b.nome));
  if(!competicoes.length){ lista.innerHTML=`<div class="card"><h3>Nenhuma competição cadastrada</h3><p>Cadastre competições na página Inserir ou altere os filtros.</p></div>`; return; }
  lista.innerHTML=competicoes.map(c=>{ const escudo=c.escudo?`<img class="escudo-competicao-mini" src="${c.escudo}" alt="Escudo de ${limparTexto(c.nome)}">`:`<div class="escudo-competicao-placeholder">🏆</div>`; return `<div class="competicao-linha" onclick="abrirDetalhesLiga('${c.id}')">${escudo}<div class="competicao-linha-info"><h3>${limparTexto(c.nome)}</h3><p>${limparTexto(c.bandeira||"")} ${limparTexto(c.local||"Local não informado")} • ${fpCompCategoria(c)==="selecao"?"Seleções":"Clubes"}${c.tipo?` • ${limparTexto(c.tipo)}`:""}${c.abrangencia?` • ${limparTexto(c.abrangencia)}`:""}</p></div></div>`; }).join("");
};
document.addEventListener("DOMContentLoaded",()=>{ fpCompCarregarContinentes(); fpCompCarregarPaises(); fpCompAtualizarFiltros(); ["filtroCategoriaCompeticoes","filtroAbrangenciaCompeticoes","filtroContinenteCompeticoes","filtroPaisCompeticoes"].forEach(id=>document.getElementById(id)?.addEventListener("change",()=>{ if(id==="filtroContinenteCompeticoes") fpCompCarregarPaises(); fpCompAtualizarFiltros(); renderizarCompeticoes(); })); });

/* ===== CORREÇÃO FINAL - Página Competições =====
   Fluxo pedido:
   - Todas: exibe todas as competições cadastradas.
   - Clubes > Mundo: competições mundiais de clubes.
   - Clubes > Continentes: selecionar continente > selecionar país > competições do país.
   - Seleções: todas as competições de seleções cadastradas.
*/
(function(){
  function catComp(c){
    if (!c) return "clube";
    return c.categoria || (typeof normalizarCategoriaCompeticao === "function" ? normalizarCategoriaCompeticao(c) : "clube") || "clube";
  }
  function txt(v){ return String(v || "").trim().toLowerCase(); }
  function ehMundo(c){
    const a = txt(c.abrangencia), t = txt(c.tipo), l = txt(c.local);
    return a === "mundial" || a === "mundo" || t.includes("mund") || l === "mundial" || l === "mundo";
  }
  function paisDaCompeticao(c){
    if (!c) return "";
    return c.pais || ((c.abrangencia === "País" || c.abrangencia === "Pais") ? c.local : "") || "";
  }
  function continenteDoPais(nome){
    if (!nome) return "";
    if (typeof buscarPaisSelecao === "function") return buscarPaisSelecao(nome)?.continente || "";
    const p = (typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []).find(x => x.nome === nome);
    return p?.continente || "";
  }
  function paisesComContinente(){
    const banco = carregarBanco();
    const mapa = new Map();
    [...(typeof PAISES_MUNDO_COMPLETO !== "undefined" ? PAISES_MUNDO_COMPLETO : []), ...(banco.paises || [])].forEach(p => {
      if (!p || !p.nome) return;
      mapa.set(p.nome, { nome: p.nome, continente: p.continente || continenteDoPais(p.nome), bandeira: p.bandeira || "" });
    });
    return Array.from(mapa.values()).sort((a,b)=>a.nome.localeCompare(b.nome));
  }
  function prepararTela(){
    const categoria = document.getElementById("filtroCategoriaCompeticoes");
    const abrangencia = document.getElementById("filtroAbrangenciaCompeticoes");
    if (categoria) categoria.innerHTML = `<option value="todas">Todas</option><option value="clube">Clubes</option><option value="selecao">Seleções</option>`;
    if (abrangencia) abrangencia.innerHTML = `<option value="Mundial">Mundo</option><option value="Continental">Continentes</option>`;
    carregarContinentes();
    carregarPaises();
    atualizarVisibilidade();
  }
  function carregarContinentes(){
    const s = document.getElementById("filtroContinenteCompeticoes");
    if (!s) return;
    const atual = s.value;
    const lista = typeof CONTINENTES !== "undefined" ? CONTINENTES : [];
    s.innerHTML = `<option value="">Selecione um continente</option>` + lista.map(c => `<option value="${limparTexto(c)}">${limparTexto(c)}</option>`).join("");
    if (lista.includes(atual)) s.value = atual;
  }
  function carregarPaises(){
    const continente = document.getElementById("filtroContinenteCompeticoes")?.value || "";
    const s = document.getElementById("filtroPaisCompeticoes");
    if (!s) return;
    const atual = s.value;
    const paises = paisesComContinente().filter(p => !continente || p.continente === continente);
    s.innerHTML = `<option value="">Selecione um país</option>` + paises.map(p => `<option value="${limparTexto(p.nome)}">${p.bandeira || ""} ${limparTexto(p.nome)}</option>`).join("");
    if (paises.some(p => p.nome === atual)) s.value = atual;
  }
  function atualizarVisibilidade(){
    const categoria = document.getElementById("filtroCategoriaCompeticoes")?.value || "todas";
    const abrangencia = document.getElementById("filtroAbrangenciaCompeticoes")?.value || "Mundial";
    const gAbr = document.getElementById("grupoAbrangenciaCompeticoes");
    const gCont = document.getElementById("grupoContinenteCompeticoes");
    const gPais = document.getElementById("grupoPaisCompeticoes");
    const clubes = categoria === "clube";
    if (gAbr) gAbr.classList.toggle("oculto", !clubes);
    if (gCont) gCont.classList.toggle("oculto", !(clubes && abrangencia === "Continental"));
    if (gPais) gPais.classList.toggle("oculto", !(clubes && abrangencia === "Continental"));
  }
  window.renderizarCompeticoes = function(){
    const banco = carregarBanco();
    const lista = document.getElementById("listaCompeticoes");
    if (!lista) return;
    lista.classList.add("lista-competicoes");

    const categoria = document.getElementById("filtroCategoriaCompeticoes")?.value || "todas";
    const abrangencia = document.getElementById("filtroAbrangenciaCompeticoes")?.value || "Mundial";
    const continente = document.getElementById("filtroContinenteCompeticoes")?.value || "";
    const pais = document.getElementById("filtroPaisCompeticoes")?.value || "";

    if (categoria === "clube" && abrangencia === "Continental" && (!continente || !pais)) {
      lista.innerHTML = `<div class="card"><h3>Selecione o continente e o país</h3><p>Depois de selecionar o país, as competições cadastradas para ele serão exibidas aqui.</p></div>`;
      return;
    }

    let competicoes = (banco.competicoes || []).filter(c => categoria === "todas" || catComp(c) === categoria);

    if (categoria === "clube") {
      if (abrangencia === "Mundial") {
        competicoes = competicoes.filter(ehMundo);
      } else if (abrangencia === "Continental") {
        competicoes = competicoes.filter(c => paisDaCompeticao(c) === pais);
      }
    }

    competicoes = competicoes.slice().sort((a,b)=>a.nome.localeCompare(b.nome));

    if (!competicoes.length) {
      lista.innerHTML = `<div class="card"><h3>Nenhuma competição cadastrada</h3><p>Cadastre competições na página Inserir ou altere os filtros.</p></div>`;
      return;
    }

    lista.innerHTML = competicoes.map(c => {
      const escudo = c.escudo ? `<img class="escudo-competicao-mini" src="${c.escudo}" alt="Escudo de ${limparTexto(c.nome)}">` : `<div class="escudo-competicao-placeholder">🏆</div>`;
      return `<div class="competicao-linha" onclick="abrirDetalhesLiga('${c.id}')">${escudo}<div class="competicao-linha-info"><h3>${limparTexto(c.nome)}</h3><p>${limparTexto(c.bandeira || "")} ${limparTexto(c.local || "Local não informado")} • ${catComp(c) === "selecao" ? "Seleções" : "Clubes"}${c.tipo ? ` • ${limparTexto(c.tipo)}` : ""}${c.abrangencia ? ` • ${limparTexto(c.abrangencia)}` : ""}</p></div></div>`;
    }).join("");
  };
  document.addEventListener("DOMContentLoaded", () => {
    prepararTela();
    ["filtroCategoriaCompeticoes", "filtroAbrangenciaCompeticoes", "filtroContinenteCompeticoes", "filtroPaisCompeticoes"].forEach(id => {
      document.getElementById(id)?.addEventListener("change", () => {
        if (id === "filtroContinenteCompeticoes") carregarPaises();
        atualizarVisibilidade();
        window.renderizarCompeticoes();
      });
    });
    window.renderizarCompeticoes();
  });
})();
