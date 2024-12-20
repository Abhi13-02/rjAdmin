import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const protectedRoutes = ["/admin/dashboard"];
  const restrictRoutes = ["/login", "/register"];
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isRestricted = restrictRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  console.log("isProtected", isProtected);

  const sessionCookie = req.cookies.get("session");
  
  if(isRestricted){
    if(sessionCookie && sessionCookie.value) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url)); 
    }
  }

  if (isProtected) {    
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}
