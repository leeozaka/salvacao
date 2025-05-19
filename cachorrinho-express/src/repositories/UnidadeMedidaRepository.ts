import { PrismaClient, Prisma, UnidadeMedida } from '@prisma/client';
import {
  UnidadeMedidaDTO,
  CreateUnidadeMedidaDTO,
  UpdateUnidadeMedidaDTO,
} from '../dtos/UnidadeMedidaDTO';

export class UnidadeMedidaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUnidadeMedidaDTO): Promise<UnidadeMedidaDTO> {
    try {
      const newUnidadeMedida = await this.prisma.unidadeMedida.create({
        data: {
          nome: data.nome,
          sigla: data.sigla,
          isActive: true,
        },
      });

      return this.mapToUnidadeMedidaDTO(newUnidadeMedida);
    } catch (error) {
      console.error('Erro ao criar unidade de medida:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('nome')) {
            throw new Error(`Unidade de medida com nome '${data.nome}' já existe.`);
          }
          if (target?.includes('sigla')) {
            throw new Error(`Unidade de medida com sigla '${data.sigla}' já existe.`);
          }
        }
      }
      throw new Error(
        `Erro ao criar unidade de medida: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findOne(id: number): Promise<UnidadeMedidaDTO | null> {
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

      return this.mapToUnidadeMedidaDTO(unidadeMedida);
    } catch (error) {
      console.error(`Erro ao buscar unidade de medida por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar unidade de medida: ${String(error)}`);
    }
  }

  async findAll(): Promise<UnidadeMedidaDTO[]> {
    try {
      const unidadesMedida = await this.prisma.unidadeMedida.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        orderBy: {
          nome: 'asc',
        },
      });

      return unidadesMedida.map((unidadeMedida) => this.mapToUnidadeMedidaDTO(unidadeMedida));
    } catch (error) {
      console.error('Erro ao buscar todas as unidades de medida:', error);
      throw new Error(
        `Erro ao buscar unidades de medida: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async update(id: number, data: UpdateUnidadeMedidaDTO): Promise<UnidadeMedidaDTO | null> {
    try {
      const updatedUnidadeMedida = await this.prisma.unidadeMedida.update({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
        data: {
          nome: data.nome,
          sigla: data.sigla,
          isActive: data.isActive,
          updatedAt: new Date(),
        },
      });

      return this.mapToUnidadeMedidaDTO(updatedUnidadeMedida);
    } catch (error) {
      console.error(`Erro ao atualizar unidade de medida ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Registro para atualização não encontrado para UnidadeMedida ID ${id}.`);
        }
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[] | undefined;
          if (target?.includes('nome')) {
            throw new Error(`Unidade de medida com nome '${data.nome}' já existe.`);
          }
          if (target?.includes('sigla')) {
            throw new Error(`Unidade de medida com sigla '${data.sigla}' já existe.`);
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

      const result = await this.prisma.unidadeMedida.update({
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
      console.error(`Erro ao excluir unidade de medida ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir unidade de medida: ${String(error)}`);
    }
  }

  private mapToUnidadeMedidaDTO(unidadeMedida: UnidadeMedida): UnidadeMedidaDTO {
    return {
      id: unidadeMedida.id,
      nome: unidadeMedida.nome,
      sigla: unidadeMedida.sigla,
      isActive: unidadeMedida.isActive,
      createdAt: unidadeMedida.createdAt,
      updatedAt: unidadeMedida.updatedAt,
      deletedAt: unidadeMedida.deletedAt,
    };
  }
}
