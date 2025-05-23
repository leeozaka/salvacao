import { Produto } from "../entities";

export interface Medicamento extends Produto {
  composicao: string;
}
export interface MedicamentoBackend {
  id: number;
  nome: string;
  idTipoProduto: number;
  nomeTipoProduto?: string;
  idUnidadeMedidaPadrao: number;
  siglaUnidadeMedida?: string;
  nomeUnidadeMedida?: string;
  descricao?: string | null;
  codigoBarras?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
}
