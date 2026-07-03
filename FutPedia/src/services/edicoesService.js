import { supabase } from "./supabase";

export async function listarEdicoes() {
  const { data, error } = await supabase
    .from("edicoes")
    .select("*")
    .order("temporada", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function inserirEdicao(dados) {
  const { data, error } = await supabase
    .from("edicoes")
    .insert([dados])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarEdicao(id, dados) {
  const { data, error } = await supabase
    .from("edicoes")
    .update(dados)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function excluirEdicao(id) {
  const { error } = await supabase
    .from("edicoes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}