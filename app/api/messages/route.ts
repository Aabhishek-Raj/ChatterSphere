import { initialProfile } from '@/app/actions/initial-profile'
import { db } from '@/lib/db'
import { Message } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getIO } from '@/lib/socket-server';

const MESSAGE_BATCH = 10

export async function GET(req: Request) {
  try {
    const profile = await initialProfile()
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const channelId = searchParams.get('channelId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!channelId) {
      return new NextResponse('Channel id missing', { status: 400 })
    }

    let messages: Message[] = []

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    } else {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }

    let nextCursor = null

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    })
  } catch (error) {
    console.log("MESSAGE_GET", error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}


export async function POST(req: Request) {

  try {
    const profile = await initialProfile()

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    const channelId = searchParams.get("channelId");

    const { content, fileUrl } = await req.json();

   if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId) return new NextResponse("ServerId missing", { status: 400 });
    if (!channelId) return new NextResponse("ChannelId missing", { status: 400 });
    if (!content) return new NextResponse("Content missing", { status: 400 });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return new NextResponse('Server not found', { status: 404 })
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })

    if (!channel) {
      return new NextResponse('Channel not found', { status: 404 })
    }

    const member = server.members.find((member) => member.profileId === profile.id)

    if (!member) {
      return new NextResponse('Memeber not found', { status: 404 })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    const channelKey = `chat:${channelId}:messages`
    const io = getIO()
    io.emit(channelKey, message);
    return new NextResponse('message', { status: 200 })
  } catch (error) {
    console.log('[MESSSAGE_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

