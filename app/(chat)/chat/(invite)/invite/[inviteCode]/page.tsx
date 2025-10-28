import { initialProfile } from '@/app/actions/initial-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await initialProfile();

  if (!profile) {
    return redirect('/login');
  }
  if (!params.inviteCode) {
    return redirect('/');
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/chat/servers/${existingServer.id}`);
  }
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });
  if (server) {
    return redirect(`/chat/servers/${server.id}`);
  }
  return null;
};

export default InviteCodePage;
