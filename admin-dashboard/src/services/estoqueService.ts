import { Produto, SaidaProduto, TipoSaida, Estoque } from "@/types/entities";

/**
 * Busca todos os produtos cadastrados
 * @returns Promise com lista de produtos
 */
export async function buscarProdutos(): Promise<Produto[]> {
  try {
    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            nome: "Ração Premium Cães",
            idTipoProduto: 1,
            idUnidadeMedidaPadrao: 1,
            descricao: "Ração Premium Cães",
            codigoBarras: "1234567890",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            tipoProduto: { id: 1, nome: "Ração" },
            unidadeMedidaPadrao: { id: 1, nome: "kg", sigla: "kg" },
          },
          {
            id: 2,
            nome: "Antipulgas Gatos",
            idTipoProduto: 2,
            idUnidadeMedidaPadrao: 2,
            descricao: "Antipulgas Gatos",
            codigoBarras: "1234567890",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            tipoProduto: { id: 2, nome: "Antipulgas" },
            unidadeMedidaPadrao: { id: 2, nome: "g", sigla: "g" },
          },
          {
            id: 3,
            nome: "Shampoo Hipoalergênico",
            idTipoProduto: 3,
            idUnidadeMedidaPadrao: 3,
            descricao: "Shampoo Hipoalergênico",
            codigoBarras: "1234567890",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            tipoProduto: { id: 3, nome: "Shampoo" },
            unidadeMedidaPadrao: { id: 3, nome: "ml", sigla: "ml" },
          },
          {
            id: 4,
            nome: "Coleira Ajustável",
            idTipoProduto: 4,
            idUnidadeMedidaPadrao: 2,
            descricao: "Coleira Ajustável",
            codigoBarras: "1234567890",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            tipoProduto: { id: 4, nome: "Coleira" },
            unidadeMedidaPadrao: { id: 2, nome: "cm", sigla: "cm" },
          },
          {
            id: 5,
            nome: "Vitamina C para Aves",
            idTipoProduto: 5,
            idUnidadeMedidaPadrao: 4,
            descricao: "Vitamina C para Aves",
            codigoBarras: "1234567890",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            tipoProduto: { id: 5, nome: "Vitamina" },
            unidadeMedidaPadrao: { id: 4, nome: "mg", sigla: "mg" },
          },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

/**
 * Busca todos os tipos de saída cadastrados
 * @returns Promise com lista de tipos de saída
 */
export async function buscarTiposSaida(): Promise<TipoSaida[]> {
  try {
    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { idtiposaida: 1, descricao: "Saída" },
          { idtiposaida: 2, descricao: "Acerto" },
          { idtiposaida: 3, descricao: "Consumo" },
          { idtiposaida: 4, descricao: "Devolução" },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar tipos de saída:", error);
    return [];
  }
}

/**
 * Busca as quantidades de estoque de todos os produtos
 * @returns Promise com lista de estoques
 */
export async function buscarQuantidadeEstoque(): Promise<Estoque[]> {
  try {
    // Simulando dados para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, idProduto: 1, quantidade: 25, idUnidadeMedida: 1, dataEntradaEstoque: new Date(), produto: { id: 1, nome: "Ração Premium Cães", idTipoProduto: 1, idUnidadeMedidaPadrao: 1, descricao: "Ração Premium Cães", codigoBarras: "1234567890", isActive: true, createdAt: new Date(), updatedAt: new Date(), tipoProduto: { id: 1, nome: "Ração" }, unidadeMedidaPadrao: { id: 1, nome: "kg", sigla: "kg" } }, unidadeMedida: { id: 1, nome: "kg", sigla: "kg" } },
          { id: 2, idProduto: 2, quantidade: 15, idUnidadeMedida: 2, dataEntradaEstoque: new Date(), produto: { id: 2, nome: "Antipulgas Gatos", idTipoProduto: 2, idUnidadeMedidaPadrao: 2, descricao: "Antipulgas Gatos", codigoBarras: "1234567890", isActive: true, createdAt: new Date(), updatedAt: new Date(), tipoProduto: { id: 2, nome: "Antipulgas" }, unidadeMedidaPadrao: { id: 2, nome: "g", sigla: "g" } }, unidadeMedida: { id: 2, nome: "g", sigla: "g" } },
        ]);
      }, 300);
    });
  } catch (error) {
    console.error("Erro ao buscar quantidades de estoque:", error);
    return [];
  }
}

/**
 * Registra uma nova saída de produto (acerto de estoque)
 * @param saida Dados da saída do produto
 * @returns Promise com a resposta da operação
 */
export async function registrarSaidaProduto(
  saida: SaidaProduto,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulando resposta de sucesso para desenvolvimento
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Saída registrada:", saida);
        resolve({ success: true });
      }, 1500);
    });
  } catch (error) {
    console.error("Erro ao registrar saída:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao registrar saída",
    };
  }
}
