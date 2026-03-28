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

  // Verify session with backend (prevents stale/invalid cookies from accessing /messages)
  const base = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${base}/api/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (res.ok) return NextResponse.next();
  } catch {
    // Fall through to redirect
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/messages/:path*"],
};
