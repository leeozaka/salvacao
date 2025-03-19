#!/bin/bash

echo "Starting development environment..."
docker-compose -f docker-compose.dev.yml up --build

echo "Development environment is running!"
echo "Dashboard available at: http://localhost:3000"
echo "API available at: http://localhost:3344"
echo "To follow logs: docker-compose -f docker-compose.dev.yml logs -f"
