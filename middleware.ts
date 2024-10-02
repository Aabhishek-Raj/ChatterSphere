import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  // Get the authorization header
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  console.log(authHeader, 'headers--!');

  // Check if the authorization header starts with Bearer
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];

  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  console.log(token);

  try {
    // Verify the token using the secret
    const { payload } = await jwtVerify(token, secret);
    console.log(payload, 'payload--');

    // Continue to the next middleware or the final handler
    return NextResponse.next();
  } catch (err) {
    console.log(err, 'err');
    // If token verification fails
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
}

export const config = {
  matcher: ['/api/((?!register|login|refresh|logout).*)'],
};
