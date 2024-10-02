import { jwtVerify } from 'jose';
import { db } from '../../lib/db';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

interface UserData {
  userId: string;
}

export const initialProfile = async () => {
  const userData = await getUserIdFromToken();

  if (!userData) return redirect('/');

  const profile = await db.profile.findUnique({
    where: {
      id: userData.userId,
    },
  });

  if (profile) return profile;

  return;
};

export const getUserIdFromToken = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('jwt')?.value;
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
