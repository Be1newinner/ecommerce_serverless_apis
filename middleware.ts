import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY || "default_secret";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // 1. Define route categories
  const isAuthRoute = pathname.startsWith("/login") || 
                      pathname.startsWith("/register") || 
                      pathname.startsWith("/reset-password");
  const isOnboardingRoute = pathname === "/onboarding";
  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname.startsWith("/admin");

  // 2. Handle unauthorized access to protected routes
  if ((isAdminRoute || isOnboardingRoute) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Handle logged-in users
  if (accessToken) {
    try {
      const decoded: any = jwt.decode(accessToken);
      const hasCompany = !!decoded?.companyId;

      // If user is on an auth route but already logged in, send to dashboard/onboarding
      if (isAuthRoute) {
        return NextResponse.redirect(new URL(hasCompany ? "/admin" : "/onboarding", request.url));
      }

      // If user lacks company and isn't on onboarding/api/public routes, MUST onboard
      if (!hasCompany && !isOnboardingRoute && !isApiRoute && pathname !== "/") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }

      // If user HAS company but tries to go to onboarding, send to dashboard
      if (hasCompany && isOnboardingRoute) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      
      // Admin route protection based on role
      if (isAdminRoute && decoded.role !== "admin" && decoded.role !== "super_admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      // If token is malformed, clear and send to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/onboarding", "/login", "/register", "/reset-password"],
};
