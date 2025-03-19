#!/bin/bash

# Create directory for certificates
mkdir -p nginx/certs

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/certs/server.key \
  -out nginx/certs/server.crt \
  -subj "/C=BR/ST=State/L=City/O=Organization/CN=localhost"

# Set permissions
chmod 644 nginx/certs/server.crt
chmod 600 nginx/certs/server.key

echo "Self-signed SSL certificate generated successfully!"
