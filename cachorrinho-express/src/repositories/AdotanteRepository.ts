import { PrismaClient, Prisma, Adotante } from '@prisma/client';
import { CreateAdotanteDTO, UpdateAdotanteDTO } from '../dtos/AdotanteDTO';

export class AdotanteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAdotanteDTO): Promise<Adotante> {
    try {
      const newAdotante = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          // First check if the pessoa exists and is not already an adotante
          const existingPessoa = await tx.pessoa.findUnique({
            where: { 
              id: data.idPessoa,
              isActive: true,
              deletedAt: null,
              adotante: null
            },
          });

          if (!existingPessoa) {
            throw new Error('Pessoa não encontrada ou já é um adotante.');
          }

          const adotante = await tx.adotante.create({
            data: {
              idPessoa: data.idPessoa,
              motivacaoAdocao: data.motivacaoAdocao,
              experienciaAnteriorAnimais: data.experienciaAnteriorAnimais,
              tipoMoradia: data.tipoMoradia,
              permiteAnimaisMoradia: data.permiteAnimaisMoradia,
              isActive: true,
            },
            include: {
              pessoa: true,
            },
          });

          return adotante;
        },
      );

      return newAdotante;
    } catch (error) {
      console.error('Erro ao criar adotante:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(`Pessoa já é um adotante.`);
        }
      }
      throw new Error(
        `Erro ao criar adotante: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async findOne(id: number): Promise<Adotante | null> {
    try {
      const adotante = await this.prisma.adotante.findUnique({
        where: {
          id: id,
          isActive: true,
          deletedAt: null,
        },
        include: {
          pessoa: true,
          adocoes: true,
        },
      });

      if (!adotante) {
        return null;
      }

      return adotante;
    } catch (error) {
      console.error(`Erro ao buscar adotante por ID ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao buscar adotante: ${String(error)}`);
    }
  }

  async findAll(filter?: Partial<Adotante>): Promise<Adotante[]> {
    try {
      const where: Prisma.AdotanteWhereInput = {
        isActive: true,
        deletedAt: null,
      };

      if (filter) {
        if (filter.tipoMoradia) where.tipoMoradia = filter.tipoMoradia;
        if (filter.permiteAnimaisMoradia !== undefined) {
          where.permiteAnimaisMoradia = filter.permiteAnimaisMoradia;
        }
      }

      const adotantes = await this.prisma.adotante.findMany({
        where: where,
        include: {
          pessoa: true,
          adocoes: true,
        },
        orderBy: {
          pessoa: {
            nome: 'asc',
          },
        },
      });

      return adotantes;
    } catch (error) {
      console.error('Erro ao buscar todos os adotantes:', error);
      throw new Error(
        `Erro ao buscar adotantes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async update(id: number, data: UpdateAdotanteDTO): Promise<Adotante | null> {
    try {
      const updatedAdotante = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const existingAdotante = await tx.adotante.findUnique({
            where: { id: id, isActive: true, deletedAt: null },
          });

          if (!existingAdotante) {
            throw new Error(`Adotante com ID ${id} não encontrado ou está inativo/excluído.`);
          }

          const adotanteData: Prisma.AdotanteUpdateInput = {};
          
          if (data.motivacaoAdocao !== undefined) {
            adotanteData.motivacaoAdocao = data.motivacaoAdocao;
          }
          if (data.experienciaAnteriorAnimais !== undefined) {
            adotanteData.experienciaAnteriorAnimais = data.experienciaAnteriorAnimais;
          }
          if (data.tipoMoradia !== undefined) {
            adotanteData.tipoMoradia = data.tipoMoradia;
          }
          if (data.permiteAnimaisMoradia !== undefined) {
            adotanteData.permiteAnimaisMoradia = data.permiteAnimaisMoradia;
          }
          if (data.isActive !== undefined) {
            adotanteData.isActive = data.isActive;
          }

          const updated = await tx.adotante.update({
            where: { id: id },
            data: {
              ...adotanteData,
              updatedAt: new Date(),
            },
            include: {
              pessoa: true,
              adocoes: true,
            },
          });

          return updated;
        },
      );

      if (!updatedAdotante) {
        return null;
      }

      return updatedAdotante;
    } catch (error) {
      console.error(`Erro ao atualizar adotante ${id}:`, error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Registro para atualização não encontrado para Adotante ID ${id}.`);
        }
      }
      throw error instanceof Error
        ? error
        : new Error(`Erro ao atualizar adotante: ${String(error)}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const now = new Date();

      const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Verificar se o adotante existe
        const existingAdotante = await tx.adotante.findUnique({
          where: { id: id, isActive: true, deletedAt: null },
          include: {
            adocoes: {
              where: {
                isActive: true,
                deletedAt: null,
              },
            },
          },
        });

        if (!existingAdotante) {
          return false;
        }

        // Verificar se há adoções ativas
        if (existingAdotante.adocoes.length > 0) {
          throw new Error('Não é possível excluir um adotante com adoções ativas.');
        }

        const adotanteUpdate = await tx.adotante.update({
          where: { id: id },
          data: {
            deletedAt: now,
            isActive: false,
            updatedAt: now,
          },
        });

        return !!adotanteUpdate;
      });

      return result;
    } catch (error) {
      console.error(`Erro ao excluir adotante ${id}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao excluir adotante: ${String(error)}`);
    }
  }
}
