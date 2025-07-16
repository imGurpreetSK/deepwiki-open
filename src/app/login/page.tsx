'use client';

import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FaWikipediaW } from 'react-icons/fa';
import ThemeToggle from '@/components/theme-toggle';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check for error in URL params (from next-auth error callback)
        const errorParam = searchParams.get('error');
        if (errorParam === 'AccessDenied') {
            setError('Access denied. Please use a jobget.com email address to sign in.');
        } else if (errorParam) {
            setError('An error occurred during sign in. Please try again.');
        }
    }, [searchParams]);

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Trigger Google OAuth sign-in
            await signIn('google', { 
                callbackUrl: '/', // Redirect to home after successful login
                redirect: true
            });
        } catch (err) {
            console.error('Sign in error:', err);
            setError('Failed to initiate sign in. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen paper-texture flex items-center justify-center p-4">
            {/* Theme toggle in top right corner */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="bg-[var(--card-bg)] rounded-lg shadow-custom border border-[var(--border-color)] p-8">
                    {/* Logo and Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="absolute -inset-2 bg-[var(--accent-primary)]/20 rounded-full blur-md"></div>
                            <div className="relative bg-[var(--accent-primary)] p-4 rounded-full">
                                <FaWikipediaW className="text-4xl text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--accent-primary)] font-serif">DeepWiki</h1>
                        <p className="text-sm text-[var(--muted)] mt-2 text-center">
                            AI-Powered Code Understanding
                        </p>
                    </div>

                    {/* Sign In Section */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                                Welcome to DeepWiki
                            </h2>
                            <p className="text-sm text-[var(--muted)]">
                                Sign in with your Jobget account to continue
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-[var(--highlight)]/10 border border-[var(--highlight)]/30 rounded-lg p-4">
                                <p className="text-sm text-[var(--highlight)] text-center">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-lg px-6 py-3 text-[var(--foreground)] font-medium hover:bg-[var(--background)] dark:hover:bg-[var(--background)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-custom hover:shadow-md"
                        >
                            {/* Google Icon */}
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                        </button>

                        {/* Footer Note */}
                        <div className="text-center pt-4 border-t border-[var(--border-color)]">
                            <p className="text-xs text-[var(--muted)]">
                                Only @jobget.com email addresses are allowed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-[var(--muted)]">
                        By signing in, you agree to use DeepWiki in accordance with your organization's policies
                    </p>
                </div>
            </div>
        </div>
    );
}