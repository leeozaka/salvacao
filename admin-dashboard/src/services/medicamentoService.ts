// src/services/medicamentoService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "../dto/MedicamentoDTO";

import { MedicamentoBackend } from "@/types/medicamento/medicamento";

import { getTokenFromCookie } from "@/services/authService";

export async function buscarMedicamentos(filtros = {}): Promise<any> {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    const response = await fetch(`${API_URL}/medicamento${queryString}`, {
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
