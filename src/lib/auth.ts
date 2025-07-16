import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Only allow jobget.com email domains
            const email = user.email || "";
            const allowedDomain = "jobget.com";
            
            if (!email.endsWith(`@${allowedDomain}`)) {
                return false; // Reject sign in
            }
            
            return true;
        },
        async session({ session, token }) {
            // Add user email to session
            if (token?.email) {
                session.user = session.user || {};
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ token, user }) {
            // Persist the user email in the token
            if (user?.email) {
                token.email = user.email;
            }
            return token;
        },
    },
    events: {
        async signOut(message) {
            // Event triggered when user signs out
            // This helps ensure proper cleanup on signout
            console.log("User signed out:", message);
        },
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login on error
    },
    session: {
        strategy: "jwt",
        maxAge: 12 * 60 * 60, // 12 hours
    },
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                // Set domain if needed (e.g., for subdomains)
                // domain: process.env.COOKIE_DOMAIN,
            },
        },
        callbackUrl: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        csrfToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Host-" : ""}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "strict",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    secret: process.env.NEXTAUTH_SECRET,
};