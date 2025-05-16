import { PrismaClient, Prisma } from '@prisma/client';
import { TipoProduto, CreateTipoProdutoDTO, UpdateTipoProdutoDTO } from '../dtos/TipoProdutoDTO';

export class TipoProdutoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Cria um novo tipo de produto
   * @param data Dados do tipo de produto
   * @returns Tipo de produto criado
   */
  async create(data: CreateTipoProdutoDTO): Promise<TipoProduto> {
    try {
      const novaTipoProduto = await this.prisma.tipoProduto.create({
        data: {
          nome: data.nome,
          descricao: data.descricao,
          isActive: true,
        },
      });

      return this.mapToTipoProduto(novaTipoProduto);
    } catch (error) {
      console.error('Erro ao criar tipo de produto:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('nome')) {
            throw new Error(`Já existe um tipo de produto com o nome '${data.nome}'.`);
          }
        }
      }
      throw new Error(
        `Erro ao criar tipo de produto: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Busca um tipo de produto pelo ID
   * @param id ID do tipo de produto
   * @returns Tipo de produto ou null se não encontrado
   */
  async findOne(id: number): Promise<TipoProduto | null> {
    try {
      const tipoProduto = await this.prisma.tipoProduto.findUnique({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
      });

      if (!tipoProduto) {
        return null;
      }

      return this.mapToTipoProduto(tipoProduto);
    } catch (error) {
      console.error(`Erro ao buscar tipo de produto por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar tipo de produto: ${String(error)}`);
    }
  }

  /**
   * Lista todos os tipos de produto com opção de filtragem
   * @param filter Filtros opcionais
   * @returns Lista de tipos de produto
   */
  async findAll(filter?: Partial<TipoProduto>): Promise<TipoProduto[]> {
    try {
      const where: Prisma.TipoProdutoWhereInput = {
        isActive: true,
        deletedAt: null,
      };

      if (filter) {
        if (filter.nome) where.nome = { contains: filter.nome, mode: 'insensitive' };
        if (filter.descricao) where.descricao = { contains: filter.descricao, mode: 'insensitive' };
      }

      const tiposProduto = await this.prisma.tipoProduto.findMany({
        where: where,
        orderBy: {
          nome: 'asc',
        },
      });

      return tiposProduto.map((tp) => this.mapToTipoProduto(tp));
    } catch (error) {
      console.error('Erro ao buscar todos os tipos de produto:', error);
      throw new Error(`Erro ao buscar tipos de produto: ${String(error)}`);
    }
  }

  /**
   * Atualiza um tipo de produto existente
   * @param id ID do tipo de produto
   * @param data Dados de atualização
   * @returns Tipo de produto atualizado ou null se não encontrado
   */
  async update(id: number, data: UpdateTipoProdutoDTO): Promise<TipoProduto | null> {
    try {
      // Verificar se o tipo de produto existe
      const existingTipoProduto = await this.prisma.tipoProduto.findUnique({
        where: { id: id, isActive: true, deletedAt: null },
      });

      if (!existingTipoProduto) {
        return null;
      }

      const tipoProdutoData: Prisma.TipoProdutoUpdateInput = {};
      if (data.nome !== undefined) tipoProdutoData.nome = data.nome;
      if (data.descricao !== undefined) tipoProdutoData.descricao = data.descricao;
      if (data.isActive !== undefined) tipoProdutoData.isActive = data.isActive;

      if (Object.keys(tipoProdutoData).length === 0) {
        return this.mapToTipoProduto(existingTipoProduto);
      }

      const updatedTipoProduto = await this.prisma.tipoProduto.update({
        where: { id: id },
        data: { ...tipoProdutoData, updatedAt: new Date() },
      });

      return this.mapToTipoProduto(updatedTipoProduto);
    } catch (error) {
      console.error(`Erro ao atualizar tipo de produto ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('nome')) {
            throw new Error(`Já existe um tipo de produto com o nome fornecido.`);
          }
        }
      }
      throw error instanceof Error
        ? error
        : new Error(`Erro ao atualizar tipo de produto: ${String(error)}`);
    }
  }

  /**
   * Exclui um tipo de produto (exclusão lógica)
   * @param id ID do tipo de produto
   * @returns True se excluído com sucesso, False se não encontrado
   */
  async delete(id: number): Promise<boolean> {
    try {
      const now = new Date();

      // Verificar se o tipo de produto existe e está ativo
      const existingTipoProduto = await this.prisma.tipoProduto.findUnique({
        where: { id: id, isActive: true, deletedAt: null },
      });

      if (!existingTipoProduto) {
        return false;
      }

      // Verificar se existem produtos associados a este tipo
      const produtosAssociados = await this.prisma.produto.count({
        where: {
          idTipoProduto: id,
          isActive: true,
          deletedAt: null,
        },
      });

      if (produtosAssociados > 0) {
        throw new Error(
          `Não é possível excluir este tipo de produto pois existem ${produtosAssociados} produtos associados.`,
        );
      }

      // Realizar exclusão lógica
      const tipoProdutoUpdate = await this.prisma.tipoProduto.update({
        where: { id: id },
        data: {
          deletedAt: now,
          isActive: false,
          updatedAt: now,
        },
      });

      return !!tipoProdutoUpdate;
    } catch (error) {
      console.error(`Erro ao excluir tipo de produto ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir tipo de produto: ${String(error)}`);
    }
  }

  /**
   * Mapeia o modelo do prisma para o DTO
   * @param prismaModel Modelo do prisma
   * @returns DTO TipoProduto
   */
  private mapToTipoProduto(prismaModel: any): TipoProduto {
    return {
      id: prismaModel.id,
      nome: prismaModel.nome,
      descricao: prismaModel.descricao,
      isActive: prismaModel.isActive,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
      deletedAt: prismaModel.deletedAt,
    };
  }
}
