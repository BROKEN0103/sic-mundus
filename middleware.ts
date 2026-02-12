import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vault-secure-platform-secret-key-2026-default"
)

const COOKIE_NAME = "vault-session"

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"]

// Routes that authenticated users should be redirected away from
const AUTH_ROUTES = ["/auth/login", "/auth/signup"]

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  console.log(`[v0] middleware: path=${pathname}, hasToken=${!!token}, tokenLen=${token?.length ?? 0}`)

  const isAuthenticated = token ? await verifyToken(token) : false

  console.log(`[v0] middleware: isAuthenticated=${isAuthenticated}`)

  // If authenticated user tries to visit auth pages, redirect to dashboard
  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname === r)) {
    console.log("[v0] middleware: authenticated user on auth page -> /dashboard")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If unauthenticated user tries to visit protected routes, redirect to login
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r)
  const isAsset = pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")

  if (!isAuthenticated && !isPublic && !isAsset) {
    console.log(`[v0] middleware: unauthenticated on protected route ${pathname} -> /auth/login`)
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
