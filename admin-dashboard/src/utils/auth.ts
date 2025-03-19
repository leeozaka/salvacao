import { cookies } from "next/headers";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken");
  return !!authToken?.value;
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value;
}

export async function verifyToken(token: string) {
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
      cache: "no-store",
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
