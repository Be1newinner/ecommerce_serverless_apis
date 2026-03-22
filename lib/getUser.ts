import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECURITY as string,
    ) as any;
    if (decoded.token_type !== "access") {
      return null;
    }
    return { 
      id: decoded.id, 
      role: decoded.role, 
      companyId: decoded.companyId 
    };
  } catch (e: any) {
    return null;
  }
}
