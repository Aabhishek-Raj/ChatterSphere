'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ModalProvider } from '@/components/providers/modal-provider'
import { NavigationSidebar } from '@/components/navigation/NavigationSidebar'
import HeaderItem from '@/components/header/HeaderItem'

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isChat = pathname?.startsWith('/chat')

  if (isChat) return <main>{children}</main>

  return (
    <div className="h-full">
      {/* <div className="w-full h-[72px] z-30 flex-col fixed inset-y-0 bg-white dark:bg-[#313338]">
        <HeaderItem />
      </div> */}
      <main>{children}</main> 
    </div>
  )
}
