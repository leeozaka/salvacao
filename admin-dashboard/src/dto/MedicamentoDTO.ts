// DTO/MedicamentoDTO.ts
export interface CreateMedicamentoDTO {
  // Campos da tabela Produto
  nome: string;
  idTipoProduto: number;
  idUnidadeMedidaPadrao: number;
  descricao?: string | null;
  codigoBarras?: string | null;

  // Campos da tabela MedicamentoDetalhe
  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
}

export interface UpdateMedicamentoDTO {
  // Campos da tabela Produto
  nome?: string;
  idTipoProduto?: number;
  idUnidadeMedidaPadrao?: number;
  descricao?: string | null;
  codigoBarras?: string | null;

  // Campos da tabela MedicamentoDetalhe
  dosagem?: string | null;
  principioAtivo?: string | null;
  fabricante?: string | null;
  necessitaReceita?: boolean;
}
