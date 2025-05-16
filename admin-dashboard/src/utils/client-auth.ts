// src/utils/client-auth.ts
"use client";

// Função para obter o token no cliente
export async function getClientAuthToken(): Promise<string | undefined> {
  // Função para recuperar cookies no navegador
  function getCookieValue(name: string): string | undefined {
    const matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)",
      ),
    );
    return matches ? decodeURIComponent(matches[1]) : undefined; // Retorna undefined em vez de null
  }

  // Obtém o token de autenticação dos cookies do navegador
  return getCookieValue("authToken");
}

// Função para verificar o token no cliente
export async function verifyClientToken(token: string) {
  if (!token) return false;

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3344";
    const verifyUrl = `${baseUrl}/login/verify`;

    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return !!data.valid;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}

// Função para verificar se o usuário está autenticado no cliente
export async function isClientAuthenticated() {
  const token = await getClientAuthToken();
  return !!token;
}
