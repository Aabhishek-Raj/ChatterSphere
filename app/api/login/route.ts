import { db } from '@/lib/db';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('call....');
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const foundUser = await db.profile.findUnique({ where: { email } });
    if (!foundUser) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
    }

    const match = await bcryptjs.compare(password, foundUser.password);
    if (!match) {
      return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
    }

    const roles = Object.values(foundUser.roles || {}).filter(Boolean);
    console.log(process.env.ACCESS_TOKEN_SECRET);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.name,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '10s' }
    );

    const newRefreshToken = jwt.sign(
      { userId: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '1d',
      }
    );

    const existingRefreshToken = req.cookies.get('jwt')?.value;

    if (existingRefreshToken) {
      const foundToken = await db.refreshToken.findUnique({
        where: { token: existingRefreshToken },
      });

      if (!foundToken) {
        // Detected reuse of an invalid or deleted token, clear all tokens
        await db.refreshToken.deleteMany({
          where: { profileId: foundUser.id },
        });
        console.log('Detected refresh token reuse. All tokens cleared.');
      }

      const response = NextResponse.json({ message: 'Token reuse detected' }, { status: 403 });
      response.cookies.delete({
        name: 'jwt',
        path: '/',
      });
      return response;
    }

    // Store the new refresh token in the database
    await db.refreshToken.create({
      data: {
        token: newRefreshToken,
        profileId: foundUser.id,
      },
    });

    // Set the refresh token as an HTTP-only cookie
    const refreshTokenCookie = serialize('jwt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });

    // Set cookie in the response header
    const response = NextResponse.json({ roles, accessToken });
    response.headers.append('Set-Cookie', refreshTokenCookie);

    return response;
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
