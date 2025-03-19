import { PrismaClient } from '@prisma/client';
import { IUserRepository } from 'interfaces/UserInterface';
import { User } from 'dtos/UserDTO';
import { UserMapper } from 'mapper/UserMapper';

/**
 * Repository implementation for User entity operations with Prisma ORM
 * Handles database operations for users including CRUD and specialized queries
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a user
   * @param {User} data - The user data
   * @returns {Promise<User>}
   */
  async create(data: User): Promise<User> {
    try {
      const user = await this.prisma.user.create({ data: UserMapper.toEntity(data) });
      return UserMapper.toDomain(user);
    } catch (error) {
      throw new Error('Error creating user: ' + error);
    }
  }

  /**
   * Finds a user by ID
   * @param {string} id - The user's unique ID
   * @returns {Promise<User>}
   */
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ 
        where: { id, isDeleted: false } 
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      return UserMapper.toDomain(user);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error finding user: ' + error);
    }
  }

  /**
   * Retrieves all users matching an optional filter
   * @param {Partial<User>} [filter] - Optional filtering criteria
   * @returns {Promise<User[]>}
   */
  async findAll(filter?: Partial<User>): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany({ 
        where: { ...filter, isDeleted: false } 
      });
      
      return users.map(user => UserMapper.toDomain(user));
    } catch (error) {
      throw new Error('Error finding users: ' + error);
    }
  }

  /**
   * Updates a user by ID
   * @param {string} id - The user's unique ID
   * @param {Partial<User>} data - Fields to update
   * @returns {Promise<User>}
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      // First check if user exists
      await this.findOne(id);
      
      const updatedUser = await this.prisma.user.update({ 
        where: { id }, 
        data: { ...data } 
      });
      
      return UserMapper.toDomain(updatedUser);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error updating user: ' + error);
    }
  }

  /**
   * Performs a soft delete on a user
   * @param {string} id - The user's unique ID
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    try {
      const user = await this.findOne(id);
      const userModel = UserMapper.toEntity(user);
      
      await this.prisma.user.update({ 
        where: { id }, 
        data: { ...userModel, isDeleted: true } 
      });
      
      return true;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error deleting user: ' + error);
    }
  }

  /**
   * Finds a user by CPF
   * @param {string} cpf - The user's CPF
   * @returns {Promise<User>}
   */
  async findByCpf(cpf: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({ 
        where: { cpf, isDeleted: false } 
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      return UserMapper.toDomain(user);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error finding by CPF: ' + error);
    }
  }
}
