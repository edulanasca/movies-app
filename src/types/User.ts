export interface User {
    username: string;
    password: string;
    favorites: Favorite[];
}

export interface Favorite {id: number; type?: string}