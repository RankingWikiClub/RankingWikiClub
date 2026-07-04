import { supabase } from "./supabase";

export async function uploadEscudoTime(file) {
  if (!file) return null;

  const extensao = file.name.split(".").pop();
  const nomeArquivo = `times/${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("escudos")
    .upload(nomeArquivo, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("escudos")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}
