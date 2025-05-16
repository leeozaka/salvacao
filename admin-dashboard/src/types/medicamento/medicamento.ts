import { Produto } from "../entities";

export interface Medicamento extends Produto {
  composicao: string;
}
export interface MedicamentoBackend {
  // Campos da tabela Produto
  id: number;
  nome: string;
  idTipoProduto: number;
  nomeTipoProduto?: string; // Campo calculado - join com TipoProduto
  idUnidadeMedidaPadrao: number;
  siglaUnidadeMedida?: string; // Campo calculado - join com UnidadeMedida
  nomeUnidadeMedida?: string; // Campo calculado - join com UnidadeMedida
  descricao?: string | null;
  codigoBarras?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  // Campos da tabela MedicamentoDetalhe
  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
}
