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
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                <div className="logo mb-4 sm:mb-0">
                    <h1 className="text-2xl font-bold text-black dark:text-white">MovieApp</h1>
                </div>
                <nav className="w-full sm:w-auto">
                    {
                        username ? (
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <p className="text-black dark:text-white">Hi, {username}</p>
                                <button
                                    onClick={logoutHandler}
                                    disabled={isLoggingOut}
                                    className={`w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => auth("signup")}
                                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Sign up
                                </button>
                                <button
                                    onClick={() => auth("login")}
                                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
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