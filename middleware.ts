import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { 
  adminRateLimiter, 
  authRateLimiter, 
  emailRateLimiter, 
  userRateLimiter, 
  workbookRateLimiter,
  generalRateLimiter,
  applyRateLimit 
} from "./src/lib/rateLimiter";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // 🚦 RATE LIMITING - Apply before any other logic (FAIL OPEN for safety)
    let rateLimitResponse: NextResponse | null = null;

    // 🔑 Auth endpoints - Very strict rate limiting
    if (pathname.startsWith("/api/auth")) {
      rateLimitResponse = await applyRateLimit(req, authRateLimiter);
    }
    // 🔐 Admin API endpoints - Strict rate limiting
    else if (pathname.startsWith("/api/admin")) {
      rateLimitResponse = await applyRateLimit(req, adminRateLimiter);
    }
    // 📧 Email endpoints - Prevent spam
    else if (pathname.startsWith("/api/send-email")) {
      rateLimitResponse = await applyRateLimit(req, emailRateLimiter);
    }
    // 👤 User API endpoints - Moderate rate limiting
    else if (pathname.startsWith("/api/user")) {
      rateLimitResponse = await applyRateLimit(req, userRateLimiter);
    }
    // 📚 Workbook API endpoints - Prevent abuse
    else if (pathname.startsWith("/api/workbook")) {
      rateLimitResponse = await applyRateLimit(req, workbookRateLimiter);
    }
    // 🌐 All other API endpoints - General protection
    else if (pathname.startsWith("/api/")) {
      rateLimitResponse = await applyRateLimit(req, generalRateLimiter);
    }

    // 🚫 If rate limit exceeded, return rate limit response
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // 🛡️ EXISTING AUTHENTICATION LOGIC (unchanged for safety)

    // Admin routes protection
    if (pathname.startsWith("/admin-dashboard")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(
          new URL("/login?error=AdminAccessRequired", req.url)
        );
      }
    }

    if (
      pathname.startsWith("/user-dashboard") ||
      pathname.startsWith("/dashboard")
    ) {
      return NextResponse.next();
    }

    // API routes protection
    if (pathname.startsWith("/api/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    }

    // Note: /api/user routes are public (for passwordless users) and have internal validation

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/login",
          "/register",
          "/api/auth",
          "/api/send-email",
          "/api/check-db",
          "/thank-you",
          "/submission-complete",
          "/user-dashboard", // Allow shareable link access
          "/workbook", // Allow workbook access via shareable links
          "/api/user", // Allow user API access for shareable links (now secured with ownership validation)
          "/api/workbook", // Allow workbook API access (now secured with ownership validation)
        ];

        // Check if the route is public or starts with a public path
        const isPublicRoute = publicRoutes.some(
          (route) => pathname === route || pathname.startsWith(route + "/")
        );

        if (isPublicRoute) {
          return true;
        }

        // For protected routes, require a valid token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.).*)",
  ],
};
