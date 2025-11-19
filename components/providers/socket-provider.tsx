'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { sockets } from '@/app/socket'

type SocketContextType = {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // connect manually
    sockets.connect()

    const onConnect = () => {
      setIsConnected(true)

      const upgradeHandler = (transport: any) => {
        console.log('Transport upgraded to:', transport.name)
      }

      sockets.io.engine.on('upgrade', upgradeHandler)

      // cleanup for upgrade listener
      return () => {
        sockets.io.engine.off('upgrade', upgradeHandler)
      }
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    sockets.on('connect', onConnect)
    sockets.on('disconnect', onDisconnect)

    return () => {
      sockets.off('connect', onConnect)
      sockets.off('disconnect', onDisconnect)
      sockets.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket: sockets, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
