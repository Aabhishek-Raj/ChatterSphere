'use client'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TooltipProps {
  label: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}
export const ToolTip = ({ label, children, side, align }: TooltipProps) => {
  return (
    <div>
      <TooltipProvider>
        <Tooltip delayDuration={50}>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side={side} align={align}>
            <p className="font-semibold text-sm capitalize">{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
