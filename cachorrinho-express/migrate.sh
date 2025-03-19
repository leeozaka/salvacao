#!/bin/bash

# Script to help with Prisma migrations

set -e

if [ -z "$1" ]; then
  echo "Usage: ./migrate.sh [command]"
  echo "Available commands:"
  echo "  create - Create a new migration"
  echo "  deploy - Apply all pending migrations"
  echo "  reset - Reset the database and apply all migrations"
  echo "  status - Show the status of all migrations"
  exit 1
fi

case "$1" in
  "create")
    echo "Creating new migration..."
    npx prisma migrate dev --name "$2"
    ;;
  "deploy")
    echo "Deploying migrations..."
    npx prisma migrate deploy
    ;;
  "reset")
    echo "Resetting database..."
    npx prisma migrate reset --force
    ;;
  "status")
    echo "Migration status:"
    npx prisma migrate status
    ;;
  *)
    echo "Unknown command: $1"
    echo "Available commands: create, deploy, reset, status"
    exit 1
    ;;
esac

echo "Done!"
