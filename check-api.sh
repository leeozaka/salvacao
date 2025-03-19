#!/bin/bash

echo "Testing API connectivity..."

# Test direct API access (within Docker network)
echo "Checking direct API access..."
docker exec salvacao_nginx_dev curl -s http://api:3344/health && echo "✅ Direct API access works!" || echo "❌ Direct API access failed"

# Test API through nginx proxy (how the browser would access it)
echo "Checking API through nginx proxy..."
curl -s http://localhost/api/health && echo "✅ API proxy access works!" || echo "❌ API proxy access failed"

# Test OPTIONS request for CORS preflight
echo "Checking CORS preflight request..."
curl -s -X OPTIONS -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://localhost/api/health -i | grep -i "access-control" && echo "✅ CORS preflight looks good!" || echo "❌ CORS preflight issues detected"

echo "Tests completed."
