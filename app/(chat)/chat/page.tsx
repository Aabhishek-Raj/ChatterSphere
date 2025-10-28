import { initialProfile } from '@/app/actions/initial-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { InitialModal } from '@/components/modals/initial-modal';

const SetupPage = async () => {
  const profile = await initialProfile();
  console.log(profile, 'pro');

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`chat/servers/${server.id}`);
  }
  return <InitialModal />;
};

export default SetupPage;
