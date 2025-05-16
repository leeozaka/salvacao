import {
  TipoProduto,
  TipoProdutoDTO,
  CreateTipoProdutoDTO,
  UpdateTipoProdutoDTO,
} from '../dtos/TipoProdutoDTO';
import { TipoProdutoRepository } from '../repositories/TipoProdutoRepository';

export class TipoProdutoService {
  constructor(private readonly tipoProdutoRepository: TipoProdutoRepository) {}

  async create(data: CreateTipoProdutoDTO): Promise<TipoProduto> {
    if (!data.nome) {
      throw new Error('Nome do tipo de produto é obrigatório.');
    }

    try {
      const novoTipoProduto = await this.tipoProdutoRepository.create(data);
      return novoTipoProduto;
    } catch (error) {
      console.error('Erro em TipoProdutoService.create:', error);
      if (error instanceof Error && error.message.includes('já existe')) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao criar tipo de produto.');
    }
  }

  async update(id: number, data: UpdateTipoProdutoDTO): Promise<TipoProduto> {
    if (Object.keys(data).length === 0) {
      throw new Error('Nenhum dado de atualização fornecido.');
    }

    try {
      const tipoProdutoAtualizado = await this.tipoProdutoRepository.update(id, data);

      if (!tipoProdutoAtualizado) {
        throw new Error(`Tipo de produto com ID ${id} não encontrado ou não pôde ser atualizado.`);
      }

      return tipoProdutoAtualizado;
    } catch (error) {
      console.error(`Erro em TipoProdutoService.update para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw new Error(error.message);
      }
      if (error instanceof Error && error.message.includes('já existe')) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao atualizar tipo de produto.');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.tipoProdutoRepository.delete(id);

      if (!result) {
        console.warn(
          `Tentativa de excluir tipo de produto inexistente ou já excluído com ID ${id}`,
        );
        return false;
      }

      return result;
    } catch (error) {
      console.error(`Erro em TipoProdutoService.delete para ID ${id}:`, error);
      throw new Error('Falha ao excluir tipo de produto.');
    }
  }

  async findOne(id: number): Promise<TipoProduto> {
    try {
      const tipoProduto = await this.tipoProdutoRepository.findOne(id);
      if (!tipoProduto) {
        throw new Error(`Tipo de produto com ID ${id} não encontrado.`);
      }
      return tipoProduto;
    } catch (error) {
      console.error(`Erro em TipoProdutoService.findOne para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw error;
      }
      throw new Error('Falha ao buscar tipo de produto.');
    }
  }

  async findAll(filter?: Partial<TipoProdutoDTO>): Promise<TipoProduto[]> {
    try {
      const tiposProduto = await this.tipoProdutoRepository.findAll(filter);
      return tiposProduto;
    } catch (error) {
      console.error('Erro em TipoProdutoService.findAll:', error);
      throw new Error('Falha ao recuperar tipos de produto.');
    }
  }
}
