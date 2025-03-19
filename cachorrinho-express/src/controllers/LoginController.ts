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
    try {
      const result = await this.loginService.authenticate(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: error instanceof Error ? error.message : 'Authentication failed' 
      });
    }
  };

  /**
   * Verifies if a JWT token is valid
   * @param req - Express request object containing token
   * @param res - Express response object
   * @returns Promise<void>
   */
  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      
      if (!token) {
        res.status(StatusCodes.BAD_REQUEST).json({ valid: false, message: 'Token is required' });
        return;
      }
      
      const isValid = await this.loginService.verifyToken(token);
      res.status(StatusCodes.OK).json({ valid: true });
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        valid: false, 
        message: error instanceof Error ? error.message : 'Token verification failed' 
      });
    }
  };
}
