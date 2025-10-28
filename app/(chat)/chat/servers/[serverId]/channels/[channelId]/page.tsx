import { initialProfile } from '@/app/actions/initial-profile'
import { ChatHeader } from '@/components/chat/chatHeader'
import { ChatInput } from '@/components/chat/ChatInput/page'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface ChannelIdPageProps {
  params: Promise<{
    serverId: string
    channelId: string
  }>
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await initialProfile()

  if (!profile) return redirect('/login')

  const { channelId, serverId } = await params
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profile?.id,
    },
  })

  if (!channel || !member) {
    redirect(`/`)
  }

  return (
    <div className=" h-full bg-white dark:bg-[#313338] flex flex-col">
      <ChatHeader name={channel.name} serverId={channel.serverId} type="channel" />

      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channel: channel.id,
          serverId: channel.serverId,
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />

      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  )
}

export default ChannelIdPage
