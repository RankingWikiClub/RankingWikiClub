/* FutPédia - Login e permissões com Supabase Auth
   A configuração do Supabase fica centralizada em js/supabase.js.
*/

async function obterSessao() {
  const supa = clienteSupabase();
  if (!supa) return { user: null, perfil: null };

  const { data: sessaoData } = await supa.auth.getSession();
  const user = sessaoData?.session?.user || null;
  if (!user) return { user: null, perfil: null };

  const { data: perfilData } = await supa
    .from("perfis")
    .select("perfil,email")
    .eq("id", user.id)
    .maybeSingle();

  return { user, perfil: perfilData?.perfil || null };
}

function podeEditar(perfil) {
  return perfil === "admin" || perfil === "editor";
}

function podeExcluir(perfil) {
  return perfil === "admin";
}

async function loginFutpedia(email, senha) {
  const supa = clienteSupabase();
  if (!supa) throw new Error("Configure a URL e a Publishable Key do Supabase no arquivo js/supabase.js");

  const { data, error } = await supa.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  return data;
}

async function sairFutpedia() {
  const supa = clienteSupabase();
  if (supa) await supa.auth.signOut();
  window.location.href = "./index.html";
}

async function protegerPagina() {
  const nivel = document.body?.dataset?.protected;
  const { user, perfil } = await obterSessao();

  document.body.dataset.perfil = perfil || "visitante";

  if (nivel === "editor" && (!user || !podeEditar(perfil))) {
    window.location.href = "./login.html?redirect=" + encodeURIComponent(location.pathname.split('/').pop() || "index.html");
    return;
  }

  if (nivel === "admin" && (!user || perfil !== "admin")) {
    window.location.href = "./login.html";
    return;
  }

  atualizarMenuAuth(user, perfil);
  aplicarPermissoesVisuais(perfil);
}

function atualizarMenuAuth(user, perfil) {
  const menus = document.querySelectorAll(".menu");
  menus.forEach(menu => {
    const linksPrivados = menu.querySelectorAll('a[href$="cadastros.html"], a[href$="editor.html"], a[href$="edicoes.html"]');
    linksPrivados.forEach(link => {
      if (!podeEditar(perfil)) link.style.display = "none";
      else link.style.display = "inline-flex";
    });

    if (!menu.querySelector(".auth-link")) {
      const a = document.createElement("a");
      a.className = "auth-link";
      if (user) {
        a.href = "#";
        a.textContent = "Sair";
        a.title = perfil ? `Perfil: ${perfil}` : "Sair";
        a.addEventListener("click", e => {
          e.preventDefault();
          sairFutpedia();
        });
      } else {
        a.href = "./login.html";
        a.textContent = "Login";
      }
      menu.appendChild(a);
    }
  });
}

function aplicarPermissoesVisuais(perfil) {
  const bloquearExclusao = () => {
    if (podeExcluir(perfil)) return;
    document.querySelectorAll("button, a").forEach(el => {
      const txt = (el.textContent || "").trim().toLowerCase();
      if (txt === "excluir" || txt.includes("excluir")) {
        el.style.display = "none";
        el.disabled = true;
      }
    });
  };
  bloquearExclusao();
  const obs = new MutationObserver(bloquearExclusao);
  obs.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", protegerPagina);
