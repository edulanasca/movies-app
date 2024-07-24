import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getDbConnection() {
    return open({
        filename: './users.sqlite',
        driver: sqlite3.Database
    });
}