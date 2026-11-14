import { NextResponse, type NextRequest } from "next/server";

/** Optimistic check only: real session validation happens in requireUser(). */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("vs_session")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico|webp)$).*)"],
};
