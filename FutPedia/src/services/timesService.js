import { supabase } from "./supabase";

export async function listarTimes() {
  const { data, error } = await supabase
    .from("times")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data;
}

export async function buscarTimePorId(id) {
  const { data, error } = await supabase
    .from("times")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function listarTitulosDoTime(id) {
  const { data, error } = await supabase
    .from("edicoes")
    .select("*")
    .or(`campeao_id.eq.${id},vice_id.eq.${id}`)
    .order("temporada", { ascending: false });

  if (error) throw error;
  return data;
}

export async function inserirTime(time) {
  const { data, error } = await supabase
    .from("times")
    .insert([time])
    .select();

  if (error) throw error;
  return data;
}

export async function atualizarTime(id, time) {
  const { data, error } = await supabase
    .from("times")
    .update(time)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function excluirTime(id) {
  const { error } = await supabase
    .from("times")
    .delete()
    .eq("id", id);

  if (error) throw error;
}