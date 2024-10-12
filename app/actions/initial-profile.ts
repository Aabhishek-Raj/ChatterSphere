import { jwtVerify } from 'jose';
import { db } from '../../lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { NextApiRequest } from 'next';

interface UserData {
  userId: string;
}

export const initialProfile = async (req?: NextApiRequest) => {
  let userData;
  if (req) {
    userData = await getUserIdFromToken(req);
  } else {
    userData = await getUserIdFromToken();
  }

  if (!userData) return redirect('/');

  const profile = await db.profile.findUnique({
    where: {
      id: userData.userId,
    },
  });

  if (profile) return profile;

  return;
};

export const getUserIdFromToken = async (req?: NextApiRequest) => {
  let token;
  if (req) {
    token = req.cookies['jwt'];
  } else {
    const cookieStore = cookies();
    token = cookieStore.get('jwt')?.value;
  }
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

  if (!token) {
    throw new Error('Token not found');
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: payload.userId } as UserData;
  } catch (err) {
    console.error('JWT decoding failed:', err);
    return null;
  }
};

// export const currentProfile = async () => {
//     const user = await currentUser()

//     if(!user?.userId) {
//       return null
//     }

//     const profile = await db.profile.findUnique({
//       where: { userId }
//     })

//     return profile
//   }
