/* RankingWikiClub - Upload de imagens para Supabase Storage
   Buckets usados:
   - escudos-times
   - escudos-selecoes
   - logos-competicoes
*/

function fpStorageCliente() {
  return typeof clienteSupabase === "function" ? clienteSupabase() : null;
}

function fpStorageSlug(texto) {
  return String(texto || "imagem")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "imagem";
}

function fpStorageExtensao(nomeArquivo, tipoArquivo) {
  const nome = String(nomeArquivo || "").toLowerCase();
  const ext = nome.split(".").pop();
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return ext;
  if (tipoArquivo === "image/png") return "png";
  if (tipoArquivo === "image/webp") return "webp";
  return "jpg";
}

function fpStorageValidarImagem(arquivo) {
  if (!arquivo) return "";
  if (!arquivo.type || !arquivo.type.startsWith("image/")) {
    return "Selecione um arquivo de imagem.";
  }
  const permitidos = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!permitidos.includes(arquivo.type)) {
    return "Formato inválido. Use PNG, JPG, JPEG ou WEBP.";
  }
  const limiteMb = 5;
  if (arquivo.size > limiteMb * 1024 * 1024) {
    return `A imagem deve ter no máximo ${limiteMb} MB.`;
  }
  return "";
}

async function fpUploadArquivoStorage(bucket, arquivo, nomeBase) {
  const supabase = fpStorageCliente();
  if (!supabase) throw new Error("Supabase não configurado.");
  if (!arquivo) return "";

  const erroValidacao = fpStorageValidarImagem(arquivo);
  if (erroValidacao) throw new Error(erroValidacao);

  const ext = fpStorageExtensao(arquivo.name, arquivo.type);
  const nomeSeguro = fpStorageSlug(nomeBase || arquivo.name);
  const caminho = `${nomeSeguro}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(caminho, arquivo, {
      cacheControl: "3600",
      upsert: true,
      contentType: arquivo.type || `image/${ext}`
    });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(caminho);
  return data?.publicUrl || "";
}

async function fpUploadImagemInput(inputId, bucket, nomeBase) {
  const input = document.getElementById(inputId);
  const arquivo = input?.files?.[0];
  if (arquivo) return await fpUploadArquivoStorage(bucket, arquivo, nomeBase || inputId);
  return input?.dataset?.webLogoUrl || "";
}

function fpCriarPreviewImagem(inputId, previewId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  let preview = document.getElementById(previewId);
  if (!preview) {
    preview = document.createElement("img");
    preview.id = previewId;
    preview.alt = "Prévia da imagem";
    preview.style.maxWidth = "120px";
    preview.style.maxHeight = "120px";
    preview.style.display = "none";
    preview.style.marginTop = "8px";
    preview.style.borderRadius = "8px";
    input.insertAdjacentElement("afterend", preview);
  }

  input.addEventListener("change", () => {
    const arquivo = input.files?.[0];
    if (!arquivo) {
      preview.removeAttribute("src");
      preview.style.display = "none";
      return;
    }

    const erro = fpStorageValidarImagem(arquivo);
    if (erro) {
      alert(erro);
      input.value = "";
      preview.removeAttribute("src");
      preview.style.display = "none";
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      preview.src = ev.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(arquivo);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fpCriarPreviewImagem("escudo", "previewEscudoTime");
  fpCriarPreviewImagem("escudoSelecao", "previewEscudoSelecao");
  fpCriarPreviewImagem("escudoCompeticao", "previewLogoCompeticao");
  fpCriarPreviewImagem("editEscudo", "previewEditEscudo");
});

window.fpUploadArquivoStorage = fpUploadArquivoStorage;
window.fpUploadImagemInput = fpUploadImagemInput;
window.fpCriarPreviewImagem = fpCriarPreviewImagem;
