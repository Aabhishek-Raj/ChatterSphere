import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('jwt')?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false, message: 'Not Authorized.' }, { status: 401 });
  }

  cookieStore.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in production
    sameSite: 'none',
    maxAge: 0, // This clears the cookie
  });

  const foundUser = await db.profile.findFirst({
    where: {
      refreshTokens: {
        some: { token: refreshToken },
      },
    },
    include: {
      refreshTokens: true, // Include related refresh tokens
    },
  });
  console.log(foundUser, '[REFRESH_Route_33]');
  console.log(process.env.REFRESH_TOKEN_SECRET);

  // Detected refresh token reuse!
  if (!foundUser) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

      // If token reuse detected, clear all refresh tokens of the hacked user
      await db.profile.update({
        where: { id: decoded.userId },
        data: {
          refreshTokens: {
            deleteMany: {}, // Clear all refresh tokens
          },
        },
      });
      return NextResponse.json(
        { success: false, message: 'Forbidden: Token reuse detected' },
        { status: 403 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Invalid or expired token' },
        { status: 403 }
      );
    }
  }
  // Filter out the current refresh token from the user's token array
  const newRefreshTokenArray = foundUser.refreshTokens.filter((rt) => rt.token !== refreshToken);

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

    // If token's user ID doesn't match the found user, reject
    if (foundUser.id !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: User mismatch' },
        { status: 403 }
      );
    }
    // If token is valid, create a new access token and refresh token
    const roles = Object.values(foundUser.roles || {});
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.name,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '10s' } // Adjust expiration as needed
    );

    const newRefreshToken = jwt.sign(
      { userId: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '1d',
      }
    );

    // Update the user's refresh tokens by removing the old one and adding the new one
    await db.profile.update({
      where: { id: foundUser.id },
      data: {
        refreshTokens: {
          deleteMany: {}, // Clear all old tokens
          create: { token: newRefreshToken }, // Add the new refresh token
        },
      },
    });

    // Set the new refresh token as a secure HTTP-only cookie
    const response = NextResponse.json({ accessToken });

    response.cookies.set('jwt', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Forbidden: Invalid or expired token' },
      { status: 403 }
    );
  }
}
