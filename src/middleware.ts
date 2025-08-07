import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    async function middleware(req) {
        // The user is authenticated if we reach this point
        // Additional session validity check
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        
        // Create response with cache control headers to prevent browser caching
        const response = NextResponse.next();
        
        // Add cache control headers to prevent caching of protected pages
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        response.headers.set('Surrogate-Control', 'no-store');
        
        // Add security headers to force revalidation
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        
        // Check if token exists and has not expired
        if (!token) {
            // No valid session, redirect to login
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
            
            // Create redirect response with cache prevention headers
            const redirectResponse = NextResponse.redirect(loginUrl);
            redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            redirectResponse.headers.set('Pragma', 'no-cache');
            redirectResponse.headers.set('Expires', '0');
            
            return redirectResponse;
        }
        
        // Check token expiration
        const now = Math.floor(Date.now() / 1000);
        if (token.exp && typeof token.exp === 'number' && token.exp < now) {
            // Token has expired, redirect to login
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
            loginUrl.searchParams.set("error", "SessionExpired");
            
            // Create redirect response with cache prevention headers
            const redirectResponse = NextResponse.redirect(loginUrl);
            redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            redirectResponse.headers.set('Pragma', 'no-cache');
            redirectResponse.headers.set('Expires', '0');
            
            return redirectResponse;
        }
        
        // Add authentication state validation header
        response.headers.set('X-Auth-State', 'authenticated');
        
        // Session is valid, return response with cache control headers
        return response;
    },
    {
        callbacks: {
            // This callback is called to check if the user is authorized
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname;
                
                // Always allow access to auth endpoints and login page
                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login"
                ) {
                    return true;
                }
                
                // Force revalidation on every request by checking actual session state
                // This prevents showing cached content after logout
                
                // Check if user has a valid token and email
                if (!token || !token.email) {
                    return false;
                }
                
                // Verify the email domain is jobget.com
                const email = token.email as string;
                if (!email.endsWith("@jobget.com")) {
                    return false;
                }
                
                // Check token expiration
                const now = Math.floor(Date.now() / 1000);
                if (token.exp && typeof token.exp === 'number' && token.exp < now) {
                    return false;
                }
                
                // Token exists, email is valid, and token is not expired
                return true;
            },
        },
        pages: {
            signIn: "/login",
            error: "/login",
        },
    }
);

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - /api/auth/* (auth endpoints must be accessible)
         * - /login (login page must be accessible for authentication)
         * - /_next/static (static files)
         * - /_next/image (image optimization files)
         * - /favicon.ico (favicon)
         * 
         * Note: All other routes including API routes, pages, and assets
         * will be protected by this middleware
         */
        "/((?!api/auth/|login|_next/static|_next/image|favicon.ico).*)",
    ],
};