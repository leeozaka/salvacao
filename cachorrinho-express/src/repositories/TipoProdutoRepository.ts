import { PrismaClient, Prisma, TipoProduto } from '@prisma/client';
import { TipoProdutoDTO, CreateTipoProdutoDTO, UpdateTipoProdutoDTO } from '../dtos/TipoProdutoDTO';

export class TipoProdutoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTipoProdutoDTO): Promise<TipoProdutoDTO> {
    try {
      const newTipoProduto = await this.prisma.tipoProduto.create({
        data: {
          nome: data.nome,
          descricao: data.descricao,
          isActive: true,
        },
      });

      return this.mapToTipoProdutoDTO(newTipoProduto);
    } catch (error) {
      console.error('Erro ao criar tipo de produto:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(`Tipo de produto com nome '${data.nome}' já existe.`);
        }
      }
      throw new Error(
        `Erro ao criar tipo de produto: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findOne(id: number): Promise<TipoProdutoDTO | null> {
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

      return this.mapToTipoProdutoDTO(tipoProduto);
    } catch (error) {
      console.error(`Erro ao buscar tipo de produto por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar tipo de produto: ${String(error)}`);
    }
  }

  async findAll(): Promise<TipoProdutoDTO[]> {
    try {
      const tiposProduto = await this.prisma.tipoProduto.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return tiposProduto.map((tipoProduto) => this.mapToTipoProdutoDTO(tipoProduto));
    } catch (error) {
      console.error('Erro ao buscar todos os tipos de produto:', error);
      throw new Error(
        `Erro ao buscar tipos de produto: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async update(id: number, data: UpdateTipoProdutoDTO): Promise<TipoProdutoDTO | null> {
    try {
      const updatedTipoProduto = await this.prisma.tipoProduto.update({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
        data: {
          nome: data.nome,
          descricao: data.descricao,
          isActive: data.isActive,
          updatedAt: new Date(),
        },
      });

      return this.mapToTipoProdutoDTO(updatedTipoProduto);
    } catch (error) {
      console.error(`Erro ao atualizar tipo de produto ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Registro para atualização não encontrado para TipoProduto ID ${id}.`);
        }
        if (error.code === 'P2002') {
          throw new Error(`Tipo de produto com nome '${data.nome}' já existe.`);
        }
      }
      throw error instanceof Error
        ? error
        : new Error(`Erro ao atualizar tipo de produto: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const now = new Date();

      const result = await this.prisma.tipoProduto.update({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
        data: {
          deletedAt: now,
          isActive: false,
          updatedAt: now,
        },
      });

      return !!result;
    } catch (error) {
      console.error(`Erro ao excluir tipo de produto ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir tipo de produto: ${String(error)}`);
    }
  }

  private mapToTipoProdutoDTO(tipoProduto: TipoProduto): TipoProdutoDTO {
    return {
      id: tipoProduto.id,
      nome: tipoProduto.nome,
      descricao: tipoProduto.descricao,
      isActive: tipoProduto.isActive,
      createdAt: tipoProduto.createdAt,
      updatedAt: tipoProduto.updatedAt,
      deletedAt: tipoProduto.deletedAt,
    };
  }
}
