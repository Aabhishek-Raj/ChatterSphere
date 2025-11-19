import { initialProfile } from '@/app/actions/initial-profile'
import { ChatHeader } from '@/components/chat/chatHeader'
import { getOrCreateConversation } from '@/lib/converstaion'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface MembersIdPageProps {
  params: Promise<{
    memberId: string
    serverId: string
  }>
}

const MembersIdPage = async ({ params }: MembersIdPageProps) => {
  const profile = await initialProfile()
  const paramsData = await params


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
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={paramsData.serverId}
        type="conversation"
      />
    </div>
  )
}

export default MembersIdPage
