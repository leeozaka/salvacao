const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3344";

function setAuthCookie(token: string): void {
  document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Strict`;
}

function clearAuthCookie(): void {
  document.cookie =
    "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
      credentials: "same-origin",
    });

    const data = await response.json();

    if (response.ok && data.token) {
      // Set authentication cookie
      setAuthCookie(data.token);

      return {
        success: true,
        token: data.token,
      };
    } else {
      return {
        success: false,
        message: data.message || "Invalid credentials",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error occurred",
    };
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    clearAuthCookie();
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

export async function verifyAuthToken() {
  try {
    const token = getTokenFromCookie();

    if (!token) {
      return false;
    }

    // Verifique se está usando a URL correta aqui
    const response = await fetch("/api/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth verification error:", error);
    return false;
  }
}

/**
 * Gets token from cookie
 */
export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const tokenCookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("authToken="));

  return tokenCookie ? tokenCookie.split("=")[1].trim() : null;
}

export async function registerUser(
  userData: RegisterCredentials,
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data,
      };
    } else {
      return {
        success: false,
        message:
          data.message ||
          data.errors?.map((e: Error) => e.message).join(", ") ||
          "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Network error occurred",
    };
  }
}
