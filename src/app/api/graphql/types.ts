import { User } from "movieapp/lib/postgresClient";

export type Context = {
    user: User | null;
    setCookie: (name: string, value: string, options: CookieOptions) => void;
    clearCookie: (name: string) => void;
};

export type CookieOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
};