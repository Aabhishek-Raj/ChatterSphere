'use client'

import { useSocket } from './providers/socket-provider'

import { Badge } from '@/components/ui/badge'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        Fallback: polling every second
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      live: real time updates
    </Badge>
  )
}
