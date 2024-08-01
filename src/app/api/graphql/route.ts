import { createYoga } from 'graphql-yoga';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { schema } from 'movieapp/lib/schema';
import { Context, CookieOptions } from './types';
import { NextRequest } from 'next/server';
import { db, User } from 'movieapp/lib/postgresClient';

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
            const userRecord = await db.selectFrom('users').selectAll().where('username', '=', decoded.username).executeTakeFirst();
            if (userRecord) {
                user = { ...userRecord, favorites: [] };
                const favorites = await db.selectFrom('favorites').selectAll().where('username', '=', user.username).execute();
                user.favorites = favorites;
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