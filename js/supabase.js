/* FutPédia - Configuração central do Supabase
   Este arquivo centraliza a URL e a Publishable Key do projeto.
   Alterações aqui não apagam nem modificam os dados já cadastrados no Supabase.
*/
const FUTPEDIA_SUPABASE_URL = "https://uypihtlcwgqkciyrzjkb.supabase.co";
const FUTPEDIA_SUPABASE_ANON_KEY = "sb_publishable_U2pudVBg3h6Yb-OjS3ALKQ_bNVAPJgV";

let futpediaSupabase = null;

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

window.clienteSupabase = clienteSupabase;
window.supabaseConfigurado = supabaseConfigurado;
