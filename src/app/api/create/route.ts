import { NextResponse } from 'next/server';
import { db } from 'movieapp/lib/postgresClient';

export async function GET() {
  try {
    await db.schema.createTable('users')
      .addColumn('username', 'text', (col) => col.primaryKey())
      .addColumn('password', 'text', (col) => col.notNull())
      .execute();

    await db.schema.createTable('favorites')
      .addColumn('username', 'text', (col) => col.primaryKey().references('users(username)'))
      .addColumn('id', 'integer', (col) => col.primaryKey().notNull())
      .addColumn('type', 'text', (col) => col.notNull())
      .execute();

    return NextResponse.json({ message: 'Database initialized' }, { status: 200 });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}