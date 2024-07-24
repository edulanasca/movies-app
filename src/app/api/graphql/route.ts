import { createYoga } from 'graphql-yoga';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { schema } from 'movieapp/lib/schema';
import { Context } from './types';
import { getDbConnection } from 'movieapp/lib/db';

const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
    console.error('SECRET_KEY is not set in the environment variables');
    process.exit(1);
}

const yoga = createYoga({
    schema,
    graphiql: true,
    context: async (): Promise<Context> => {
        const cookieStore = cookies();
        const token = cookieStore.get('auth_token')?.value;
        let user = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, SECRET_KEY) as { username: string };
                const db = await getDbConnection();
                user = await db.get('SELECT * FROM users WHERE username = ?', decoded.username);
                if (user) {
                    const favorites = await db.all('SELECT id FROM favorites WHERE username = ?', user.username);
                    user.favorites = favorites.map(f => f.id);
                }
                await db.close();
            } catch (err) {
                console.error('Invalid token', err?.toString());
            }
        }

        return {
            user,
            setCookie: (name: string, value: string, options: any) => {
                cookieStore.set(name, value, options);
            },
            clearCookie: (name: string) => {
                cookieStore.delete(name);
            }
        };
    },
});

export const GET = yoga;
export const POST = yoga;