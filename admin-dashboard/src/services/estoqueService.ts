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
            idproduto: 1,
            nome: "Ração Premium Cães",
            idtipoproduto: 1,
            idunidademedida: 1,
            fabricante: "PetFood Inc.",
            dataValidade: new Date("2026-05-01"),
          },
          {
            idproduto: 2,
            nome: "Antipulgas Gatos",
            idtipoproduto: 2,
            idunidademedida: 2,
            fabricante: "VetPharma",
            dataValidade: new Date("2025-12-15"),
          },
          {
            idproduto: 3,
            nome: "Shampoo Hipoalergênico",
            idtipoproduto: 3,
            idunidademedida: 3,
            fabricante: "CleanPet",
            dataValidade: null,
          },
          {
            idproduto: 4,
            nome: "Coleira Ajustável",
            idtipoproduto: 4,
            idunidademedida: 2,
            fabricante: "PetGear",
            dataValidade: null,
          },
          {
            idproduto: 5,
            nome: "Vitamina C para Aves",
            idtipoproduto: 5,
            idunidademedida: 4,
            fabricante: "NutriPet",
            dataValidade: new Date("2025-10-30"),
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
          { idestoque: 1, idproduto: 1, quantidade: 25 },
          { idestoque: 2, idproduto: 2, quantidade: 15 },
          { idestoque: 3, idproduto: 3, quantidade: 8 },
          { idestoque: 4, idproduto: 4, quantidade: 12 },
          { idestoque: 5, idproduto: 5, quantidade: 6 },
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
