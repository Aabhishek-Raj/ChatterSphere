import { useSocket } from "@/components/providers/socket-provider"
import { Member, Message, Profile } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

interface ChatSocketProps {
  queryKey: string
  addKey: string
  updateKey: string
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}

export const useChatSocket = ({ queryKey, addKey, updateKey }: ChatSocketProps) => {
    const { socket } = useSocket()
    const queryClient = useQueryClient()

    useEffect(()=> {
        if(!socket) {
            return
        }
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if(!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],

                        }]
                    }
                }

                const newData = [...oldData.pages]
                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items
                    ]
                }

                return {
                    ...oldData,
                    pages: newData
                }
            })
        })

        return () => {
            socket.off(addKey)
        }
    }, [queryClient, queryKey, addKey, updateKey, socket])
}
