// src/services/medicamentoService.ts
import {
  CreateMedicamentoDTO,
  UpdateMedicamentoDTO,
} from "../dto/MedicamentoDTO";

import { MedicamentoBackend } from "@/types/medicamento/medicamento";
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

// Buscar todos os medicamentos
export async function buscarMedicamentos(
  filtro?: Partial<MedicamentoBackend>,
  token?: string,
) {
  const queryParams = filtro
    ? `?${new URLSearchParams(
        Object.entries(filtro)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, String(v)]) as [string, string][],
      )}`
    : "";

  console.log("Buscando medicamentos...");
  return fetchWithAuth(`medicamento${queryParams}`, {}, token);
}

// Buscar um medicamento por ID
export async function buscarMedicamentoPorId(id: number, token?: string) {
  return fetchWithAuth(`medicamento/${id}`, {}, token);
}

// Adicionar novo medicamento
export async function adicionarMedicamento(
  medicamento: CreateMedicamentoDTO,
  token?: string,
) {
  return fetchWithAuth(
    "medicamento",
    {
      method: "POST",
      body: JSON.stringify(medicamento),
    },
    token,
  );
}

// Atualizar medicamento
export async function atualizarMedicamento(
  id: number,
  medicamento: UpdateMedicamentoDTO,
  token?: string,
) {
  return fetchWithAuth(
    `medicamento/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(medicamento),
    },
    token,
  );
}

// Excluir medicamento
export async function excluirMedicamento(id: number, token?: string) {
  return fetchWithAuth(
    `medicamento/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}
