import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secret';
import { LoginRequest, LoginResponse } from '../interfaces/LoginInterface';
import { UsuarioRepository } from '../repositories/UsuarioRepository';

export class LoginService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  /**
   * Authenticates a user with email and password
   * @param loginData Login credentials (email, password)
   * @returns Promise<LoginResponse> Contains JWT token and expiry
   * @throws {Error} If authentication fails (invalid credentials, user not found, etc.)
   */
  async authenticate(loginData: LoginRequest): Promise<LoginResponse> {
    if (!loginData.email || !loginData.password) {
        throw new Error('Email and password are required.');
    }

    try {
      const userWithPassword = await this.usuarioRepository.findByEmailForAuth(loginData.email);

      if (!userWithPassword || !userWithPassword.senha) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await this.validateCredentials(
          loginData.password, 
          userWithPassword.senha
      );

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(userWithPassword.id.toString());

      const expiresIn = 24 * 60 * 60 * 1000;
      const expiryDate = new Date(Date.now() + expiresIn);

      return {
        token,
        expires: expiryDate,
      };
    } catch (error) {
        console.error(`Authentication failed for email ${loginData.email}:`, error);
         if (error instanceof Error && error.message === 'Invalid credentials') {
             throw error;
         }
        throw new Error('Authentication failed due to an internal error.');
    }
  }

  /**
   * Verifies if a JWT token is valid
   * @param token The JWT token to verify
   * @returns Promise<boolean>
   */
  async verifyToken(token: string): Promise<boolean> {
    if (!JWT_SECRET) {
      throw new Error('JWT secret is not configured');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return !!decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Validates user password against stored hash
   */
  private async validateCredentials(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  /**
   * Generates JWT token for authenticated user
   */
  private generateToken(userId: string): string {
    if (!JWT_SECRET) {
      throw new Error('JWT secret is not configured');
    }

    try {
      return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '24h',
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error('Token generation failed');
    }
  }
}
