import { AdotanteRepository } from '../repositories/AdotanteRepository';
import { AdotanteDTO, CreateAdotanteDTO, UpdateAdotanteDTO } from '../dtos/AdotanteDTO';

export class AdotanteService {
  constructor(private readonly adotanteRepository: AdotanteRepository) {}

  async create(data: CreateAdotanteDTO): Promise<AdotanteDTO> {
    try {
      return await this.adotanteRepository.create(data);
    } catch (error) {
      console.error('Erro ao criar adotante:', error);
      throw error instanceof Error ? error : new Error(`Erro ao criar adotante: ${String(error)}`);
    }
  }

  async findOne(id: number): Promise<AdotanteDTO | null> {
    try {
      return await this.adotanteRepository.findOne(id);
    } catch (error) {
      console.error(`Erro ao buscar adotante por ID ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao buscar adotante: ${String(error)}`);
    }
  }

  async findAll(): Promise<AdotanteDTO[]> {
    try {
      return await this.adotanteRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar todos os adotantes:', error);
      throw error instanceof Error ? error : new Error(`Erro ao buscar adotantes: ${String(error)}`);
    }
  }

  async update(id: number, data: UpdateAdotanteDTO): Promise<AdotanteDTO | null> {
    try {
      return await this.adotanteRepository.update(id, data);
    } catch (error) {
      console.error(`Erro ao atualizar adotante ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao atualizar adotante: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      return await this.adotanteRepository.delete(id);
    } catch (error) {
      console.error(`Erro ao excluir adotante ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao excluir adotante: ${String(error)}`);
    }
  }
}