import { env } from "@/config/env";
import { AppError, ErrorCode } from "@/utils/errors/AppError";
import { Logger } from "@/utils/logger/Logger";

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  transformation?: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export async function uploadImage(
  fileUri: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  try {
    if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_UPLOAD_PRESET) {
      throw new AppError("Credenciais do Cloudinary não configuradas.", ErrorCode.CLOUDINARY_UPLOAD_FAILED, 500);
    }

    const cloudName = env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = env.CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);
    formData.append("upload_preset", uploadPreset);
    if (env.CLOUDINARY_API_KEY) {
      formData.append("api_key", env.CLOUDINARY_API_KEY);
    }

    if (options.folder) {
      formData.append("folder", options.folder);
    }
    if (options.tags && options.tags.length > 0) {
      formData.append("tags", options.tags.join(","));
    }

    formData.append("transformation", options.transformation || "f_auto,q_auto");

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData?.error?.message || "Falha ao carregar imagem para o Cloudinary.",
        ErrorCode.CLOUDINARY_UPLOAD_FAILED,
        response.status
      );
    }

    const data: CloudinaryUploadResponse = await response.json();
    Logger.info("Imagem carregada para o Cloudinary com sucesso", { public_id: data.public_id, url: data.secure_url });
    return data;
  } catch (error) {
    Logger.error("Erro no upload para o Cloudinary", error);
    throw AppError.fromError(error, "Falha ao carregar imagem.");
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    Logger.info(`Solicitação de exclusão de imagem do Cloudinary: ${publicId}`);
    return true;
  } catch (error) {
    Logger.error(`Erro ao apagar imagem do Cloudinary (${publicId})`, error);
    throw AppError.fromError(error, "Falha ao apagar imagem.");
  }
}

export async function updateImage(
  oldPublicId: string,
  newFileUri: string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  try {
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    return await uploadImage(newFileUri, options);
  } catch (error) {
    Logger.error("Erro ao atualizar imagem no Cloudinary", error);
    throw AppError.fromError(error, "Falha ao atualizar imagem.");
  }
}

export function getTransformedImageUrl(publicId: string, transformations = "f_auto,q_auto,c_thumb,w_300,h_300"): string {
  const cloudName = env.CLOUDINARY_CLOUD_NAME || "de7pp8857";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}
