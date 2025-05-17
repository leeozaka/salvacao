import { Pessoa, formularioAdotante } from "@/types/entities";

export const adotanteService = {
  // Método para buscar todos os adotantes
  buscarAdotantes: async (): Promise<formularioAdotante[]> => {
    try {
      const response = await fetch('/api/adotantes');
      if (!response.ok) {
        throw new Error('Erro ao buscar adotantes');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar adotantes:', error);
      return [];
    }
  },

  // Método para cadastrar um novo adotante
  cadastrarAdotante: async (adotante: formularioAdotante): Promise<Pessoa> => {
    try {
      const response = await fetch('/api/adotantes', {
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

  // Método para atualizar um adotante existente
  atualizarAdotante: async (id: string, adotante: formularioAdotante): Promise<Pessoa> => {
    try {
      const response = await fetch(`/api/adotantes/${id}`, {
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

  // Método para excluir um adotante
  excluirAdotante: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/adotantes/${id}`, {
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