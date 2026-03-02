import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Token exists:", !!token);
  console.log("Middleware - Token value:", token?.value?.substring(0, 20) + "...");

  // استثناء ملفات Next والـ static و API routes والصفحة الرئيسية
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api") ||
    pathname === "/" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isAuthPage =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register") ||
    pathname.startsWith("/auth");

  console.log("Middleware - Is auth page:", isAuthPage);

  if (!token && !isAuthPage) {
    console.log("Middleware - Redirecting to login (no token)");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthPage) {
    console.log("Middleware - Redirecting to dashboard (has token)");
    return NextResponse.redirect(new URL("/user-dashboard", request.url));
  }

  console.log("Middleware - Continuing normally");
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};