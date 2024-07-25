export interface User {
    username: string;
    password: string;
    favorites: { id: number; type?: string }[];
}