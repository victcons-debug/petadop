import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const isRutaPrivada = request.nextUrl.pathname.startsWith("/dashboard");

  // Si intenta entrar al dashboard sin sesión activa, lo mandamos a login
  if (isRutaPrivada && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};
