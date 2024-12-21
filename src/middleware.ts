import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Define protected and restricted routes
  const protectedRoutes = ["/admin/dashboard","/admin/dashboard/users","/admin/dashboard/products","/admin/dashboard/orders"];
  const restrictedRoutes = ["/login", "/register"];

  // Check if the request matches a protected or restricted route
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isRestricted = restrictedRoutes.some((route) => pathname.startsWith(route));

  // Get the session cookie
  const sessionCookie = req.cookies.get("session");
  const isLoggedIn = sessionCookie && sessionCookie.value;

  if (isRestricted && isLoggedIn) {
    // Redirect logged-in users away from login/register pages
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (isProtected && !isLoggedIn) {
    // Redirect unauthenticated users trying to access protected routes
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"], // Apply middleware to all relevant routes
};
