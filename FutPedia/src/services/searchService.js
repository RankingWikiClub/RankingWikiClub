import { supabase } from "./supabase";

export async function pesquisarTudo(termo) {
  if (!termo.trim()) {
    return {
      times: [],
      competicoes: [],
      paises: [],
      continentes: [],
      organizacoes: [],
    };
  }

  const [
    times,
    competicoes,
    paises,
    continentes,
    organizacoes,
  ] = await Promise.all([
    supabase.from("times").select("id, nome").ilike("nome", `%${termo}%`),
    supabase.from("competicoes").select("id, nome").ilike("nome", `%${termo}%`),
    supabase.from("paises").select("id, nome").ilike("nome", `%${termo}%`),
    supabase.from("continentes").select("id, nome").ilike("nome", `%${termo}%`),
    supabase.from("organizacoes").select("id, nome").ilike("nome", `%${termo}%`),
  ]);

  return {
    times: times.data || [],
    competicoes: competicoes.data || [],
    paises: paises.data || [],
    continentes: continentes.data || [],
    organizacoes: organizacoes.data || [],
  };
}