import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/secret';
import { LoginRequest, LoginResponse } from '../interfaces/LoginInterface';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { PessoaDTO } from '../dtos/PessoaDTO';

export class LoginService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async login(email: string, senha: string): Promise<PessoaDTO> {
    try {
      const pessoa = await this.usuarioRepository.findByEmailForAuth(email);

      if (!pessoa) {
        throw new Error('Usuário não encontrado.');
      }

      if (!pessoa.usuario) {
        throw new Error('Usuário não encontrado.');
      }

      if (!pessoa.usuario.isActive || pessoa.usuario.deletedAt) {
        throw new Error('Usuário inativo ou excluído.');
      }

      const senhaCorreta = await compare(senha, pessoa.usuario.senha);

      if (!senhaCorreta) {
        throw new Error('Senha incorreta.');
      }

      const { usuario, ...pessoaSemSenha } = pessoa;
      const usuarioSemSenha = { ...usuario, senha: '' };

      return {
        ...pessoaSemSenha,
        usuario: usuarioSemSenha,
      };
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      throw error instanceof Error ? error : new Error(`Erro ao realizar login: ${String(error)}`);
    }
  }

  async isFirstUser(): Promise<boolean> {
    try {
      return await this.usuarioRepository.isFirstUser();
    } catch (error) {
      console.error('Erro ao verificar se é o primeiro usuário:', error);
      throw error instanceof Error
        ? error
        : new Error(`Erro ao verificar primeiro usuário: ${String(error)}`);
    }
  }

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
        userWithPassword.senha,
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

  private async validateCredentials(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

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
