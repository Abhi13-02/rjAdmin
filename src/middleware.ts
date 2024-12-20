import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/admin/dashboard"];
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  console.log("isProtected", isProtected);
  

  if (isProtected) {
    const sessionCookie = req.cookies.get("session");
    

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // else{
    //   return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    // }

    try {
      const session = JSON.parse(sessionCookie.value); // Access `value` property of the cookie      
      if (!session.isAdmin) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch (error) {
      console.error("Invalid session cookie:", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}
