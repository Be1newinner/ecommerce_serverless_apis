import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const TOKEN_SECURITY = process.env.TOKEN_SECURITY;

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get("cookie");

    // Parse cookies manually because we are in the App Router Route Handlers
    const refresh_token = cookies
      ?.split("; ")
      .find((c) => c.startsWith("refresh_token="))
      ?.split("=")[1];

    if (!refresh_token) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 },
      );
    }

    if (!TOKEN_SECURITY) {
      throw new Error("TOKEN_SECURITY is not defined in env");
    }

    // Verify refresh token
    const decoded: any = jwt.verify(refresh_token, TOKEN_SECURITY);

    if (decoded.token_type !== "refresh") {
      return NextResponse.json(
        { error: "Invalid token type" },
        { status: 401 },
      );
    }

    // Generate new access token
    const new_access_token = jwt.sign(
      { id: decoded.id, role: decoded.role, token_type: "access" },
      TOKEN_SECURITY,
      { expiresIn: "15m" },
    );

    const response = NextResponse.json({
      message: "Token refreshed successfully",
    });

    // Set new access token cookie
    response.cookies.set({
      name: "access_token",
      value: new_access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error: any) {
    console.error("Token refresh error:", error);
    // Erase cookies if refresh token is dead/expired to force logout
    const response = NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 },
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }
}
