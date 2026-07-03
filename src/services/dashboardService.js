import { supabase } from "./supabase";

async function contarTabela(tabela) {
  const { count, error } = await supabase
    .from(tabela)
    .select("*", { count: "exact", head: true });

  if (error) throw error;

  return count || 0;
}

export async function carregarDashboard() {
  const [continentes, paises, ligas, times, competicoes] = await Promise.all([
    contarTabela("continentes"),
    contarTabela("paises"),
    contarTabela("ligas"),
    contarTabela("times"),
    contarTabela("competicoes"),
  ]);

  return {
    continentes,
    paises,
    ligas,
    times,
    competicoes,
  };
}