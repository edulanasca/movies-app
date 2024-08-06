import { createKysely } from "@vercel/postgres-kysely";
import { Generated, Selectable } from "kysely";

interface Database {
    users: UserTable;
    favorites: FavoriteTable;
}

interface UserTable {
    username: string;
    password: string;
    favorites?: FavoriteTable[];
}

interface FavoriteTable {
    id: Generated<number>;
    username: string | null;
    type: string | null;
}

export const db = createKysely<Database>();
export type Favorite = Selectable<FavoriteTable>;
export type User = Omit<Selectable<UserTable>, "favorites"> & { favorites: Favorite[] };