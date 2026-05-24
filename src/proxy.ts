import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/auth/sign-in"];

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};

export default auth((req) => {
  if (publicRoutes.some((route) => req.nextUrl.pathname === route)) {
    if (req.auth) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.nextUrl));
  }

  return NextResponse.next();
});
