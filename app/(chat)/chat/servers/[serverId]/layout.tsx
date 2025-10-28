import { initialProfile } from '@/app/actions/initial-profile'
import { ServerSidebar } from '@/components/server/ServerSidebar'
import { db } from '@/lib/db'
import { selectCurrentToken } from '@/store/reducers/auth/authSlice'

import { redirect } from 'next/navigation'
import { useSelector } from 'react-redux'

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ serverId: string }>
}) => {
  const profile = await initialProfile()
  const { serverId } = await params

  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}

export default ServerIdLayout
