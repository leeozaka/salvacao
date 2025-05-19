import { MedicamentoRepository } from '../repositories/MedicamentoRepository';
import { MedicamentoDTO, CreateMedicamentoDTO, UpdateMedicamentoDTO } from '../dtos/MedicamentoDTO';

export class MedicamentoService {
  constructor(private readonly medicamentoRepository: MedicamentoRepository) {}

  async create(data: CreateMedicamentoDTO): Promise<MedicamentoDTO> {
    if (!data.nome || !data.idTipoProduto || !data.idUnidadeMedidaPadrao) {
      throw new Error('Campos obrigatórios faltando (nome, tipo de produto, unidade de medida).');
    }

    try {
      const novoMedicamento = await this.medicamentoRepository.create(data);
      return novoMedicamento;
    } catch (error) {
      console.error('Erro em MedicamentoService.create:', error);
      if (
        error instanceof Error &&
        (error.message.includes('já existe') || error.message.includes('violation'))
      ) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao criar medicamento.');
    }
  }

  async update(id: number, data: UpdateMedicamentoDTO): Promise<MedicamentoDTO> {
    if (Object.keys(data).length === 0) {
      throw new Error('Nenhum dado de atualização fornecido.');
    }

    try {
      const medicamentoAtualizado = await this.medicamentoRepository.update(id, data);

      if (!medicamentoAtualizado) {
        throw new Error(`Medicamento com ID ${id} não encontrado ou não pôde ser atualizado.`);
      }

      return medicamentoAtualizado;
    } catch (error) {
      console.error(`Erro em MedicamentoService.update para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw new Error(error.message);
      }
      if (error instanceof Error && error.message.includes('restrição única')) {
        throw new Error(error.message);
      }
      throw new Error('Falha ao atualizar medicamento.');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const resultado = await this.medicamentoRepository.delete(id);

      if (!resultado) {
        console.warn(`Tentativa de excluir medicamento inexistente ou já excluído com ID ${id}`);
        return false;
      }

      return resultado;
    } catch (error) {
      console.error(`Erro em MedicamentoService.delete para ID ${id}:`, error);
      throw new Error('Falha ao excluir medicamento.');
    }
  }

  async findOne(id: number): Promise<MedicamentoDTO> {
    try {
      const medicamento = await this.medicamentoRepository.findOne(id);
      if (!medicamento) {
        throw new Error(`Medicamento com ID ${id} não encontrado.`);
      }
      return medicamento;
    } catch (error) {
      console.error(`Erro em MedicamentoService.findOne para ID ${id}:`, error);
      if (error instanceof Error && error.message.includes('não encontrado')) {
        throw error;
      }
      throw new Error('Falha ao buscar medicamento.');
    }
  }

  async findAll(filter?: Partial<MedicamentoDTO>): Promise<MedicamentoDTO[]> {
    try {
      const medicamentos = await this.medicamentoRepository.findAll(filter);
      return medicamentos;
    } catch (error) {
      console.error('Erro em MedicamentoService.findAll:', error);
      throw new Error('Falha ao recuperar medicamentos.');
    }
  }
}
