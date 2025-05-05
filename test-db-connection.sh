#!/bin/bash

echo "Testing database connection..."

# Test connection from API container to DB container
echo "Checking API to DB connection..."
docker exec salvacao_api_dev pg_isready -h db -p 5432 -U salvacao && \
  echo "✅ Direct DB connection from API container works!" || \
  echo "❌ Direct DB connection from API container failed"

# Test connection using Prisma
echo "Checking DB connection through Prisma..."
docker exec salvacao_api_dev npx prisma db execute --stdin <<EOF
SELECT 1;
EOF

if [ $? -eq 0 ]; then
  echo "✅ Prisma can connect to the database!"
else
  echo "❌ Prisma connection to database failed"
fi

echo "Testing Docker network..."
docker network inspect salvacao_network_dev

echo "Database container logs:"
docker logs salvacao_db_dev --tail 20

echo "Tests completed."
