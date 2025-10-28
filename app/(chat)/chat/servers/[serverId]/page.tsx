import { initialProfile } from '@/app/actions/initial-profile';
import { db } from '@/lib/db';
import { partialMatchKey } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

interface ServerPageProps {
  params: Promise<{ serverId: string }>;
}

const ServerPage = async ({ params }: ServerPageProps) => {
  const profile = await initialProfile();
  const { serverId } = await params

  if (!profile) {
    return redirect('/login');
  }

  console.log(serverId, 'Parm--')

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== 'general') {
    return null;
  }

  return redirect(`/chat/servers/${serverId}/channels/${initialChannel?.id}`);
};

export default ServerPage;
