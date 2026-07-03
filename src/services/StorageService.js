import { supabase } from "./supabase";

export async function uploadEscudoTime(arquivo) {
  if (!arquivo) return null;

  const extensao = arquivo.name.split(".").pop();
  const nomeArquivo = `escudo-${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("escudos-times")
    .upload(nomeArquivo, arquivo, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("escudos-times")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}