'use client'

import { gql, useMutation, useQuery } from "@apollo/client";
import { GET_TRENDING, ME } from "movieapp/lib/queries";
import { useRouter } from "next/navigation";

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export default function Header() {
    const router = useRouter();
    const [logout] = useMutation(LOGOUT);

    const { data } = useQuery(ME);
    
    async function auth(type: "signup" | "login") {
        router.push(`/auth/${type}`);
    }

    async function logoutHandler() {
        await logout({refetchQueries: [{query: ME}, {query: GET_TRENDING}]});
        router.push('/');
    }

    return (
        <header className="text-white p-4 w-full">
            <div className="container mx-auto flex justify-between items-center">
                <div className="logo">
                    <h1 className="text-2xl font-bold text-black">MovieApp</h1>
                </div>
                <nav>
                    {
                        data?.me?.username ? (
                            <div className="flex items-center space-x-4">
                                <p className="text-black">Hi, {data.me.username}</p>
                                <button 
                                    onClick={logoutHandler}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Logout
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