import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isDashboardPage = path.startsWith("/dashboard");
  const authToken = request.cookies.get("authToken");

  if (isDashboardPage && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDashboardPage && authToken) {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL;
      const verifyUrl = `${apiBaseUrl}/login/verify`;

      const verifyRes = await fetch(verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken.value }),
        cache: "no-store",
      });

      if (!verifyRes.ok || !(await verifyRes.json()).valid) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("authToken");
        return response;
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authToken");
      return response;
    }
  }

  if ((path === "/login" || path === "/") && authToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
