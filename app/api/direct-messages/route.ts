import { initialProfile } from '@/app/actions/initial-profile'
import { db } from '@/lib/db'
import { DirectMessage } from '@prisma/client'
import { NextResponse } from 'next/server'
import { getIO } from '@/lib/socket-server';

const MESSAGE_BATCH = 10

export async function GET(req: Request) {
  try {
    const profile = await initialProfile()
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const conversationId = searchParams.get('conversationId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!conversationId) {
      return new NextResponse('conversation id missing', { status: 400 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId,
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
    console.log("DIRECT_MESSAGE_GET", error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}



export async function POST(req: Request) {

  try {
    const profile = await initialProfile()

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    const { content, fileUrl } = await req.json();

   if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!conversationId) return new NextResponse("ConversationId missing", { status: 400 });
    if (!content) return new NextResponse("Content missing", { status: 400 });

    const conversation = await db.conversation.findFirst({
        where: {
            id: conversationId as string,
            OR: [
                {
                    memberOne: {
                        profileId: profile.id
                    }
                },
                {
                    memberTwo: {
                        profileId: profile.id
                    }
                }
            ]
        },
        include: {
            memberOne: {
                include: {
                    profile: true
                }
            },
            memberTwo: {
                include: {
                    profile: true
                }
            }
        }
    })

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 })
    }

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne: conversation.memberTwo

    if (!member) {
      return new NextResponse('Memeber not found', { status: 404 })
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
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
    const channelKey = `chat:${conversationId}:messages`
    const io = getIO()
    io.emit(channelKey, message);
    return new NextResponse('message', { status: 200 })
  } catch (error) {
    console.log('[DIRECT_MESSSAGE_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}