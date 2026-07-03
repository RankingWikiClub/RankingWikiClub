import { supabase } from "./supabase";

export async function listarCompeticoes() {
  const { data, error } = await supabase
    .from("competicoes")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data;
}

export async function buscarCompeticaoPorId(id) {
  const { data, error } = await supabase
    .from("competicoes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function inserirCompeticao(competicao) {
  const { data, error } = await supabase
    .from("competicoes")
    .insert([competicao])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarCompeticao(id, competicao) {
  const { data, error } = await supabase
    .from("competicoes")
    .update(competicao)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function excluirCompeticao(id) {
  const { error } = await supabase
    .from("competicoes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}