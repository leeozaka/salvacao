import { TipoProdutoRepository } from '../repositories/TipoProdutoRepository';
import { TipoProdutoDTO, CreateTipoProdutoDTO, UpdateTipoProdutoDTO } from '../dtos/TipoProdutoDTO';

export class TipoProdutoService {
  constructor(private readonly tipoProdutoRepository: TipoProdutoRepository) {}

  async create(data: CreateTipoProdutoDTO): Promise<TipoProdutoDTO> {
    try {
      return await this.tipoProdutoRepository.create(data);
    } catch (error) {
      console.error('Erro ao criar tipo de produto:', error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao criar tipo de produto: ${String(error)}`);
    }
  }

  async findOne(id: number): Promise<TipoProdutoDTO | null> {
    try {
      return await this.tipoProdutoRepository.findOne(id);
    } catch (error) {
      console.error(`Erro ao buscar tipo de produto por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar tipo de produto: ${String(error)}`);
    }
  }

  async findAll(): Promise<TipoProdutoDTO[]> {
    try {
      return await this.tipoProdutoRepository.findAll();
    } catch (error) {
      console.error('Erro ao buscar todos os tipos de produto:', error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar tipos de produto: ${String(error)}`);
    }
  }

  async update(id: number, data: UpdateTipoProdutoDTO): Promise<TipoProdutoDTO | null> {
    try {
      return await this.tipoProdutoRepository.update(id, data);
    } catch (error) {
      console.error(`Erro ao atualizar tipo de produto ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao atualizar tipo de produto: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      return await this.tipoProdutoRepository.delete(id);
    } catch (error) {
      console.error(`Erro ao excluir tipo de produto ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir tipo de produto: ${String(error)}`);
    }
  }
}
