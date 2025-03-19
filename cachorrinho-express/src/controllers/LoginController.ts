import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LoginRequest } from '../interfaces/LoginInterface';
import { LoginService } from 'services/LoginService';

/**
 * Controller responsible for handling user authentication
 * @class LoginController
 */
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  /**
   * Authenticates a user and generates JWT token
   * @param req - Express request object
   * @param res - Express response object
   * @returns Promise<void>
   */
  authenticate = async (
    req: Request<object, object, LoginRequest>,
    res: Response,
  ): Promise<void> => {
    const result = await this.loginService.authenticate(req.body);

    if (result.isOk()) {
      res.status(StatusCodes.OK).json(result.value);
      return;
    }
    res.status(StatusCodes.BAD_REQUEST).json({ message: result.error.message });
  };

  /**
   * Verifies if a JWT token is valid
   * @param req - Express request object containing token
   * @param res - Express response object
   * @returns Promise<void>
   */
  verifyToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    
    if (!token) {
      res.status(StatusCodes.BAD_REQUEST).json({ valid: false, message: 'Token is required' });
      return;
    }
    
    const result = await this.loginService.verifyToken(token);
    
    if (result.isOk()) {
      res.status(StatusCodes.OK).json({ valid: true });
      return;
    }
    
    res.status(StatusCodes.UNAUTHORIZED).json({ valid: false, message: result.error.message });
  };
}
