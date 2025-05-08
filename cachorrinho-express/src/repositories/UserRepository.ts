import { PrismaClient } from '@prisma/client';
import { IUserRepository } from 'interfaces/UserInterface';
import { User, CreateUserDTO } from 'dtos/UserDTO';

/**
 * Repository implementation for User entity operations with Prisma ORM
 * Handles database operations for users including CRUD and specialized queries
 * All methods use raw SQL queries for database interactions
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Creates a user
   * @param {CreateUserDTO} data - The user data for creation
   * @returns {Promise<User>}
   */
  async create(data: CreateUserDTO): Promise<User> {
    try {
      const now = new Date();
      
      const result = await this.prisma.$queryRaw<User[]>`
        INSERT INTO "User" (
          id, cpf, name, email, telephone, birthday, password, role, 
          "isActive", "isDeleted", "createdAt", "updatedAt"
        ) 
        VALUES (
          gen_random_uuid(),
          ${data.cpf}, ${data.name}, ${data.email}, ${data.telephone}, 
          ${data.birthday}::DATE, ${data.password}, ${data.role}::"Role",
          true, false, ${now}, ${now}
        ) 
        RETURNING *`.then(x => x[0]);

      if (!result) {
        throw new Error('Failed to create user');
      }

      return result;
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
      const result = await this.prisma.$queryRaw<User[]>`
        SELECT * FROM "User" 
        WHERE id = ${id} AND "isDeleted" = false
      `.then(x => x[0]);
      
      if (!result) {
        throw new Error('User not found');
      }

      return result;
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
      // Build the base query
      let query = `SELECT * FROM "User" WHERE "isDeleted" = false`;
      
      // Add filter conditions if they exist
      if (filter) {
        if (filter.cpf) query += ` AND cpf = '${filter.cpf}'`;
        if (filter.name) query += ` AND name = '${filter.name}'`;
        if (filter.email) query += ` AND email = '${filter.email}'`;
        if (filter.telephone) query += ` AND telephone = '${filter.telephone}'`;
        if (filter.role) query += ` AND role = '${filter.role}'`;
        if (filter.isActive !== undefined) query += ` AND isActive = ${filter.isActive}`;
      }
      
      const results = await this.prisma.$queryRaw<User[]>`${query}`;
      return results;
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
      
      // Build update query parts
      const updateParts = [];
      const now = new Date();
      
      if (data.name) updateParts.push(`name = '${data.name}'`);
      if (data.email) updateParts.push(`email = '${data.email}'`);
      if (data.telephone) updateParts.push(`telephone = '${data.telephone}'`);
      if (data.birthday) updateParts.push(`birthday = '${data.birthday}'`);
      if (data.password) updateParts.push(`password = '${data.password}'`);
      if (data.role) updateParts.push(`role = '${data.role}'`);
      if (data.isActive !== undefined) updateParts.push(`isActive = ${data.isActive}`);
      
      // Always update the updatedAt timestamp
      updateParts.push(`updatedAt = '${now.toISOString()}'`);
      
      if (updateParts.length === 0) {
        throw new Error('No fields to update');
      }
      
      const updateQuery = `
        UPDATE "User" 
        SET ${updateParts.join(', ')}
        WHERE id = '${id}'
        RETURNING *
      `;
      
      const result = await this.prisma.$queryRaw<User[]>`${updateQuery}`.then(x => x[0]);
      
      if (!result) {
        throw new Error('Failed to update user');
      }
      
      return result;
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
      // Check if user exists
      const user = await this.prisma.$queryRaw<User[]>`
        SELECT * FROM "User" WHERE id = ${id}
      `.then(x => x[0]);

      if (!user) {
        throw new Error('User not found');
      }
      
      // Perform soft delete
      const now = new Date();
      await this.prisma.$queryRaw`
        UPDATE "User"
        SET isDeleted = true, updatedAt = '${now.toISOString()}'
        WHERE id = ${id}
      `;
      
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
      const result = await this.prisma.$queryRaw<User[]>`
        SELECT * FROM "User" 
        WHERE cpf = ${cpf} AND isDeleted = false
      `.then(x => x[0]);
      
      if (!result) {
        throw new Error('User not found');
      }

      return result;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error finding by CPF: ' + error);
    }
  }

  /**
   * Checks if there are any users in the system
   * @returns {Promise<boolean>} True if there are no users, false otherwise
   */
  async isFirstUser(): Promise<boolean> {
    try {
      const result = await this.prisma.$queryRaw<{ count: string }[]>`
        SELECT COUNT(*) as count FROM "User"
      `.then(x => Number(x[0].count));
      
      return result === 0;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error checking first user: ' + error);
    }
  }
}
