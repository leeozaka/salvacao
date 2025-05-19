import { Adotante } from '@prisma/client';
import { AdotanteRepository } from '../repositories/AdotanteRepository';
import {
  CreateAdotanteDTO,
  UpdateAdotanteDTO,
} from '../dtos/AdotanteDTO';

export class AdotanteService {
  constructor(private readonly adotanteRepository: AdotanteRepository) {}


  async create(data: CreateAdotanteDTO): Promise<Adotante> {
    if (!data.idPessoa) {
      throw new Error('O campo idPessoa é obrigatório.');
    }
    // if (!data.nome || !data.email || !data.telefone || !data.endereco || !data.cep || !data.cidade || !data.estado) {
    //   throw new Error('Campos obrigatórios faltando (nome, email, telefone, endereço, CEP, cidade, estado).');
    // }

    try {
      const novoAdotante = await this.adotanteRepository.create(data);
      return novoAdotante;
    } catch (error) {
      console.error('Erro em AdotanteService.create:', error);

      if (error instanceof Error && (error.message.includes('já existe') || error.message.includes('violation'))) {
        throw new Error(error.message);
      }

      throw new Error('Falha ao criar adotante. ' + (error as Error).message);
    }
  }

 
  async update(id: number, data: UpdateAdotanteDTO): Promise<Adotante> {
    if (Object.keys(data).length === 0) {
      throw new Error('Nenhum dado de atualização fornecido.');
    }

    try {
      const adotanteAtualizado = await this.adotanteRepository.update(id, data);

      if (!adotanteAtualizado) {
        throw new Error(`Adotante com ID ${id} não encontrado ou não pôde ser atualizado.`);
      }

      return adotanteAtualizado;
    } catch (error) {
      console.error(`Erro em AdotanteService.update para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw new Error(error.message);
      }
      if (error instanceof Error && error.message.includes('restrição única')) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao atualizar adotante.');
    }
  }

 
  async delete(id: number): Promise<boolean> {
    try {
      const resultado = await this.adotanteRepository.delete(id);

      if (!resultado) {
        console.warn(`Tentativa de excluir adotante inexistente ou já excluído com ID ${id}`);
        return false;
      }

      return resultado;
    } catch (error) {
      console.error(`Erro em AdotanteService.delete para ID ${id}:`, error);
      throw new Error('Falha ao excluir adotante.');
    }
  }

  async findOne(id: number): Promise<Adotante> {
    try {
      const adotante = await this.adotanteRepository.findOne(id);
      if (!adotante) {
        throw new Error(`Adotante com ID ${id} não encontrado.`);
      }
      return adotante;
    } catch (error) {
      console.error(`Erro em AdotanteService.findOne para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw error;
      }
      throw new Error('Falha ao buscar adotante.');
    }
  }

 
  async findAll(filter?: Partial<Adotante>): Promise<Adotante[]> {
    try {
      const adotantes = await this.adotanteRepository.findAll(filter);
      return adotantes;
    } catch (error) {
      console.error('Erro em AdotanteService.findAll:', error);
      throw new Error('Falha ao recuperar adotantes.');
    }
  }
}