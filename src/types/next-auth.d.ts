import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            email: string;
        } & DefaultSession["user"];
    }
    
    interface User extends DefaultUser {
        email: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        email: string;
    }
}