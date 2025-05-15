import { hash } from 'bcrypt';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import {
  CreatePessoaUsuarioDTO,
  UpdatePessoaUsuarioDTO,
  PessoaUsuario,
} from '../dtos/PessoaUsuarioDTO';
import { TipoUsuario } from '@prisma/client';

export class PessoaUsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  /**
   * Creates a new user (Pessoa and Usuario).
   * Handles password hashing and validation (basic example).
   * @param {CreatePessoaUsuarioDTO} data - The input data for user creation.
   * @returns {Promise<PessoaUsuario>} The created user data.
   * @throws {Error} If validation fails or creation encounters an issue.
   */
  async create(data: CreatePessoaUsuarioDTO): Promise<PessoaUsuario> {
    if (!data.email || !data.senha || !data.nome || !data.tipoUsuario) {
      throw new Error('Missing required fields for user creation (email, password, name, user type).');
    }

    const hashedPassword = await hash(data.senha, 12);

    const userData: CreatePessoaUsuarioDTO = {
      ...data,
      senha: hashedPassword, 
    };

    try {
        const isFirstUser = await this.usuarioRepository.isFirstUser();
        if (isFirstUser) {
            userData.tipoUsuario = TipoUsuario.ADMIN;
        }

        const newUser = await this.usuarioRepository.create(userData);
        return newUser;
    } catch (error) {
        console.error('Error in PessoaUsuarioService.create:', error);
         if (error instanceof Error && (error.message.includes('already exists') || error.message.includes('Unique constraint failed'))) {
            throw new Error(error.message); 
        }
        throw new Error('Failed to create user.'); 
    }
  }

  /**
   * Updates a user by Pessoa ID.
   * @param {number} pessoaId - The user's Pessoa ID.
   * @param {UpdatePessoaUsuarioDTO} data - Fields to update.
   * @returns {Promise<PessoaUsuario>} The updated user data.
   * @throws {Error} If user not found or update fails.
   */
  async update(pessoaId: number, data: UpdatePessoaUsuarioDTO): Promise<PessoaUsuario> {
    if (Object.keys(data).length === 0) {
        throw new Error('No update data provided.');
    }

    let updateData = { ...data };
    if (data.senha) {
      updateData.senha = await hash(data.senha, 12);
    }

    try {
        const updatedUser = await this.usuarioRepository.update(pessoaId, updateData);

        if (!updatedUser) {
            throw new Error(`User with Pessoa ID ${pessoaId} not found or could not be updated.`);
        }

        return updatedUser;
    } catch (error) {
         console.error(`Error in PessoaUsuarioService.update for ID ${pessoaId}:`, error);
         if (error instanceof Error && error.message.includes('not found')) {
             throw new Error(error.message);
         }
         if (error instanceof Error && error.message.includes('unique constraint')) {
             throw new Error(error.message);
         }
         throw new Error('Failed to update user.');
    }
  }

  /**
   * Soft deletes a user by Pessoa ID.
   * @param {number} pessoaId - The user's Pessoa ID.
   * @returns {Promise<boolean>} True if deletion was successful.
   * @throws {Error} If deletion fails.
   */
  async delete(pessoaId: number): Promise<boolean> {
    try {
        const success = await this.usuarioRepository.delete(pessoaId);

        if (!success) {
             console.warn(`Attempted to delete non-existent or already deleted user with Pessoa ID ${pessoaId}`);
        }

        return success;
    } catch (error) {
         console.error(`Error in PessoaUsuarioService.delete for ID ${pessoaId}:`, error);
         throw new Error('Failed to delete user.');
    }
  }

  /**
   * Finds a user by Pessoa ID.
   * @param {number} pessoaId - The user's Pessoa ID.
   * @returns {Promise<PessoaUsuario>} The user data.
   * @throws {Error} If user not found.
   */
  async findOne(pessoaId: number): Promise<PessoaUsuario> {
    try {
        const user = await this.usuarioRepository.findOne(pessoaId);
        if (!user) {
            throw new Error(`User with Pessoa ID ${pessoaId} not found.`);
        }
        return user;
    } catch (error) {
        console.error(`Error in PessoaUsuarioService.findOne for ID ${pessoaId}:`, error);
        if (error instanceof Error && error.message.includes('not found')) {
             throw error;
        }
        throw new Error('Failed to find user.');
    }
  }

   /**
   * Finds a user by their email.
   * @param {string} email - The user's email.
   * @returns {Promise<PessoaUsuario>} The user data.
   * @throws {Error} If user not found.
   */
  async findByEmail(email: string): Promise<PessoaUsuario> {
    // Basic validation
    if (!email) {
         // Replace with ValidationError
        throw new Error('Email cannot be empty.');
    }

    try {
        const user = await this.usuarioRepository.findByEmail(email);
        if (!user) {
             // Replace with NotFoundError
            throw new Error(`User with email ${email} not found.`);
        }
        return user;
    } catch (error) {
        console.error(`Error in PessoaUsuarioService.findByEmail for email ${email}:`, error);
         if (error instanceof Error && error.message.includes('not found')) {
             throw error; // Re-throw the specific error
        }
         // Replace with generic InternalServerError or FindError
        throw new Error('Failed to find user by email.');
    }
  }

   /**
   * Finds a user by their document identifier (e.g., CPF).
   * @param {string} documento - The user's document identifier.
   * @returns {Promise<PessoaUsuario>} The user data.
   * @throws {Error} If user not found.
   */
  async findByDocumento(documento: string): Promise<PessoaUsuario> {
    if (!documento) {
        throw new Error('Document identifier cannot be empty.');
    }
    try {
        const user = await this.usuarioRepository.findByDocumento(documento);
        if (!user) {
            throw new Error(`User with document ${documento} not found.`);
        }
        return user;
    } catch (error) {
         console.error(`Error in PessoaUsuarioService.findByDocumento for document ${documento}:`, error);
          if (error instanceof Error && error.message.includes('not found')) {
             throw error;
        }
        throw new Error('Failed to find user by document.');
    }
  }


  /**
   * Retrieves all users matching an optional filter.
   * @param {Partial<PessoaUsuario>} [filter] - Optional filtering criteria.
   * @returns {Promise<PessoaUsuario[]>} An array of users.
   * @throws {Error} If retrieval fails.
   */
  async findAll(filter?: Partial<PessoaUsuario>): Promise<PessoaUsuario[]> {
    try {
        const users = await this.usuarioRepository.findAll(filter);
        return users;
    } catch (error) {
         console.error('Error in PessoaUsuarioService.findAll:', error);
          // Replace with generic InternalServerError or FindError
         throw new Error('Failed to retrieve users.');
    }
  }
}
