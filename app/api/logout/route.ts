import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const cookieStore = cookies() // Get cookies from the request
  const refreshToken = cookieStore.get('jwt')?.value

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'No refresh token provided.',
      },
      { status: 401 }
    )
  }

  // Is refreshToken in db?
  const foundUser = await db.profile.findFirst({
    where: {
      refreshTokens: {
        some: { token: refreshToken }, // Assuming you store refreshTokens in a separate model linked to the profile
      },
    },
  })
  if (!foundUser) {
    // Clear the JWT cookie if the user isn't found
    cookieStore.set('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'none',
      maxAge: 0, // Expire the cookie
    })

    return NextResponse.json(
      {
        success: false,
        message: 'User not found or token invalid.',
      },
      { status: 403 }
    )
  }

  // Delete refreshToken in db
  const updatedRefreshTokens = foundUser.refreshTokens.filter((rt) => rt.token !== refreshToken)

  await db.profile.update({
    where: { id: foundUser.id },
    data: { refreshTokens: updatedRefreshTokens }, // Updating the array with the new tokens
  })
  // Clear the JWT cookie
  cookieStore.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'none',
    maxAge: 0, // Expire the cookie
  })
  // Send response
  return NextResponse.json(
    {
      success: true,
      message: 'Refresh token invalidated and cookie cleared.',
    },
    { status: 200 }
  )
}
