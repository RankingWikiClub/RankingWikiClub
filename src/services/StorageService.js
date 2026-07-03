import { supabase } from "./supabase";

export async function uploadImagem(bucket, caminho, arquivo) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(caminho, arquivo, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;
  return data;
}

export function obterUrlPublica(bucket, caminho) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(caminho);
  return data.publicUrl;
}