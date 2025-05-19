import { UnidadeMedidaRepository } from '../repositories/UnidadeMedidaRepository';
import { UnidadeMedidaDTO, CreateUnidadeMedidaDTO, UpdateUnidadeMedidaDTO } from '../dtos/UnidadeMedidaDTO';

export class UnidadeMedidaService {
  constructor(private readonly unidadeMedidaRepository: UnidadeMedidaRepository) {}

  async create(data: CreateUnidadeMedidaDTO): Promise<UnidadeMedidaDTO> {
    try {
      return await this.unidadeMedidaRepository.create(data);
    } catch (error) {
      console.error('Erro ao criar unidade de medida:', error);
      throw error instanceof Error ? error : new Error(`Erro ao criar unidade de medida: ${String(error)}`);
    }
  }

  async findOne(id: number): Promise<UnidadeMedidaDTO | null> {
    try {
      return await this.unidadeMedidaRepository.findOne(id);
    } catch (error) {
      console.error(`Erro ao buscar unidade de medida por ID ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao buscar unidade de medida: ${String(error)}`);
    }
  }

  async findAll(): Promise<UnidadeMedidaDTO[]> {
    try {
      return await this.unidadeMedidaRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar todas as unidades de medida:', error);
      throw error instanceof Error ? error : new Error(`Erro ao buscar unidades de medida: ${String(error)}`);
    }
  }

  async update(id: number, data: UpdateUnidadeMedidaDTO): Promise<UnidadeMedidaDTO | null> {
    try {
      return await this.unidadeMedidaRepository.update(id, data);
    } catch (error) {
      console.error(`Erro ao atualizar unidade de medida ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao atualizar unidade de medida: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      return await this.unidadeMedidaRepository.delete(id);
    } catch (error) {
      console.error(`Erro ao excluir unidade de medida ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao excluir unidade de medida: ${String(error)}`);
    }
  }
}
