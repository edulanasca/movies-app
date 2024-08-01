'use client';

import { useState } from 'react';
import { ApolloError, gql, ServerError, useMutation } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import { GET_TRENDING, ME } from 'movieapp/lib/queries';

const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export default function AuthForm() {
  const router = useRouter();
  const params = useParams();
  const isLogin = params.type === 'login';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [register] = useMutation(REGISTER);
  const [login] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      if (isLogin) {
        await login({ 
            variables: { username, password } ,
            refetchQueries: [{ query: ME }, {query: GET_TRENDING}],
        },);
      } else {
        await register({ 
          variables: { username, password }, 
          refetchQueries: [{ query: ME }],
        });
      }

      router.push('/');
    } catch (error) {
      const err = error as ApolloError;
      const networkError: ServerError = err.networkError as ServerError;
      const result: {errors: {message: string}[]} = networkError.result as {errors: {message: string}[]};
      if (err.networkError && result.errors) {
        result.errors.forEach((error: {message: string}) => {
          setError(error.message);
        });
      } else {
        console.error('An unexpected error occurred', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black dark:text-black"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black dark:text-black"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => router.push(`/auth/${isLogin ? 'signup' : 'login'}`)} className="text-blue-500 hover:underline">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}