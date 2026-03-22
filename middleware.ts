import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to decode JWT payload safely in Edge Runtime
function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  // --- 1. Handle CORS for all API routes ---
  if (isApiRoute) {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // Prepare response for actual request
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With",
    );

    // Continue to auth logic
    return handleAuthMiddleware(request, response);
  }

  return handleAuthMiddleware(request, NextResponse.next());
}

function handleAuthMiddleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // Define route categories
  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname === "/onboarding";
  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname.startsWith("/admin");

  // 2. Handle unauthorized access to protected routes
  if ((isAdminRoute || isOnboardingRoute) && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. Handle logged-in users
  if (accessToken) {
    const decoded: any = decodeJWT(accessToken);

    if (!decoded) {
      // If token is malformed, clear and send to login
      const redirectResponse = NextResponse.redirect(
        new URL("/auth/login", request.url),
      );
      redirectResponse.cookies.delete("access_token");
      redirectResponse.cookies.delete("refresh_token");
      return redirectResponse;
    }

    const hasCompany = !!decoded?.companyId;

    // If user is on an auth route but already logged in, send to dashboard/onboarding
    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(hasCompany ? "/admin" : "/onboarding", request.url),
      );
    }

    // If user lacks company and isn't on onboarding/api/public routes, MUST onboard
    if (!hasCompany && !isOnboardingRoute && !isApiRoute && pathname !== "/") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // If user HAS company but tries to go to onboarding, send to dashboard
    if (hasCompany && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Admin route protection
    if (
      isAdminRoute &&
      decoded.role !== "admin" &&
      decoded.role !== "super_admin" &&
      !hasCompany
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/onboarding", "/auth/:path*", "/api/:path*"],
};
