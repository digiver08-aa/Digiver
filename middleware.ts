import { NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/supabase/middleware";

const PROTECTED_ROUTES = [
  "/home",
  "/explore",
  "/circles",
  "/messages",
  "/notifications",
  "/settings",
  "/persona",
  "/reputation",
];

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(
  request: NextRequest
) {
  const {
    response,
    user,
  } = await updateSession(request);

  const pathname =
    request.nextUrl.pathname;

  const isAuthenticated =
    user !== null;

  const isProtectedRoute =
    PROTECTED_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(
          `${route}/`
        )
    );

  const isAuthRoute =
    AUTH_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(
          `${route}/`
        )
    );

  if (
    isProtectedRoute &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (
    isAuthRoute &&
    isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL("/home", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/home/:path*",
    "/explore/:path*",
    "/circles/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/persona/:path*",
    "/reputation/:path*",

    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ],
};