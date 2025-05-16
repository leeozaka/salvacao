const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "../dto/MedicamentoDTO";

import { MedicamentoBackend } from "@/types/medicamento/medicamento";

/**
 * Buscar todos os medicamentos
 */
export async function buscarMedicamentos(
  filtro?: Partial<MedicamentoBackend>,
): Promise<any> {
  try {
    const queryParams = filtro
      ? `?${new URLSearchParams(
          Object.entries(filtro)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)]) as [string, string][],
        )}`
      : "";

    const response = await fetch(`${API_URL}/medicamento${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`,
      },
      cache: "no-store",
      credentials: "same-origin",
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
        message: data.message || "Falha ao buscar medicamentos",
      };
    }
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Buscar um medicamento por ID
 */
export async function buscarMedicamentoPorId(id: number): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/medicamento/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`,
      },
      cache: "no-store",
      credentials: "same-origin",
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
        message: data.message || "Medicamento não encontrado",
      };
    }
  } catch (error) {
    console.error("Erro ao buscar medicamento:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Adicionar novo medicamento
 */
export async function adicionarMedicamento(
  medicamento: CreateMedicamentoDTO,
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/medicamento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`,
      },
      body: JSON.stringify(medicamento),
      cache: "no-store",
      credentials: "same-origin",
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
        message: data.message || "Falha ao adicionar medicamento",
      };
    }
  } catch (error) {
    console.error("Erro ao adicionar medicamento:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Atualizar medicamento
 */
export async function atualizarMedicamento(
  id: number,
  medicamento: UpdateMedicamentoDTO,
): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/medicamento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`,
      },
      body: JSON.stringify(medicamento),
      cache: "no-store",
      credentials: "same-origin",
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
        message: data.message || "Falha ao atualizar medicamento",
      };
    }
  } catch (error) {
    console.error("Erro ao atualizar medicamento:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Excluir medicamento
 */
export async function excluirMedicamento(id: number): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/medicamento/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getTokenFromCookie()}`,
      },
      cache: "no-store",
      credentials: "same-origin",
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
        message: data.message || "Falha ao excluir medicamento",
      };
    }
  } catch (error) {
    console.error("Erro ao excluir medicamento:", error);
    return {
      success: false,
      message: "Erro de rede ocorreu",
    };
  }
}

/**
 * Gets token from cookie
 */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const tokenCookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("authToken="));

  return tokenCookie ? tokenCookie.split("=")[1].trim() : null;
}
