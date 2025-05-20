"use server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { Pessoa } from "@/types/entities";
import { CreatePessoaDTO, UpdatePessoaDTO } from "@/dto/PessoaDTO";
import { cookies } from "next/headers";

export const buscarPessoas = async (filtros?: { termo?: string, tipoUsuario?: string }): Promise<Pessoa[]> => {
  const authToken = (await cookies()).get("authToken")?.value;
  let url = `${API_URL}/user/all`;

  const queryParams = new URLSearchParams();
  if (filtros?.termo) {
    queryParams.append("termo", filtros.termo);
  }
  if (filtros?.tipoUsuario) {
    queryParams.append("tipoUsuario", filtros.tipoUsuario);
  }

  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao buscar pessoas");
    }

    const data = await response
      .json()
      .then((pessoas) => pessoas.map((pessoa: Pessoa) => pessoa));

    return data;
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
    return [];
  }
};

export const buscarPessoaPorId = async (
  id: string,
): Promise<Pessoa | null> => {
  const authToken = (await cookies()).get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Erro ao buscar pessoa por ID");
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar pessoa por ID:", error);
    throw error;
  }
};

export const buscarPessoasPorTipo = async (tipo: string): Promise<Pessoa[]> => {
  const authToken = (await cookies()).get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/user/all?buscarPessoas=true&tipo=${tipo}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar pessoas");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
    throw error;
  }
};

export const cadastrarPessoa = async (
  pessoaData: CreatePessoaDTO,
): Promise<Pessoa> => {
  const authToken = (await cookies()).get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(pessoaData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Erro ao cadastrar pessoa");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao cadastrar pessoa:", error);
    throw error;
  }
};

export const atualizarPessoa = async (
  id: number,
  pessoaData: UpdatePessoaDTO,
): Promise<Pessoa> => {
  const authToken = (await cookies()).get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(pessoaData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Erro ao atualizar pessoa");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar pessoa:", error);
    throw error;
  }
};

export const excluirPessoa = async (id: number): Promise<void> => {
  const authToken = (await cookies()).get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir pessoa");
    }
  } catch (error) {
    console.error("Erro ao excluir pessoa:", error);
    throw error;
  }
};
