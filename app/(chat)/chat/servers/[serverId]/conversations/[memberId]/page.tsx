import { initialProfile } from '@/app/actions/initial-profile'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatInput } from '@/components/chat/ChatInput'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { MediaRoom } from '@/components/mediaRoom'
import { getOrCreateConversation } from '@/lib/converstaion'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface MembersIdPageProps {
  params: Promise<{
    memberId: string
    serverId: string
  }>,
  searchParams: Promise<{
    video?: boolean
  }>
}

const MembersIdPage = async ({ params, searchParams }: MembersIdPageProps) => {
  const profile = await initialProfile()
  const paramsData = await params
  const searchParamsData = await searchParams


  if (!profile) {
    return redirect('login')
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: paramsData.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, paramsData.memberId)

  if (!conversation) {
    return redirect(`/chat/servers/${paramsData.serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={paramsData.serverId}
        type="conversation"
      />

      {searchParamsData.video && (
        <MediaRoom 
        chatId={conversation.id}
        video={true}
        audio={true}
        />
      )}

      {!searchParamsData.video && (
        <>
      <ChatMessages 
      member={currentMember}
      name={otherMember.profile.name}
      chatId={conversation.id}
      type='conversation'
      apiUrl='/api/direct-messages'
      paramKey='conversationId'
      paramValue={conversation.id}
      socketUrl='api/direct-messages'
      socketQuery={{
        conversationId: conversation.id
      }}
      />

      <ChatInput 
      name={otherMember.profile.name}
      type='conversation'
      apiUrl='api/direct-messages'
      query={{
        conversationId: conversation.id
      }}
      />
        </>
      )}
    </div>
  )
}

export default MembersIdPage
