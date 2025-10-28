import { useParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useSocket } from '@/components/providers/socket-provider'
import { axiosPrivate } from '@/app/api/axios'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam }: { pageParam: string | undefined }) => {
    const url = pageParam
      ? `${apiUrl}/?cursor=${pageParam}&${paramKey}=${paramValue}`
      : `${apiUrl}/?${paramKey}=${paramValue}`

    const { data } = await axiosPrivate.get(url)

    return data
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKey],
    initialPageParam: undefined,
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  }
}
