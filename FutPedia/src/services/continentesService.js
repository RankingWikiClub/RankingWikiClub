import { supabase } from "./supabase";

export async function listarContinentes() {
  const { data, error } = await supabase
    .from("continentes")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function inserirContinente(dados) {
  const { data, error } = await supabase
    .from("continentes")
    .insert([dados])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarContinente(id, dados) {
  const { data, error } = await supabase
    .from("continentes")
    .update(dados)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function excluirContinente(id) {
  const { error } = await supabase
    .from("continentes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}