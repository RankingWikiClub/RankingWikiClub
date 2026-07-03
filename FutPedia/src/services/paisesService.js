import { supabase } from "./supabase";

export async function listarPaises() {
  const { data, error } = await supabase
    .from("paises")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data;
}

export async function inserirPais(pais) {
  const { data, error } = await supabase
    .from("paises")
    .insert([pais])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarPais(id, pais) {
  const { data, error } = await supabase
    .from("paises")
    .update(pais)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function excluirPais(id) {
  const { error } = await supabase
    .from("paises")
    .delete()
    .eq("id", id);

  if (error) throw error;
}