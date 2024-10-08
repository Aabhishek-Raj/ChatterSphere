import { initialProfile } from '@/app/actions/initial-profile';
import { db } from '@/lib/db';
import { v4 as uuid4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await initialProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse('Server Id missing', { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
