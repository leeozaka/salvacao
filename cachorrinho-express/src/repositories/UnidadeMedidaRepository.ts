import { PrismaClient, Prisma } from '@prisma/client';
import {
  UnidadeMedida,
  CreateUnidadeMedidaDTO,
  UpdateUnidadeMedidaDTO,
} from '../dtos/UnidadeMedidaDTO';

export class UnidadeMedidaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUnidadeMedidaDTO): Promise<UnidadeMedida> {
    try {
      const novaUnidadeMedida = await this.prisma.unidadeMedida.create({
        data: {
          nome: data.nome,
          sigla: data.sigla,
          isActive: true,
        },
      });

      return this.mapToUnidadeMedida(novaUnidadeMedida);
    } catch (error) {
      console.error('Erro ao criar unidade de medida:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('nome')) {
            throw new Error(`Já existe uma unidade de medida com o nome '${data.nome}'.`);
          }
          if (target?.includes('sigla')) {
            throw new Error(`Já existe uma unidade de medida com a sigla '${data.sigla}'.`);
          }
        }
      }
      throw new Error(
        `Erro ao criar unidade de medida: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findOne(id: number): Promise<UnidadeMedida | null> {
    try {
      const unidadeMedida = await this.prisma.unidadeMedida.findUnique({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
      });

      if (!unidadeMedida) {
        return null;
      }

      return this.mapToUnidadeMedida(unidadeMedida);
    } catch (error) {
      console.error(`Erro ao buscar unidade de medida por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar unidade de medida: ${String(error)}`);
    }
  }

  async findAll(filter?: Partial<UnidadeMedida>): Promise<UnidadeMedida[]> {
    try {
      const where: Prisma.UnidadeMedidaWhereInput = {
        isActive: true,
        deletedAt: null,
      };

      if (filter) {
        if (filter.nome) where.nome = { contains: filter.nome, mode: 'insensitive' };
        if (filter.sigla) where.sigla = { contains: filter.sigla, mode: 'insensitive' };
      }

      const unidadesMedida = await this.prisma.unidadeMedida.findMany({
        where: where,
        orderBy: {
          nome: 'asc',
        },
      });

      return unidadesMedida.map((um) => this.mapToUnidadeMedida(um));
    } catch (error) {
      console.error('Erro ao buscar todas as unidades de medida:', error);
      throw new Error(`Erro ao buscar unidades de medida: ${String(error)}`);
    }
  }

  async update(id: number, data: UpdateUnidadeMedidaDTO): Promise<UnidadeMedida | null> {
    try {
      const existingUnidadeMedida = await this.prisma.unidadeMedida.findUnique({
        where: { id: id, isActive: true, deletedAt: null },
      });

      if (!existingUnidadeMedida) {
        return null;
      }

      const unidadeMedidaData: Prisma.UnidadeMedidaUpdateInput = {};
      if (data.nome !== undefined) unidadeMedidaData.nome = data.nome;
      if (data.sigla !== undefined) unidadeMedidaData.sigla = data.sigla;
      if (data.isActive !== undefined) unidadeMedidaData.isActive = data.isActive;

      if (Object.keys(unidadeMedidaData).length === 0) {
        return this.mapToUnidadeMedida(existingUnidadeMedida);
      }

      const updatedUnidadeMedida = await this.prisma.unidadeMedida.update({
        where: { id: id },
        data: { ...unidadeMedidaData, updatedAt: new Date() },
      });

      return this.mapToUnidadeMedida(updatedUnidadeMedida);
    } catch (error) {
      console.error(`Erro ao atualizar unidade de medida ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('nome')) {
            throw new Error(`Já existe uma unidade de medida com o nome fornecido.`);
          }
          if (target?.includes('sigla')) {
            throw new Error(`Já existe uma unidade de medida com a sigla fornecida.`);
          }
        }
      }
      throw error instanceof Error
        ? error
        : new Error(`Erro ao atualizar unidade de medida: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const now = new Date();

      const existingUnidadeMedida = await this.prisma.unidadeMedida.findUnique({
        where: { id: id, isActive: true, deletedAt: null },
      });

      if (!existingUnidadeMedida) {
        return false;
      }

      const produtosAssociados = await this.prisma.produto.count({
        where: {
          idUnidadeMedidaPadrao: id,
          isActive: true,
          deletedAt: null,
        },
      });

      if (produtosAssociados > 0) {
        throw new Error(
          `Não é possível excluir esta unidade de medida pois existem ${produtosAssociados} produtos associados.`,
        );
      }

      const estoquesAssociados = await this.prisma.estoque.count({
        where: {
          idUnidadeMedida: id,
          isActive: true,
          deletedAt: null,
        },
      });

      if (estoquesAssociados > 0) {
        throw new Error(
          `Não é possível excluir esta unidade de medida pois existem ${estoquesAssociados} registros de estoque associados.`,
        );
      }

      const unidadeMedidaUpdate = await this.prisma.unidadeMedida.update({
        where: { id: id },
        data: {
          deletedAt: now,
          isActive: false,
          updatedAt: now,
        },
      });

      return !!unidadeMedidaUpdate;
    } catch (error) {
      console.error(`Erro ao excluir unidade de medida ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir unidade de medida: ${String(error)}`);
    }
  }

  private mapToUnidadeMedida(prismaModel: any): UnidadeMedida {
    return {
      id: prismaModel.id,
      nome: prismaModel.nome,
      sigla: prismaModel.sigla,
      isActive: prismaModel.isActive,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
      deletedAt: prismaModel.deletedAt,
    };
  }
}
