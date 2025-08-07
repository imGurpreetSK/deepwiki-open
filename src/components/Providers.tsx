'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            refetchInterval={10 * 60} // Refetch session every 10 minutes
            refetchOnWindowFocus={true} // Refetch when user returns to the app
        >
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}