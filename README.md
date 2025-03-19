# Salvação - Admin Dashboard with Backend API

A full-stack application featuring an Express.js REST API backend with a Next.js admin dashboard frontend.

## Project Structure

The project consists of the following main components:

- **cachorrinho-express**: Backend REST API built with Express.js and TypeScript
- **admin-dashboard**: Frontend admin panel built with Next.js and TailwindCSS
- **Docker configurations**: For easy deployment in both development and production environments
- **Nginx**: As a reverse proxy to route requests to the appropriate service

## Architecture

![Architecture](https://raw.githubusercontent.com/docker-library/docs/c350af05d3fac7b5c3f6327ac82fe4d990d8729c/docker/logo.png)

## Features

- **Authentication**: JWT-based user authentication system
- **User Management**: Complete CRUD operations for user accounts
- **Dashboard**: Analytics, reports, and user management interface
- **Docker Support**: Easy setup and deployment with Docker Compose
- **Development Tools**: Live-reloading in development mode

## Prerequisites

- Docker and Docker Compose
- Git

## Quick Start

### Development Mode

To start the application in development mode with hot-reloading:

```bash
# Clone the repository
git clone <your-repo-url> salvacao
cd salvacao

# Start development environment
chmod +x dev.sh
./dev.sh
```

The development environment will be available at:

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:3344

  The suggested approach is to let NGINX serve the application
- **Nginx**: http://localhost/

### Production Mode

To run the application in production mode:

```bash
# Clone the repository
git clone <your-repo-url> salvacao
cd salvacao

# Start production environment
chmod +x start.sh
./start.sh
```

The production environment will be available at:

- **Dashboard and API**: http://localhost

## Available Scripts

The project includes several utility scripts to help with development and debugging:

- `dev.sh` - Start development environment
- `start.sh` - Start production environment
- `stop.sh` - Stop all running containers
- `check-api.sh` - Test API connectivity
- `test-db-connection.sh` - Test database connectivity
- `reset-db.sh` - Reset the development database
- `generate-certs.sh` - Generate self-signed SSL certificates for HTTPS

## Docker Compose Configuration

The project uses two Docker Compose configurations:

### Development (`docker-compose.dev.yml`)

- Hot-reloading enabled for both frontend and backend
- Exposed ports for direct access to services
- Mounted volumes for live code changes

### Production (`docker-compose.yml`)

- Optimized builds
- Properly secured services
- Nginx with SSL support

## Environment Variables

A `.env` file will be automatically created by the `start.sh` script with the following variables:

- `JWT_SECRET`: Secret key for JWT token generation

## Troubleshooting

### API Connection Issues

If you're experiencing API connection issues, run the `check-api.sh` script:

```bash
chmod +x check-api.sh
./check-api.sh
```

This will test:

- Direct API access from within the Docker network
- API access through the Nginx proxy
- CORS preflight request handling

### Database Connection Issues

For database connection problems, use the `test-db-connection.sh` script:

```bash
chmod +x test-db-connection.sh
./test-db-connection.sh
```

### Reset Database

If you need to reset the development database:

```bash
chmod +x reset-db.sh
./reset-db.sh
```

## Backend API Documentation

The backend API includes several endpoints:

### Authentication

- `POST /login`: Authenticate user and get JWT token
- `POST /login/verify`: Verify JWT token validity

### User Management

- `POST /user`: Create a new user
- `GET /user`: Get user details
- `PUT /user`: Update user information
- `DELETE /user`: Delete a user (soft delete)

## Frontend Dashboard

The admin dashboard includes the following sections:

- Dashboard overview with analytics
- User management
- Detailed analytics and reports
- Settings

## Development Guide

For detailed information about implementing new features or entities, see the guide available in the backend codebase at:

`/cachorrinho-express/src/guide.md`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
