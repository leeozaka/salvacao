import {
  UnidadeMedida,
  UnidadeMedidaDTO,
  CreateUnidadeMedidaDTO,
  UpdateUnidadeMedidaDTO,
} from '../dtos/UnidadeMedidaDTO';
import { UnidadeMedidaRepository } from '../repositories/UnidadeMedidaRepository';

export class UnidadeMedidaService {
  constructor(private readonly unidadeMedidaRepository: UnidadeMedidaRepository) {}

  /**
   * Cria uma nova unidade de medida
   * @param data Dados da unidade de medida a ser criada
   * @returns Unidade de medida criada
   */
  async create(data: CreateUnidadeMedidaDTO): Promise<UnidadeMedida> {
    if (!data.nome || !data.sigla) {
      throw new Error('Nome e sigla da unidade de medida são obrigatórios.');
    }

    try {
      const novaUnidadeMedida = await this.unidadeMedidaRepository.create(data);
      return novaUnidadeMedida;
    } catch (error) {
      console.error('Erro em UnidadeMedidaService.create:', error);
      if (error instanceof Error && error.message.includes('já existe')) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao criar unidade de medida.');
    }
  }

  /**
   * Atualiza uma unidade de medida existente
   * @param id ID da unidade de medida a ser atualizada
   * @param data Dados de atualização
   * @returns Unidade de medida atualizada
   */
  async update(id: number, data: UpdateUnidadeMedidaDTO): Promise<UnidadeMedida> {
    if (Object.keys(data).length === 0) {
      throw new Error('Nenhum dado de atualização fornecido.');
    }

    try {
      const unidadeMedidaAtualizada = await this.unidadeMedidaRepository.update(id, data);

      if (!unidadeMedidaAtualizada) {
        throw new Error(
          `Unidade de medida com ID ${id} não encontrada ou não pôde ser atualizada.`,
        );
      }

      return unidadeMedidaAtualizada;
    } catch (error) {
      console.error(`Erro em UnidadeMedidaService.update para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrada')) {
        throw new Error(error.message);
      }
      if (error instanceof Error && error.message.includes('já existe')) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao atualizar unidade de medida.');
    }
  }

  /**
   * Exclui uma unidade de medida (exclusão lógica)
   * @param id ID da unidade de medida a ser excluída
   * @returns True se excluída com sucesso, False se não encontrada
   */
  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.unidadeMedidaRepository.delete(id);

      if (!result) {
        console.warn(
          `Tentativa de excluir unidade de medida inexistente ou já excluída com ID ${id}`,
        );
        return false;
      }

      return result;
    } catch (error) {
      console.error(`Erro em UnidadeMedidaService.delete para ID ${id}:`, error);
      throw new Error('Falha ao excluir unidade de medida.');
    }
  }

  /**
   * Busca uma unidade de medida pelo ID
   * @param id ID da unidade de medida
   * @returns Unidade de medida encontrada
   */
  async findOne(id: number): Promise<UnidadeMedida> {
    try {
      const unidadeMedida = await this.unidadeMedidaRepository.findOne(id);
      if (!unidadeMedida) {
        throw new Error(`Unidade de medida com ID ${id} não encontrada.`);
      }
      return unidadeMedida;
    } catch (error) {
      console.error(`Erro em UnidadeMedidaService.findOne para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrada')) {
        throw error;
      }
      throw new Error('Falha ao buscar unidade de medida.');
    }
  }

  /**
   * Lista todas as unidades de medida com opção de filtragem
   * @param filter Filtros opcionais
   * @returns Lista de unidades de medida
   */
  async findAll(filter?: Partial<UnidadeMedidaDTO>): Promise<UnidadeMedida[]> {
    try {
      const unidadesMedida = await this.unidadeMedidaRepository.findAll(filter);
      return unidadesMedida;
    } catch (error) {
      console.error('Erro em UnidadeMedidaService.findAll:', error);
      throw new Error('Falha ao recuperar unidades de medida.');
    }
  }
}
