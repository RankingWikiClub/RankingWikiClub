import { supabase } from "./supabase";

export async function listarLigas() {
  const { data, error } = await supabase
    .from("ligas")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data;
}

export async function inserirLiga(liga) {
  const { data, error } = await supabase
    .from("ligas")
    .insert([liga])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarLiga(id, liga) {
  const { data, error } = await supabase
    .from("ligas")
    .update(liga)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function excluirLiga(id) {
  const { error } = await supabase
    .from("ligas")
    .delete()
    .eq("id", id);

  if (error) throw error;
}