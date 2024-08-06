'use client'

import { useQuery } from "@apollo/client";
import { GET_TRENDING, ME } from "movieapp/lib/queries";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header({ username }: { username?: string }) {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { refetch: refetchTrending } = useQuery(GET_TRENDING, {skip: true});
    const { refetch: refetchMe } = useQuery(ME, {skip: true});

    async function auth(type: "signup" | "login") {
        router.push(`/auth/${type}`);
    }

    async function logoutHandler() {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Logout failed');
            }
            await refetchTrending();
            await refetchMe();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    }

    useEffect(() => {
        refetchMe();
    }, [refetchMe]);

    return (
        <header className="text-white p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo">
                    <h1 className="text-2xl font-bold text-black">MovieApp</h1>
                </div>
                <nav>
                    {
                        username ? (
                            <div className="flex items-center space-x-4">
                                <p className="text-black dark:text-white">Hi, {username}</p>
                                <button
                                    onClick={logoutHandler}
                                    disabled={isLoggingOut}
                                    className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoggingOut ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging out...
                                        </span>
                                    ) : 'Logout'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <button
                                    onClick={() => auth("signup")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Sign up
                                </button>
                                <button
                                    onClick={() => auth("login")}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Login
                                </button>
                            </div>
                        )
                    }
                </nav>
            </div>
        </header>
    );
}