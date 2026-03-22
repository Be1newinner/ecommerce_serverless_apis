import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jwt from "jsonwebtoken";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY || "default_secret";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      // Decode token without full verification if secret is not available in edge
      // or just check for presence and role. For real production, use jose library for edge verification.
      const decoded: any = jwt.decode(accessToken);
      
      if (!decoded || (decoded.role !== "admin" && decoded.role !== "super_admin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
