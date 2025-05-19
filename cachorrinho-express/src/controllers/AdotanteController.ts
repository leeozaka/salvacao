import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AdotanteService } from '../services/AdotanteService';

export class AdotanteController {
  constructor(private readonly adotanteService: AdotanteService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const adotante = await this.adotanteService.create(req.body);
      res.status(StatusCodes.CREATED).json(adotante);
    } catch (error) {
      if (Array.isArray(error)) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Validação falhou', erros: error });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.query.id || req.body.id;

      if (!id || isNaN(Number(id))) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Parâmetro ID inválido' });
        return;
      }

      const adotante = await this.adotanteService.findOne(Number(id));
      res.status(StatusCodes.OK).json(adotante);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const adotantes = await this.adotanteService.findAll(req.query);
      res.status(StatusCodes.OK).json(adotantes);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.body.id;

      if (!id || isNaN(Number(id))) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Parâmetro ID inválido' });
        return;
      }

      const adotante = await this.adotanteService.update(Number(id), req.body);
      res.status(StatusCodes.OK).json(adotante);
    } catch (error) {
      if (error instanceof Error && error.message.includes('não encontrado')) {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: error.message,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
        });
      }
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.body.id;

      if (!id || isNaN(Number(id))) {
        res.status(StatusCodes.BAD_REQUEST).json({ mensagem: 'Parâmetro ID inválido' });
        return;
      }

      const result = await this.adotanteService.delete(Number(id));

      if (result) {
        res.status(StatusCodes.NO_CONTENT).send();
      } else {
        res.status(StatusCodes.NOT_FOUND).json({
          mensagem: `Adotante com ID ${id} não encontrado ou já está excluído.`,
        });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        mensagem: error instanceof Error ? error.message : 'Erro interno do servidor',
      });
    }
  };
}
