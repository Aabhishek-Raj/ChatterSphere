import { v4 as uuid4 } from 'uuid';
import { initialProfile } from '@/app/actions/initial-profile';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { MemberRole } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    console.log('haithere');
    const { name, imageUrl } = await req.json();
    // const profile = await currentUser()
    const profile = await initialProfile();
    console.log(profile);

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuid4(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
