'use client'

import { ToolTip } from '@/components/actions/tooltip'
import { useModal } from '@/hooks/use-modal-store'
import { Plus } from 'lucide-react'

export const NavigationAction = () => {
  const { onOpen } = useModal()

  return (
    <div className="group flex items-center">
      <ToolTip side="right" align="center" label="Add a Server">
        <button
          onClick={() => onOpen('createServer')}
          className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500"
        >
          <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
        </button>
      </ToolTip>
    </div>
  )
}
