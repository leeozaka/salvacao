const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { Produto } from "@/types/entities";
import { NovoProdutoDTO } from "@/dto/NovoProdutoDTO";
import { NovoTipoDTO } from "@/dto/NovoTipoDTO";
import { cookies } from "next/headers";

/**
 * Buscar todos os tipos de produto
 */
export async function buscarTiposProduto(filtro?: any): Promise<any> {
  const cookie = (await cookies()).get("authToken")?.value;

  try {
    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    const response = await fetch(`${API_URL}/tipo-produto${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao buscar tipos de produto",
      };
    }
  } catch (error) {
    console.error("Erro ao buscar tipos de produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Buscar todas as unidades de medida
 */
export async function buscarUnidadesMedida(filtro?: any): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    const response = await fetch(`${API_URL}/unidade-medida${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        data: data,
        success: true,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao buscar unidades de medida",
      };
    }
    
  } catch (error) {
    console.error("Erro ao buscar unidades de medida:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Buscar todos os produtos
 */
export async function buscarProdutos(filtro?: Partial<Produto>): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    const response = await fetch(`${API_URL}/produto${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao buscar produtos",
      };
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Adicionar novo produto
 */
export async function adicionarProduto(produto: NovoProdutoDTO): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/produto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify(produto),
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao adicionar produto",
      };
    }
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Adicionar novo tipo de produto
 */
export async function adicionarTipoProduto(tipo: NovoTipoDTO): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/tipo-produto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify(tipo),
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao adicionar tipo de produto",
      };
    }
  } catch (error) {
    console.error("Erro ao adicionar tipo de produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Excluir tipo de produto
 */
export async function excluirTipoProduto(id: number): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/tipo-produto/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao excluir tipo de produto",
      };
    }
  } catch (error) {
    console.error("Erro ao excluir tipo de produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Atualizar tipo de produto
 */
export async function atualizarTipoProduto(
  id: number,
  tipo: NovoTipoDTO,
): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/tipo-produto/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify(tipo),
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao atualizar tipo de produto",
      };
    }
  } catch (error) {
    console.error("Erro ao atualizar tipo de produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Buscar um produto por ID
 */
export async function buscarProdutoPorId(id: number): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/produto/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Produto não encontrado",
      };
    }
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Atualizar produto
 */
export async function atualizarProduto(
  id: number,
  produto: NovoProdutoDTO,
): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/produto/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      body: JSON.stringify(produto),
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao atualizar produto",
      };
    }
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Excluir produto
 */
export async function excluirProduto(id: number): Promise<any> {
  try {
    const cookie = (await cookies()).get("authToken")?.value;

    const response = await fetch(`${API_URL}/produto/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Falha ao excluir produto",
      };
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}