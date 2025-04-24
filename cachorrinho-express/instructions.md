# Adding a New Entity to Cachorrinho-Express API

This guide provides step-by-step instructions for adding a new entity and corresponding endpoints to the Cachorrinho-Express API.

## 1. Define the Prisma Schema

First, add your entity to the Prisma schema file (`prisma/schema.prisma`):

```prisma
model NewEntity {
  id          String    @id @default(uuid())
  name        String
  description String?
  // Add other fields as needed
  
  // Standard activable entity fields
  isActive    Boolean   @default(true)
  isDeleted   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime? @updatedAt
  
  // Add any relationships
  // userId      String
  // user        User     @relation(fields: [userId], references: [id])
}
```

After updating the schema, generate the Prisma client:

```bash
npx prisma generate
```

## 2. Create DTOs (Data Transfer Objects)

Create a new file in the `src/dtos` directory:

```typescript
// src/dtos/NewEntityDTO.ts
import { ActivableEntityType } from 'types/ActivableEntityType';

export interface NewEntity extends ActivableEntityType {
  id?: string;
  name: string;
  description?: string;
  // Add other fields as needed
}

export interface CreateNewEntityDTO extends Omit<NewEntity, 'id' | keyof ActivableEntityType> {
  // Add any required fields for creation that aren't in the base entity
}

export type UpdateNewEntityDTO = Partial<Omit<NewEntity, 'id'>>;
```

## 3. Define Interfaces

Create a new file in the `src/interfaces` directory:

```typescript
// src/interfaces/NewEntityInterface.ts
import { NewEntity } from 'dtos/NewEntityDTO';
import { ValidationError } from 'types/ValidationErrorType';

export interface CreateNewEntityRequest {
  name: string;
  description?: string;
  // Add other fields needed for creation
}

export interface INewEntityRepository {
  create(data: NewEntity): Promise<NewEntity>;
  findOne(id: string): Promise<NewEntity>;
  findAll(filter?: Partial<NewEntity>): Promise<NewEntity[]>;
  update(id: string, data: Partial<NewEntity>): Promise<NewEntity>;
  delete(id: string): Promise<boolean>;
  // Add any specialized finder methods
}

export interface INewEntityService {
  create(data: CreateNewEntityRequest): Promise<NewEntity>;
  findOne(id: string): Promise<NewEntity>;
  findAll(filter?: Partial<NewEntity>): Promise<NewEntity[]>;
  update(id: string, data: Partial<NewEntity>): Promise<NewEntity>;
  delete(id: string): Promise<boolean>;
  // Add any specialized service methods
}
```

## 4. Create a Model

Create a model class in the `src/models` directory:

```typescript
// src/models/NewEntityModel.ts
import { NewEntity } from 'dtos/NewEntityDTO';
import ActivableEntity, { ActivableEntityMixin } from 'interfaces/ActivableEntityInterface';
import { ValidationError } from 'types/ValidationErrorType';
import { EntityAttribute, EntityType } from 'enums/ErrorTypes';

export default class NewEntityModel implements NewEntity, ActivableEntity {
  id?: string;
  name: string;
  description?: string;
  // Other fields
  
  isActive: boolean = true;
  isDeleted: boolean = false;
  createdAt: Date = new Date();
  updatedAt?: Date;

  // Implement ActivableEntity methods
  inactivate = ActivableEntityMixin.inactivate;
  logicalDelete = ActivableEntityMixin.logicalDelete;
  activate = ActivableEntityMixin.activate;

  constructor(data: Partial<NewEntity>) {
    Object.assign(this, data);
  }

  async validate(): Promise<true | ValidationError[]> {
    const errors: ValidationError[] = [];

    // Validate name
    if (!this.name || this.name.trim() === '') {
      errors.push({
        type: EntityType.NEW_ENTITY,
        attribute: EntityAttribute.NAME,
        message: 'Name is required',
      });
    }

    // Add other validations as needed

    return errors.length ? errors : true;
  }
}
```

## 5. Create an Entity Mapper

Create a mapper in the `src/mapper` directory:

```typescript
// src/mapper/NewEntityMapper.ts
import { NewEntity as PrismaNewEntity } from '@prisma/client';
import { NewEntity } from '../dtos/NewEntityDTO';
import { ActivableEntityMapper } from './ActivableEntityMapper';

export class NewEntityMapper {
  static toDomain(prismaEntity: PrismaNewEntity): NewEntity {
    const entity = ActivableEntityMapper.toDomain<NewEntity>(prismaEntity);

    return {
      ...entity,
      // Transform any fields that need special handling
    } as NewEntity;
  }

  static toEntity(entity: NewEntity): PrismaNewEntity {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      // Other fields
      isActive: entity.isActive,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as PrismaNewEntity;
  }
}
```

## 6. Create a Repository

Create a repository in the `src/repositories` directory:

```typescript
// src/repositories/NewEntityRepository.ts
import { PrismaClient } from '@prisma/client';
import { INewEntityRepository } from 'interfaces/NewEntityInterface';
import { NewEntity } from 'dtos/NewEntityDTO';
import { NewEntityMapper } from 'mapper/NewEntityMapper';

export class NewEntityRepository implements INewEntityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: NewEntity): Promise<NewEntity> {
    try {
      const entity = await this.prisma.newEntity.create({ 
        data: NewEntityMapper.toEntity(data) 
      });
      return NewEntityMapper.toDomain(entity);
    } catch (error) {
      throw new Error('Error creating entity: ' + error);
    }
  }

  async findOne(id: string): Promise<NewEntity> {
    try {
      const entity = await this.prisma.newEntity.findUnique({ 
        where: { id, isDeleted: false } 
      });
      
      if (!entity) {
        throw new Error('Entity not found');
      }

      return NewEntityMapper.toDomain(entity);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error finding entity: ' + error);
    }
  }

  async findAll(filter?: Partial<NewEntity>): Promise<NewEntity[]> {
    try {
      const entities = await this.prisma.newEntity.findMany({ 
        where: { ...filter, isDeleted: false } 
      });
      
      return entities.map(entity => NewEntityMapper.toDomain(entity));
    } catch (error) {
      throw new Error('Error finding entities: ' + error);
    }
  }

  async update(id: string, data: Partial<NewEntity>): Promise<NewEntity> {
    try {
      // First check if entity exists
      await this.findOne(id);
      
      const updatedEntity = await this.prisma.newEntity.update({ 
        where: { id }, 
        data: { ...data } 
      });
      
      return NewEntityMapper.toDomain(updatedEntity);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error updating entity: ' + error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const entity = await this.findOne(id);
      const entityModel = NewEntityMapper.toEntity(entity);
      
      await this.prisma.newEntity.update({ 
        where: { id }, 
        data: { ...entityModel, isDeleted: true } 
      });
      
      return true;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Error deleting entity: ' + error);
    }
  }
}
```

## 7. Create a Service

Create a service in the `src/services` directory:

```typescript
// src/services/NewEntityService.ts
import { CreateNewEntityRequest, INewEntityRepository, INewEntityService } from 'interfaces/NewEntityInterface';
import { NewEntity } from 'dtos/NewEntityDTO';
import NewEntityModel from 'models/NewEntityModel';
import { NewEntityMapper } from 'mapper/NewEntityMapper';

export class NewEntityService implements INewEntityService {
  constructor(private readonly newEntityRepository: INewEntityRepository) {}

  /**
   * Creates a new entity. Returns the created entity or throws validation/DB errors.
   * @param {CreateNewEntityRequest} data - The input data for entity creation
   * @returns {Promise<NewEntity>}
   */
  async create(data: CreateNewEntityRequest): Promise<NewEntity> {
    const entityModel = new NewEntityModel(data);

    // Validate the entity data
    const validationResult = await entityModel.validate();
    if (Array.isArray(validationResult)) {
      throw validationResult;
    }

    return this.newEntityRepository.create(NewEntityMapper.toEntity(entityModel));
  }

  /**
   * Updates an entity by ID. Returns the updated entity or throws an error if not found.
   * @param {string} id - The entity's unique ID
   * @param {Partial<NewEntity>} data - Fields to update
   * @returns {Promise<NewEntity>}
   */
  async update(id: string, data: Partial<NewEntity>): Promise<NewEntity> {
    const entity = await this.newEntityRepository.update(id, data);
    if (!entity) {
      throw new Error('Entity not found');
    }
    return entity;
  }

  /**
   * Soft deletes an entity. Returns true or throws an error if not found.
   * @param {string} id - The entity's unique ID
   * @returns {Promise<boolean>}
   */
  async delete(id: string): Promise<boolean> {
    return this.newEntityRepository.delete(id);
  }

  /**
   * Finds an entity by ID. Returns the entity or throws an error if not found.
   * @param {string} id - The entity's unique ID
   * @returns {Promise<NewEntity>}
   */
  async findOne(id: string): Promise<NewEntity> {
    return this.newEntityRepository.findOne(id);
  }

  /**
   * Retrieves all entities matching an optional filter. Returns an array of entities.
   * @param {Partial<NewEntity>} [filter] - Optional filtering criteria
   * @returns {Promise<NewEntity[]>}
   */
  async findAll(filter?: Partial<NewEntity>): Promise<NewEntity[]> {
    return this.newEntityRepository.findAll(filter);
  }
}
```

## 8. Create a Controller

Create a controller in the `src/controllers` directory:

```typescript
// src/controllers/NewEntityController.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NewEntityService } from 'services/NewEntityService';

export class NewEntityController {
  constructor(private readonly newEntityService: NewEntityService) {}

  /**
   * Creates a new entity
   * @param req - Express request with entity data in body
   * @param res - Express response object
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const entity = await this.newEntityService.create(req.body);
      res.status(StatusCodes.CREATED).json(entity);
    } catch (error) {
      if (Array.isArray(error)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Validation failed', errors: error });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
          message: error instanceof Error ? error.message : 'Internal server error' 
        });
      }
    }
  };

  /**
   * Retrieves a single entity by ID
   * @param req - Express request with entity ID in params or body
   * @param res - Express response object
   */
  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id || req.query.id || req.body.id;

      if (typeof id !== 'string') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid ID parameter' });
        return;
      }

      const entity = await this.newEntityService.findOne(id as string);
      res.status(StatusCodes.OK).json(entity);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        message: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  };

  /**
   * Retrieves all entities with optional filtering
   * @param req - Express request with optional filter in body
   * @param res - Express response object
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const entities = await this.newEntityService.findAll(req.body);
      res.status(StatusCodes.OK).json(entities);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        message: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  };

  /**
   * Updates an existing entity
   * @param req - Express request with entity ID and update data in body
   * @param res - Express response object
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const entity = await this.newEntityService.update(req.body.id, req.body);
      res.status(StatusCodes.OK).json(entity);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        message: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  };

  /**
   * Performs a logical deletion of an entity
   * @param req - Express request with entity ID in body
   * @param res - Express response object
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.newEntityService.delete(req.body.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        message: error instanceof Error ? error.message : 'Internal server error' 
      });
    }
  };
}
```

## 9. Create Routes

Create routes in the `src/routes` directory:

```typescript
// src/routes/NewEntityRoutes.ts
import { Router } from 'express';
import { Container } from '../container';

const routes = Router();
const newEntityController = Container.getNewEntityController();
const auth = Container.getAuthMiddleware();

routes.post('/', auth, newEntityController.create);
routes.get('/:id', auth, newEntityController.findOne);
routes.get('/', auth, newEntityController.findAll);
routes.put('/', auth, newEntityController.update);
routes.delete('/', auth, newEntityController.delete);

export default routes;
```

## 10. Update Error Types

Add your new entity to the error types enum in `src/enums/ErrorTypes.ts`:

```typescript
// Add NEW_ENTITY to EntityType enum
export enum EntityType {
  USER = 'USER',
  NEW_ENTITY = 'NEW_ENTITY',
  // ... other entities
}

// Add entity-specific attributes to EntityAttribute enum
export enum EntityAttribute {
  // ... existing attributes
  NAME = 'NAME',
  DESCRIPTION = 'DESCRIPTION',
  // ... other attributes
}
```

## 11. Update the Container

Update the dependency injection container in `src/container.ts` to include your new entity:

```typescript
// Add imports for your new entity classes
import { NewEntityRepository } from './repositories/NewEntityRepository';
import { NewEntityService } from './services/NewEntityService';
import { NewEntityController } from './controllers/NewEntityController';

export class Container {
  // ... existing code
  
  private static newEntityRepository: NewEntityRepository;
  private static newEntityService: NewEntityService;
  private static newEntityController: NewEntityController;

  // Get repository instance
  static getNewEntityRepository(): NewEntityRepository {
    if (!Container.newEntityRepository) {
      Container.newEntityRepository = new NewEntityRepository(Container.getPrismaClient());
    }
    return Container.newEntityRepository;
  }

  // Get service instance
  static getNewEntityService(): NewEntityService {
    if (!Container.newEntityService) {
      Container.newEntityService = new NewEntityService(Container.getNewEntityRepository());
    }
    return Container.newEntityService;
  }

  // Get controller instance
  static getNewEntityController(): NewEntityController {
    if (!Container.newEntityController) {
      Container.newEntityController = new NewEntityController(Container.getNewEntityService());
    }
    return Container.newEntityController;
  }
}
```

## 12. Register the Routes

Add your new routes to the main router in `src/routes.ts`:

```typescript
import NewEntityRoutes from 'routes/NewEntityRoutes';
// ... existing imports

const routes = Router();

// ... existing routes
routes.use('/new-entity', NewEntityRoutes);

export default routes;
```

## 13. Add to API Documentation

Update the README.md to include your new entity endpoints:

```markdown
## API Endpoints

### New Entity
- `POST /new-entity` (create entity)
- `GET /new-entity/:id` (get entity by ID)
- `GET /new-entity` (get all entities)
- `PUT /new-entity` (update entity)
- `DELETE /new-entity` (soft-delete entity)
```

## 14. Test Your Implementation

1. Create a new entity:
   ```bash
   curl -X POST http://localhost:3344/new-entity \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"name": "Test Entity", "description": "This is a test"}'
   ```

2. Get all entities:
   ```bash
   curl -X GET http://localhost:3344/new-entity \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. Update an entity:
   ```bash
   curl -X PUT http://localhost:3344/new-entity \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"id": "ENTITY_ID", "name": "Updated Name"}'
   ```

4. Delete an entity:
   ```bash
   curl -X DELETE http://localhost:3344/new-entity \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{"id": "ENTITY_ID"}'
   ```

## Conclusion

By following these steps, you've successfully added a new entity to the Cachorrinho-Express API. The implementation follows the existing architecture patterns and maintains consistency with the rest of the codebase.
