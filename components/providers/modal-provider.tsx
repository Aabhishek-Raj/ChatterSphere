'use client'

import { useEffect, useState } from 'react'
import { CreateModalServer } from '../modals/CreateServerModal'
import { InviteModal } from '../modals/InviteModal'
import { EditServerModal } from '../modals/EditServerModal'
import { MembersModal } from '../modals/MembersModal'
import { CreateChannelModal } from '../modals/CreateChannelModal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <>
      <CreateModalServer />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
    </>
  )
}
