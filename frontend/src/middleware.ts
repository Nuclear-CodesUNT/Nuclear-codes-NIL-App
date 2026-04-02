import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /messages (and its subpaths)
  if (!pathname.startsWith("/messages")) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasSessionCookie = cookieHeader.includes("connect.sid=");

  if (!hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Cookie present — let the page load.
  // Client-side AuthContext validates the session and handles stale cookies.
  return NextResponse.next();
}

export const config = {
  matcher: ["/messages/:path*"],
};
