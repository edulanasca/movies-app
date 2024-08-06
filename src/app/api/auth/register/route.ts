import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from 'movieapp/lib/postgresClient';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await db.selectFrom('users').selectAll().where('username', '=', username).executeTakeFirst();
    if (user) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insertInto('users').values({ username, password: hashedPassword }).execute();

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    const response = NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}