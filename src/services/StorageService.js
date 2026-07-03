import { supabase } from "./supabase";

/**
 * Faz upload do escudo de um time para o bucket "imagens"
 * e retorna a URL pública.
 */
export async function uploadEscudoTime(file) {
  if (!file) return null;

  const extensao = file.name.split(".").pop();
  const nomeArquivo = `escudos/${Date.now()}.${extensao}`;

  const { error } = await supabase.storage
    .from("imagens")
    .upload(nomeArquivo, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error(error);
    throw error;
  }

  const { data } = supabase.storage
    .from("imagens")
    .getPublicUrl(nomeArquivo);

  return data.publicUrl;
}

/**
 * Upload genérico de qualquer arquivo.
 */
export async function uploadArquivo(bucket, caminho, file) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(caminho, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  return data;
}

/**
 * Retorna a URL pública de um arquivo.
 */
export function obterUrlPublica(bucket, caminho) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(caminho);

  return data.publicUrl;
}

/**
 * Remove um arquivo do Storage.
 */
export async function excluirArquivo(bucket, caminho) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([caminho]);

  if (error) throw error;

  return true;
}