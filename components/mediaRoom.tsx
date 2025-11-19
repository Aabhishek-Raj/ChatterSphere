'use client'

import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { initialProfile } from '@/app/actions/initial-profile'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/reducers/auth/authSlice'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const user = useSelector(selectCurrentUser)
  console.log(user, "USER")

  const [token, setToken] = useState('')

  useEffect(() => {
    if (!user) return

    (async () => {
      try {
        const response = await fetch(`/api/livekit?room=${chatId}&username=${user}`)
        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [user, chatId])

  if (token === '') {
    return (
      <div className="flex flex-1 flex-col justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
