// src/services/produtoService.ts
import { Produto, TipoProduto, UnidadeDeMedida } from "@/types/entities";
import { NovoProdutoDTO } from "@/dto/NovoProdutoDTO";
import { NovoTipoDTO } from "@/dto/NovoTipoDTO";
import { getClientAuthToken } from "@/utils/client-auth";
import { buildApiUrl } from "./api-config";

// Função auxiliar para fazer requisições autenticadas
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {},
  providedToken?: string,
) {
  // Usar o token fornecido, ou tentar obter via ambiente apropriado
  let token = providedToken;

  if (!token) {
    if (typeof window !== "undefined") {
      // Estamos no navegador (Client Component)
      token = await getClientAuthToken();
    } else {
      // Estamos no servidor (Server Component)
      console.warn(
        "Aviso: Tentando obter token no servidor sem fornecê-lo explicitamente",
      );
    }
  }

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  // Construir URL completa usando a função centralizada
  const url = buildApiUrl(endpoint);

  console.log(`Fazendo requisição para: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: typeof window === "undefined" ? "no-store" : undefined, // Apenas no servidor
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData?.mensagem ||
          `Erro ${response.status}: ${response.statusText}`;
      } catch (jsonError) {
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }

      console.error(`Erro na requisição para ${url}:`, errorMessage);
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error(`Falha ao fazer requisição para ${url}:`, error);
    throw error;
  }
}

// Buscar todos os tipos de produto
export async function buscarTiposProduto(filtro?: any, token?: string) {
  try {
    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    console.log("Buscando tipos de produto...");
    return fetchWithAuth(`tipo-produto${queryParams}`, {}, token);
  } catch (error) {
    console.error("Erro ao buscar tipos de produto:", error);
    throw error;
  }
}

// Buscar todas as unidades de medida
export async function buscarUnidadesMedida(filtro?: any, token?: string) {
  try {
    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    console.log("Buscando unidades de medida...");
    return fetchWithAuth(`unidade-medida${queryParams}`, {}, token);
  } catch (error) {
    console.error("Erro ao buscar unidades de medida:", error);
    throw error;
  }
}

// Buscar todos os produtos
export async function buscarProdutos(
  filtro?: Partial<Produto>,
  token?: string,
) {
  try {
    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    return fetchWithAuth(`produto${queryParams}`, {}, token);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
}

// Adicionar novo produto
export async function adicionarProduto(
  produto: NovoProdutoDTO,
  token?: string,
) {
  try {
    return fetchWithAuth(
      "produto",
      {
        method: "POST",
        body: JSON.stringify(produto),
      },
      token,
    );
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    throw error;
  }
}

// Adicionar novo tipo de produto
export async function adicionarTipoProduto(tipo: NovoTipoDTO, token?: string) {
  try {
    return fetchWithAuth(
      "tipo-produto",
      {
        method: "POST",
        body: JSON.stringify(tipo),
      },
      token,
    );
  } catch (error) {
    console.error("Erro ao adicionar tipo de produto:", error);
    throw error;
  }
}

// Excluir tipo de produto
export async function excluirTipoProduto(id: number, token?: string) {
  try {
    return fetchWithAuth(
      `tipo-produto/${id}`,
      {
        method: "DELETE",
      },
      token,
    );
  } catch (error) {
    console.error("Erro ao excluir tipo de produto:", error);
    throw error;
  }
}

// Atualizar tipo de produto
export async function atualizarTipoProduto(
  id: number,
  tipo: NovoTipoDTO,
  token?: string,
) {
  try {
    return fetchWithAuth(
      `tipo-produto/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(tipo),
      },
      token,
    );
  } catch (error) {
    console.error("Erro ao atualizar tipo de produto:", error);
    throw error;
  }
}

// Buscar um produto por ID
export async function buscarProdutoPorId(id: number, token?: string) {
  try {
    return fetchWithAuth(`produto/${id}`, {}, token);
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error);
    throw error;
  }
}

// Atualizar produto
export async function atualizarProduto(
  id: number,
  produto: NovoProdutoDTO,
  token?: string,
) {
  try {
    return fetchWithAuth(
      `produto/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(produto),
      },
      token,
    );
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

// Excluir produto
export async function excluirProduto(id: number, token?: string) {
  try {
    return fetchWithAuth(
      `produto/${id}`,
      {
        method: "DELETE",
      },
      token,
    );
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
}
