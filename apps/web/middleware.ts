import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

/**
 * Internationalization middleware configuration.
 * Forces locale prefixing for all routes to ensure SEO consistency 
 * and reliable locale detection.
 */
const intlMiddleware = createMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Extract authentication token from secure cookies
  const token = req.cookies.get("access_token")?.value;

  // Identify if the current path is part of the publicly accessible routes
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.includes(route));

  // Determine locale for redirection purposes. 
  // With localePrefix: "always", the first segment is the locale.
  const locale = pathname.split("/")[1] || "es";

  // Guard: Redirect unauthenticated users attempting to access protected routes
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Guard: Prevent authenticated users from accessing login/auth pages
  if (token && pathname.includes("/login")) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  // Delegate to intlMiddleware for locale handling and path rewriting
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};