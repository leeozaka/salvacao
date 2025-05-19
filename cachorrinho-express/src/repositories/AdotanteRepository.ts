import { PrismaClient, Prisma, Adotante, Pessoa } from '@prisma/client';
import { AdotanteDTO, CreateAdotanteDTO, UpdateAdotanteDTO } from '../dtos/AdotanteDTO';

export class AdotanteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAdotanteDTO): Promise<AdotanteDTO> {
    try {
      const newAdotante = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // First create the pessoa
        const newPessoa = await tx.pessoa.create({
          data: {
            nome: data.pessoa.nome,
            documentoIdentidade: data.pessoa.documentoIdentidade,
            email: data.pessoa.email,
            telefone: data.pessoa.telefone,
            endereco: data.pessoa.endereco,
            isActive: true,
          },
        });

        // Then create the adotante
        const adotante = await tx.adotante.create({
          data: {
            idPessoa: newPessoa.id,
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
      });

      return this.mapToAdotanteDTO(newAdotante);
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

  async findOne(id: number): Promise<AdotanteDTO | null> {
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

      return this.mapToAdotanteDTO(adotante);
    } catch (error) {
      console.error(`Erro ao buscar adotante por ID ${id}:`, error);
      throw error instanceof Error ? error : new Error(`Erro ao buscar adotante: ${String(error)}`);
    }
  }

  async findAll(filter?: Partial<AdotanteDTO>): Promise<AdotanteDTO[]> {
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

      return adotantes.map((adotante) => this.mapToAdotanteDTO(adotante));
    } catch (error) {
      console.error('Erro ao buscar todos os adotantes:', error);
      throw new Error(
        `Erro ao buscar adotantes: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async update(id: number, data: UpdateAdotanteDTO): Promise<AdotanteDTO | null> {
    try {
      const updatedAdotante = await this.prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const existingAdotante = await tx.adotante.findUnique({
            where: { id: id, isActive: true, deletedAt: null },
            include: { pessoa: true },
          });

          if (!existingAdotante) {
            throw new Error(`Adotante com ID ${id} não encontrado ou está inativo/excluído.`);
          }

          const adotanteData: Prisma.AdotanteUpdateInput = {};
          const pessoaData: Prisma.PessoaUpdateInput = {};

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

          if (data.pessoa) {
            if (data.pessoa.nome !== undefined) pessoaData.nome = data.pessoa.nome;
            if (data.pessoa.documentoIdentidade !== undefined)
              pessoaData.documentoIdentidade = data.pessoa.documentoIdentidade;
            if (data.pessoa.email !== undefined) pessoaData.email = data.pessoa.email;
            if (data.pessoa.telefone !== undefined) pessoaData.telefone = data.pessoa.telefone;
            if (data.pessoa.endereco !== undefined) pessoaData.endereco = data.pessoa.endereco;
          }

          const hasAdotanteUpdates = Object.keys(adotanteData).length > 0;
          const hasPessoaUpdates = Object.keys(pessoaData).length > 0;

          if (hasAdotanteUpdates) {
            await tx.adotante.update({
              where: { id: id },
              data: {
                ...adotanteData,
                updatedAt: new Date(),
              },
            });
          }

          if (hasPessoaUpdates) {
            await tx.pessoa.update({
              where: { id: existingAdotante.idPessoa },
              data: {
                ...pessoaData,
                updatedAt: new Date(),
              },
            });
          }

          const updated = await tx.adotante.findUnique({
            where: { id: id },
            include: {
              pessoa: true,
              adocoes: true,
            },
          });

          if (!updated) {
            throw new Error(`Failed to retrieve updated adotante with ID ${id}`);
          }

          return updated;
        },
      );

      return this.mapToAdotanteDTO(updatedAdotante);
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

  private mapToAdotanteDTO(adotante: Adotante & { pessoa: Pessoa }): AdotanteDTO {
    return {
      id: adotante.id,
      motivacaoAdocao: adotante.motivacaoAdocao,
      experienciaAnteriorAnimais: adotante.experienciaAnteriorAnimais,
      tipoMoradia: adotante.tipoMoradia,
      permiteAnimaisMoradia: adotante.permiteAnimaisMoradia,
      isActive: adotante.isActive,
      createdAt: adotante.createdAt,
      updatedAt: adotante.updatedAt,
      deletedAt: adotante.deletedAt,
      pessoa: {
        id: adotante.pessoa.id,
        nome: adotante.pessoa.nome,
        documentoIdentidade: adotante.pessoa.documentoIdentidade,
        tipoDocumento: adotante.pessoa.tipoDocumento,
        email: adotante.pessoa.email,
        telefone: adotante.pessoa.telefone,
        endereco: adotante.pessoa.endereco,
        isActive: adotante.pessoa.isActive,
        createdAt: adotante.pessoa.createdAt,
        updatedAt: adotante.pessoa.updatedAt,
        deletedAt: adotante.pessoa.deletedAt,
      },
    };
  }
}
