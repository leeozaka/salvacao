### Entity Implementation Structure

To implement a new entity in the system, you would typically need to follow these steps:

1. **Define the Prisma schema**: Add the new entity in schema.prisma
2. **Create DTOs**: Define data transfer objects in a new file under src/dtos/
3. **Create a Repository**: Implement the repository pattern in src/repositories/
4. **Create a Service**: Add business logic in src/services/
5. **Create a Controller**: Handle HTTP requests in src/controllers/
6. **Define Routes**: Add API endpoints in src/routes/
7. **Register in Container**: Wire everything up in src/container.ts
8. **Add to main routes**: Register the new routes in src/routes.ts

## Reusable Components

The code has several reusable components that make entity implementation easier:

- ActivableEntityType and ActivableEntityInterface provide common functionality for entities with active/inactive status
- ActivableEntityMapper helps with entity mapping
- UserMapper can serve as a template for new entity mappers
- ErrorTypes.ts already has enums for common entity types
