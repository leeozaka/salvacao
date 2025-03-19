#!/bin/bash

echo "Resetting database..."

docker-compose -f docker-compose.dev.yml down

docker volume rm salvacao_postgres_data_dev

docker-compose -f docker-compose.dev.yml up -d

echo "Waiting for database to be ready..."
sleep 10

docker exec salvacao_api_dev npx prisma migrate deploy

echo "Database reset complete!"
