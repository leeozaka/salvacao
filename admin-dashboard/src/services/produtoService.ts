import { Produto, TipoProduto, UnidadeDeMedida } from "@/types/entities";

// Dados simulados
const tiposExemplo: TipoProduto[] = [
  {
    idtipoproduto: 1,
    descricao: "Medicamentos",
    controlaValidade: true,
  },
  { idtipoproduto: 2, descricao: "Vacinas", controlaValidade: true },
  {
    idtipoproduto: 3,
    descricao: "Alimentos",
    controlaValidade: true,
  },
  {
    idtipoproduto: 4,
    descricao: "Acessórios",
    controlaValidade: false,
  },
  { idtipoproduto: 5, descricao: "Higiene", controlaValidade: true },
];

const unidadesExemplo: UnidadeDeMedida[] = [
  { idunidademedida: 1, descricao: "Unidade" },
  { idunidademedida: 2, descricao: "Kg" },
  { idunidademedida: 3, descricao: "g" },
  { idunidademedida: 4, descricao: "ml" },
  { idunidademedida: 5, descricao: "L" },
];

const produtosExemplo: Produto[] = [
  {
    idproduto: 1,
    nome: "Ração Premium Cães",
    idtipoproduto: 3,
    idunidademedida: 2,
    fabricante: "PetNutri",
    dataValidade: new Date("2025-07-15"),
  },
  {
    idproduto: 2,
    nome: "Antipulgas Gatos",
    idtipoproduto: 1,
    idunidademedida: 1,
    fabricante: "VetPharma",
    dataValidade: new Date("2025-03-10"),
  },
  {
    idproduto: 3,
    nome: "Vacina Antirrábica",
    idtipoproduto: 2,
    idunidademedida: 1,
    fabricante: "BioVet",
    dataValidade: new Date("2025-05-22"),
  },
  {
    idproduto: 4,
    nome: "Shampoo Hipoalergênico",
    idtipoproduto: 5,
    idunidademedida: 5,
    fabricante: "PetClean",
    dataValidade: new Date("2026-01-30"),
  },
  {
    idproduto: 5,
    nome: "Coleira Ajustável P",
    idtipoproduto: 4,
    idunidademedida: 1,
    fabricante: "PetAcessórios",
    dataValidade: null,
  },
];

// Função para simular o tempo de resposta da API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Funções para buscar dados
export const buscarTiposProduto = async (): Promise<TipoProduto[]> => {
  try {
    // Simulando chamada à API
    await delay(1000);
    return [...tiposExemplo];
  } catch (error) {
    console.error("Erro ao buscar tipos de produto:", error);
    throw new Error("Falha ao carregar tipos de produto.");
  }
};

export const buscarUnidadesMedida = async (): Promise<UnidadeDeMedida[]> => {
  try {
    // Simulando chamada à API
    await delay(800);
    return [...unidadesExemplo];
  } catch (error) {
    console.error("Erro ao buscar unidades de medida:", error);
    throw new Error("Falha ao carregar unidades de medida.");
  }
};

export const buscarProdutos = async (): Promise<Produto[]> => {
  try {
    // Simulando chamada à API
    await delay(1200);
    return [...produtosExemplo];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Falha ao carregar produtos.");
  }
};

// Funções para adicionar novos dados
export interface NovoProdutoDTO {
  nome: string;
  idtipoproduto: number;
  idunidademedida: number;
  fabricante: string;
  dataValidade?: string;
}

export const adicionarProduto = async (
  produto: NovoProdutoDTO,
): Promise<Produto> => {
  try {
    // Simulando chamada à API
    await delay(1500);

    // Validações
    if (!produto.nome.trim()) {
      throw new Error("Nome do produto é obrigatório");
    }

    if (produto.idtipoproduto === 0) {
      throw new Error("Selecione um tipo de produto");
    }

    if (produto.idunidademedida === 0) {
      throw new Error("Selecione uma unidade de medida");
    }

    // Verificar se o tipo controla validade
    const tipo = tiposExemplo.find(
      (t) => t.idtipoproduto === produto.idtipoproduto,
    );
    if (tipo && tipo.controlaValidade && !produto.dataValidade) {
      throw new Error(
        "Data de validade é obrigatória para este tipo de produto",
      );
    }

    // Criar novo produto
    const novoProduto: Produto = {
      idproduto: Math.max(...produtosExemplo.map((p) => p.idproduto)) + 1,
      nome: produto.nome,
      idtipoproduto: produto.idtipoproduto,
      idunidademedida: produto.idunidademedida,
      fabricante: produto.fabricante,
      dataValidade: produto.dataValidade
        ? new Date(produto.dataValidade)
        : null,
    };

    // Adicionar produto à lista (simulando o banco de dados)
    produtosExemplo.push(novoProduto);

    return novoProduto;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    throw error;
  }
};

export interface NovoTipoDTO {
  descricao: string;
  controlaValidade: boolean;
}

export const adicionarTipoProduto = async (
  tipo: NovoTipoDTO,
): Promise<TipoProduto> => {
  try {
    // Simulando chamada à API
    await delay(1500);

    // Validações
    if (!tipo.descricao.trim()) {
      throw new Error("Descrição do tipo de produto é obrigatória");
    }

    // Verificar duplicação
    if (
      tiposExemplo.some(
        (t) => t.descricao.toLowerCase() === tipo.descricao.toLowerCase(),
      )
    ) {
      throw new Error("Já existe um tipo de produto com esta descrição");
    }

    // Criar novo tipo de produto
    const novoTipo: TipoProduto = {
      idtipoproduto: Math.max(...tiposExemplo.map((t) => t.idtipoproduto)) + 1,
      descricao: tipo.descricao,
      controlaValidade: tipo.controlaValidade,
    };

    // Adicionar tipo à lista (simulando o banco de dados)
    tiposExemplo.push(novoTipo);

    return novoTipo;
  } catch (error) {
    console.error("Erro ao adicionar tipo de produto:", error);
    throw error;
  }
};

export const excluirTipoProduto = async (id: number): Promise<void> => {
  try {
    // Simulando chamada à API
    await delay(1000);

    // Verificar se existem produtos usando este tipo
    if (produtosExemplo.some((produto) => produto.idtipoproduto === id)) {
      throw new Error(
        "Não é possível excluir este tipo de produto pois existem produtos cadastrados com ele",
      );
    }

    // Encontrar o índice do tipo de produto
    const index = tiposExemplo.findIndex((tipo) => tipo.idtipoproduto === id);

    if (index === -1) {
      throw new Error("Tipo de produto não encontrado");
    }

    // Remover o tipo de produto da lista
    tiposExemplo.splice(index, 1);
  } catch (error) {
    console.error("Erro ao excluir tipo de produto:", error);
    throw error;
  }
};
