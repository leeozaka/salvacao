const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { Pessoa, formularioAdotante } from "@/types/entities";

export const adotanteService = {
  buscarAdotantes: async (): Promise<formularioAdotante[]> => {
    try {
      const response = await fetch(`${API_URL}/adotantes`);
      if (!response.ok) {
        throw new Error('Erro ao buscar adotantes');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar adotantes:', error);
      return [];
    }
  },

  cadastrarAdotante: async (adotante: formularioAdotante): Promise<Pessoa> => {
    try {
      const response = await fetch(`${API_URL}/adotantes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  },

  atualizarAdotante: async (id: string, adotante: formularioAdotante): Promise<Pessoa> => {
    try {
      const response = await fetch(`${API_URL}/adotantes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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
  },

  excluirAdotante: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/adotantes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir adotante');
      }
    } catch (error) {
      console.error('Erro ao excluir adotante:', error);
      throw error;
    }
  }
};