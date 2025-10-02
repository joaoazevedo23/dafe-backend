/* import {z} from "zod";

const MaxFileSize = 5 * 1024 *1024; // Tamanho máximo do arquivo em bytes (5MB)
const AcceptedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const UploadSchema = z.object({
    file: z.any()
    .refine((file) => file, "Arquivo é obrigatório.")
    .refine((file) => file?.size <= MaxFileSize, `O arquivo deve ser menor que ${MaxFileSize / (1024 * 1024)}MB.`)
    .refine((file) => AcceptedImageTypes.includes(file?.type), "Tipo de arquivo inválido. Apenas arquivos de imagem são aceitos."),
}); */