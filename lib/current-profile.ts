import { db } from './db';

export const currentProfile = async () => {
  const { userId } = currentUser();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  return profile;
};
