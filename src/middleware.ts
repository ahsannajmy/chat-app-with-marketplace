import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./app/api/auth/service";

export async function middleware(req: NextRequest) {
  const publicPaths = ["/login", "/register"];
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  const session = await getSession();

  if (session && publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (publicPaths.includes(req.nextUrl.pathname) || isApiRoute) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
