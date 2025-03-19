#!/bin/bash

# Make scripts executable
chmod +x generate-certs.sh

if [ ! -f "nginx/certs/server.crt" ]; then
  echo "SSL certificates not found. Generating them..."
  ./generate-certs.sh
fi

if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  echo "JWT_SECRET=$(openssl rand -hex 32)" > .env
fi

echo "Starting services..."
docker-compose up --build -d

echo "Services should be running!"
echo "Dashboard available at: http://localhost"
echo "API available at: http://localhost/api"
echo "To follow logs: docker-compose logs -f"
