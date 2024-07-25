import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result_users = await sql`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        password TEXT NOT NULL
      );
    `;

    const result_favorites = await sql`
      CREATE TABLE IF NOT EXISTS favorites (
        username TEXT,
        id INTEGER,
        type TEXT,
        PRIMARY KEY (username, id),
        FOREIGN KEY (username) REFERENCES users(username)
      );
    `;

    return NextResponse.json({ result_users, result_favorites }, { status: 200 });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}