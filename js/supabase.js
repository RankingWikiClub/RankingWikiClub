/* FutPédia - Configuração central do Supabase
   Este arquivo centraliza a URL, a Publishable Key e a sincronização dos dados do projeto.
   Alterações aqui não apagam nem modificam os dados já cadastrados no Supabase.
*/
const FUTPEDIA_SUPABASE_URL = "https://uypihtlcwgqkciyrzjkb.supabase.co";
const FUTPEDIA_SUPABASE_ANON_KEY = "sb_publishable_U2pudVBg3h6Yb-OjS3ALKQ_bNVAPJgV";

/* Tabela usada para manter o mesmo banco de dados em computador e celular.
   SQL necessário no Supabase:

   create table if not exists futpedia_dados (
     id text primary key,
     dados jsonb not null,
     atualizado_em timestamptz default now()
   );

   alter table futpedia_dados enable row level security;

   drop policy if exists "futpedia_dados leitura publica" on futpedia_dados;
   create policy "futpedia_dados leitura publica"
   on futpedia_dados for select
   using (true);

   drop policy if exists "futpedia_dados escrita autenticada" on futpedia_dados;
   create policy "futpedia_dados escrita autenticada"
   on futpedia_dados for all
   to authenticated
   using (true)
   with check (true);
*/
const FUTPEDIA_TABELA_DADOS = "futpedia_dados";
const FUTPEDIA_LINHA_DADOS = "principal";
const FUTPEDIA_STORAGE_KEY = "futpedia_v8";

let futpediaSupabase = null;
let futpediaSincronizacaoIniciada = false;
let futpediaSincronizando = false;
let futpediaTimerUpload = null;

function supabaseConfigurado() {
  return FUTPEDIA_SUPABASE_URL && FUTPEDIA_SUPABASE_ANON_KEY &&
    !FUTPEDIA_SUPABASE_URL.includes("COLE_AQUI") &&
    !FUTPEDIA_SUPABASE_ANON_KEY.includes("COLE_AQUI");
}

function clienteSupabase() {
  if (!supabaseConfigurado()) return null;
  if (!window.supabase) return null;
  if (!futpediaSupabase) {
    futpediaSupabase = window.supabase.createClient(
      FUTPEDIA_SUPABASE_URL,
      FUTPEDIA_SUPABASE_ANON_KEY
    );
  }
  return futpediaSupabase;
}

function futpediaBancoLocal() {
  try {
    return JSON.parse(localStorage.getItem(FUTPEDIA_STORAGE_KEY) || "null");
  } catch (erro) {
    return null;
  }
}

function futpediaTotalRegistros(banco) {
  if (!banco || typeof banco !== "object") return 0;
  return ["clubes", "selecoes", "competicoes", "titulos"].reduce((total, chave) => {
    return total + (Array.isArray(banco[chave]) ? banco[chave].length : 0);
  }, 0);
}

function futpediaPrepararBancoParaNuvem(banco) {
  const copia = banco && typeof banco === "object" ? JSON.parse(JSON.stringify(banco)) : {};
  copia._futpediaSync = {
    atualizadoEm: new Date().toISOString(),
    origem: "site"
  };
  return copia;
}

async function futpediaUsuarioPodeEscrever() {
  const supa = clienteSupabase();
  if (!supa) return false;
  try {
    const { data } = await supa.auth.getSession();
    return !!data?.session?.user;
  } catch (erro) {
    return false;
  }
}

async function futpediaBuscarBancoNuvem() {
  const supa = clienteSupabase();
  if (!supa) return null;
  const { data, error } = await supa
    .from(FUTPEDIA_TABELA_DADOS)
    .select("dados, atualizado_em")
    .eq("id", FUTPEDIA_LINHA_DADOS)
    .maybeSingle();

  if (error) {
    console.warn("FutPédia: não foi possível ler o banco na nuvem.", error.message || error);
    return null;
  }
  return data?.dados || null;
}

async function futpediaEnviarBancoNuvem(banco) {
  const supa = clienteSupabase();
  if (!supa || !banco) return false;
  try {
    const { error } = await supa
      .from(FUTPEDIA_TABELA_DADOS)
      .upsert({
        id: FUTPEDIA_LINHA_DADOS,
        dados: futpediaPrepararBancoParaNuvem(banco),
        atualizado_em: new Date().toISOString()
      });

    if (error) {
      console.warn("FutPédia: não foi possível salvar o banco na nuvem.", error.message || error);
      return false;
    }
    return true;
  } catch (erro) {
    console.warn("FutPédia: erro ao salvar banco na nuvem.", erro);
    return false;
  }
}

function futpediaAgendarUploadBanco() {
  clearTimeout(futpediaTimerUpload);
  futpediaTimerUpload = setTimeout(async () => {
    if (!(await futpediaUsuarioPodeEscrever())) return;
    const banco = futpediaBancoLocal();
    if (banco) await futpediaEnviarBancoNuvem(banco);
  }, 700);
}

function futpediaAtivarUploadAutomatico() {
  if (window.__futpediaSalvarBancoOriginal) return;
  if (typeof window.salvarBanco !== "function") return;

  window.__futpediaSalvarBancoOriginal = window.salvarBanco;
  window.salvarBanco = function salvarBancoSincronizado(banco) {
    window.__futpediaSalvarBancoOriginal(banco);
    futpediaAgendarUploadBanco();
  };
}

async function sincronizarBancoSupabase() {
  if (futpediaSincronizando) return;
  futpediaSincronizando = true;

  try {
    const bancoLocal = futpediaBancoLocal();
    const bancoNuvem = await futpediaBuscarBancoNuvem();

    const totalLocal = futpediaTotalRegistros(bancoLocal);
    const totalNuvem = futpediaTotalRegistros(bancoNuvem);

    if (bancoNuvem && totalNuvem > totalLocal) {
      localStorage.setItem(FUTPEDIA_STORAGE_KEY, JSON.stringify(bancoNuvem));
      sessionStorage.setItem("futpedia_sync_reload", "1");
      location.reload();
      return;
    }

    if (bancoLocal && totalLocal > totalNuvem && await futpediaUsuarioPodeEscrever()) {
      await futpediaEnviarBancoNuvem(bancoLocal);
    }
  } finally {
    futpediaSincronizando = false;
  }
}

function iniciarSincronizacaoFutpedia() {
  if (futpediaSincronizacaoIniciada) return;
  futpediaSincronizacaoIniciada = true;
  futpediaAtivarUploadAutomatico();

  // Evita recarregar em loop se a página acabou de ser atualizada pela sincronização.
  if (sessionStorage.getItem("futpedia_sync_reload") === "1") {
    sessionStorage.removeItem("futpedia_sync_reload");
    futpediaAgendarUploadBanco();
    return;
  }

  setTimeout(() => {
    sincronizarBancoSupabase();
  }, 500);
}

window.clienteSupabase = clienteSupabase;
window.supabaseConfigurado = supabaseConfigurado;
window.sincronizarBancoSupabase = sincronizarBancoSupabase;
window.futpediaEnviarBancoNuvem = futpediaEnviarBancoNuvem;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarSincronizacaoFutpedia);
} else {
  iniciarSincronizacaoFutpedia();
}
