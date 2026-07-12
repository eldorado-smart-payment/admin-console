import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/transactions", "/kyc", "/admin", "/bill-payments"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthPage = pathname === "/" || pathname === "/otp" || pathname === "/register" || pathname === "/forgot-password";

  if (isProtected && !token) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    const hasPendingOtp = request.cookies.get("pending_email")?.value;
    if (hasPendingOtp && pathname === "/") {
      return NextResponse.redirect(new URL("/otp", request.url));
    }
    if (!hasPendingOtp && pathname === "/otp") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
