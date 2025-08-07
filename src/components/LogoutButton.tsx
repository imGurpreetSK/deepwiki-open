'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface LogoutButtonProps {
    className?: string;
    children?: React.ReactNode;
    redirectTo?: string;
}

export default function LogoutButton({ 
    className = '', 
    children = 'Sign out',
    redirectTo = '/login' 
}: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            
            // Clear any client-side caches before signing out
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }
            
            // Sign out and redirect
            await signOut({ 
                callbackUrl: redirectTo,
                redirect: true 
            });
        } catch (error) {
            console.error('Error signing out:', error);
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md border border-transparent bg-[var(--accent-primary)]/90 text-white hover:bg-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isLoading ? 'Signing out...' : children}
        </button>
    );
}