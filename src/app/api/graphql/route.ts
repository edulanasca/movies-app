import { createYoga } from 'graphql-yoga';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { schema } from 'movieapp/lib/schema';
import { Context, CookieOptions } from './types';
import { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';
import { User } from 'movieapp/models/User';

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
    console.error('SECRET_KEY is not set in the environment variables');
    process.exit(1);
}

const context = async (): Promise<Context> => {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    let user: User | null = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
            const { rows } = await sql<User>`SELECT username, password FROM users WHERE username = ${decoded.username}`;
            if (rows.length > 0) {
                user = rows[0];
                if (user) {
                    const { rows: favorites } = await sql<{ id: number }>`SELECT id FROM favorites WHERE username = ${user.username}`;
                    user.favorites = favorites.map(f => ({id: f.id}));
                }
            }
        } catch (err) {
            console.error('Invalid token', err?.toString());
        }
    }

    return {
        user,
        setCookie: (name: string, value: string, options: CookieOptions) => {
            cookieStore.set(name, value, options);
        },
        clearCookie: (name: string) => {
            cookieStore.delete(name);
        }
    };
};

const yoga = createYoga({
    schema,
    graphiql: true,
    context
});

export const GET = (request: NextRequest) => {
    return yoga.handleRequest(request, context);
};

export const POST = (request: NextRequest) => {
    return yoga.handleRequest(request, context);
};