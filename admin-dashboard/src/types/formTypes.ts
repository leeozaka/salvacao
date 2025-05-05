// Tipos específicos para o formulário de medicação

export type ViaAdministracaoType =
  | "oral"
  | "injetável"
  | "tópica"
  | "ocular"
  | "auricular";

export interface FormDataType {
  animalId: number | string;
  medicamentoId: number | string;
  dose: string;
  unidadeId: number | string;
  data: string;
  hora: string;
  observacoes: string;
  viaAdministracao: ViaAdministracaoType;
  responsavelId: number | string;
  receitaId?: number | string;
  quantidadeDias?: string;
  intervaloHoras?: string;
}
