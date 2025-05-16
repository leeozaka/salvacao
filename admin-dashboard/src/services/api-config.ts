// src/services/api-config.ts
// Arquivo central para configuração da API

/**
 * Retorna a URL base da API dependendo do ambiente (cliente ou servidor)
 */
export function getApiBaseUrl() {
  // No lado do cliente, usamos a URL relativa que será tratada pelo proxy do Next.js
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  // No lado do servidor, precisamos de uma URL absoluta para o backend
  // Como estamos em um ambiente Docker, precisamos usar o nome do serviço ('api')
  // em vez de 'localhost'
  const serverApiUrl =
    process.env.SERVER_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://api:3344";

  console.log("URL da API no servidor:", serverApiUrl);
  return serverApiUrl;
}

/**
 * Normaliza e constrói um URL completo para um endpoint da API
 */
export function buildApiUrl(endpoint: string) {
  const baseUrl = getApiBaseUrl();

  // Remove qualquer barra inicial do endpoint
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  // Garante que haja uma barra entre baseUrl e endpoint
  const url = baseUrl.endsWith("/")
    ? `${baseUrl}${cleanEndpoint}`
    : `${baseUrl}/${cleanEndpoint}`;

  return url;
}
