"use server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { Pessoa, Adotante } from "@/types/entities";
import { cookies } from "next/headers";

export const buscarAdotantes = async (): Promise<Adotante[]> => {
  const authToken = (await cookies()).get("authToken")?.value;

  try {
    const response = await fetch(`${API_URL}/adotantes`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Erro ao buscar adotantes');
    }

    const data = await response.json().then(adotantes => adotantes.map((adotante: Adotante) => adotante));
    console.log('adotantes', data);

    return data;
  } catch (error) {
    console.error('Erro ao buscar adotantes:', error);
    return [];
  }
};

export const cadastrarAdotante = async (adotante: Adotante): Promise<Pessoa> => {
  const authToken = (await cookies()).get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/adotantes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(adotante),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao cadastrar adotante');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao cadastrar adotante:', error);
    throw error;
  }
};

export const atualizarAdotante = async (id: number, adotante: Adotante): Promise<Pessoa> => {
  const authToken = (await cookies()).get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/adotantes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(adotante),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar adotante');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar adotante:', error);
    throw error;
  }
};

export const excluirAdotante = async (id: string): Promise<void> => {
  const authToken = (await cookies()).get("authToken")?.value;
  try {
    const response = await fetch(`${API_URL}/adotantes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao excluir adotante');
    }
  } catch (error) {
    console.error('Erro ao excluir adotante:', error);
    throw error;
  }
};